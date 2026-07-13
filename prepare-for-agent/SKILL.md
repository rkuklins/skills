---
name: prepare-for-agent
description: >-
  Create a new Linear ticket — or refine an existing one — so it is ready for an
  autonomous coding agent (e.g. a Cursor Cloud/Background Agent, or any similar
  agent that executes directly from a ticket) to pick up and implement without
  further clarification. Reads the target repository's coding standards
  (AGENTS.md/CLAUDE.md/.cursor rules), existing patterns, and test conventions to
  ground the acceptance criteria, test expectations, and required architectural
  decisions in reality rather than guesswork. Company- and tool-agnostic — works
  with any Linear team, any repo, and any agent runtime. Use when the user wants
  to prepare, ready, or hand off a Linear ticket for autonomous agent execution,
  or asks whether a ticket is "agent-ready."
---

# prepare-for-agent

## Trigger

Use this skill when the user wants to:

- **Create** a new Linear ticket meant to be picked up and executed by an autonomous coding agent, or
- **Review and refine** an existing Linear ticket so an agent can act on it without a kickoff conversation.

Mode is detected from the invocation input:

- Input contains a Linear identifier matching `\b[A-Z]+-\d+\b` (e.g. `ENG-580`) → **Review mode** for that identifier.
- Otherwise → **Create mode** with the user's free-text request as the seed.
- Input plausibly contains both an identifier *and* an unrelated fresh request → ask one disambiguating question: *"Are you reviewing ENG-580, or creating a new ticket that references it?"*

The end goal is the same in both modes: a Linear ticket that follows the canonical structure (below), is in the right team/project/cycle, is grounded in the target repo's actual conventions, and whose URL is printed at the end with an agent-readiness recap.

## Universal rules

These rules apply to every step below and override any local instructions:

1. **One question at a time for substantive content.** Acceptance criteria, Context, Scope, Reproduction, refinement probes, and the final confirmation each go as a *single* question. Two specific groupings are explicitly allowed because the fields are independent and at most yes/no confirms or short facts: (a) classification + repository in Step 3, (b) Linear metadata (team/project/cycle/labels) in Step 6. Everywhere else: never batch.
2. **This skill investigates the repo — it is not a pure structured editor.** Unlike a ticket-intake tool that only rephrases what the user says, this skill actively reads the target repository's coding standards, existing patterns, and test conventions (Step 3) to ground the ticket in what's actually true of the codebase, and asks the user only for what can't be inferred from the repo itself. It does not, however, design or implement the solution — see "What this skill does NOT do."
3. **Outcome-level for requirements; repo-grounded for engineering constraints.** Requirements/UAC questions stay outcome-level — never propose libraries, patterns, or designs from thin air. Test-expectation and architectural-decision questions, by contrast, are informed by what Step 3 found in the repo (existing test framework, coverage bar, documented patterns) and presented to the user as a proposal to confirm or adjust, not a blank-slate question.
4. **No hardcoded trigger labels.** This skill does not assume any specific label naming convention for dispatching an agent. If the user's workspace uses a particular label or convention to mark a ticket ready for agent execution, ask once in Step 6 and apply it if given; otherwise skip labeling.

## Steps

### 1. Detect mode

- Inspect the user's invocation message.
- If it contains a token matching `\b[A-Z]+-\d+\b` (e.g. `ENG-580`) → enter **Review mode** with that identifier.
- Otherwise → enter **Create mode** with the user's free-text request as the seed content.
- If the message plausibly contains both an identifier *and* an unrelated fresh request, ask **one** disambiguating question and act on the answer.

Record the chosen mode for the rest of the run.

### 2. Fetch existing ticket (review mode only)

- Skip this step in create mode.
- Use the Linear MCP to fetch the ticket by its identifier (`get_issue`). Read tool schemas under the workspace `mcps` folder before calling; call `mcp_auth` if a read fails with an auth error.
- Capture the existing title, description, team, project, cycle, labels, and state. These become defaults for later steps.
- If the issue is not found, stop and tell the user: the identifier could not be resolved. Do not silently fall back to create mode.

### 3. Identify the target repository and read its coding standards

This is the step that grounds the ticket in reality instead of the user's unaided memory of conventions. Do not skip it — a ticket without this context is not agent-ready.

#### 3a. Detect the repository

