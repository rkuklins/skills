---
name: memorize
description: >
  Writes and reads a durable home file ~/.memory.md using wiki-style
  topic links ([[topic]]). Captures task history and user-supplied
  notes; asks clarifying questions so entries stay retrievable by
  connected topics. Restores prior memory on demand: remind me,
  what did I save for, what was I supposed to remember, surface
  everything related to H2 planning (or any theme or [[topic]]). Reads
  supporting detail from workspace files when memorizing file-based
  context. Use when the user asks to remember, memorize, recall,
  remind, restore, save for later, capture, log, or persist something;
  or when they want to update or retrieve memory without losing topic
  links.
---

# Memorize

## Goal

**Write:** Persist **what matters for later**—especially **task history** and **unstructured notes**—into `~/.memory.md`. Organize with **wiki-style links** (`[[topic-name]]`) so the same memory can be reached from multiple connected topics. Prefer **workspace files** as the source of truth for facts you are memorizing when the user references paths or documents.

**Read / restore:** When the user asks to be reminded, recall, or surface what was saved (for example “what did I have to remember for H2 planning?”), read `~/.memory.md` and answer from stored content only—do not invent memories.

## Memory file

- **Path:** `~/.memory.md` (the user’s home directory, not the repo).
- **On write runs:** Read the file if it exists, then update it. If it does not exist, create it with the structure below.
- **On restore runs:** Read the file if it exists; if it is missing or empty, say so and offer to capture new notes instead of guessing.

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

## When the input is unstructured

Before writing, ask **short** follow-ups (only what is still unclear):

1. What is this most related to? (name or confirm `[[topics]]`)
2. Why might you want this back later?
3. When should it surface again (next session, before a meeting, when touching repo X, etc.)?
4. What decision or follow-up could this affect?

If the user already answered in the same message, skip redundant questions.

## Restore / recall workflow

1. **Parse the ask** — Extract themes, planning horizons (for example “H2”), project names, and explicit `[[topic]]` names from the user’s question.
2. **Load memory** — Read `~/.memory.md` in full when it is small enough; if very large, read **What matters now**, **Topic index**, and any `## [[...]]` sections whose titles match the ask (case-insensitive, slug match for `[[links]]`).
3. **Match** — Include bullets and paragraphs that mention those themes, share a `[[topic]]` link with a matched section, or sit under a matching heading. Include relevant **Log** entries if they are the only hits.
4. **Reply** — Short synthesis first (what to remember, decisions, open loops), then optional **verbatim excerpts** from the file so the user trusts the source. If nothing matches, say **no stored memory** for that angle and suggest adding a `[[topic]]` (for example `[[h2-planning]]`) next time they save.

When the user’s recall is vague (“what was I holding in my head?”), still search the file; if ambiguous, ask one clarifying question (which project or which half-year) before answering.

## Inputs

1. **User message** — primary intent and wording to preserve or compress; or the recall question for restore.
2. **Workspace files** — when memorizing technical or project facts, read the files or sections the user names (or that are clearly the subject). Do not invent file contents; quote minimally and summarize the rest into memory. Restore does not require workspace files unless the user asks to cross-check.

## Output to the user (chat)

**After writing** `~/.memory.md`:

- What was added or changed (1 short paragraph).
- The `[[topics]]` touched or created.
- Whether anything was **not** stored due to sensitivity (see Safety).

**After restore** (no file changes unless the user also asked to update):

- Direct answer to their reminder question.
- Bullet list of matching memories; note if **What matters now** vs **Log** vs a `[[topic]]` section was the source.
- If the file was missing or had no matches, state that clearly.

## Safety (light warning)

If the user pastes **tokens, passwords, API keys, recovery codes, or obvious high-risk PII**, warn once, refuse to store verbatim secrets, and offer a redacted or placeholder form (for example `API_KEY=<redacted>`). For borderline PII, warn briefly and store only what is necessary for recall.
