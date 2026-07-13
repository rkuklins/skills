# Devil's-advocate check (for specs)

An adaptation of the devil's-advocate method, tuned for product specifications. Used **twice**:

- **Mid-draft (Step 5):** run it on what you know so far and **convert each gap into an interview
  question**. The goal is elicitation, not just critique.
- **Final (Step 8):** run it on the assembled document and deliver a verdict.

Challenge **constructively**. Prioritize the 2-3 critiques that could actually sink the effort. Never
end with "but overall this looks good" unless the verdict genuinely is SOLID.

## Checklist

1. **Problem defined?** If there is no clear problem/purpose, the metrics and scope are unanchored —
   fix this first.
2. **Hidden assumptions (3-5).** For each: the strongest counter-argument (steelman the opposition),
   the **risk if wrong**, and a **severity** (High/Med/Low).
3. **Biggest blind spot.** The single thing not being considered that could sink the plan.
4. **Writing rigor.**
   - Ban **weasel words** ("nearly all", "significantly", "dramatically") — replace with concrete values.
   - Replace adjectives with **data** (baseline + delta).
   - **"So what?" test** — cut or rewrite any line with no user/purpose impact.
   - Concision — sentences under ~30 words; remove filler.
   - Remove **peacock words** ("world-class", "cutting-edge", "innovative").
5. **Bias check.**
   - **Presenter:** anchoring, confirmation bias, sunk cost, authority bias, scope creep / feature
     attachment.
   - **Model (yourself):** "I notice I'm defaulting to X (e.g. more systems, more citations) — this may
     reflect training patterns rather than the user's context." State it explicitly.
6. **Citations ≠ correctness.** Flag when heavy sourcing is validating individual mechanisms rather than
   the assembled system's viability or desirability.

## Structure-completeness check (map to the SOLID bar)

Mark each **Present / Partial / Missing**:

- **Problem & purpose** (why it exists)
- **Audience** (who for)
- **Product identity** (one clear framing; conflicts resolved)
- **Measurable success** (adopted gates + targets)
- **Scope & anti-goals** (deferrals explicit)
- **Core mechanics / requirements** (no black boxes on the critical path)
- **Acceptance scenario(s)** (concrete, testable)
- **Decision log**
- **Phased plan / MVP** (for buildable specs)
- **Risk register**
- **Non-functional requirements** (perf, determinism, persistence, security — where relevant)

## Verdict

- **SOLID** — all mandatory elements present; critical path specified; success is testable.
- **SHAKY** — concept is sound but one or more mandatory elements are missing/weak (name them).
- **RED FLAG** — the purpose, audience, or success is undefined, or a High-severity assumption is
  unmitigated.

State a **confidence** level and end with **prioritized mitigations** ("if you proceed, do these").
When SHAKY/RED FLAG, offer another short interview round to close the named gaps.