- **Create mode:** scan the user's request for an `org/repo` token, a bare repo name, a local path, or a URL. If the current working directory (or an immediate subdirectory) is a git repo, read its origin with `git remote get-url origin` and treat it as the default candidate.
- **Review mode:** scan the existing description for a `Repository` section and parse the repo reference from it; fall back to the same detection as create mode if absent.
- **Multiple repos in the workspace:** if several sibling directories are git repos (`find . -maxdepth 4 -name ".git" -type d | sed 's|/.git||'`), list them and let the pre-fill/confirm step (3c) resolve which one applies — don't guess silently when more than one plausible candidate exists.
- If no repository can be determined at all, ask the user directly: *"Which repository should this ticket target? (org/repo, local path, or a URL.)"* This is the one hard gate — every ticket must name exactly one target repository.

#### 3b. Read the repository's coding standards and conventions

Once a repository is identified and reachable (local clone, or fetchable via `gh api`/git host API):

1. Look for, in this order, and read the full contents of each found: `AGENTS.md`, `CLAUDE.md`, `.cursor/rules/**/*.mdc`, `CONTRIBUTING.md`, and the developer-facing sections of the root `README.md`.
2. Parse each for references to other files — relative-path links (`@file.md`, `[text](path/to/file.md)`, or bare paths like `docs/testing.md`) — and follow them. Follow web links too if they point at internal documentation.
3. Separately, detect the test setup: test framework/config files (e.g. `jest.config.*`, `pytest.ini`, `vitest.config.*`, a `test` script in `package.json`), CI workflow files that run tests, and the existing test file naming/location pattern. This feeds the **Test expectations** section in Step 4.
4. Note anything the repo documents about: coding style/lint rules, branch/commit naming, PR conventions, required test coverage or test commands, and any documented architecture-decision-record (ADR) process. These become the authoritative constraints for the ticket — repo standards always take precedence over generic assumptions.
5. If the repo isn't locally reachable, best-effort fetch `AGENTS.md`/`CLAUDE.md` via the git host's API (e.g. `gh api -H "Accept: application/vnd.github.v3.raw" /repos/<org>/<repo>/contents/AGENTS.md`). If that also fails, proceed without repo standards — do not block ticket creation — but say so explicitly in the final output (Step 9) so the reader knows the ticket may be missing repo-specific grounding.

#### 3c. Classify and confirm — combined prompt

Bug-vs-feature classification and the resolved repository go to the user in **one combined prompt**, since each is at most a confirm/short fact and the fields are independent.

- **Classification.** Propose *bug* or *feature/enhancement* from the request text (create mode) or existing ticket text (review mode): "X is broken", "X regressed", "fails when…" → bug; "I want X to also do Y", "add support for…", "should now…" → feature/enhancement.
- **Combined question, once repo + standards are known:** *"This looks like a {bug|feature} ticket targeting `<repo>`. I read `<AGENTS.md/CLAUDE.md/.cursor rules found>` for conventions — confirm both, or correct?"*
- **If repo standards could not be found/read:** *"This looks like a {bug|feature} ticket targeting `<repo>`. I could not find `AGENTS.md`/`CLAUDE.md`/repo rules to ground conventions — confirm classification and repo anyway, and flag if there's a standards doc I missed?"*
- **If repo is still unresolved:** ask only the repo question from 3a first; fold classification into the same turn only once a repo candidate exists.

Record the classification, resolved repository, and the coding-standards findings for the rest of the run.

### 4. Structure content into the canonical sections

Build the description in the fixed section order below. Required sections are always emitted; optional sections are emitted only if the user supplied content for them — never auto-padded with placeholders. Sections marked "required if applicable" are emitted whenever Step 3 or the refinement loop (Step 5) surfaced material for them; they are not optional filler, but they're also not forced when genuinely nothing applies (e.g. a one-line copy fix has no architectural decisions).

**Section order:**

