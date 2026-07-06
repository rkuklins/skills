---
name: assess-contributor
description: >-
  Build a structured developer profile for any contributor by mining git history
  across all repos in the workspace, fetching PR review activity via the gh CLI when
  GitHub access is available, and correlating related Linear projects via the Linear
  MCP to score the complexity of the topics they've handled. Produces a Cursor canvas
  with charts and tables plus a brief chat summary. Use when the user asks to "assess",
  "profile", "evaluate", or "review the contribution history of" a developer; or when
  given a GitHub username (e.g. @janizde) and asked to understand their work style,
  areas of ownership, commit quality, activity trend, topic complexity, or whether
  they are more of a coder or a reviewer.
---

# assess-contributor

Profile a contributor across all git repos in the workspace. Output: a Cursor canvas
(charts + tables) and a 3–5 bullet chat summary.

## Inputs

Accept any of: GitHub username (e.g. `@janizde` or `janizde`), full name, or email.
If the user provides only a name, resolve it to email(s) in step 2.

## Step 1 — Discover repos

Find every git repo under the workspace root (up to 4 directory levels deep):

```bash
find . -maxdepth 4 -name ".git" -type d | sed 's|/.git||'
```

List them so the user can see which repos will be analyzed. Proceed with all discovered repos.

## Step 2 — Resolve identity

In each repo, find all author name + email combinations that match the target handle/name:

```bash
git log --all --format="%ae %an" | sort -u | grep -i "<handle or name>"
```

Collect all matching email addresses (a contributor often has 2–3: work email, personal email,
GitHub noreply). Build a git `--author` pattern like:

```
"email1@example.com\|email2@example.com\|handle@users.noreply.github.com"
```

## Step 3 — Collect git stats (per repo, then combined)

Run these in parallel for each repo, using the resolved author pattern.

### 3a. Volume & timeline

```bash
# Total commits
git log --all --author="<pattern>" --oneline | wc -l

# Commits by month (last 24 months)
git log --all --author="<pattern>" --format="%ad" --date=format:"%Y-%m" \
  --after="$(date -v-24m +%Y-%m-01 2>/dev/null || date -d '24 months ago' +%Y-%m-01)" \
  | sort | uniq -c

# Commits by year (all time)
git log --all --author="<pattern>" --format="%ad" --date=format:"%Y" | sort | uniq -c
```

### 3b. Commit type breakdown

```bash
git log --all --author="<pattern>" --format="%s" \
  | grep -oE "^(feat|fix|chore|test|docs|refactor|build|ci|perf|style|revert|Merge|Revert)" \
  | sort | uniq -c | sort -rn
```

### 3c. File area distribution

```bash
git log --all --author="<pattern>" --name-only --format="" \
  | grep -v "^$" | grep -oE "^[^/]+/[^/]+" | sort | uniq -c | sort -rn | head -20
```

### 3d. Lines changed (total)

```bash
git log --all --author="<pattern>" --shortstat --format="" \
  | grep -E "insertion|deletion" \
  | awk '{ins+=$4; del+=$6} END {print "insertions: " ins " deletions: " del}'
```

### 3e. Own PRs vs. others' PRs merged

```bash
# Total merge commits (own PRs)
git log --all --author="<pattern>" --format="%s" | grep -c "^Merge pull request"

# PRs from other authors merged by this person
git log --all --format="%s %ae" | grep "^Merge pull request" \
  | grep "<one of the author emails>" \
  | grep -v "<branch prefix associated with contributor>" | wc -l
```

### 3f. Trend: trailing quarter vs. prior quarter, trailing year vs. prior year

Compare activity in the most recent period against the period immediately before it, to tell
whether the contributor's output is accelerating, steady, or slowing. Use trailing (rolling)
windows, not calendar quarters/years, so the comparison always reflects "now."

```bash
# Date boundaries (BSD date on macOS, GNU date elsewhere)
today=$(date +%Y-%m-%d)
q_start=$(date -v-3m +%Y-%m-%d 2>/dev/null || date -d '3 months ago' +%Y-%m-%d)
q_prior_start=$(date -v-6m +%Y-%m-%d 2>/dev/null || date -d '6 months ago' +%Y-%m-%d)
y_start=$(date -v-12m +%Y-%m-%d 2>/dev/null || date -d '12 months ago' +%Y-%m-%d)
y_prior_start=$(date -v-24m +%Y-%m-%d 2>/dev/null || date -d '24 months ago' +%Y-%m-%d)

# Commit counts
git log --all --author="<pattern>" --after="$q_start"       --before="$today"     --oneline | wc -l   # trailing quarter
git log --all --author="<pattern>" --after="$q_prior_start" --before="$q_start"   --oneline | wc -l   # prior quarter
git log --all --author="<pattern>" --after="$y_start"       --before="$today"     --oneline | wc -l   # trailing year
git log --all --author="<pattern>" --after="$y_prior_start" --before="$y_start"   --oneline | wc -l   # prior year

# Lines changed per period (repeat with each pair of --after/--before above)
git log --all --author="<pattern>" --after="$q_start" --before="$today" --shortstat --format="" \
  | grep -E "insertion|deletion" \
  | awk '{ins+=$4; del+=$6} END {print "insertions: " ins " deletions: " del}'
```

