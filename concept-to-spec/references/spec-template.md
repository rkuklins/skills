# Spec document template

The target structure for the SOLID specification. Adapt section numbering and depth to the product;
**bold sections are mandatory** (they form the SOLID bar). Sections marked *(software)* apply mainly to
software/tech products — include when relevant, drop otherwise.

Keep the document internally consistent: when a decision changes, update every affected section **and**
the Decision Log.

---

## 0. Document status

- **Type** (spec / design doc / PRD) and intended use.
- **Source concept** (link/filename of the original notes).
- **Purpose** — one sentence.
- One-line pointers to the Decision Log, roadmap/plan, acceptance scenario(s), and risk register.

## 1. Purpose, audience, success & principles  *(mandatory)*

- **1.1 Problem & purpose** — why this exists; the job it does or the question it answers. State the
  founding use case / hypothesis explicitly.
- **1.2 Audience** — the primary (and possibly only) user; who it is *not* for.
- **1.3 Product identity** — what it primarily *is*; explicitly resolve competing framings and state
  which wins when they conflict.
- **1.4 Vision** — the short aspirational description.
- **1.5 Success definition & measurable goals** — **adopted acceptance gates** (`G1…`) vs. **strong
  targets**; note any target that arguably should be a gate.
- **1.6 Design pillars & tenets** — product pillars + build tenets (e.g. "smallest slice first").
- **1.7 Anti-goals / out of scope** — what is deliberately excluded from this version.

## 2. Core experience / user flow

The main loop or primary user journey, end to end (a diagram or numbered steps).

## 3–N. Domain model & mechanics  *(mandatory for the critical path)*

The concrete, buildable specifics. No black boxes on anything the product depends on. Typical subsections:

- **Core objects / entities** and their attributes.
- **Core behavior / logic** — decision rules, algorithms, state transitions, key interactions
  (with formulas or pseudocode where it removes ambiguity).
- **Rules of interaction** — how components/agents/users affect each other.
- **Inputs & configuration** — what is tunable, with defaults and **provenance** (where each default
  came from: precedent / research analog / convention / to-be-calibrated).

## N+1. Data model & architecture  *(software)*

Conceptual entities, module boundaries, interfaces (UI/API/CLI/integrations), extensibility seams, and
non-functional requirements (**performance, determinism/reproducibility, persistence, security, scale**).

## N+2. Setup / configuration

How a user configures and starts using it (wizard, config file, defaults).

## Decision log  *(mandatory)*

A table of every locked decision: `| Topic | Decision | Section ref |`. This is the single source of
truth; keep it current.

## Implementation plan — MVP & phased roadmap  *(mandatory for buildable specs)*

Milestones as a table: `| Milestone | Goal | Scope added | Exit criteria |`. Include an early
**de-risking spike** when the core premise is unproven. Map milestones to the success gates.

## Acceptance scenario(s)  *(mandatory)*

At least one concrete, runnable scenario that operationalizes the success gates: **setup** (a table of
exact inputs) + **expected observable outcomes** (the pass conditions) + interpretation guidance.
Passing should mean "it runs and produces an interpretable result", not a specific value, unless a
specific value is genuinely required.

## Risk register  *(mandatory)*

`| # | Risk | Impact | Mitigation |` — the assumptions most likely to sink the effort, with concrete
mitigations (spikes, phasing, guardrails).

## Open questions

Anything unresolved that does not block, plus questions parked for later, each with the default assumed
until answered.

## Future extensions

Explicitly deferred capabilities, so scope stays honest.

## Glossary

Define domain terms used in the spec.

## References  *(when research was used)*

Clickable links, grouped by topic. Label each as established fact, design analog, or precedent.
