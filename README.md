# Skills

A private collection of agent skills for recurring workflows. Each skill lives in its own folder with a `SKILL.md` that defines when to use it and how to run it—so the same process does not need to be explained every time.

These paths are typically available to Cursor (and similar tools) from `~/.cursor/skills`.

## Skills

| Skill | Description |
|-------|-------------|
| [weekly-brief](./weekly-brief/SKILL.md) | Builds a personal weekly status brief: reads Linear project names from `project-tracking.md`, pulls current project state via the Linear MCP, optionally cross-checks recent commits/PRs, and writes a dated markdown report (`brief-[date].md`). Use for weekly updates, status, or progress reviews. |
| [devils-advocate](./devils-advocate/SKILL.md) | Critical review of a proposal, plan, decision, or document: surfaces assumptions, steelmans counter-arguments, flags blind spots and biases, gives a verdict (SOLID / SHAKY / RED FLAG), and ends with mitigations. Trigger phrases include “devil’s advocate,” “stress test,” “what am I missing,” “before I send this,” and similar. |
| [personal-context-builder](./personal-context-builder/SKILL.md) | Interview-driven workflow that produces a **personal context portfolio**—structured markdown files (from templates under `personal-context-builder/templates/`) describing how someone works and what matters to them, for reuse by other agents or tools. |

## Layout

```
weekly-brief/SKILL.md           — Linear-backed weekly report
devils-advocate/SKILL.md        — Structured critique workflow
personal-context-builder/       — Interview protocol + templates/
```

## Usage

Invoke a skill when the task matches its description; agents that support skills usually load them from this directory automatically. If your environment uses slash commands, the skill name in the YAML frontmatter (e.g. `weekly-brief`, `devils-advocate`, `context-builder` for personal-context-builder) is what those commands are keyed on—check your client’s docs for the exact syntax.