For each of the two comparisons (quarter-over-quarter, year-over-year) compute:

```
% change = (current_period_count - prior_period_count) / prior_period_count * 100
```

Classify the trend per repo and combined-across-repos as:
- **Accelerating**: current period count is >20% higher than the prior period
- **Steady**: within ±20%
- **Slowing**: current period count is >20% lower than the prior period
- **Insufficient data**: prior period has 0 commits, or the contributor's first commit is more
  recent than the prior period's start (don't compute a % change off a zero or partial base —
  just state the raw counts and note there's no baseline yet)

Do this for commit count and lines changed at minimum. If PR/merge data (3e) or GitHub review
data (Step 4) is available, extend the same quarter/year comparison to those signals too.

## Step 4 — GitHub review activity (requires gh CLI)

Check that `gh auth status` succeeds before attempting. If not authenticated, skip this
step and note it in the canvas.

Get the repo's GitHub coordinates:
```bash
gh repo view --json owner,name --jq '"" + .owner.login + "/" + .name'
```

### 4a. PRs authored

```bash
gh pr list --author="<github-username>" --state=all --limit=200 \
  --json number,title,createdAt,mergedAt,additions,deletions,comments,reviewDecision
```

### 4b. PRs reviewed (but not authored)

```bash
gh pr list --reviewed-by="<github-username>" --state=all --limit=200 \
  --json number,title,author,createdAt
# Filter out PRs where author == contributor
```

### 4c. Review comments left by this person

Fetch inline review comments from the last 50 PRs they reviewed:

```bash
gh api "repos/<owner>/<repo>/pulls/comments?per_page=100&page=1" \
  | jq '[.[] | select(.user.login == "<github-username>")]'
```

Repeat for pages 2–5 if needed. Also fetch general (non-inline) review submissions:

```bash
gh api "repos/<owner>/<repo>/pulls/<pr_number>/reviews" \
  | jq '[.[] | select(.user.login == "<github-username>")]'
```

Analyze review comments using the signals in `references/review-quality-signals.md`.

### 4d. Trend for authored PRs and reviews

Reuse the `$q_start`, `$q_prior_start`, `$y_start`, `$y_prior_start` boundaries from step 3f.
Filter the JSON from 4a/4b by `createdAt` with `jq` to get counts per period:

```bash
# Example: PRs authored in the trailing quarter vs. the prior quarter
jq --arg start "$q_start" --arg end "$today" \
  '[.[] | select(.createdAt >= $start and .createdAt < $end)] | length' prs_authored.json
jq --arg start "$q_prior_start" --arg end "$q_start" \
  '[.[] | select(.createdAt >= $start and .createdAt < $end)] | length' prs_authored.json
```

Apply the same query (swap `$q_start`/`$q_prior_start` for `$y_start`/`$y_prior_start`) to get
the year-over-year comparison, and repeat for the PRs-reviewed list (4b). Classify each using
the same accelerating/steady/slowing/insufficient-data bands as step 3f.

## Step 5 — Linear ticket history & topic complexity (requires Linear MCP)

Look into the Linear projects related to this contributor's work and assess the complexity of
the topics they've handled, not just the volume.

1. **Auth & tool schemas** — Read the Linear MCP tool schemas under the workspace `mcps` folder
   before calling. Call `mcp_auth` if a read fails with an auth error.
