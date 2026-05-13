---
name: memorize
description: >
  Writes and reads a durable file ~/memory/.memory.md using wiki-style
  topic links ([[topic]]). Captures task history and user-supplied
  notes; asks clarifying questions so entries stay retrievable by
  connected topics. Uses ~/context-portfolio (especially team and
  relationships) to align people, reporting lines, teams, and missions
  when building relational memory. Restores prior memory on demand:
  remind me, what did I save for, what was I supposed to remember,
  surface everything related to H2 planning (or any theme or
  [[topic]]). Reads supporting detail from workspace files when
  memorizing file-based context. Use when the user asks to remember,
  memorize, recall, remind, restore, save for later, capture, log, or
  persist something; or when they want to update or retrieve memory
  without losing topic links.
---

# Memorize

## Goal

**Write:** Persist **what matters for later**—especially **task history** and **unstructured notes**—into `~/memory/.memory.md`. Organize with **wiki-style links** (`[[topic-name]]`) so the same memory can be reached from multiple connected topics. Prefer **workspace files** as the source of truth for facts you are memorizing when the user references paths or documents.

**People / org context:** When the memory involves **people, teams, reporting lines, missions, or cross-functional partners**, read the user’s **context portfolio** under `~/context-portfolio/` before writing. Use it to **name roles correctly**, **avoid contradicting** stated relationships (manager, direct report, peer, squad ownership), and to **add accurate `[[topic]]` links** (for example `[[goran]]`, `[[m14-ads]]`) that mirror how people and workstreams appear in the portfolio. If the portfolio and the user’s message disagree, **prefer the user’s explicit correction** in the current message and note the conflict briefly in memory.

**Read / restore:** When the user asks to be reminded, recall, or surface what was saved (for example “what did I have to remember for H2 planning?”), read `~/memory/.memory.md` and answer from stored content only—do not invent memories. If the question is **about a person or team** and memory is thin, you may **supplement** with `~/context-portfolio/` (especially `04-team-and-relationships.md`) **only to frame** who someone is or how teams connect—label that as coming from the portfolio, not from `[[memory]]`.

## Memory file

- **Path:** `~/memory/.memory.md` (under `~/memory/` in the user’s home directory, not the repo).
- **Directory:** Ensure `~/memory/` exists before creating or updating the file; create it if missing.
- **On write runs:** Read the file if it exists, then update it. If it does not exist, create the directory (if needed) and the file with the structure below.
- **On restore runs:** Read the file if it exists; if it is missing or empty, say so and offer to capture new notes instead of guessing.
- **Migration from `~/.memory.md`:** If the user still has the old path and wants continuity, suggest moving or copying that file to `~/memory/.memory.md` after creating `~/memory/` (one-time; the agent can do it when the user asks).

## Context portfolio (relations and teams)

**Root:** `~/context-portfolio/` (living markdown context about the user’s work identity, org, and priorities).

**When memorizing or answering recall about people / teams / ownership:**

1. **Primary for org graph:** `04-team-and-relationships.md` — people, roles, who reports to whom, squads, PM/engineering dynamics, missions (M01, M14, etc.) when named there.
2. **Supporting as needed:**
   - `02-role-and-responsibilities.md` — how the user’s weeks actually look; scope boundaries.
   - `03-current-projects.md` — active workstreams and status (good for **team ↔ project** links).
   - `01-identity.md` — minimum viable context if other files are sparse.
3. **How to use it:** Extract **stable facts** (titles, reporting, team names, mission codes) into memory with `[[topics]]`. Keep **sensitive opinions or tensions** from the portfolio in memory only if the user is explicitly memorizing them; do not copy large chunks of the portfolio into `.memory.md`—**summarize** and **link** (`[[person]]`, `[[mission-m14]]`).
4. **If `~/context-portfolio/` is missing or a file is absent:** Proceed from the user message and workspace only; do not fabricate org data.

## Suggested file shape

Keep the top scannable; put depth under linked topics or dated logs.

