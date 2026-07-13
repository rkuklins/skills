# Interview guide (batched thematic rounds)

Run the interview as a small number of **thematic rounds** (~5). Each round bundles related questions.
Prefer **multiple-choice with a recommended option first**, and **always allow free-text "Other"**.
Split deep/ambiguous items into their own question. Record answers into the Decision Log immediately.

Adapt wording to the product; the *themes* are the stable part. Below, each theme lists what to elicit
and example option shapes.

---

## Round 1 — Foundations: Problem · Audience · Identity · Success

The most important round. Resolve these before any mechanics.

- **Problem / why** — "What draws you to build this / what problem or question does it address?"
  (allow multiple; capture free-text motivation verbatim).
- **Audience** — "Who is the primary user of v1?" (just me / me + peers / general public / a specific
  role / researchers).
- **Identity** *(force a choice when framings compete)* — "What is this *primarily*?" e.g.
  rigorous/reproducible **tool** vs. **entertainment/story** vs. **learning/exploration toy** vs.
  genuinely both (with the cost acknowledged). State which wins on conflict.
- **Gut success** — "What single outcome would make you say v1 succeeded?" (runs end-to-end / produces
  differentiated results / answers the core question / is engaging enough to keep using).

## Round 2 — Success made measurable & scope

- **Measurable goals** — turn the gut answer into `G1…Gn`; ask which are **hard 'done' gates** vs.
  **strong targets**. Flag any target that is core to the identity (e.g. reproducibility for a "tool").
- **First use case / hypothesis** — "What should it demonstrate/answer *first*?" This becomes the
  acceptance scenario.
- **MVP boundary** — "Which parts must be in the first slice vs. deferred to later increments?"
  (multi-select of the heavier subsystems the concept implies).
- **Rigor/quality bar** — where relevant: reproducibility, single-run vs. batch, determinism.

## Round 3+ — Mechanics / requirements (driven by the mid-draft critique)

Ask only what the devil's-advocate pass exposed as undefined on the critical path. Common themes:

- **Core decision/logic model** — how the central behavior is decided (simple rules / scoring /
  learned) — favor **legible & deterministic** for tools.
- **Key interactions** — how entities/agents/users affect each other (conflict, cooperation, exchange),
  including the concrete resolution math/rules.
- **Inheritance/derivation/transformation rules** — how state or outputs are produced from inputs.
- **Cost/trade-off model** — what makes strong options expensive so nothing is free.
- **Non-functionals** — performance targets, persistence/save, determinism, security/privacy, scale.
- **Interfaces** — UI/CLI/API surface for v1.

## Round N — Scope confirmation & deferrals

- Confirm the **v1 vs. deferred** split; ensure **no concept element is silently dropped**.
- Confirm **naming/authoring** choices (what the user provides vs. what the system generates).

---

## Consistency watch-outs to raise during the interview

- **Identity vs. success mismatch** — e.g. a "reproducible tool" whose success bar omits reproducibility.
- **Deferrals that strand each other** — deferring A while keeping B that only exists to serve A.
- **Termination / completion** — for long-running or open-ended products, how does a run/session *end*
  so the success bar ("a coherent result") is reachable?
- **Determinism vs. non-deterministic components** (e.g. LLMs, randomness) — isolate/freeze them so
  reproducibility survives.
