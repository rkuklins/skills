# Ticket Body Template

Use this format for every ticket created by `prd-to-linear`. Fill each section fully; do not
omit a section — use "N/A" or "TBD" with a note if genuinely not applicable.

---

```markdown
## Problem / context
[Why does this ticket exist? What user need or system gap does it address?
One to three sentences. Link back to the PRD section if possible.]

## Proposed outcome
[What will be true when this ticket is done? Describe the end state, not the steps.]

## Scope
**In scope:**
- …

**Out of scope:**
- …

## Acceptance criteria
- [ ] [Verifiable, specific condition. Prefer "Given / When / Then" for behavioral criteria.]
- [ ] …

## Definition of done
- [ ] Feature implemented and code reviewed
- [ ] Unit and integration tests written and passing
- [ ] CI green
- [ ] [Add release-specific items: feature flag, migration applied, monitoring dashboard, docs updated, etc.]

## Implementation approach
[Describe the technical approach. Populate from repo survey when performed; label as **inferred** when not.]

- **Approach:** [High-level strategy, key design decision]
- **Touchpoints:** [Files, modules, services, APIs that will be modified]
- **Data model changes:** [New tables, fields, migrations — or "none"]
- **Rollout / flags:** [Feature flag name, rollout strategy — or "none required"]
- **Test plan:** [What to test, where tests live, testing strategy]

## Repositories / code areas
- [org/repo or local path] — [relevant module or layer] — confirmed / inferred

## Edge cases and risks
- [What could go wrong? What behavior is expected in the failure case?]

## Dependencies
- [Blocked by: ticket / external dependency]
- [Relates to: ticket]

## Open questions
> ⚠️ OPEN QUESTION: [question from gap analysis — to be resolved before implementation starts]

## References
- PRD: [Linear document URL]
- Design: [Figma / link — or "not provided"]
- API spec: [link — or "not provided"]
- Related tickets: [identifiers]
```

---

## Notes on filling the template

**Acceptance criteria** must be verifiable by the implementing engineer or a reviewer without
additional context. Avoid: "works correctly", "looks good", "is fast". Prefer:
- "Returns HTTP 200 with the expected JSON shape for a valid request"
- "Displays error toast when the API returns a 4xx response"
- "Migration runs in under 30s on a table with 10M rows (tested in staging)"

**Implementation approach — inferred:** When the repo was not surveyed, write the most plausible
approach based on the PRD and general patterns, then prepend each bullet with `(inferred)`. The
implementing engineer should verify before starting.

**Scope — out of scope:** Always include at least one out-of-scope item for medium and large
tickets. This prevents scope creep and communicates what a follow-up ticket should address.

**Priority mapping:**
- **Urgent (1):** Blocking another milestone from starting; security/data integrity concern
- **High (2):** Required for milestone completion; no acceptable workaround
- **Medium (3):** Important but can be deferred one sprint without blocking the milestone
- **Low (4):** Nice-to-have; polish; can ship after the milestone
