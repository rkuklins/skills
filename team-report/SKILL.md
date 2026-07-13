---
name: team-report
description: Builds a team activity report as a Cursor Canvas from Linear (issue counts per person and per project) and Git (commit counts per person and per repo) for a requested time window. Asks the user which roster file defines the team (no default filename assumed); roster entries carry name, email, and optional GitHub id for commit matching. Reads project-tracking.md for primary Linear project columns; surfaces other Linear projects assignees touched. Use when the user asks for team activity for a period, what the team worked on last month/week, a portfolio vs assignees report, or Linear plus GitHub commit summaries for a named team file.
---

# Team report (Linear + Git)

## Inputs (workspace root)

| Input | Purpose |
| --- | --- |
| Roster file (path supplied by the user) | Roster: one person per line, `Name; email@domain; github-id` (semicolon-separated, GitHub id optional but recommended). Use **email** for Linear assignee filters and Git `%ae` matching; use **github-id** for GitHub-side commit/PR lookups (`gh api`, `git log --author`) when local `%ae` matching is unreliable (noreply addresses, forks, contractors with multiple emails). |
| `project-tracking.md` | Directional portfolio: one **Linear project name** per line (must match Linear project titles for `project` / `get_project` queries). |

### Roster file

Do **not** assume a default filename (e.g. `team.md`). Before doing anything else:

1. If the user's request already names a specific file or path for the roster, use it as-is.
2. Otherwise, ask the user which file defines the team roster (path relative to the workspace root, or absolute). Do not guess or silently fall back to a conventional name.
3. Confirm the resolved path exists and is non-empty before reading it. If it's missing or empty — whether it was user-named or a conventional guess — do **not** substitute another file or invent roster data; ask the user for the correct path to the roster source and wait for their answer.
4. Use that resolved path everywhere below (referred to as **the roster file**).
5. Parse each line as `Name; email; github-id`. The GitHub id is optional per line — if absent, fall back to email-only matching for that person and note it in caveats.

If `project-tracking.md` is missing, tell the user to add it at the repo root before generating the report.

## Time window

1. If the user gives a range, use it.
2. If they say **last month**, default to the **previous calendar month** (first day 00:00 through first day of current month 00:00 exclusive), aligned with `git log --since/--until` and Linear `createdAt`/`updatedAt` filters only when those fit the question; for **assignee backlog** snapshots, use **as-of query time** and state that clearly.
3. For **activity** (commits, issues completed), prefer filters on **completedAt** / git dates inside the window when the user asks what shipped in the period; for **current load**, use assignee totals with an explicit snapshot timestamp.

## Linear (MCP)

1. Read MCP tool schemas under the workspace `mcps` folder before calling (`list_issues`, `get_project`, pagination `cursor`).
2. **Team filter**: Pass `team` to `list_issues` when the work is team-scoped (e.g. `iOS` for the SoundCloud iOS app). If the user names another Linear team, use that. If unclear, ask once.
3. **Per person**: For each email in the roster file, call `list_issues` with `assignee` set to that email (and `team` when used). Paginate (`limit` up to 250, follow `cursor`) until `hasNextPage` is false. Count **total issues** per person.
4. **Portfolio columns**: Header row = every project name from `project-tracking.md` that resolves in Linear, **plus** any other `project` values seen on those assignees’ issues in the same fetch (so work outside the tracking list still appears as columns or in a “Other projects” summary—pick one layout and stay consistent).
5. **Per cell** (optional but recommended): `issues / share%` where **share%** is the share of that person’s issues **only among the portfolio column set** (denominator excludes issues with no project or only in “other” columns if you split that way—state the rule in the report).
6. **Project blurbs**: For each portfolio column project, call `get_project` with the project name; use `summary`, `description`, and initiative names. If `description` is empty, paraphrase from initiatives and state that in caveats.
7. **Estimates / time**: Linear MCP payloads may omit story points or time—do not imply wall-clock allocation unless those fields are present.

## Git (local clones)

1. Discover repos: e.g. `ios/` (or `**/ios`) with `.git` under the workspace, plus any other roots the user points at or that sibling layout conventions suggest (e.g. `~/dev/SC/api-mobile`). Do **not** assume GitHub API unless the user asks; prefer `git log` on existing clones.
2. **Window**: Match the user’s period (`--since` / `--until`) on **author date** unless they ask for committer date.
3. **Authors**: Match `git log --format=%ae` to roster emails from the roster file. If a person's commits don't show up under their roster email (common with GitHub `noreply` addresses, forks, or contractors using multiple emails) and the roster has a **github-id** for them, cross-check with `git log --author="<github-id>"` (GitHub rewrites noreply addresses as `<id>+<github-id>@users.noreply.github.com` or sets `%an`/`%ae` to match the account) or, if the repo isn't cloned locally, use `gh api repos/<org>/<repo>/commits?author=<github-id>` to pull commit counts directly from GitHub. **Merge alternate addresses** when the same person appears with a different email; document any merges (and which ones relied on github-id) in caveats.
4. **Output**: Table per person: commit count in the window, and breakdown by repo (`origin` URL basename or `org/repo` from remote).

## Output artifact

Read and follow the `canvas` skill (`/Users/<user>/.cursor/skills-cursor/canvas/SKILL.md`) before writing anything — it governs the file location, SDK usage, theming, and anti-slop rules. This report is exactly the kind of structured, data-heavy MCP output that skill says belongs in a canvas, not a markdown table.

- Do **not** write a dated markdown report file. Instead, write a single `.canvas.tsx` file to `/Users/<user>/.cursor/projects/<workspace>/canvases/team-report-YYYY-MM-DD.canvas.tsx` (kebab-case, dated) unless the user names a different canvas filename.
- Embed all fetched Linear/Git data inline in the component — no `fetch()`, no relative imports, import only from `cursor/canvas`, default-export the top-level component.
- Sections to render (adapt names to the team; omit any section with no data rather than showing an empty state):
  - Exec summary: data sources, roster file path used, window definition, Linear team filter, git roots scanned.
  - **Projects legend** (from `get_project`).
  - **Portfolio table** (projects as columns, people as rows) + **total Linear issues per assignee** column (all projects, not just portfolio).
  - **Git commits** table (repos × people for the window) — consider a bar chart per person/repo alongside the raw table.
  - **Caveats**: pagination limits, alternate emails, people missing a github-id (email-only matching), commits attributed via github-id lookup rather than local `%ae`, issues outside portfolio, no open ingress / no secrets in the canvas.
- Label every table/chart with a specific title, axis units where relevant, and a caption noting the data source and time window, per the canvas skill's labeling rules.
- After writing the canvas, tell the user in chat with a markdown link to the `.canvas.tsx` file so they can open it beside the chat; follow the canvas skill's rules on when to include an intro sentence.

## Anti-patterns

- Do not fabricate counts: paginate Linear until done or say the count is a lower bound.
- Do not put credentials or tokens in the canvas.
- Do not fall back to writing a markdown report file, even as a supplement to the canvas, unless the user explicitly asks for one in addition.
- Keep the diff limited to the canvas file unless the user asks to change tracking files.
