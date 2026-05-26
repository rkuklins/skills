# Skills

A private collection of agent skills for recurring workflows. Each skill lives in its own folder with a `SKILL.md` that defines when to use it and how to run it—so the same process does not need to be explained every time.

These paths are typically available to Cursor (and similar tools) from `~/.cursor/skills` after deploy.

**Skill folders in this repo** (run `make list-skills` to print the current list):

`architecture-survey`, `devils-advocate`, `meeting-prep`, `memorize`, `personal-context-builder`, `tech-debt`, `team-report`, `tune-the-ticket`, `weekly-brief`

## Skills

| Skill | Frontmatter `name` | Description |
|-------|-------------------|-------------|
| [architecture-survey](./architecture-survey/SKILL.md) | `repo-architecture-survey` | Multi-phase **repo and org architecture survey**: discover repos, read connective tissue (gateways, IaC, events), scan each service in a fixed order, cluster by domain, then synthesize diagrams and an overview. Uses `gh`, local clones, and file inspection. Trigger when mapping services, system structure, or “how is X built?” from code. |
| [devils-advocate](./devils-advocate/SKILL.md) | `devils-advocate` | Critical review of a proposal, plan, decision, or document: surfaces assumptions, steelmans counter-arguments, flags blind spots and biases, gives a verdict (SOLID / SHAKY / RED FLAG), and ends with mitigations. Trigger phrases include “devil’s advocate,” “stress test,” “what am I missing,” “before I send this,” and similar. |
| [meeting-prep](./meeting-prep/SKILL.md) | _(see skill bundle)_ | **Meeting preparation** bundle: stakeholder context, scenarios, output brief structure, and examples. Includes embedded **meeting simulation** (`simulating-meeting`) for rehearsing (“simulate the meeting”, role-play attendees). |
| [memorize](./memorize/SKILL.md) | `memorize` | **Durable memory** in `~/.memory.md` with wiki-style `[[topic]]` links: capture task history and notes, recall on demand (“remind me…”, “what did I save for…”), and pull detail from workspace files when the user points at them. |
| [personal-context-builder](./personal-context-builder/SKILL.md) | `context-builder` | Interview-driven workflow that produces a **personal context portfolio**—structured markdown files (from templates under `personal-context-builder/templates/`) describing how someone works and what matters to them, for reuse by other agents or tools. |
| [tech-debt-assessor](./tech-debt/SKILL.md) | `tech-debt-assessor` | **Tech debt assessment**: scans local repos, architecture documents, and Linear projects listed in `tech-debt-config.md` (or `project-tracking.md` as fallback) to identify debt themes and writes a stakeholder-ready report using [tech-debt-report-template.md](./tech-debt/tech-debt-report-template.md). Copy [tech-debt-config-template.md](./tech-debt/tech-debt-config-template.md) to `tech-debt-config.md` per workspace. Trigger: tech debt assessment, debt report, debt backlog, architecture risk review. |
| [team-report](./team-report/SKILL.md) | `team-report` | **Team activity report** for a time window: Linear issue counts per person and per project (with optional portfolio share and project blurbs from `get_project`), plus Git commit counts per person and per repo from local clones. Reads `team.md` (roster emails) and `project-tracking.md` (portfolio project names). Use for “what did the team ship,” portfolio vs assignees, or Linear plus commit summaries. Writes a dated markdown file at the repo root (for example `report-team-activity-YYYY-MM-DD.md`). |
| [tune-the-ticket](./tune-the-ticket/SKILL.md) | `tune-the-ticket` | **Refine a ticket** from a Linear issue (read-only MCP) or pasted text: gap analysis (acceptance criteria, DoD, scope, dependencies), likely repos, edge cases; writes one new markdown file and **does not** update Linear. |
| [weekly-brief](./weekly-brief/SKILL.md) | `weekly-brief` | Builds a personal weekly status brief: reads Linear project names from `project-tracking.md`, pulls current project state via the Linear MCP, optionally cross-checks recent commits/PRs, and writes a dated markdown report (`brief-[date].md`). Use for weekly updates, status, or progress reviews. |

## External dependencies

Some skills assume MCP servers, CLIs, or files outside the skill folder. Enable and authenticate MCP integrations in your client (for example Cursor **Settings → MCP**) using the server that exposes **Linear** tools; the exact server id varies by setup (`user-linear`, `plugin-linear-linear`, and so on).