```markdown
# Memory

## What matters now
- … (3–7 bullets max; refresh so this reflects current priorities)

## Topic index
- [[topic-one]] — one-line pointer
- [[topic-two]] — one-line pointer

## [[topic-one]]
… detail, decisions, open loops …

## Log
### YYYY-MM-DD
- …
```

Rules:

- Use `[[topic-slugs]]` consistently (lowercase, hyphens). Link the same fact from every topic it belongs to, or duplicate a one-liner under each topic with a link to the canonical paragraph.
- When something becomes stale, **move it down** into `## Log` or trim from **What matters now** instead of deleting history without intent.
- When portfolio-backed facts anchor a memory, a short inline hint helps later recall (for example “per context portfolio: direct report”).

## When the input is unstructured

Before writing, ask **short** follow-ups (only what is still unclear):

1. What is this most related to? (name or confirm `[[topics]]`)
2. Why might you want this back later?
3. When should it surface again (next session, before a meeting, when touching repo X, etc.)?
4. What decision or follow-up could this affect?
5. If the note involves **people or teams** not clearly identified, confirm **who** (and optionally cross-check `04-team-and-relationships.md` if the portfolio exists).

If the user already answered in the same message, skip redundant questions.

## Restore / recall workflow

1. **Parse the ask** — Extract themes, planning horizons (for example “H2”), project names, **people and team names**, and explicit `[[topic]]` names from the user’s question.
2. **Load memory** — Read `~/memory/.memory.md` in full when it is small enough; if very large, read **What matters now**, **Topic index**, and any `## [[...]]` sections whose titles match the ask (case-insensitive, slug match for `[[links]]`).
3. **Optional portfolio pass** — If the ask is **who is X** or **how does X relate to Y** and memory is empty or unclear, read the relevant section(s) of `~/context-portfolio/04-team-and-relationships.md` (and `03-current-projects.md` if missions/ownership matter). Present portfolio facts as **portfolio context**, not as prior `.memory.md` saves.
4. **Match** — Include bullets and paragraphs that mention those themes, share a `[[topic]]` link with a matched section, or sit under a matching heading. Include relevant **Log** entries if they are the only hits.
5. **Reply** — Short synthesis first (what to remember, decisions, open loops), then optional **verbatim excerpts** from the file so the user trusts the source. If nothing matches, say **no stored memory** for that angle and suggest adding a `[[topic]]` (for example `[[h2-planning]]`) next time they save.

When the user’s recall is vague (“what was I holding in my head?”), still search the file; if ambiguous, ask one clarifying question (which project or which half-year) before answering.

## Inputs

1. **User message** — primary intent and wording to preserve or compress; or the recall question for restore.
2. **Workspace files** — when memorizing technical or project facts, read the files or sections the user names (or that are clearly the subject). Do not invent file contents; quote minimally and summarize the rest into memory. Restore does not require workspace files unless the user asks to cross-check.
3. **Context portfolio** — `~/context-portfolio/**/*.md` when building or clarifying **people, team, and ownership** relations; prioritize `04-team-and-relationships.md`.

## Output to the user (chat)

**After writing** `~/memory/.memory.md`:

- What was added or changed (1 short paragraph).
- The `[[topics]]` touched or created.
- Whether anything was **not** stored due to sensitivity (see Safety).
- If the portfolio was used, one line on **which file** informed relations (no need to quote private details at length).

**After restore** (no file changes unless the user also asked to update):

- Direct answer to their reminder question.
- Bullet list of matching memories; note if **What matters now** vs **Log** vs a `[[topic]]` section was the source.
- If portfolio material was used because memory had no hit, say so clearly.
- If the file was missing or had no matches, state that clearly.

## Safety (light warning)

If the user pastes **tokens, passwords, API keys, recovery codes, or obvious high-risk PII**, warn once, refuse to store verbatim secrets, and offer a redacted or placeholder form (for example `API_KEY=<redacted>`). For borderline PII, warn briefly and store only what is necessary for recall. The context portfolio may contain **frank assessments of colleagues**; treat that as **private**—do not echo it broadly in chat unless needed to answer the user’s question, and do not push sensitive portfolio opinions into memory unless the user asks to remember them.

