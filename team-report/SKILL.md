---
name: team-report
description: Builds a markdown team activity report from Linear (issue counts per person and per project) and Git (commit counts per person and per repo) for a requested time window. Reads team.md for roster emails and project-tracking.md for primary Linear project columns; surfaces other Linear projects assignees touched. Use when the user asks for team activity for a period, what the team worked on last month/week, a portfolio vs assignees report, or Linear plus GitHub commit summaries for a named team file.
---

# Team report (Linear + Git)

## Inputs (workspace root)

| File | Purpose |
| --- | --- |
| `team.md` | Roster: one person per line, `Name; email@domain` (semicolon-separated). Use **email** for Linear assignee filters and Git `%ae` matching. |
| `project-tracking.md` | Directional portfolio: one **Linear project name** per line (must match Linear project titles for `project` / `get_project` queries). |

If either file is missing, tell the user to add it at the repo root before generating the report.

## Time window

1. If the user gives a range, use it.
2. If they say **last month**, default to the **previous calendar month** (first day 00:00 through first day of current month 00:00 exclusive), aligned with `git log --since/--until` and Linear `createdAt`/`updatedAt` filters only when those fit the question; for **assignee backlog** snapshots, use **as-of query time** and state that clearly.
3. For **activity** (commits, issues completed), prefer filters on **completedAt** / git dates inside the window when the user asks what shipped in the period; for **current load**, use assignee totals with an explicit snapshot timestamp.

## Linear (MCP)

1. Read MCP tool schemas under the workspace `mcps` folder before calling (`list_issues`, `get_project`, pagination `cursor`).
2. **Team filter**: Pass `team` to `list_issues` when the work is team-scoped (e.g. `iOS` for the SoundCloud iOS app). If the user names another Linear team, use that. If unclear, ask once.
3. **Per person**: For each email in `team.md`, call `list_issues` with `assignee` set to that email (and `team` when used). Paginate (`limit` up to 250, follow `cursor`) until `hasNextPage` is false. Count **total issues** per person.
4. **Portfolio columns**: Header row = every project name from `project-tracking.md` that resolves in Linear, **plus** any other `project` values seen on those assignees’ issues in the same fetch (so work outside the tracking list still appears as columns or in a “Other projects” summary—pick one layout and stay consistent).
5. **Per cell** (optional but recommended): `issues / share%` where **share%** is the share of that person’s issues **only among the portfolio column set** (denominator excludes issues with no project or only in “other” columns if you split that way—state the rule in the report).
6. **Project blurbs**: For each portfolio column project, call `get_project` with the project name; use `summary`, `description`, and initiative names. If `description` is empty, paraphrase from initiatives and state that in caveats.
7. **Estimates / time**: Linear MCP payloads may omit story points or time—do not imply wall-clock allocation unless those fields are present.

## Git (local clones)

1. Discover repos: e.g. `ios/` (or `**/ios`) with `.git` under the workspace, plus any other roots the user points at or that sibling layout conventions suggest (e.g. `~/dev/SC/api-mobile`). Do **not** assume GitHub API unless the user asks; prefer `git log` on existing clones.
2. **Window**: Match the user’s period (`--since` / `--until`) on **author date** unless they ask for committer date.
3. **Authors**: Match `git log --format=%ae` to roster emails from `team.md`. **Merge alternate addresses** when the same person appears with a different email (common for contractors); document any merges in caveats.
4. **Output**: Table per person: commit count in the window, and breakdown by repo (`origin` URL basename or `org/repo` from remote).

## Output artifact

- Write a **dated markdown file** at the workspace root (e.g. `report-team-activity-YYYY-MM-DD.md`) unless the user names a path.
- Sections (adapt names to the team):
  - Exec line: data sources, window definition, Linear team filter, git roots scanned.
  - **Projects legend** (from `get_project`).
  - **Portfolio table** (projects as columns, people as rows) + **total Linear issues per assignee** column (all projects, not just portfolio).
  - **Git commits** table (repos × people for the window).
  - **Caveats**: pagination limits, alternate emails, issues outside portfolio, no open ingress / no secrets in the doc.

## Anti-patterns

- Do not fabricate counts: paginate Linear until done or say the count is a lower bound.
- Do not put credentials or tokens in the report.
- Keep the diff limited to the report file unless the user asks to change tracking files.
