---
name: tune-the-ticket
description: >
  Assess whether a Linear issue is ready for development (human or
  agent): acceptance criteria, scope, definition of done, engineering
  implementation notes, PRD/design/repo references. Reads Linear via
  MCP, optionally reviews the related codebase, proposes concrete
  ticket improvements, and — after user confirmation — writes the
  improved ticket back to Linear via save_issue.
  Use when the user asks to tune-the-ticket, refine a ticket, check
  ticket readiness, polish a Linear issue, improve acceptance criteria,
  or prepare a ticket for implementation.
allowed-tools: Read, mcp__user_linear__get_issue, mcp__user_linear__list_comments, mcp__user_linear__list_issues, mcp__user_linear__get_project, mcp__user_linear__get_team, mcp__user_linear__get_document, mcp__user_linear__save_issue
disable-model-invocation: true
---

# Tune the Ticket

## Goal

Determine if a Linear issue is **ready to start development** (by a human or an agent). Identify gaps, ask for missing references (PRD, design, repo), optionally review the related codebase, propose **concrete ticket improvements**, and — after user confirmation — **write the improved ticket back to Linear**.

## Linear MCP

**Read tools:**
1. Issue id or URL → **`get_issue`** (`includeRelations: true` when dependencies help).
2. Also use as needed: **`list_comments`**, **`list_issues`**, **`get_project`**, **`get_team`**, **`get_document`**.
3. On auth failure → **`mcp_auth`** for that server, then retry.

**Write tool:**
- **`save_issue`** — used in Step 7 only, after explicit user confirmation. Pass only the fields that changed (title and/or description). Never churn unchanged metadata.
- **Forbidden:** `save_comment`, `delete_*`, and any other write/delete tools not listed above.

No Linear id → work from pasted ticket text only; skip Step 7 (no ticket to update).

## Workflow

### 1. Gather references (ask early)

Before deep analysis, check whether the ticket or user provides:

| Reference | When required |
|-----------|----------------|
| **Repo** | Any code change — path, org/repo name, or workspace folder |
| **PRD / spec** | Product behavior, new features, policy changes |
| **Design** | UI/UX, copy, layout changes |

If missing and required, ask up to **5 concrete questions** in one message (see [readiness-checklist.md](readiness-checklist.md)). Continue with partial analysis if the user declines, and mark gaps **NEEDS INFO**.

### 2. Load ticket

- Linear MCP or pasted content.
- Pull comments and linked documents if they carry AC or engineering notes.

### 3. Readiness assessment

Score the ticket against [readiness-checklist.md](readiness-checklist.md). Produce:

- **Verdict:** `READY` | `NOT READY` | `NEEDS INFO`
- Per-area table: Pass / Weak / Missing
- One paragraph: *Can a developer or agent start without a kickoff meeting?*

### 4. Repo review (when repo is known)

If a repo path or name is confirmed (ticket link, label, project, or user answer):

1. Locate repo in workspace or note that clone/access is needed.
2. **Lightweight survey** (not full architecture-survey): entry points, similar features, tests, config/flags, APIs touched.
3. Mark findings **confirmed** (in ticket/repo) vs **inferred**.
4. Draft **Implementation plan (proposed)** — ordered steps, files/modules, test plan, rollout/flag notes.

If repo is unknown, list **inferred** repos from labels/project and say what to confirm.

### 5. Propose ticket changes

Deliver two layers:

**A. Suggested edits (delta)** — bullet list of what to add/change in Linear (title, description sections, AC lines, labels). Copy-paste friendly.

**B. Full tuned ticket** — complete markdown using the output template below.

### 6. Confirm and persist

Present the full tuned ticket (title + description in the output template format) to the user and ask **one** confirmation question: *"Apply these changes to Linear?"*

- **Yes / confirm:** proceed to Step 7.
- **No / change X:** incorporate the requested edit, re-present only the affected section, and re-ask confirmation.
- If no Linear id exists (pasted-only session): skip Steps 6–7 and note that no ticket was updated.

### 7. Write to Linear

Call `save_issue` with the issue `id` plus only the fields that changed:
- Pass `title` only if the proposed title differs from the original.
- Pass `description` with the full tuned ticket body in markdown.
- Do not send unchanged metadata (team, labels, state, assignee, etc.).

On success: print the ticket URL and a one-line confirmation (*"Linear updated — [KEY]: [title]"*).
On error: surface the error message and offer paste-ready markdown blocks so the user can apply the changes manually.

### 8. Write deliverable

One file in the active workspace:

- Name: `tuned-ticket-<ISSUE-KEY>-<YYYY-MM-DD>.md` (or `tuned-ticket-manual-<YYYY-MM-DD>.md`)
- Chat reply: verdict, top gaps, file path, and whether Linear was updated.

## Output template

```markdown
# Tuned ticket — [TITLE or LINEAR-KEY]

## Readiness verdict
**[READY | NOT READY | NEEDS INFO]** — [one sentence why]

## Original reference
- Linear: [key or URL] (or "pasted only")
- PRD: [link or "not provided"]
- Design: [link or "not provided"]
- Repo: [path or "not confirmed"]
- Updated in Linear: [yes / no — pasted only]

## Readiness scorecard
| Area | Status | Notes |
|------|--------|-------|
| Problem | Pass/Weak/Missing | … |
| Outcome | … | … |
| Scope | … | … |
| Acceptance criteria | … | … |
| Definition of done | … | … |
| Implementation approach | … | … |
| References | … | … |
| Dependencies | … | … |
| Edge cases | … | … |

## Suggested edits to Linear (delta)
1. **Title:** …
2. **Description — add section …:** …
3. **Acceptance criteria — add:** …
4. **Labels / project / links:** …

## Title (proposed)
[Imperative, under ~80 characters]

## Problem / context
…

## Proposed outcome
…

## Scope
**In scope:** …  
**Out of scope:** …

## Acceptance criteria
- [ ] …

## Definition of done
- [ ] …

## Implementation approach
[Preserve engineering notes from ticket; extend or propose if missing]
- Approach: …
- Touchpoints: …
- Rollout / flags: …
- Test plan: …

## Implementation plan (proposed)
[From repo review when performed]
1. …
2. …

## Repositories / code areas
- … (confirmed vs inferred)

## Edge cases and risks
- …

## Dependencies
- …

## Open questions
1. …
```

## Quality bar

- AC must be verifiable; separate DoD when release/monitoring/docs matter.
- Scope must have explicit **out of scope** when the ticket is medium or larger.
- **Implementation approach** is required for NOT READY → READY promotion; propose it if authors left it blank.
- Implementation plan must tie to repo evidence when repo was reviewed; otherwise label steps as **inferred**.
- Do not duplicate the entire description — delta section must be actionable for paste into Linear.

## Additional resources

- Full readiness rubric: [readiness-checklist.md](readiness-checklist.md)
