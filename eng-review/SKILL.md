---
name: eng-review
description: >-
  Assess a technical decision document for its readiness for engineering review and generate a
  readiness checklist from the review's requirements. Checks whether the document has a clear problem
  statement, a real decision to be made, genuine alternatives considered, a clearly stated recommended
  decision, an honest cost-of-being-wrong analysis, and a rollout plan — and whether the decision
  actually warrants review against six impact categories (irreversible/expensive-to-change, team blast
  radius, product blast radius, infrastructure spend, new patterns, security posture). Use when the
  user asks "is this ready for eng review?", "review this decision doc", "is my eng review document
  complete?", or wants a readiness checklist for a technical decision document.
disable-model-invocation: true
---

# eng-review

Assess whether a technical decision document is ready for engineering review, and generate a
readiness checklist from the review's requirements.

## Purpose

This is a lightweight but consistent governance process for technical decisions with broad
organizational or product impact. It is **not** an ivory-tower architecture process. It is how the
org ensures that major technical decisions are made clearly and transparently, with the right
oversight from the right people. The goal is to balance velocity against the fragmentation that
results from localized decision-making on issues of global impact.

This skill helps a team get a document **ready** for that review: it evaluates a draft against the
review's requirements and produces a concrete checklist of what's solid and what's missing.

## What this skill does

Given a decision document (or a draft, outline, or description of one):

1. **Assess readiness** — evaluate the document against the requirements below and judge whether it's
   ready to bring to review.
2. **Generate a checklist** — produce a pass/gap checklist the team can work through before the
   session.

## Does the decision warrant review?

First confirm the decision is in scope. A decision should come to review if it falls into **any** of
these six categories:

1. **Irreversible or expensive-to-change decisions**
2. **High team blast radius** — significant switching costs for other teams
3. **High product blast radius** — changes key failure modes on fan or creator experience
4. **Significant infrastructure spend changes**
5. **New patterns** — intentional deviations from established norms
6. **Security posture changes**

State, for each category, whether it applies and why. If none apply, say so — the team may not need
review at all. If the document doesn't make the triggering category obvious, that itself is a gap.

## Readiness requirements

A document is ready when it clearly answers all of the following. Assess each one and mark it
**Pass**, **Gap**, or **Unclear**, with a one-line reason.

| # | Requirement | What "ready" looks like |
| --- | --- | --- |
| 1 | **Clear problem statement** | The problem, who it affects, and why now are stated plainly. |
| 2 | **A real decision to be made** | There is an actual decision on the table — not a status update or a foregone conclusion. |
| 3 | **Alternatives considered** | Real options with honest trade-offs and the reason each was or wasn't chosen — no strawmen. |
| 4 | **Recommended decision** | The proposal is stated clearly and unambiguously. |
| 5 | **Cost of being wrong** | What breaks if this is wrong, how reversible it is, and how it's detected/recovered. |
| 6 | **Rollout plan** | Sequencing, guardrails, and rollback — how the decision is implemented and de-risked. |
| 7 | **Format** | A written document of **2–4 pages of prose** — not slides. |
| 8 | **Stakeholders consulted** | Key impacted stakeholders were given the document and their stance is captured (consent is optimal; dissent is fine to bring to the meeting). |
| 9 | **Tech-lead presenter** | A tech lead — **not a manager** — is named to lead the discussion. |

Notes on the requirements:

- This is a **decision-making meeting**, so requirement 2 is central: if there's no decision to make,
  it doesn't belong in review.
- Dissent does **not** make a document unready. Hidden dissent or no consultation does (requirement 8).
- Standing participants are the CTO, engineering SVPs, and a rotating set of key IC technical leads;
  the proposing team determines any additional required and optional attendees.

## Output

Produce:

1. **Verdict** — `READY`, `NOT READY`, or `NEEDS WORK`, in one line.
2. **Scope check** — which of the six categories the decision triggers (with reasons), or a note that
   it may not need review.
3. **Readiness checklist** — each of the nine requirements marked Pass / Gap / Unclear with a
   one-line reason.
4. **Top gaps to close** — the few highest-impact fixes needed before the session, ordered.

When the user is drafting from scratch rather than assessing, use
[references/decision-doc-template.md](references/decision-doc-template.md) as the starting structure.
