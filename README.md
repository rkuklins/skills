# Skills

A private collection of agent skills for recurring workflows. Each skill lives in its own folder with a `SKILL.md` that defines when to use it and how to run it—so the same process does not need to be explained every time.

These paths are typically available to Cursor (and similar tools) from `~/.cursor/skills`.

## Skills

| Skill | Description |
|-------|-------------|
| [architecture-survey](./architecture-survey/SKILL.md) | Multi-phase **repo and org architecture survey**: discover repos, read connective tissue (gateways, IaC, events), scan each service in a fixed order, cluster by domain, then synthesize diagrams and an overview. Uses `gh`, local clones, and file inspection. Trigger when mapping services, system structure, or “how is X built?” from code. |
| [devils-advocate](./devils-advocate/SKILL.md) | Critical review of a proposal, plan, decision, or document: surfaces assumptions, steelmans counter-arguments, flags blind spots and biases, gives a verdict (SOLID / SHAKY / RED FLAG), and ends with mitigations. Trigger phrases include “devil’s advocate,” “stress test,” “what am I missing,” “before I send this,” and similar. |
| [memorize](./memorize/SKILL.md) | **Durable memory** in `~/.memory.md` with wiki-style `[[topic]]` links: capture task history and notes, recall on demand (“remind me…”, “what did I save for…”), and pull detail from workspace files when the user points at them. |
| [meeting-prep](./meeting-prep/SKILL.md) | **Meeting preparation** bundle: stakeholder context template, scenarios, output brief structure, and examples. The folder also contains the same material as separate files (`stakeholder-context.md`, `output-template.md`, `scenarios.md`, `examples.md`) for easier editing. Includes nested [meeting-sim](./meeting-prep/skills/meeting-sim/SKILL.md) for rehearsing (“simulate the meeting”, role-play attendees). |
| [personal-context-builder](./personal-context-builder/SKILL.md) | Interview-driven workflow that produces a **personal context portfolio**—structured markdown files (from templates under `personal-context-builder/templates/`) describing how someone works and what matters to them, for reuse by other agents or tools. |
| [tune-the-ticket](./tune-the-ticket/SKILL.md) | **Refine a ticket** from a Linear issue (read-only MCP) or pasted text: gap analysis (acceptance criteria, DoD, scope, dependencies), likely repos, edge cases; writes one new markdown file and **does not** update Linear. |
| [weekly-brief](./weekly-brief/SKILL.md) | Builds a personal weekly status brief: reads Linear project names from `project-tracking.md`, pulls current project state via the Linear MCP, optionally cross-checks recent commits/PRs, and writes a dated markdown report (`brief-[date].md`). Use for weekly updates, status, or progress reviews. |

## External dependencies

Some skills assume MCP servers, CLIs, or files outside the skill folder. Enable and authenticate MCP integrations in your client (for example Cursor **Settings → MCP**) using the server that exposes **Linear** tools; the exact server id varies by setup (`user-linear`, `plugin-linear-linear`, and so on).

| Skill | External tools and inputs |
|-------|---------------------------|
| [architecture-survey](./architecture-survey/SKILL.md) | **GitHub CLI** (`gh`, authenticated to the org), **`python3`** for JSON filtering in the documented examples, and normal **git** / filesystem access to clone and inspect repos. |
| [devils-advocate](./devils-advocate/SKILL.md) | None—works on text or documents in the session. |
| [memorize](./memorize/SKILL.md) | Writes **`~/.memory.md`** in the user’s home directory; may read workspace paths the user names. No MCP. |
| [meeting-prep](./meeting-prep/SKILL.md) | Optional maintainer-owned **stakeholder context** file (see the skill bundle). No MCP described in the skill. |
| [personal-context-builder](./personal-context-builder/SKILL.md) | Templates under the skill folder; optional user-supplied samples (exports, transcripts). No MCP. |
| [tune-the-ticket](./tune-the-ticket/SKILL.md) | **Linear MCP**, read-only (for example **`get_issue`**) when the user gives an issue id or URL; **`mcp_auth`** if reads fail. If the user pastes ticket text only, no Linear MCP is required. |
| [weekly-brief](./weekly-brief/SKILL.md) | **Linear MCP** for projects, issues, and status (use **`mcp_auth`** when the host requires it). **`project-tracking.md`** at the workspace root lists project names. **Git** in sibling repos for recent commits/PRs; **GitHub** access if you use `gh` or remote history the same way. Statsig / A/B callouts in the brief are inferred from Linear and commit text; the skill’s TODO mentions a future **Statsig** read—no Statsig MCP today. |

## Layout

```
architecture-survey/SKILL.md    — Org/repo architecture methodology
devils-advocate/SKILL.md        — Structured critique workflow
memorize/SKILL.md               — ~/.memory.md wiki-style memory
meeting-prep/                   — Prep templates + scenarios + nested meeting-sim/
personal-context-builder/     — Interview protocol + templates/
tune-the-ticket/SKILL.md        — Read-only Linear + refined ticket markdown
weekly-brief/SKILL.md           — Linear-backed weekly report
```

## Deployment

Deploying copies every top-level folder that contains a `SKILL.md` into `~/.sync-skills/skills` and into the home skills folders for `claude`, `codex`, `cursor`, and `gemini`.

Prerequisite: install Node.js with npm. The deploy script is dependency-free and does not require `sync-skills`.

Target folders:

```text
~/.claude/skills
~/.codex/skills
~/.cursor/skills
~/.gemini/skills
~/.sync-skills/skills
```

### Windows

From PowerShell:

```powershell
npm run deploy
```

Or run the script directly:

```powershell
node scripts/deploy-skills.mjs
```

### macOS and Linux

Using npm:

```bash
npm run deploy
```

Using Make:

```bash
make deploy
```

### Dry Run

Preview the deployment without writing files:

```bash
npm run deploy:dry-run
```

Make users can also run:

```bash
make deploy-dry-run
```

### Common Directory Only

Copy only to `~/.sync-skills/skills` and skip assistant folders:

```bash
node scripts/deploy-skills.mjs --common-only
```

## Usage

Invoke a skill when the task matches its description; agents that support skills usually load them from this directory automatically. If your environment uses slash commands, the skill name in the YAML frontmatter is what those commands are keyed on—check your client’s docs for the exact syntax. Names in this repo: `weekly-brief`, `devils-advocate`, `context-builder` ([personal-context-builder](./personal-context-builder/SKILL.md)), `memorize`, `tune-the-ticket`, `repo-architecture-survey` ([architecture-survey](./architecture-survey/SKILL.md)), and nested `simulating-meeting` ([meeting-sim](./meeting-prep/skills/meeting-sim/SKILL.md)).