2. **Resolve emails to Linear assignee filter** — Reuse the email address(es) resolved in step 2.
3. **Scope projects**:
   - If `project-tracking.md` exists at the workspace root, note those project names as the
     primary scope of interest (consistent with `team-report`'s convention), but still fetch all
     of the contributor's issues — don't pre-filter by project, since the goal is to discover
     *which* Linear projects they're actually involved in.
   - If it doesn't exist, don't ask the user to create one first; just proceed with an unscoped
     fetch and report the discovered project names as "related Linear projects" in the output.
4. **Fetch issues** — Call `list_issues` with `assignee` set to each resolved email, paginating
   (`limit` up to 250, follow `cursor`) until `hasNextPage` is false. Retrieve: `title`,
   `description`, `labels`, `estimate`, `priority`, `project` (name), `state`, `createdAt`,
   `completedAt`, `comments` count if available.
5. **Group by project** — Build the list of related Linear projects touched: project name,
   ticket count, and first/last activity date. This is the "related Linear projects" list for
   the canvas.
6. **Score complexity per ticket** — Use the rubric and signals in
   `references/topic-complexity-signals.md` to assign each ticket a 1–5 complexity score. Cross
   reference with the file-area distribution from step 3c where useful (e.g. a ticket completed
   during a period where commits touched many distinct repos/directories is a corroborating
   complexity signal).
7. **Aggregate**:
   - Complexity mix (share of low/medium/high complexity tickets) and average score, overall.
   - Complexity trend: reuse the `$q_start`/`$q_prior_start`/`$y_start`/`$y_prior_start`
     boundaries from step 3f, filtering tickets by `completedAt` (or `createdAt` if not
     completed), to compare average complexity in the trailing quarter/year vs. the prior
     quarter/year. Label as accelerating/steady/slowing, same bands as step 3f, but interpreted
     as "taking on harder problems" rather than "more volume."
   - Top 5 most complex tickets handled, each with a one-line rationale.
8. If Linear MCP access is unavailable or no issues are found for the resolved emails, skip this
   step's scoring and say so explicitly; fall back to the file-area breadth from step 3c as a
   weaker proxy for topic complexity (see the fallback note in
   `references/topic-complexity-signals.md`).

## Step 6 — Build canvas

Read the canvas skill at `~/.cursor/skills-cursor/canvas/SKILL.md` and the SDK types
at `~/.cursor/skills-cursor/canvas/sdk/index.d.ts` before writing the canvas file.

Place the canvas at:
```
~/.cursor/projects/<workspace-id>/canvases/contributor-<github-username>.canvas.tsx
```

The workspace-id is derived from the workspace root path: replace `/` with `-` and strip leading `-`. Example: workspace `/Users/alice/dev/my-project` → `Users-alice-dev-my-project`.

### Canvas sections (include only sections where you have data)

1. **Header** — name, handle, primary employer domain, analysis date
2. **Top-level stats strip** — total commits, lines changed, repos analyzed, active since year (Stat grid)
3. **Summary verdict** — Callout with the overall profile in 2–3 sentences
4. **Commit activity** — BarChart per repo (monthly, last 24 months)
5. **Activity trend** — Stat grid or small table comparing trailing quarter vs. prior quarter and trailing year vs. prior year (commits, lines changed, and — if available — PRs authored/reviewed), each with a % change and an accelerating/steady/slowing/insufficient-data label (see step 3f/4d)
6. **Commit composition** — BarChart of type breakdown (feat/fix/chore/test/docs/revert) + quality signal list
7. **Code areas** — UsageBar + Table per repo (top 7 file path prefixes by touch count)
8. **Feature domain ownership** — Table of identified themes (domain, repo, ownership level, period)
9. **Coder vs Reviewer** — two-column layout: producer signals (Table) + reviewer signals (Table + Callout)
10. **Review quality** — (only if GitHub data was fetched) Table of: PRs reviewed, avg comments/PR, review depth score, sample comments showing specificity; see `references/review-quality-signals.md` for scoring
11. **Documentation contributions** — Table of docs files edited with edit counts
12. **Related Linear projects** — (only if Linear data was fetched) Table of project name, ticket count, first/last activity date
13. **Topic complexity** — (only if Linear data was fetched) Stat grid for complexity mix (low/medium/high share) + avg score and trend (accelerating/steady/slowing, see step 5), plus a Table of the top 5 most complex tickets with score and rationale; see `references/topic-complexity-signals.md` for scoring
14. **Overall profile summary** — 3-card grid: Efficiency, Impact, Role archetype

Use `BarChart` with `categories: string[]` + `series: { name, data: number[] }[]`.
Use `CardHeader` with `children` (plain text), not a `title` prop.
Use `Table` with `headers: ReactNode[]` + `rows: ReactNode[][]`.
Use `Text` with `size="small"` not `"sm"`.
`StatTone` values: `"success" | "danger" | "warning" | "info"` — omit for neutral.
`UsageBarSegment` requires `id`, `value`, and optional `color`.
`PillTone` is deprecated — use `active` boolean instead.

## Step 7 — Chat summary

After creating the canvas, provide a brief summary in chat (3–5 bullet points) covering:
- Volume & tenure (commits, years active)
- Top domain ownerships
- Coder vs. reviewer assessment
- Code quality signals (tests, docs, revert rate)
- Review thoroughness (if GitHub data was available)
- Trend: whether activity is accelerating, steady, or slowing quarter-over-quarter and year-over-year
- Topic complexity: related Linear projects touched, and whether the complexity of tickets they take on is rising, steady, or falling (if Linear data was available)

Include a markdown link to the canvas file.

## Edge cases

- **No commits found**: Confirm the spelling of the handle/name with the user before giving up.
- **Single repo workspace**: Skip the "per repo" split in the canvas; show combined charts only.
- **No GitHub access**: Note clearly in the canvas that the review quality section was skipped; everything else still runs.
- **Very low commit count (<20)**: Note that the sample is too small for reliable conclusions; still produce the profile.
- **Tenure shorter than one prior comparison window**: If the contributor's first commit is more recent than `$q_prior_start` (quarter) or `$y_prior_start` (year), skip the % change for that window and label it "insufficient data" instead of dividing by a partial or zero base.
- **No Linear access or no assigned tickets found**: Skip the Linear project/topic complexity sections and note in the canvas that they were skipped; fall back to file-area breadth (3c) as a weaker complexity proxy if useful.
