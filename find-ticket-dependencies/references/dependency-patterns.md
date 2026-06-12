# Dependency Detection Patterns

Reference for Step 4 of `find-ticket-dependencies`. Describes the signals
to look for in each detection pass and how to score confidence.

---

## 1. Cross-Reference Signals

Check ticket descriptions, PR bodies, and commit messages for explicit
references to other tickets in the set.

| Signal | Example | Weight |
|--------|---------|--------|
| Ticket identifier mentioned by ID | "depends on CD-123" | Strong |
| Dependency language near an ID | "blocked by", "after", "requires", "prerequisite", "needs CD-…" | Strong |
| Ticket title keyword in another's description | Ticket "Add PaymentService" is named in "Use PaymentService in checkout flow" | Medium |
| PR body references another PR from the set | "stacks on top of #45 which adds the API" | Medium |

**Relation type**: almost always `blocks`/`blockedBy` — explicit language
usually implies ordering.

---

## 2. Structural Signals

Compare the changed file sets gathered in Step 3.

| Signal | Example | Weight |
|--------|---------|--------|
| Exact same file modified by both tickets | Both modify `src/services/payment.ts` | Strong |
| Same core module / shared directory | Both touch `src/services/` | Medium |
| One ticket adds a file the other also touches | A adds `api/orders.go`, B later modifies `api/orders.go` | Strong |
| One ticket adds a file, other imports it | A adds `lib/formatter.ts`, B imports `from '../lib/formatter'` | Medium (requires description analysis to confirm) |

**Relation type guidance for structural overlap:**
- If the overlap is in a file that one ticket *creates* and another *uses* →
  `blocks`/`blockedBy`.
- If both tickets *modify* an existing shared file independently → `relatedTo`
  (risk of merge conflict, but no strict ordering required).

---

## 3. Functional Signals

Analyze ticket titles and descriptions for producer/consumer relationships.
No repo data needed — description-only analysis falls back to this.

### 3a. API / Contract producer → consumer

- One ticket creates an endpoint, RPC method, or public interface.
- Another ticket calls that endpoint or implements a client for it.

Keywords on the **producer** side: "add endpoint", "create API", "expose",
"introduce interface", "define contract", "implement service", "add route".

Keywords on the **consumer** side: "use", "call", "consume", "integrate with",
"fetch from", "send to", "hook up to", "wire up".

Relation type: producer `blocks` consumer.

### 3b. Stub / Skeleton → Implementation

- One ticket creates a placeholder, empty class, scaffolding, or stub.
- Another ticket fills in the logic, methods, or business rules.

Keywords on the **stub** side: "stub", "scaffold", "skeleton", "placeholder",
"empty implementation", "define structure", "create class".

Keywords on the **implementation** side: "implement", "fill in", "add logic",
"complete", "flesh out", "add business rules".

Relation type: stub `blocks` implementation.

### 3c. Schema / Migration → Feature

- One ticket adds or modifies a database migration, table, column, or schema.
- Another ticket adds logic that reads or writes those new columns/tables.

Keywords on the **schema** side: "migration", "add column", "create table",
"alter schema", "add index", "data model".

Keywords on the **feature** side: references the same entity name (e.g. the
table name or column) in a feature context.

Relation type: schema `blocks` feature.

### 3d. Configuration / Feature Flag → Feature

- One ticket adds a config key, environment variable, or feature flag.
- Another ticket reads that config or gates behavior behind that flag.

Relation type: config `blocks` feature (if config must be present for the
feature to run); otherwise `relatedTo`.

### 3e. Shared Refactor / Extract → Dependents

- One ticket refactors, extracts, or renames a shared module, function, or
  component.
- Other tickets touch code that will be affected by that rename/move.

Relation type: refactor `relates to` dependents (both need to coordinate but
neither strictly blocks the other if done on separate branches carefully).

---

## 4. Confidence Scoring

| Level | Criteria |
|-------|----------|
| **High** | Cross-reference signal **or** structural + functional signal both present |
| **Medium** | One strong structural signal **or** one clear functional pattern |
| **Low** | Only weak structural overlap (shared directory, not file) **or** only vague keyword match with no corroborating signal |

**Drop Low-confidence pairs** unless the user specifically asks to include them.

---

## 5. Relation Type Quick Reference

| Situation | Type to use |
|-----------|-------------|
| B cannot be correctly implemented until A is merged | A `blocks` B |
| A's description says it depends on B | A `blockedBy` B |
| They share code surface but can proceed independently | `relatedTo` |
| Unclear ordering, but clearly connected | `relatedTo` |

Always use the **minimum necessary relation**: prefer `relatedTo` over
`blocks`/`blockedBy` when you are not confident ordering matters.
