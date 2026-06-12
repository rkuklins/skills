# Development readiness checklist

Use this rubric when scoring a ticket. Mark each row **Pass**, **Weak**, or **Missing**.

| Area | Pass | Weak | Missing |
|------|------|------|---------|
| **Problem** | Who is affected, what breaks, why now | Vague user pain | No problem statement |
| **Outcome** | One sentence: what changes when done | Multiple conflicting goals | No outcome |
| **Scope** | Explicit in / out of scope | Implied only | Scope creep or absent |
| **Acceptance criteria** | Testable, observable, complete for scope | Partial or subjective | None |
| **Definition of done** | Release/QA/docs/monitoring where relevant | Duplicates AC only | None |
| **Implementation approach** | Engineering notes: approach, touchpoints, risks | "TBD" or one line | None |
| **References** | PRD/design/repo links present and reachable | Broken or generic links | None for a non-trivial change |
| **Dependencies** | Blockers, teams, flags, migrations named | Hand-wavy | None |
| **Edge cases** | Key failures and boundaries listed | One or two obvious only | None |
| **Agent/human start** | A developer could pick this up without a meeting | Needs verbal context | Cannot start |

**Verdict rules**

- **READY** — No **Missing** in Problem, Outcome, Scope, AC; Implementation approach at least **Weak**; references sufficient for the change type.
- **NEEDS INFO** — One or more **Missing** in critical rows, or required PRD/design/repo not provided after ask.
- **NOT READY** — Problem or AC **Missing**, or scope undefined for a multi-repo change.

## Acceptance criteria quality

Each criterion should be:

- **Observable** — someone can verify without reading the author's mind
- **Scoped** — maps to in-scope work only
- **Independent** — prefer several small AC over one mega-criterion

Bad: "Works well", "Performance is good", "Handles edge cases"
Good: "Returns 404 when id not found", "p95 latency under 200ms on staging", "Empty search shows zero-state copy from Figma node X"

## Implementation approach (engineering section)

The ticket should capture **how** engineering expects to build it, not only **what**. Look for or propose:

- Likely files/modules/services to change
- Approach choice and why (or options considered)
- Feature flag / rollout / rollback
- Test strategy (unit, integration, manual)
- Open technical risks

If the ticket has no engineering section, propose one under `## Implementation approach (proposed)` after repo review or inference.

## When to require external references

| Change type | Ask for |
|-------------|---------|
| User-facing UI/UX | Design link (Figma etc.) or explicit "no design — engineer discretion" |
| Product behavior | PRD, spec, or parent initiative with requirements |
| Code change | Repo name or monorepo path; clone or workspace root |
| Infra / platform | Runbook, architecture doc, or owning team |
| Bug | Repro steps, expected vs actual, environment |

Ask at most **5 targeted questions** in one batch; do not stall on nice-to-haves.
