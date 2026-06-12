---
name: distro-agent-ticket
description: Create a new Linear ticket — or refine an existing one — so the distribution-agents bug-fix or enhancement strategy can plan and act on it. Probes for outcome-level clarity (never solutions) and never adds the trigger labels.
allowed-tools: Read, Bash(gh:*), mcp__claude_ai_Linear__get_issue, mcp__claude_ai_Linear__list_teams, mcp__claude_ai_Linear__list_projects, mcp__claude_ai_Linear__list_cycles, mcp__claude_ai_Linear__list_issue_labels, mcp__claude_ai_Linear__save_issue
metadata:
    version: 1.1.0
---

# distro-agent-ticket

## Trigger

Use this skill when the user wants to:

- **Create** a new Linear ticket aimed at the distribution-agents (bug-fix or enhancement strategy), or
- **Review and refine** an existing Linear ticket so the distribution-agents can act on it.

Mode is detected from the invocation input:

- Input contains a Linear identifier matching `\b[A-Z]+-\d+\b` (e.g. `CD-580`) → **Review mode** for that identifier.
- Otherwise → **Create mode** with the user's free-text request as the seed.
- Input plausibly contains both an identifier *and* an unrelated fresh request → ask one disambiguating question: *"Are you reviewing CD-580, or creating a new ticket that references it?"*

The end goal is the same in both modes: a Linear ticket that follows the canonical structure (below), is in the right team/project/cycle, has appropriate non-trigger labels, and whose URL is printed at the end with a one-line reminder of how to dispatch the agent.

## Universal rules

These rules apply to every step below and override any local instructions:

1. **One question at a time for substantive content.** UAC, Context, Scope, Reproduction, refinement probes, and the final confirmation each go as a *single* question. Two specific groupings are explicitly allowed because the fields are independent and at most yes/no confirms or a short fact: (a) classification + repository in Step 3, (b) Linear metadata (team/project/cycle/labels) in Step 6. Everywhere else: never batch.
2. **The skill is a structured-editor, not a research agent.** Do not read source code, run codebase searches, browse repos, fetch documentation, or attempt to figure out *how* the change should be implemented. The user's words are the source of truth; the `distribution-agents` themselves do the technical research and produce the fix.
3. **Outcome-level only.** When asking clarifying or refinement questions, stay on requirements / outcomes / success criteria. Never propose libraries, patterns, file layouts, algorithms, or designs. If a question can only be answered by reading code or running commands, it's the wrong question — that's the agent's job.
4. **Never add trigger labels.** The labels `distro-bug-agent` and `distro-enhancement-agent` are filtered out of every candidate set the skill shows the user, and any user-supplied input naming them is rejected with an inline explanation.

## Steps

### 1. Detect mode

- Inspect the user's invocation message.
- If it contains a token matching `\b[A-Z]+-\d+\b` (e.g. `CD-580`) → enter **Review mode** with that identifier.
- Otherwise → enter **Create mode** with the user's free-text request as the seed content.
- If the message plausibly contains both an identifier *and* an unrelated fresh request, ask **one** disambiguating question: *"Are you reviewing CD-580, or creating a new ticket that references it?"* and act on the answer.

Record the chosen mode for the rest of the run.

### 2. Fetch existing ticket (review mode only)

- Skip this step in create mode.
- Call `mcp__claude_ai_Linear__get_issue` with the identifier from Step 1.
- Capture the existing title, description, team, project, cycle, labels, and state. These become defaults for later steps.
- If the issue is not found, stop and tell the user: the identifier could not be resolved. Do not silently fall back to create mode.

### 3. Classify and resolve repository

Bug-vs-enhancement classification and the target repository go to the user in **one combined prompt**, since each is at most a yes/no confirm or a short fact and the fields are independent. Pre-fill silently as much as possible, then ask once for whatever still needs the user.

Naming a specific repo in the ticket short-circuits the distribution-agent's orientation step and prevents revision loops. The skill's only hard requirement around repos is that the ticket names one. Validating that name against the canonical `allowed_repos` list is best-effort: warn-and-continue if the list is unavailable or the user's repo isn't in it. Let the distribution-agent handle invalid repos downstream — never block the user from writing a ticket when the repo is in fact allowed.

#### 3a. Best-effort fetch the canonical allowed_repos list

Run:

```bash
gh api -H "Accept: application/vnd.github.v3.raw" /repos/soundcloud/distribution-agents/contents/src/config.py
```

Parse the `allowed_repos: list[str] = [ ... ]` literal from the returned source. The list is a Python list of `"owner/repo"` string literals.

If the fetch fails (non-zero exit, empty output, or no parseable `allowed_repos` literal), proceed without a list. Note this internally — it changes the warning text in Step 3c — but do not warn the user yet and do not stop.