1. `**Acceptance Criteria**` — bullet list of acceptance criteria / outcomes (required)
2. `**Context**` — 1–3 short paragraphs of background (required)
3. `**Scope**` — `**In scope:**` and `**Out of scope:**` bullet lists (required)
4. `**Repository & conventions**` — the resolved repo (Step 3a) plus a short bullet summary of the coding standards/conventions found in Step 3b, with paths to the source docs (e.g. `AGENTS.md`, `.cursor/rules/testing.mdc`) so the agent can go read them directly (required)
5. `**Reproduction**` — Steps + Expected + Actual (required for bugs only; omitted for features)
6. `**Architectural decisions**` — decisions already made/constrained by the user or the repo's documented patterns, and open decisions explicitly deferred to the agent along with the boundaries it must respect (required if applicable — see Step 5)
7. `**Test expectations**` — what test types are required (unit/integration/e2e), any coverage bar or specific scenarios the repo's standards call for, and the commands to run them, derived from Step 3b and confirmed with the user (required — every ticket needs at least a minimal statement of what "tested" means here)
8. `**Suggested approach**` — user-supplied solution hints (optional)
9. `**References**` — bullet links (optional)

#### 4a. Pull content from the source

- **Create mode:** start from the user's request as raw input.
- **Review mode:** start from the existing ticket's description, parsing it into the canonical sections where possible.

#### 4b. Fill required sections — ask one question per missing field

For each required section that has no content yet, ask **one** focused question. Examples:

