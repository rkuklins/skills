# PRD Analysis Guide

Reference for Step 2 of the `prd-to-linear` skill: how to extract milestones, features,
implementation tasks, and gaps from a PRD document.

---

## Milestone / Phase Detection

Look for these signals in the document:

| Signal | Example |
|--------|---------|
| Explicit phase headings | `## Phase 1`, `### MVP`, `#### Beta Release` |
| Timeline / date markers | "by Q3", "launch in two months", "week 4" |
| Numbered rollout steps | "First, we will… Then…" |
| Delivery qualifiers | "must-have for launch", "nice-to-have post-MVP", "v2" |
| Risk-gating language | "only proceed to X once Y is stable" |

**When there are no explicit phases:** infer phases from feature dependency order and complexity. A
minimal set is: *Foundation → Core Features → Polish / Launch*. Always ask the user to confirm
inferred phases (Step 4).

**Mapping to existing milestones:** if the project already has milestones defined, match by name
similarity and goal description before proposing new ones. Prefer reuse over creating duplicates.

---

## Feature Extraction

A **feature** is a named, user-visible capability or a distinct system concern. Extract from:

- User stories (`As a [user], I want [goal]…`)
- Named sections describing what the system should do
- Lists of requirements under a phase heading
- Success metrics that imply a specific capability

Group features by milestone. A feature typically maps to a Linear Epic (parent issue) when it
contains more than 3 sub-tasks.

---

## Implementation Task Decomposition

Each feature implies concrete engineering tasks. Common patterns:

| Feature type | Typical tasks |
|---|---|
| New API endpoint | Data model, service logic, API handler, auth/authz, tests, docs |
| UI screen or flow | Component design, data fetching, state management, accessibility, tests |
| Background job | Job definition, scheduling config, idempotency, retry logic, monitoring |
| Integration with external service | Auth/credentials, client wrapper, error handling, webhook/callback, tests |
| Data migration | Migration script, rollback plan, staging validation, monitoring |
| Feature flag / config | Flag definition, evaluation logic, admin UI, cleanup ticket |

Size guidance:
- Tickets should be completable by one engineer in 1–5 days.
- If a task is larger, split it. Prefer API-layer and UI-layer as separate tickets.
- If a task is smaller than half a day, consider batching with a closely related task.

---

## Gap Detection

A gap is any requirement that cannot be directly implemented from the PRD alone. Common gap types:

### Vague requirements
- "fast", "secure", "scalable", "easy to use" without measurable criteria
- "support all users" without specifying user types or access rules
- "improve performance" without a baseline or target metric

**Fix:** Ask for quantitative acceptance criteria (e.g. p95 latency < 200ms, RBAC with three
roles).

### Missing functional scope
- A feature is described but the error path / failure mode is not specified
- Pagination, filtering, or sort order is assumed but not defined
- Multi-tenancy or per-user isolation is implied but not specified

**Fix:** Ask for the expected behavior in the missing case.

### Missing references
- "follow the existing design" with no design file linked
- "use the API" without specifying which API or version
- "match the current data model" with no schema or entity diagram

**Fix:** Ask for the specific link or document.

### Conflicting requirements
- Two sections describe incompatible behaviors for the same feature
- A constraint in one phase contradicts a requirement in another

**Fix:** Surface both statements and ask which takes precedence.

### Untestable acceptance criteria
- "The system should feel responsive"
- "Users should be satisfied"

**Fix:** Ask for a measurable criterion.

### Unresolved dependencies
- Feature B is described as depending on Feature A, but Feature A is not fully specified
- An external service dependency is mentioned without a timeline or owner

**Fix:** Ask whether the dependency is ready or flag the ticket as blocked.

### Prioritization ambiguity
- Long feature lists with no clear must-have / nice-to-have distinction
- All features described at equal priority

**Fix:** Ask the user to rank or label features by release priority.

---

## Severity of Gaps

When deciding how hard to push on a gap before proceeding:

| Severity | Description | Action |
|---|---|---|
| **Critical** | Without resolution, a ticket cannot be implemented correctly | Always ask before proceeding |
| **High** | Ambiguity will cause implementation divergence or rework | Ask; proceed only if user says to |
| **Medium** | Missing detail that can be inferred from context | Flag as OPEN QUESTION in ticket |
| **Low** | Minor style or preference gap | Flag inline; skip asking |