#### 3b. Pre-fill silently

- **Classification.** Propose *bug* or *enhancement* from the request text (create mode) or existing ticket text (review mode): "X is broken", "X regressed", "fails when…" → bug; "I want X to also do Y", "add support for…", "should now…" → enhancement.
- **Repository.** Scan the user's request (create mode) for a `soundcloud/<name>` token or a bare `<name>` that plausibly references a repo. In review mode, scan the existing description for a `Repository` section and parse the repo name from it.

#### 3c. Combined prompt

Build a single prompt with whatever still needs the user. Pick the variant that matches the pre-fill state:

- **Both pre-filled and repo allow-listed (or list unfetched):**
  *"This looks like a {bug|enhancement} ticket targeting `soundcloud/<repo>` — confirm both?"*
- **Both pre-filled but repo NOT in the allow-list:**
  *"This looks like a {bug|enhancement} ticket targeting `soundcloud/<repo>`. Heads up: `<repo>` is not in `allowed_repos` (`soundcloud/distribution-agents/src/config.py`), so the agent will likely refuse to act on this ticket. Confirm classification, and either pick another repo from the allow-list or say 'proceed anyway'?"*
- **Classification pre-filled, repo unknown, allow-list available:**
  *"This looks like a {bug|enhancement} ticket. Confirm classification, and which repo should it target? (Allow-listed repos: <bulleted list>.)"*
- **Classification pre-filled, repo unknown, allow-list fetch failed:**
  *"This looks like a {bug|enhancement} ticket. Confirm classification, and which `soundcloud/<repo>` should it target? (Could not fetch the canonical allow-list; the distribution-agent will reject downstream if the repo isn't allow-listed.)"*

The user must provide a repo — that is the one hard gate. Classification accepts a yes / no / flip.

#### 3d. Soft-validate after the answer

- Repo in the canonical list → proceed silently.
- Repo not in the canonical list and user said "proceed anyway" → proceed; the description's `Repository` section uses what the user gave.
- Repo not in the canonical list and user picked a different one → use the new value; re-validate if needed.
- Allow-list fetch failed → no validation; record the chosen repo as-is.

Record the classification and the chosen repo for the rest of the run.

### 4. Structure content into the canonical sections

Build the description in the fixed section order below. Required sections are always emitted; optional sections are emitted only if the user supplied content for them — never auto-padded with placeholders.

**Section order:**

1. `**UAC**` — bullet list of acceptance criteria / outcomes (required)
2. `**Context**` — 1–3 short paragraphs of background (required)
3. `**Scope**` — `**In scope:**` and `**Out of scope:**` bullet lists (required)
4. `**Repository**` — `soundcloud/<repo>` followed by an optional one-liner on which area inside (required, from Step 3)
5. `**Reproduction**` — Steps + Expected + Actual (required for bugs only; omitted for enhancements)
6. `**Suggested approach**` — user-supplied solution hints (optional)
7. `**Test expectations**` — user-supplied test requirements (optional)
8. `**References**` — bullet links (optional)

#### 4a. Pull content from the source

- **Create mode:** start from the user's request as raw input.
- **Review mode:** start from the existing ticket's description, parsing it into the canonical sections where possible.

#### 4b. Fill required sections — ask one question per missing field

For each required section that has no content yet, ask **one** focused question. Examples:

- *"What are the acceptance criteria — what specifically must be true for this to be considered done?"* (UAC)
- *"What's the background — why does this need to change now, and what should the agent know to act on it?"* (Context)
- *"What's in scope and what's explicitly out of scope?"* (Scope)
- *"What are the steps to reproduce the bug? What's the expected behavior, and what's the actual behavior?"* (Reproduction)

Ask one question, wait for the answer, fold it in, move to the next gap.

#### 4c. Comprehensibility check

After all required sections have content, re-read the description as if you were the distribution-agent reading it for the first time. For every:

- vague pronoun (`it`, `this`, `the system`) without a clear antecedent,
- undefined acronym, jargon, or shorthand,
- ambiguous reference (e.g. "the new endpoint" — which one?),

ask **one** focused clarifying question. The bar: *would the distribution-agent be able to act on this without guessing what the user meant?* Stop when the description is unambiguous.

#### 4d. Optional sections — emit only if supplied

Do not ask the user to fill `Suggested approach`, `Test expectations`, or `References`. If the user volunteered such content in their original input, structure it into the corresponding section. If not, omit those sections entirely. **Never** auto-pad these — they signal human-supplied solution intent to the agent, and synthesizing them would mislead it.

#### 4e. Review-mode preservation

Sections already present in the existing ticket and structurally sound and unambiguous are kept verbatim. Only missing, malformed, or unclear sections trigger questions. Do not rewrite for style or polish.

