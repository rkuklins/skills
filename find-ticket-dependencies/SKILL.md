---
name: find-ticket-dependencies
description: >-
  Analyze a filtered set of Linear tickets to detect dependencies between them,
  then mark those dependencies using Linear's built-in relation types (blocks /
  is blocked by / relates to). Use when the user asks to "find dependencies",
  "check dependencies between tickets", "mark dependencies", or wants to
  understand which tickets in a project, status, label, cycle, or date range
  depend on each other before starting work.
---

# find-ticket-dependencies

## Dependencies

- **Linear MCP** — read (`list_issues`, `get_issue`) and write (`save_issue`)
- **GitHub CLI** (`gh`, authenticated) — to fetch changed files and PR bodies
- **Local git** — fallback for branch inspection when no PR exists

## Steps

### 1. Clarify the filter

If the user's filter is unambiguous, proceed silently. Otherwise ask one
focused question to resolve it. Translate into `list_issues` parameters:

| User phrase | Parameter |
|---|---|
| "in project X" | `project: "X"` |
| "in triage / in progress / ..." | `state: "<name>"` |
| "with label Y" | `label: "Y"` |
| "in current / next cycle" | `cycle: "current"` or `"next"` |
| "created today" | `createdAt: "-P1D"` |
| "created this week" | `createdAt: "-P7D"` |
| "assigned to me" | `assignee: "me"` |
| "in team X" | `team: "X"` |

Combinations are valid (e.g. project + state).

### 2. Fetch all matching tickets

- Call `list_issues` with the resolved parameters. Use `limit: 250` and
  paginate via `cursor` until all results are collected.
- **Gate**: if the result set exceeds 50 tickets, warn the user — pairwise
  analysis grows as O(n²). Ask them to narrow the filter before continuing.
- For each ticket, call `get_issue` with `includeRelations: true` to capture
  the branch name and any relations already set.

### 3. Gather repository signals

For each ticket that has a branch name:

1. Run `gh pr list --head <branch> --json number,files,body,title --limit 1`
   to get the linked PR, its changed file paths, and PR body.
2. If no PR exists, run `git log --oneline origin/<branch> 2>/dev/null` for
   recent commit messages.
3. Record changed file paths and any ticket identifiers (e.g. `CD-123`)
   mentioned in PR bodies or commit messages.

If a branch cannot be resolved, mark the ticket as **description-only** —
analysis will rely on title and description text alone.

### 4. Analyze pairs for dependencies

Read [references/dependency-patterns.md](references/dependency-patterns.md)
for detection heuristics and confidence scoring before starting this step.

For every unordered pair (A, B) that does **not** already share a relation:

1. **Cross-reference** — Does A's description, PR body, or commits mention B's
   identifier or title keyword, or vice versa?
2. **Structural** — Do A and B touch overlapping files or directories?
3. **Functional** — Based on titles and descriptions, does one ticket produce
   something (an API endpoint, class stub, schema, config value) that the
   other ticket consumes or extends?

For each identified dependency decide:

- **Relation type**: `blocks`/`blockedBy` when order matters for correctness
  (B cannot be correctly implemented without A being merged first);
  `relatedTo` when they share a code surface but can proceed in either order.
- **Confidence**: High / Medium / Low (see patterns reference).

Drop pairs where confidence is Low with only one weak signal.

### 5. Present proposed relations — confirm before writing

Show a table of all proposed relations:

| From   | Relation   | To     | Reason                                   | Confidence |
|--------|------------|--------|------------------------------------------|------------|
| CD-123 | blocks     | CD-456 | CD-123 adds the API endpoint CD-456 uses | High       |
| CD-124 | relates to | CD-456 | Both modify services/payment.ts          | Medium     |

Also state how many tickets had no dependencies found and how many were
analyzed with description-only signals.

Then ask one question: *"Apply all, skip specific ones, or adjust any relation
types before writing to Linear?"* Wait for the user's answer before proceeding.

### 6. Apply approved relations

For each approved pair, call `save_issue` once per source ticket:

- A blocks B → `save_issue(id: A-id, blocks: [B-id])`
- A is blocked by B → `save_issue(id: A-id, blockedBy: [B-id])`
- A relates to B → `save_issue(id: A-id, relatedTo: [B-id])`

`blocks`, `blockedBy`, and `relatedTo` are append-only — existing relations
are never removed. Never call `save_issue` for pairs the user skipped.

### 7. Report

Print a concise summary:

- Total tickets analyzed
- Relations written (count and list)
- Tickets skipped by the user
- Tickets with description-only analysis (no repo signal found)
