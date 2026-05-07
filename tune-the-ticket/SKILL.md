---
name: tune-the-ticket
description: >
  Analyze an existing Linear issue (or pasted ticket text), list gaps
  (acceptance criteria, definition of done, scope, context), infer
  affected repositories, surface edge cases, and produce a refined
  ticket as a new markdown file only. Use when the user asks to
  tune-the-ticket, tune this ticket, improve the ticket, check the
  ticket, polish or sharpen a ticket, make it better, or similar
  explicit requests about a specific issue. Linear is the primary
  tracker: use the Linear MCP only to read issues, never to update
  Linear. Does not modify the original ticket in Linear.
disable-model-invocation: true
---

# Tune the Ticket

## Goal

Take an existing ticket, analyze it, verify what is missing (acceptance criteria, definition of done, clear problem, scope, dependencies), identify which repositories are likely affected and potential edge cases, then write a **single new markdown file** with the refined ticket. **Do not change the issue in Linear** and do not use any Linear MCP tool that creates, updates, or deletes data.

## Linear MCP (read only)

1. If the user provides a Linear issue id or URL (for example `LIN-123`), load the issue with the Linear MCP **`get_issue`** (use `includeRelations: true` when relations help scope or dependencies).
2. Use other **read** tools as needed: for example **`list_issues`** (search), **`list_comments`**, **`get_project`**, **`get_team`** — only when they reduce ambiguity.
3. If Linear reads fail for authentication, use the host MCP flow for that Linear server (for example **`mcp_auth`** when it exists for that server), then retry the read.
4. **Forbidden:** any Linear MCP tool whose purpose is to write or delete — including but not limited to **`save_issue`**, **`save_comment`**, **`save_status_update`**, **`save_document`**, **`save_project`**, **`save_milestone`**, **`save_initiative`**, **`create_attachment`**, **`delete_*`**, **`create_issue_label`**. If the user asks to apply changes in Linear, refuse the write and deliver only the markdown file plus instructions they can paste manually.

When the user pastes ticket text and there is no Linear id, skip MCP and work from the paste.

## Workflow

1. **Capture source** — Linear id/URL (via MCP) or pasted content. Ask only for what blocks analysis (for example which workspace/repo root to write the file into, if unclear).
2. **Gap analysis** — Short checklist: missing or untestable acceptance criteria; missing or vague definition of done; unclear problem or customer impact; scope bleed; missing dependencies or relations; missing technical or rollout notes if the ticket is implementation-heavy.
3. **Repos affected** — From issue description, links, labels, project name, or `get_issue` fields (for example git branch name if present), list repositories or code areas likely touched. Mark each as **confirmed** (explicit in ticket) vs **inferred** (guess).
4. **Edge cases** — List boundary conditions, failure modes, permissions, backwards compatibility, empty states, and concurrency or idempotency where relevant.
5. **Rewrite** — Fill the output template below with imperative title, concrete AC, explicit DoD, and open questions.
6. **Deliverable** — Write one new file in the **active workspace** (root or a path the user gives): suggest name `tuned-ticket-<ISSUE-KEY>-<YYYY-MM-DD>.md` (use `tuned-ticket-manual-<YYYY-MM-DD>.md` if no Linear key). Put the full refined content in that file. The chat reply can be brief: path to the file, summary of gaps found, and reminder that Linear was not updated.

## Output template

Use this structure inside the generated markdown file:

```markdown
# Tuned ticket — [Original title or LINEAR-KEY]

## Original reference
- Linear: [key or URL] (or "pasted only")
- Note: This file is a proposal only; the Linear issue was not modified.

## Gap analysis (what was missing or weak)
- …

## Title
[Imperative, under ~80 characters]

## Problem / context
[Who is affected, what is broken or missing, why now]

## Proposed outcome
[Single sentence: what changes for users or the system]

## Scope
**In scope:** …  
**Out of scope:** …

## Acceptance criteria
- [ ] …
- [ ] …

## Definition of done
- [ ] …

## Repositories likely affected
- … (confirmed vs inferred)

## Edge cases and risks
- …

## Notes / dependencies
- …

## Open questions
1. …
```

## Quality bar

- Title states action or outcome, not a meeting or vague theme.
- Every acceptance criterion is verifiable (observable behavior, metric, or artifact).
- Definition of done is separate from AC when useful (release notes, flags, monitoring, rollback).
- "Done" does not depend on unstated environment or role.
- No duplicate prose between problem and AC; AC checks the outcome, not the essay.