### 5. Refinement loop — outcome-level probes only

After Step 4 leaves the description structured and unambiguous, probe for outcome-level details the user may have implicit in their head but didn't write down. The goal is a fuller specification of *what success looks like* — not how to get there.

**Hard boundary:** refinement is **requirements / outcomes only**. Never propose libraries, patterns, file layouts, algorithms, or designs. If you catch yourself drafting a "should we use X?" or "how about pattern Y?" question, drop or reframe it. The agent owns the solution; this skill owns the spec.

#### 5a. Allowed probe categories

Pick the categories that genuinely add information for *this specific* ticket. Skip irrelevant ones.

- **Reference behavior.** Are there places — at SoundCloud or in well-known external systems — that already do this and should serve as the *behavioral* target? (Behavioral references only — not implementation references. The user's answer becomes a `References` entry.)
- **Edge cases.** Are there boundary conditions in scope — empty input, large input, concurrency, partial failures, retries, idempotency, time zones, localization — the UAC should explicitly cover or exclude?
- **Observability outcomes.** Should the change emit specific log lines, metrics, traces, or alerts? (Outcome-level: "we should be able to see X", not "use the foo library".)
- **Success measurement.** Is there a measurable signal that proves this works in production — a metric to move, an error rate to drop, a duration target?
- **Audience / consumer impact.** Who or what consumes the output, and is there a contract (API shape, event schema, data format) to preserve or evolve? Are there downstream systems that need a coordinated change or a deprecation window?
- **Scope generalization.** Is this a one-off fix or should it generalize to a class of similar cases?
- **Implicit UAC.** If you spot an outcome that's strongly implied but not listed, propose it and ask the user to confirm or adjust.

#### 5b. Loop control

- **No fixed cap on questions.** Probe for as long as you can identify another *genuinely useful* outcome-level question. After each answer, apply the resulting edit to the description, then re-evaluate: is there still an outcome-level gap worth probing? If yes, ask. If not, stop.
- **One question at a time** (universal rule). Never batch refinement questions.
- **The "genuinely useful" bar.** A new probe is justified only if (a) the answer would change UAC, Scope, Reproduction, or References meaningfully, and (b) the question is *not* a restatement, narrowing, or elaboration of one already answered. Do not pad with marginal questions just to keep probing.
- **Termination conditions** — stop when *any* of these holds:
  1. You can no longer identify a genuinely useful outcome-level question (the natural and usual stopping point).
  2. The user signals they're done (`ship it`, `good enough`, `no more questions`, `next`).
  3. The user's last few answers indicate diminishing returns (repeated `n/a`, `no opinion`, `let the agent decide`, terse short answers signaling fatigue).
- **Soft check-in at ~5 questions.** If you've asked five outcome-level refinement questions and still believe more would add value, pause and ask **one** meta-question: *"I have more refinement questions — want to keep going or finalize the ticket here?"* This is a checkpoint, not a hard cap. If the user says continue, keep going with no further checkpoints unless answer-pattern fatigue appears.
- **Hard ceiling: 15 questions** as a runaway safety net. If hit, stop refinement and proceed to Step 6, noting in the final output that the loop hit the ceiling. Hitting the ceiling means something is wrong with the input or you're asking marginal questions.

#### 5c. Where edits go

Refinement edits land in the **same canonical sections** (`UAC`, `Context`, `Scope`, `Reproduction`, `References`). The refinement loop does **not** introduce new sections.

#### 5d. Knowledge boundaries

Use general training knowledge to *frame* questions intelligently (e.g. knowing that a retry-logic ticket should probably address idempotency). Never assume facts about SoundCloud's codebase, internal services, or runbooks. If a probe would require SoundCloud-specific knowledge to ask well, ask the user instead of guessing.

#### 5e. Review-mode behavior

Skip the refinement loop entirely if Step 4 leaves the existing ticket clean. Run refinement in review mode only when (a) the user explicitly asked to "improve" or "expand" the ticket, or (b) Step 4 found gaps.

#### 5f. Disallowed probe shapes

Do **not** ask:

- "Should we use library X?" / "Have you considered pattern Y?" / "What about caching here?"
- Anything proposing a file layout, class structure, function signature, or specific algorithm.
- Anything that requires reading source code, running commands, or browsing repos to answer — those are agent questions, not author questions.

### 6. Pick Linear metadata — team, project, cycle, labels

Linear metadata is administrative — fields are independent and don't reward sequential discovery. Ask in **one grouped prompt**, then fall back to focused single-field follow-ups only for fields the user left blank or asked to see options for.

#### 6a. Combined prompt (create mode)

Ask:

> *"Linear metadata — answer all in one go, leave any blank, or say 'show me the list for X':*
> *• Team (e.g. CD)*
> *• Project (or 'no project')*
> *• Cycle ('current', 'next', a cycle name, or 'no cycle')*
> *• Labels (comma-separated, 'none', or 'show me the list')"*

Parse the answer and resolve each field:

- **Team.** Accept a name or key. Resolve via `mcp__claude_ai_Linear__list_teams` only if needed for ID lookup or if the value is ambiguous.
- **Project.** Accept a name, "no project", or empty. Resolve via `mcp__claude_ai_Linear__list_projects` filtered by the chosen team if needed.
- **Cycle.** Accept `current`, `next`, a name/number, or "no cycle". Resolve via `mcp__claude_ai_Linear__list_cycles` for the chosen team. `current` resolves to the cycle whose start ≤ today ≤ end.
- **Labels.** Accept comma-separated names or "none". Resolve via `mcp__claude_ai_Linear__list_issue_labels`.

For any field the user left blank or said "show me the list", ask **one** focused single-field question for that field (and only that field), showing the relevant `list_*` results. **Filter `distro-bug-agent` and `distro-enhancement-agent` out of any label list shown.**

If the user's answer names `distro-bug-agent` or `distro-enhancement-agent`, reject inline: *"This skill never adds the trigger labels (`distro-bug-agent`, `distro-enhancement-agent`) — they're applied separately when you're ready to dispatch the agent. Pick from the other available labels."* Re-ask just for labels.

Record team / project / cycle / label IDs.

#### 6b. Combined prompt (review mode)

Existing values become defaults. Ask:

> *"Existing metadata: team={X}, project={Y}, cycle={Z}, labels={A, B}. Keep all, or change anything?"*

- **"Keep" / yes / equivalent:** carry all values forward, no further questions.
- **Free-form delta** (e.g. *"swap cycle to next"*, *"add label foo"*, *"clear project"*): apply just that delta. Resolve via the relevant `list_*` tool only if needed for ID lookup or ambiguity.
- **"Show me the list for X":** ask a focused single-field question for that field, showing the relevant filtered list.

The trigger-label filter and rejection behavior from 6a still apply.

#### 6c. Review-mode label preservation

If the existing ticket already has a trigger label, leave it alone. The skill refuses to *add* trigger labels but does not strip them.

### 7. Final review and confirmation

Render the full draft for the user — description (in canonical section order) plus metadata (team / project / cycle / labels). Show it as it will appear on the ticket.

**Review mode only:** also show a one-line summary of what changed vs the existing ticket (e.g. *"Added Scope section; rewrote Reproduction; added 2 references; metadata unchanged."*). If nothing changed, say so and ask whether to proceed at all.

Then ask **one** confirmation question: *"Persist this ticket?"* — accept yes/no. On no, ask the user what they want to change and loop back to the relevant step. On yes, proceed to Step 8.

### 8. Persist via Linear MCP

- **Create mode:** call `mcp__claude_ai_Linear__save_issue` with `team`, `project`, `cycle`, `labels`, `title`, and `description`.
- **Review mode:** call `mcp__claude_ai_Linear__save_issue` with `id` plus only the fields that changed. Do not churn unchanged metadata.
- Capture the returned URL for Step 9.
- If `save_issue` errors, surface the error to the user and stop — do not retry silently.

### 9. Output the URL and trigger-label reminder

Print, in this order:

1. The ticket URL on its own line.
2. The trigger-label reminder, picked from these cases:
   - **No trigger label is on the ticket** (the common case): print exactly one of these, matching the classification from Step 3:
     - For bug tickets: *"When ready to dispatch the agent, add the `distro-bug-agent` label in Linear."*
     - For enhancement tickets: *"When ready to dispatch the agent, add the `distro-enhancement-agent` label in Linear."*
   - **A trigger label is already on the ticket** (review mode of an in-flight ticket): print *"Trigger label `distro-<bug|enhancement>-agent` already present — agent has been or will be invoked."* Skip the "when ready" reminder.

3. If the refinement loop hit the runaway ceiling at 15 questions, append a brief note: *"Note: refinement loop terminated at the runaway ceiling — review the description carefully before triggering the agent."*

Stop the skill.

## What this skill does NOT do

- It does not run distribution-agents workflows, dispatch agents, or apply trigger labels.
- It does not read source code, AGENTS.md, or any repo content to inform the ticket.
- It does not search documentation, runbooks, or eng-doc to fill gaps in the user's input.
- It does not auto-translate vague requests into structured ones — it asks the user.
- It does not paginate exhaustively through Linear lists; if a target isn't on the first page of `list_*` results, it asks the user to disambiguate by name.
- It does not propose implementation choices in the refinement loop (libraries, patterns, file layouts, algorithms, designs). Refinement is requirements/outcomes only.
