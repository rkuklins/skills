---
name: concept-to-spec
description: >-
  Turn an initial concept or free-form notes into a SOLID product specification / description
  document through a structured, batched interview combined with a devil's-advocate hardening pass.
  Elicits and locks the problem, audience, product identity, vision, measurable success criteria and
  goals, scope and anti-goals, core mechanics/requirements, a decision log, at least one concrete
  acceptance scenario, a phased plan, and a risk register — recording every decision as it is made.
  An optional web-research step grounds decisions in cited sources. Company- and domain-agnostic with
  strong support for software/tech products.
  Use when the user says "turn this concept into a spec", "write a product spec/PRD", "help me spec
  this out", "interview me to build a specification", "make this a solid product doc", "flesh out my
  idea into requirements", or has rough notes / an idea that needs to become a clear, buildable
  specification.
---

# concept-to-spec

Transform a rough concept into a **SOLID** product specification by interviewing the author and
hardening the result with a devil's-advocate pass. The output is a single, internally consistent
markdown document that a person (or an agent) could act on: build it, or break it into tickets.

## What this produces

One markdown spec document, **built incrementally** (default location: workspace root, named
`<Name>-Specification.md` or `SPEC-<slug>.md`). A spec is **SOLID** when it has all of:

- a stated **problem + audience** (why it exists, for whom);
- a single clear **product identity** (what it primarily *is*, with competing framings resolved);
- **measurable success criteria** (adopted "done" gates vs. strong targets);
- explicit **scope + anti-goals** (what is deferred, not silently dropped);
- specified **core mechanics / requirements** — no black boxes on the critical path;
- at least one concrete, testable **acceptance scenario**;
- a **decision log** (every locked choice) and a **risk register** (assumptions + mitigations).

## Dependencies

- **None required.** Runs on the concept text supplied in the session.
- **Optional:** web search / fetch tools (for the enrichment step, §2); a structured multiple-choice
  question tool if the client has one (otherwise ask the batched questions inline as a numbered list).

## Rules

1. **Don't assume — ask.** Never invent the problem, audience, or definition of success. Interview to
   fill every material gap.
2. **Batched thematic rounds.** Group related questions into one round (~5 rounds is typical). Prefer
   multiple-choice with a **recommended option listed first**, and **always allow a free-text "Other"**.
   Split out deep or ambiguous decisions into their own focused question rather than over-batching.
3. **One source of truth.** Maintain a **Decision Log**; record every locked choice, including reversals.
   Never silently drop an element of the original concept — either include it or **explicitly defer** it.
4. **Devil's-advocate woven in, not bolted on.** Run a *mid-draft* assumption/gap check that **converts
   each gap into a targeted interview question**, and a *final* verdict (SOLID / SHAKY / RED FLAG) with
   mitigations. Advisory by default (do not hard-block) unless the user asked to gate on SOLID.
5. **Legibility & honesty.** No weasel words ("significantly", "nearly all") or peacock words
   ("world-class", "innovative"); quantify claims; label unknowns; distinguish **decided vs. deferred**;
   record **provenance** for non-obvious numbers; cite sources when research was used.
6. **Resolve identity early.** "What is this + who is it for + what does success mean" is the biggest
   lever. Lock it before diving into mechanics.
7. **Comment-driven refinement.** The author may leave inline comments anywhere in the spec using
   **`{{ ... }}`** markers — change requests, clarification questions, or asks for research/materials.
   Treat these as first-class feedback (§8): address each, then **replace the marker with the resulting
   content/answer** so no `{{ }}` remains. This is a supported alternative to live interviewing — the author
   can react to a draft by annotating it, and you refine from the annotations.
8. **Read reference files before the steps that use them.**

## Steps

### 1. Ingest the concept

Read the concept / notes completely. Extract:

- **Explicit asks** and any **embedded action items / open questions** ("figure out X", "decide Y").
- **Implied requirements** and **obvious gaps** (unstated audience, success, scope, mechanics).
- **Internal tensions** — statements that pull in different directions (e.g. "rigorous tool" *and*
  "fun toy").

Restate your understanding in 2-4 sentences and confirm it before proceeding.

### 2. (Optional) Research & enrichment

Trigger when the concept **flags unknowns**, references a **domain you should ground in**, or **asks
for external input**. Otherwise skip.

- Run focused web searches; collect **linkable sources**.
- Tie each finding back to a specific open item from Step 1.
- Keep a running **references list** for the spec's References section, with clickable links.
- Be honest about what is established fact vs. a design analogy vs. a guess.

### 3. Foundations interview — Round 1: Problem · Audience · Identity · Success

The highest-leverage round. Ask these as one batched round (see
[references/interview-guide.md](references/interview-guide.md) for the full question bank and option
templates):

- **Problem / why it exists** — the job it does or the question it answers.
- **Audience** — the primary (and possibly only) user.
- **Product identity** — what it primarily *is*; **force a choice** when framings compete (e.g.
  rigorous/reproducible tool vs. entertainment; internal utility vs. shippable product).
- **Gut definition of success** — the single outcome that would make the author say "this worked".

### 4. Success & scope — Round 2: measurable goals · MVP boundary · first use case

