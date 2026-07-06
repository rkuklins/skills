# Review Quality Signals

Use these signals to assess whether a contributor reviews code thoroughly and specifically.

## Data sources

- **Inline comments** (`/repos/{owner}/{repo}/pulls/comments`) — line-level comments on diffs
- **Review submissions** (`/repos/{owner}/{repo}/pulls/{n}/reviews`) — overall review verdicts and top-level body comments
- **Review events**: `APPROVED`, `CHANGES_REQUESTED`, `COMMENTED`

## Depth score (0–5)

Assign one score per PR reviewed, then average across all reviewed PRs.

| Score | Description |
|-------|-------------|
| 0 | No comment body — bare APPROVED or LGTM with no explanation |
| 1 | Single sentence, no specific line references ("Looks good to me") |
| 2 | 1–2 inline comments, mostly style/naming nitpicks |
| 3 | 3–6 inline comments spanning multiple files; at least one substantive concern |
| 4 | 6+ comments; questions logic, edge cases, or design; proposes concrete alternatives |
| 5 | Multi-round review; CHANGES_REQUESTED with detailed reasoning; follows up after changes |

## Specificity signals (positive)

- References specific line numbers or file paths
- Quotes code and explains _why_ it is problematic
- Proposes a concrete alternative (code suggestion or pseudocode)
- Asks clarifying questions about intent or edge cases
- Identifies missing tests or missing docs
- Connects the change to broader architecture or conventions
- Reviews multiple files (not just the main diff file)

## Superficiality signals (negative)

- "LGTM", "looks good", "nice work" with no elaboration
- Only approves — never requests changes even on large PRs
- All comments are on formatting/whitespace (no substance)
- Comments only on files they own (ignores the rest of the diff)
- Always approves within minutes (likely not reading the diff)

## Interpretation

| Avg depth score | Assessment |
|----------------|-----------|
| 0–1 | Rubber-stamp reviewer — approvals only, not engaged |
| 2 | Light reviewer — catches obvious issues, misses deeper problems |
| 3 | Solid reviewer — consistent, specific, finds real issues |
| 4 | Thorough reviewer — engaged with design, edge cases, and quality |
| 5 | Exceptional reviewer — high-signal, multi-round, mentoring-level |

## Canvas presentation

Report in the **Review quality** section:
- Total PRs reviewed (distinct PR numbers where they left a comment or approved)
- Total review comments left
- Average comments per PR reviewed
- Depth score (averaged)
- `CHANGES_REQUESTED` rate (pct of reviews where they blocked merge)
- 2–3 example comments (quoted, with context) to illustrate specificity level

## Note on git-only analysis

When `gh` is unavailable, note that review quality cannot be assessed from git history alone.
The only proxy available is: number of other people's PRs merged by this contributor
(found via `git log --format="%s %ae"` filtered to merge commits from others' branches).
This indicates a team-lead / gatekeeper role but says nothing about review depth.