| Skill | External tools and inputs |
|-------|---------------------------|
| [architecture-survey](./architecture-survey/SKILL.md) | **GitHub CLI** (`gh`, authenticated to the org), **`python3`** for JSON filtering in the documented examples, and normal **git** / filesystem access to clone and inspect repos. |
| [devils-advocate](./devils-advocate/SKILL.md) | None—works on text or documents in the session. |
| [meeting-prep](./meeting-prep/SKILL.md) | Optional maintainer-owned **stakeholder context** file (see the skill bundle). No MCP described in the skill. |
| [memorize](./memorize/SKILL.md) | Writes **`~/.memory.md`** in the user’s home directory; may read workspace paths the user names. No MCP. |
| [personal-context-builder](./personal-context-builder/SKILL.md) | Templates under the skill folder; optional user-supplied samples (exports, transcripts). No MCP. |
| [tech-debt-assessor](./tech-debt/SKILL.md) | **Linear MCP** (`get_project`, `list_issues` with pagination). **`tech-debt-config.md`** at the workspace root (from [tech-debt-config-template.md](./tech-debt/tech-debt-config-template.md)): **Linear project titles**, architecture doc paths, repo roots, labels, report period. Falls back to **`project-tracking.md`** if the config project list is empty. **Local git repos** under the workspace (or configured paths) for code/deps/CI signals. Writes `tech-debt-report-YYYY-MM-DD.md` at the workspace root. |
| [team-report](./team-report/SKILL.md) | **Linear MCP** with **`list_issues`** (assignee filters, optional `team`, pagination via `cursor` / `limit`), and **`get_project`** for portfolio blurbs; read tool schemas under the workspace **`mcps`** folder before calling. **`team.md`** at the workspace root: one person per line, `Name; email@domain` (emails used for Linear assignee filters and Git author matching). **`project-tracking.md`** at the workspace root: one Linear project **title** per line (must match Linear for `get_project` / project columns). **Local `git` clones** under the workspace (or paths the user names); the skill prefers `git log` over the GitHub API unless the user asks otherwise. Optional **Linear team** name (for example `iOS`) when scoping `list_issues`. |
| [tune-the-ticket](./tune-the-ticket/SKILL.md) | **Linear MCP**, read-only (for example **`get_issue`**) when the user gives an issue id or URL; **`mcp_auth`** if reads fail. If the user pastes ticket text only, no Linear MCP is required. |
| [weekly-brief](./weekly-brief/SKILL.md) | **Linear MCP** for projects, issues, and status (use **`mcp_auth`** when the host requires it). **`project-tracking.md`** at the workspace root lists project names. **Git** in sibling repos for recent commits/PRs; **GitHub** access if you use `gh` or remote history the same way. Statsig / A/B callouts in the brief are inferred from Linear and commit text; the skill’s TODO mentions a future **Statsig** read—no Statsig MCP today. |

## Layout

```
architecture-survey/SKILL.md       — Org/repo architecture methodology
devils-advocate/SKILL.md           — Structured critique workflow
meeting-prep/SKILL.md              — Prep + embedded meeting-sim content
memorize/SKILL.md                  — ~/.memory.md wiki-style memory
personal-context-builder/          — Interview protocol + templates/
tech-debt/
  SKILL.md                         — Tech debt assessor workflow
  tech-debt-report-template.md     — Report output structure
  tech-debt-config-template.md     — Copy to workspace as tech-debt-config.md
team-report/SKILL.md               — Linear + git team activity report
tune-the-ticket/SKILL.md           — Read-only Linear + refined ticket markdown
weekly-brief/SKILL.md              — Linear-backed weekly report
```

Deploy copies each **top-level** folder that contains `SKILL.md` (nested `meeting-prep/skills/` is not deployed separately unless promoted to its own top-level folder).

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
make list-skills      # folders that will be deployed
make help             # all Make targets
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

Or:

```bash
make deploy-common-only
```

## Usage

Invoke a skill when the task matches its description; agents that support skills usually load them from this directory automatically. If your environment uses slash commands, the skill name in the YAML frontmatter is what those commands are keyed on—check your client’s docs for the exact syntax.

**Frontmatter `name` values** (alphabetical): `context-builder`, `devils-advocate`, `memorize`, `repo-architecture-survey`, `simulating-meeting` (embedded in [meeting-prep](./meeting-prep/SKILL.md)), `team-report`, `tech-debt-assessor`, `tune-the-ticket`, `weekly-brief`.