- *"What are the acceptance criteria — what specifically must be true for this to be considered done?"* (Acceptance Criteria)
- *"What's the background — why does this need to change now, and what should the agent know to act on it?"* (Context)
- *"What's in scope and what's explicitly out of scope?"* (Scope)
- *"What are the steps to reproduce the bug? What's the expected behavior, and what's the actual behavior?"* (Reproduction)
- *"Based on the repo's test setup (`<framework found in 3b>`), should this require unit tests, integration tests, or both? Any edge cases the tests must cover?"* (Test expectations — propose from 3b findings, don't ask blind)

Ask one question, wait for the answer, fold it in, move to the next gap.

#### 4c. Comprehensibility check

After all required sections have content, re-read the description as if you were the agent reading it for the first time, with no prior context. For every:

- vague pronoun (`it`, `this`, `the system`) without a clear antecedent,
- undefined acronym, jargon, or shorthand,
- ambiguous reference (e.g. "the new endpoint" — which one?),

ask **one** focused clarifying question. The bar: *would an autonomous agent be able to act on this without guessing what the user meant, and without needing to ask a follow-up question mid-task?* Stop when the description is unambiguous.

#### 4d. Optional sections — emit only if supplied

Do not ask the user to fill `Suggested approach` or `References`. If the user volunteered such content in their original input, structure it into the corresponding section. If not, omit those sections entirely. **Never** auto-pad these — they signal human-supplied solution intent to the agent, and synthesizing them would mislead it.

#### 4e. Review-mode preservation

Sections already present in the existing ticket and structurally sound and unambiguous are kept verbatim. Only missing, malformed, or unclear sections trigger questions. Do not rewrite for style or polish.

### 5. Refinement loop — outcome-level, test, and architecture probes

After Step 4 leaves the description structured and unambiguous, probe for the details that make the difference between "a human can figure this out in a kickoff meeting" and "an agent can execute this end-to-end unattended."

**Hard boundary on requirements probes:** for outcome-level categories, never propose libraries, patterns, file layouts, algorithms, or full designs out of nowhere. For architecture and test probes, you *are* expected to propose based on what Step 3b found in the repo — the user confirms or corrects, rather than starting blank.

#### 5a. Allowed probe categories

Pick the categories that genuinely add information for *this specific* ticket. Skip irrelevant ones.

- **Reference behavior.** Are there places in this repo, or well-known external systems, that already do this and should serve as the behavioral target? (Behavioral references only — not implementation prescriptions. The answer becomes a `References` entry.)
- **Edge cases.** Are there boundary conditions in scope — empty input, large input, concurrency, partial failures, retries, idempotency, time zones, localization — the Acceptance Criteria should explicitly cover or exclude?
- **Architectural decisions.** Does the repo's documented conventions (Step 3b) already dictate the pattern to use here, or is this genuinely open? If open: should the agent make the call and document it (e.g. as an ADR or in the PR description) for review, or is there a hard constraint the user wants enforced regardless of what the agent would otherwise choose?
- **Test expectations.** Given the repo's test framework and any coverage bar found in Step 3b, what test types does this specific change need, and are there scenarios the tests must exercise that a generic pass wouldn't catch?
- **Environment / setup.** Does the agent need any credentials, feature flags, environment variables, or seed data to run and validate this locally or in its sandbox? Cloud/background agents typically run isolated — call out anything that isn't available by default.
- **Observability outcomes.** Should the change emit specific log lines, metrics, traces, or alerts? (Outcome-level: "we should be able to see X," not "use library Y.")
- **Success measurement.** Is there a measurable signal that proves this works in production — a metric to move, an error rate to drop, a duration target?
- **Audience / consumer impact.** Who or what consumes the output, and is there a contract (API shape, event schema, data format) to preserve or evolve? Are there downstream systems needing a coordinated change or deprecation window?
- **Scope generalization.** Is this a one-off fix or should it generalize to a class of similar cases?
- **Implicit acceptance criteria.** If you spot an outcome that's strongly implied but not listed, propose it and ask the user to confirm or adjust.

#### 5b. Loop control

- **No fixed cap on questions.** Probe for as long as you can identify another *genuinely useful* question. After each answer, apply the resulting edit to the description, then re-evaluate: is there still a gap worth probing? If yes, ask. If not, stop.
- **One question at a time** (universal rule). Never batch refinement questions.
- **The "genuinely useful" bar.** A new probe is justified only if (a) the answer would meaningfully change Acceptance Criteria, Scope, Reproduction, Architectural decisions, Test expectations, or References, and (b) the question is *not* a restatement, narrowing, or elaboration of one already answered.
- **Termination conditions** — stop when *any* of these holds:
  1. You can no longer identify a genuinely useful question (the natural and usual stopping point).
  2. The user signals they're done (`ship it`, `good enough`, `no more questions`, `next`).
  3. The user's last few answers indicate diminishing returns (repeated `n/a`, `no opinion`, `let the agent decide`, terse short answers signaling fatigue).
- **Soft check-in at ~5 questions.** If you've asked five refinement questions and still believe more would add value, pause and ask **one** meta-question: *"I have more refinement questions — want to keep going or finalize the ticket here?"* If the user says continue, keep going with no further checkpoints unless answer-pattern fatigue appears.
- **Hard ceiling: 15 questions** as a runaway safety net. If hit, stop refinement and proceed to Step 6, noting in the final output that the loop hit the ceiling.

#### 5c. Where edits go

Refinement edits land in the canonical sections (`Acceptance Criteria`, `Context`, `Scope`, `Reproduction`, `Architectural decisions`, `Test expectations`, `References`). The refinement loop does **not** introduce new sections.

#### 5d. Knowledge boundaries

Use general training knowledge to *frame* questions intelligently (e.g. knowing that retry logic should probably address idempotency). For anything specific to this repo or organization beyond what Step 3b actually found, ask the user instead of guessing — never assume undocumented facts about the codebase, internal services, or runbooks.

#### 5e. Review-mode behavior

Skip the refinement loop entirely if Step 4 leaves the existing ticket clean and it already has explicit Architectural decisions and Test expectations sections. Run refinement in review mode when (a) the user explicitly asked to "improve," "expand," or "make agent-ready," or (b) Step 4 or 3b found gaps.

#### 5f. Disallowed probe shapes

Do **not** ask, for the outcome-level categories:

- "Should we use library X?" / "Have you considered pattern Y?" / "What about caching here?" — unless Step 3b already found that the repo's own standards dictate the answer, in which case state it as a proposal to confirm, not an open question.
- Anything proposing a file layout, class structure, function signature, or specific algorithm that isn't already documented as the repo's convention.

### 6. Pick Linear metadata — team, project, cycle, labels

Linear metadata is administrative — fields are independent and don't reward sequential discovery. Ask in **one grouped prompt**, then fall back to focused single-field follow-ups only for fields the user left blank or asked to see options for.

#### 6a. Combined prompt (create mode)

Ask:

> *"Linear metadata — answer all in one go, leave any blank, or say 'show me the list for X':*
> *• Team*
> *• Project (or 'no project')*
> *• Cycle ('current', 'next', a cycle name, or 'no cycle')*
> *• Labels (comma-separated, 'none', or 'show me the list')*
> *• Is there a specific label or convention your team uses to mark a ticket ready for agent dispatch? (Or 'none'.)"*

Parse the answer and resolve each field:

- **Team.** Accept a name or key. Resolve via `list_teams` only if needed for ID lookup or if the value is ambiguous.
- **Project.** Accept a name, "no project", or empty. Resolve via `list_projects` filtered by the chosen team if needed.
- **Cycle.** Accept `current`, `next`, a name/number, or "no cycle". Resolve via `list_cycles` for the chosen team. `current` resolves to the cycle whose start ≤ today ≤ end.
- **Labels.** Accept comma-separated names or "none". Resolve via `list_issue_labels`.
- **Agent-dispatch label/convention.** If the user names one, apply it as one of the labels (or note the convention if it's not a label, e.g. a specific state/column). If "none" or unclear, skip — do not invent a label name.

For any field the user left blank or said "show me the list", ask **one** focused single-field question for that field, showing the relevant list results.

Record team / project / cycle / label IDs.

#### 6b. Combined prompt (review mode)

Existing values become defaults. Ask:

> *"Existing metadata: team={X}, project={Y}, cycle={Z}, labels={A, B}. Keep all, or change anything?"*

- **"Keep" / yes / equivalent:** carry all values forward, no further questions.
- **Free-form delta** (e.g. *"swap cycle to next"*, *"add label foo"*, *"clear project"*): apply just that delta. Resolve via the relevant list tool only if needed for ID lookup or ambiguity.
- **"Show me the list for X":** ask a focused single-field question for that field, showing the relevant filtered list.

### 7. Final review and confirmation

Render the full draft for the user — description (in canonical section order) plus metadata (team / project / cycle / labels). Show it as it will appear on the ticket.

**Review mode only:** also show a one-line summary of what changed vs. the existing ticket (e.g. *"Added Architectural decisions and Test expectations sections; rewrote Reproduction; metadata unchanged."*). If nothing changed, say so and ask whether to proceed at all.

Then ask **one** confirmation question: *"Persist this ticket?"* — accept yes/no. On no, ask the user what they want to change and loop back to the relevant step. On yes, proceed to Step 8.

### 8. Persist via Linear MCP

- **Create mode:** call `save_issue` with `team`, `project`, `cycle`, `labels`, `title`, and `description`.
- **Review mode:** call `save_issue` with `id` plus only the fields that changed. Do not churn unchanged metadata.
- Capture the returned URL for Step 9.
- If `save_issue` errors, surface the error to the user and stop — do not retry silently.

### 9. Output the URL and agent-readiness recap

Print, in this order:

1. The ticket URL on its own line.
2. An **agent-readiness recap**:
   - Repository: resolved repo, and whether coding standards were successfully read (list the files found, e.g. `AGENTS.md`, `.cursor/rules/testing.mdc`) or a clear flag if none were found/reachable.
   - Acceptance Criteria: count of criteria listed.
   - Test expectations: present / absent, and whether they're grounded in a detected test framework or user-stated only.
   - Architectural decisions: present / absent, and whether any decisions were explicitly deferred to the agent.
   - If repo standards could not be read at all: *"Could not read repo coding standards — the agent may need to infer conventions. Consider granting repo access, or pointing me at the right doc, before dispatch."*
3. If a specific agent-dispatch label/convention was applied in Step 6, confirm it: *"Applied label `<name>` — ready for dispatch."* If none was configured, omit this line rather than inventing one.
4. If the refinement loop hit the runaway ceiling at 15 questions, append a brief note: *"Note: refinement loop terminated at the runaway ceiling — review the description carefully before dispatching the agent."*

Stop the skill.

## What this skill does NOT do

- It does not implement the solution, write code, open branches, or create PRs — that is the dispatched agent's job.
- It does not design the architecture on the user's behalf; it surfaces the decisions that need to be made (informed by repo conventions) and records who is making them (user-constrained vs. agent-deferred).
- It does not fabricate coding standards, test conventions, or architectural precedent it did not actually find in the repo — absence of a standard is reported as absence, not filled in with a plausible-sounding guess.
- It does not search external documentation, runbooks, or wikis to fill gaps in the user's input — only the target repository itself (Step 3) and the user's answers.
- It does not paginate exhaustively through Linear lists; if a target isn't on the first page of list results, it asks the user to disambiguate by name.
- It does not assume a specific agent-dispatch label or workflow — it asks once, applies what the user names, and otherwise stays silent on dispatch mechanics.