- Convert the gut success into **measurable acceptance goals**, split into **adopted "done" gates**
  vs. **strong targets** (record the distinction; note when a target *should* be a gate).
- Establish the **v1 vs. deferred** boundary and the **first / most important use case or hypothesis**
  the spec must serve.

### 5. Mid-draft devil's-advocate pass (drives the remaining rounds)

Read [references/devils-advocate-check.md](references/devils-advocate-check.md), then against what you
know so far:

- Surface **3-5 hidden assumptions**, each with **risk-if-wrong + severity**.
- Name the **single biggest blind spot**.
- Note **presenter biases** (anchoring, confirmation, sunk cost, scope creep) and **your own model
  biases** ("I notice I'm defaulting to more systems/citations — flagging that").
- **Convert every material gap into a targeted question** for the next rounds. The point is elicitation,
  not just critique.

### 6. Mechanics / requirements interview — Rounds 3-4+

Elicit the concrete, buildable specifics the critique exposed as black boxes. Tailor to the domain;
for software/tech products this typically includes:

- **Core behavior / logic** (decision rules, algorithms, state, key interactions) — no hand-waving on
  the critical path.
- **Data / entities** and **interfaces** (UI, API, CLI, integrations).
- **Non-functional requirements** — performance targets, determinism/reproducibility, persistence,
  security/privacy, scale.
- **Contradiction resolution** — where new detail conflicts with earlier decisions, reconcile and log.

### 7. Assemble the specification document

Write/update the doc using [references/spec-template.md](references/spec-template.md). Ensure it is
**internally consistent** — when a decision changes, propagate it across every affected section and the
Decision Log. Record **provenance** for non-obvious values and **cite** any researched sources.

### 8. Comment-driven refinement loop (whenever the doc contains `{{ }}` comments)

**Trigger:** the author has left inline **`{{ ... }}`** comments in the spec, or asks you to "address my
comments". This can run right after the first draft or on any later revision, and may repeat across several
review cycles.

1. **Find every comment.** Search the *entire* file for all `{{ ... }}` markers — do not rely on what is
   visible in the editor. Count them.
2. **Classify each** as one of:
   - **Change request** → make the edit.
   - **Clarification question** ("what is X?", "why this value?", "is this a guess?") → answer it *in the
     document*, with **cited sources** when it is a factual/technical claim (run §2 research if needed). If it
     is a decision only the author can make, **ask them** (batched with any other author-directed questions).
   - **Research / materials ask** ("find sources", "add links") → run the research step (§2) and fold in cited
     results.
   - **Idea for later** ("keep as a future thought") → move it to *Future extensions* / *Open questions*.
3. **Resolve in place.** For each comment, make the change/answer and **remove the `{{ }}` marker**, replacing
   it with the actual content — **never leave a marker behind**. Propagate any decision across all affected
   sections and into the **Decision Log**.
4. **Track methodically.** For many comments, use a checklist/todo and report to the author how many you found
   and how each was handled (change / answered+cited / researched / deferred / asked).
5. **Verify clean.** Search again to confirm **no `{{` or `}}` remain**, then continue to the verdict (§9).

### 9. Final devil's-advocate verdict

Run the full check in [references/devils-advocate-check.md](references/devils-advocate-check.md) against
the assembled document and output:

- Assumptions (risk + severity), the biggest blind spot, and the bias check (presenter + model).
- Writing-rigor fixes (weasel/peacock words, unquantified claims, "so what?" failures).
- A **structure-completeness check** against the SOLID bar.
- A **verdict — SOLID / SHAKY / RED FLAG** with confidence, then **prioritized mitigations**.

If SHAKY or RED FLAG, list the specific gaps and **offer another short interview round** to close them
(advisory unless the user chose to gate on SOLID).

### 10. Handoff

Summarize concisely: what was **decided**, what is **deferred**, the **unresolved open questions**, and
the **recommended next step** (e.g. build the MVP first slice, or run a PRD-to-tickets skill).

## Output contract (the SOLID bar)

Do not call the spec finished unless it contains: stated problem + audience; one clear identity;
measurable success (gates + targets); explicit scope + anti-goals; specified core mechanics/requirements
for the critical path; ≥1 concrete acceptance scenario; a decision log; and a risk register. Where the
product makes claims that must hold (performance, correctness), they must be **testable**.

## Gotchas

- **Don't over-batch.** Deep or ambiguous decisions deserve their own question; batching is for related,
  low-risk choices.
- **Citations ≠ correctness.** Rich sourcing validates individual mechanisms, not that the assembled
  system works or is desirable. Say so.
- **Always offer "Other"** and record important free-text answers verbatim.
- **Flag your own model biases** explicitly when you notice them.
- **Decided vs. deferred must stay crisp.** Every concept element is either specified or explicitly
  parked with a reason.
- **Never leave a `{{ }}` marker in a finished draft.** Each comment is resolved inline (change/answer, with
  citations for factual claims) or converted into an *Open Question* / *Future extension* entry — then the
  marker is deleted. Verify with a whole-file search before declaring the pass done.
- **Never end with "but overall this looks good"** unless the verdict is genuinely SOLID.
