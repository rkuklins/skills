---
name: prd-to-linear
description: >-
  Read a PRD (Product Requirements Document) stored as a Linear Document and convert it into
  Linear milestones and fully-structured implementation tickets. Analyzes the document to identify
  development phases (mapped to Linear Milestones), features, and implementation tasks; surfaces
  inconsistencies (contradictions within the PRD) and gaps in the spec through a collaborative
  one-question-at-a-time review; probes for high-level architectural guidance before writing
  tickets; consults the target repository for architecture context; and creates milestones and
  tickets in Linear.
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

1. **One question per turn.** Never batch clarifying questions about PRD inconsistencies, gaps, or
   architectural guidance. Each unresolved item gets its own focused question. Stop when the user
   says "proceed" or all critical items are resolved.
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
- **Inconsistencies** — pairs of contradictory statements: the same entity described differently
  across sections, a constraint in one phase that conflicts with a requirement in another, a success
  metric incompatible with a stated constraint, a non-functional requirement that contradicts a
  functional one. See the Inconsistency Detection section of the analysis guide for the full
  pattern table. Record each as `(section A, statement A)` vs `(section B, statement B)`.

Produce an internal structured outline (milestones → features → tasks + gap list + inconsistency
list). Do not output it yet.

### 3. Surface inconsistencies (one at a time)

Before surfacing gaps, resolve any contradictions found in Step 2. For each inconsistency, ask one
focused question per turn. Use this format:

> **Inconsistency [n/total]:** [Section A title] vs [Section B title] — [Exact conflict] —
> Which takes precedence, or should both be revised?

Example: *"Inconsistency 1/2: Section 2 (User roles) vs Section 5 (Permissions model) — Section 2
states each user has exactly one role, while Section 5 describes permissions that imply a user can
hold multiple simultaneous roles. Which model is correct?"*

Stop asking when:
- All inconsistencies are resolved, or
- The user says to proceed and flag remaining inconsistencies in tickets.

Mark unresolved inconsistencies as `> ⚠️ INCONSISTENCY: [description of conflict]` in the
description of every ticket that the conflicting requirements affect.

### 4. Surface gaps (one at a time)

For each gap, ask one focused question per turn. Use this format:

> **Gap [n/total]:** [Area] — [Concrete question]

Example: *"Gap 1/3: User authentication — The PRD mentions 'secure login' but doesn't specify the
auth mechanism. Should this use OAuth/SSO, magic links, or username/password?"*

Stop asking when:
- All critical gaps are resolved, or
- The user says to proceed and flag remaining gaps in tickets.

Mark unresolved gaps as `> ⚠️ OPEN QUESTION: [question]` in the relevant ticket's description.

### 5. Confirm milestone structure

Present the proposed milestones:

| # | Milestone | Goal summary | Key features |
|---|-----------|--------------|--------------|
| 1 | … | … | … |

Ask: *"Does this milestone structure match your intended phases? Any renames, additions, or
reordering?"*

Wait for explicit confirmation before continuing. Map to existing milestones where possible.

### 6. Architecture and guidance check (per milestone or feature cluster)

#### 6a. Repository survey (per milestone)

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

#### 6b. Architectural guidance questions (project-scoped, asked once)

After completing the repository survey for all milestones, probe for high-level architectural
decisions that the PRD implies but does not specify. These answers apply to every ticket in Step 7
and are stored as **Architectural context** used to populate the `Implementation approach` section.

**Skip any category already answered by `AGENTS.md`, `CLAUDE.md`, or the PRD itself.** Ask one
question per turn.

Probe the following categories (in order), tailoring each question to what the PRD actually implies:

1. **Communication style** — *"The PRD involves [feature]. Should the API surface use REST,
   GraphQL, gRPC, or internal events / pub-sub? Is there an existing convention to follow?"*
2. **Service boundaries** — *"Should this be built by extending existing services, or does it
   warrant new service(s)? Are there ownership or team-boundary constraints?"*
3. **Feature flag strategy** — *"Will any of these features need a rollout flag? If so, what
   mechanism is in use (e.g. LaunchDarkly, custom config, env vars), and what is the flag lifecycle
   policy (when should cleanup happen)?"*
4. **Data ownership / tenancy** — *"Does the system need per-user isolation, multi-tenancy, or is
   it single-tenant? Are there data residency or partitioning constraints?"*
5. **Scale and performance targets** — *"Are there latency SLOs, throughput targets, or data-volume
   constraints that should guide the implementation approach?"*
6. **Auth and security patterns** — *"Which authentication and authorization mechanism applies
   here? Any compliance or data-sensitivity constraints the tickets should reflect?"*
7. **Observability conventions** — *"Are there logging formats, metric naming conventions, or
   alerting thresholds the implementation should conform to?"*

Stop when:
- All relevant categories have been answered or confirmed as not applicable, or
- The user says to proceed and notes that remaining categories are not applicable to this project.

Record all answers as an **Architectural context** block and reference it in the `Implementation
approach` of every ticket in Step 7.

### 7. Propose the full ticket breakdown

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

### 8. Create milestones and tickets

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

### 9. Report

Print a concise summary:

- Project and PRD document used
- Milestones created (names, with Linear URLs if returned)
- Tickets created (count, grouped by milestone, with identifiers)
- Open questions still unresolved (list them)
- Tickets where implementation approach is **inferred** — suggest running `tune-the-ticket` on each
