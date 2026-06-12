---
name: prd-to-linear
description: >-
  Read a PRD (Product Requirements Document) stored as a Linear Document and convert it into
  Linear milestones and fully-structured implementation tickets. Analyzes the document to identify
  development phases (mapped to Linear Milestones), features, and implementation tasks; surfaces
  gaps in the spec through a collaborative one-question-at-a-time review; consults the target
  repository for architecture context; and creates milestones and tickets in Linear.
  Use when the user says "break this PRD into tickets", "convert the spec to Linear issues",
  "create tickets from the PRD", "plan this feature from the document", "turn this doc into a
  backlog", or wants to transform a product specification into a structured Linear project backlog
  with milestones.
---

# prd-to-linear

## Dependencies

- **Linear MCP** — `list_projects`, `get_project`, `list_documents`, `get_document`,
  `list_milestones`, `list_teams`, `get_team`, `save_milestone`, `save_issue`
- **gh CLI** (optional) — lightweight repo survey for architecture context
- **git / Read** (optional) — read `AGENTS.md`, file structure, and relevant modules

## Rules

1. **One gap question per turn.** Never batch clarifying questions about PRD gaps. Each unresolved
   requirement gets its own focused question. Stop when the user says "proceed" or all critical
   gaps are resolved.
2. **Confirm before writing to Linear.** Present the full proposed plan (milestones + ticket list)
   and wait for explicit approval before calling `save_milestone` or `save_issue`.
3. **Every ticket needs an implementation approach.** Derive it from the repo survey when available;
   label it **inferred** when the repo was not inspected.
4. **Read reference files before the steps that require them.** See notes in each step.

## Steps

### 1. Resolve the project and PRD document

Ask: *"Which Linear project and PRD document should I work from?"*
Accept a project name/URL/slug and a document name/URL/id.

- Resolve the project via `get_project` (by name or slug) or `list_projects` if ambiguous.
- Fetch documents in the project: `list_documents` with `projectId`.
- Match the user-specified document by title; if unclear, list candidates and ask for confirmation.
- Fetch the full document content: `get_document`.
- Fetch existing milestones: `list_milestones` for the project. Note any already defined — map to
  them before proposing new ones.

### 2. Parse the PRD

Read [references/prd-analysis-guide.md](references/prd-analysis-guide.md) for extraction patterns
before starting this step.

Extract from the document:

- **Phases / milestones** — explicit phase sections, timeline headers, delivery stages, or numbered
  rollout steps.
- **Features / epics** — named capabilities, user stories, or functional areas.
- **Implementation tasks** — concrete changes implied per feature: API endpoints, data model
  changes, UI screens, background jobs, integrations, config flags.
- **Gaps** — vague requirements, missing acceptance criteria, untestable claims, unspecified edge
  cases, missing design/API/data model references, undefined error handling, unresolved dependencies.

Produce an internal structured outline (milestones → features → tasks + gap list). Do not output it
yet.

### 3. Surface gaps (one at a time)

For each gap, ask one focused question per turn. Use this format:

> **Gap [n/total]:** [Area] — [Concrete question]

Example: *"Gap 1/3: User authentication — The PRD mentions 'secure login' but doesn't specify the
auth mechanism. Should this use OAuth/SSO, magic links, or username/password?"*

Stop asking when:
- All critical gaps are resolved, or
- The user says to proceed and flag remaining gaps in tickets.

Mark unresolved gaps as `> ⚠️ OPEN QUESTION: [question]` in the relevant ticket's description.

### 4. Confirm milestone structure

Present the proposed milestones:

| # | Milestone | Goal summary | Key features |
|---|-----------|--------------|--------------|
| 1 | … | … | … |

Ask: *"Does this milestone structure match your intended phases? Any renames, additions, or
reordering?"*

Wait for explicit confirmation before continuing. Map to existing milestones where possible.

### 5. Architecture check (per milestone or feature cluster)

For each milestone (or significant feature cluster):

1. Ask: *"Which repository should I reference for [milestone / feature name]? (Provide org/repo,
   local path, or 'skip'.)"*
2. If a repo is provided:
   - Read `AGENTS.md` or `CLAUDE.md` at the repo root for coding conventions and test guidelines.
   - Identify entry points, relevant modules, existing similar features, tests, API surfaces, config
     flags, and data models touched by this feature.
   - Note reusable patterns, existing abstractions, and risky touchpoints.
3. If skipped: mark all implementation approach sections for that milestone as **inferred**.

Batch the repo question for the next milestone immediately after the user answers the current one —
but still ask one milestone at a time.

### 6. Propose the full ticket breakdown

Read [references/ticket-template.md](references/ticket-template.md) for the ticket body format.

For each milestone, produce a summary table followed by the full draft body of each ticket:

**Milestone N — [Name]**

| # | Title | Type | Priority |
|---|-------|------|----------|
| 1 | … | feature / chore / spike | High / Med / Low |

Then show the full ticket body for each (use the template from the reference file).

After presenting all milestones, ask:
*"Apply all, skip specific tickets, or adjust any before I write to Linear?"*

Wait for the user's answer.

### 7. Create milestones and tickets

After explicit approval:

1. **Milestones first:** For each new milestone call `save_milestone` with `project`, `name`,
   `description` (one-sentence goal), and `targetDate` if the PRD specifies one.
   — Skip milestones that already exist and were mapped in Step 1.

2. **Tickets:** For each approved ticket call `save_issue` with:
   - `title`, `description` (full markdown body from template)
   - `team` (from `get_team` or project default)
   - `project`
   - `milestone` (name of the milestone created above)
   - `priority` (1=Urgent, 2=High, 3=Medium, 4=Low)
   - `state` → team's backlog state (fetch via `list_issue_statuses` if unsure)
   - `links` → include PRD document URL where possible

   Never create tickets the user explicitly skipped.

### 8. Report

Print a concise summary:

- Project and PRD document used
- Milestones created (names, with Linear URLs if returned)
- Tickets created (count, grouped by milestone, with identifiers)
- Open questions still unresolved (list them)
- Tickets where implementation approach is **inferred** — suggest running `tune-the-ticket` on each
