# Skills

A private collection of agent skills for recurring workflows. Each skill lives in its own folder with a `SKILL.md` that defines when to use it and how to run it—so the same process does not need to be explained every time.

These paths are typically available to Cursor (and similar tools) from `~/.cursor/skills` after deploy.

**Skill folders in this repo** (run `make list-skills` to print the current list):

`address-review-comments`, `architecture-survey`, `concept-to-spec`, `devils-advocate`, `eng-review`, `find-ticket-dependencies`, `implement-linear-ticket`, `meeting-prep`, `memorize`, `personal-context-builder`, `prd-to-linear`, `prepare-for-agent`, `review-code`, `review-code-and-comment`, `team-report`, `tech-debt`, `tune-the-ticket`, `weekly-brief`

## Skills

| Skill | Frontmatter `name` | Description |
|-------|-------------------|-------------|
| [address-review-comments](./address-review-comments/SKILL.md) | `address-review-comments` | Fetch unresolved PR review comments, analyze each one, recommend change or no-change with rationale, apply user-approved changes, push via `push-code`, post replies to each comment thread, and resolve addressed threads via GitHub GraphQL. Requires `push-code`. |
| [architecture-survey](./architecture-survey/SKILL.md) | `repo-architecture-survey` | Multi-phase **repo and org architecture survey**: discover repos, read connective tissue (gateways, IaC, events), scan each service in a fixed order, cluster by domain, then synthesize diagrams and an overview. Uses `gh`, local clones, and file inspection. Trigger when mapping services, system structure, or "how is X built?" from code. |
| [concept-to-spec](./concept-to-spec/SKILL.md) | `concept-to-spec` | Turn an initial **concept or free-form notes into a SOLID product specification** via a batched thematic interview plus a devil's-advocate hardening pass. Locks problem, audience, product identity, vision, measurable success gates/targets, scope, core mechanics/requirements, a decision log, ≥1 acceptance scenario, a phased plan, and a risk register — with an optional cited research step. Reference files: [spec-template.md](./concept-to-spec/references/spec-template.md), [interview-guide.md](./concept-to-spec/references/interview-guide.md), [devils-advocate-check.md](./concept-to-spec/references/devils-advocate-check.md). Trigger: "turn this concept into a spec", "write a product spec/PRD", "interview me to build a spec". |
| [devils-advocate](./devils-advocate/SKILL.md) | `devils-advocate` | Critical review of a proposal, plan, decision, or document: surfaces assumptions, steelmans counter-arguments, flags blind spots and biases, gives a verdict (SOLID / SHAKY / RED FLAG), and ends with mitigations. Trigger phrases include "devil's advocate," "stress test," "what am I missing," "before I send this," and similar. |
| [eng-review](./eng-review/SKILL.md) | `eng-review` | **Engineering review readiness** for high-impact technical decisions: assesses a decision document against the review's requirements (clear problem statement, a real decision to be made, genuine alternatives, recommended decision, cost of being wrong, rollout plan, 2–4 page prose, stakeholders consulted, tech-lead presenter) and against six impact categories (irreversible/expensive-to-change, team blast radius, product blast radius, infra spend, new patterns, security posture), then emits a verdict and a Pass/Gap readiness checklist. Drafting helper: [decision-doc-template.md](./eng-review/references/decision-doc-template.md). Trigger: "is this ready for eng review?", "review this decision doc". |
| [find-ticket-dependencies](./find-ticket-dependencies/SKILL.md) | `find-ticket-dependencies` | Detect and mark dependencies between a filtered set of Linear tickets: fetches tickets by project/state/label/cycle/date, gathers branch and PR signals from the repo, analyzes pairs for cross-reference, structural (shared files), and functional (API/stub/schema) dependencies, presents proposed relations for review, then writes `blocks`/`blockedBy`/`relatedTo` relations via `save_issue`. |
| [implement-linear-ticket](./implement-linear-ticket/SKILL.md) | `implement-linear-ticket` | **End-to-end autonomous ticket implementation**: read the Linear ticket, create a feature branch, plan and implement with tests following AGENTS.md conventions, run `push-code`, open a draft PR, then poll CI and fix failures in a loop until green. Requires `push-code`. |
| [meeting-prep](./meeting-prep/SKILL.md) | _(see skill bundle)_ | **Meeting preparation** bundle: stakeholder context, scenarios, output brief structure, and examples. Includes embedded **meeting simulation** (`simulating-meeting`) for rehearsing ("simulate the meeting", role-play attendees). |
| [memorize](./memorize/SKILL.md) | `memorize` | **Durable memory** in `~/.memory.md` with wiki-style `[[topic]]` links: capture task history and notes, recall on demand ("remind me…", "what did I save for…"), and pull detail from workspace files when the user points at them. |
| [personal-context-builder](./personal-context-builder/SKILL.md) | `context-builder` | Interview-driven workflow that produces a **personal context portfolio**—structured markdown files (from templates under `personal-context-builder/templates/`) describing how someone works and what matters to them, for reuse by other agents or tools. |
| [prd-to-linear](./prd-to-linear/SKILL.md) | `prd-to-linear` | Read a Linear Document PRD and convert it into **Linear milestones and implementation tickets**: extracts phases → milestones, features → epics, tasks → tickets; surfaces spec gaps one-at-a-time; consults the target repo for architecture context; creates milestones and fully-structured tickets in Linear with user confirmation. |
| [prepare-for-agent](./prepare-for-agent/SKILL.md) | `prepare-for-agent` | Create or refine a Linear ticket so it's ready for an **autonomous coding agent** (e.g. a Cursor Cloud/Background Agent) to execute unattended: identifies the target repo and reads its coding standards (`AGENTS.md`/`CLAUDE.md`/`.cursor/rules`) to ground the ticket, guided one-question-at-a-time interview for canonical sections (Acceptance Criteria, Context, Scope, Repository & conventions, Reproduction, Architectural decisions, Test expectations), outcome/repo-grounded refinement loop, Linear metadata selection, and final persist via MCP. Company- and tool-agnostic. |
| [review-code](./review-code/SKILL.md) | `review-code` | Review a GitHub PR and produce **structured findings**: two-pass review (general + checklist across 7 categories), cross-referenced against repo standards (AGENTS.md/CLAUDE.md), deduped, and formatted with verdict (APPROVE / COMMENT / REQUEST_CHANGES), severity counts, and per-finding category/file/line references. Output is local markdown — no GitHub writes. |
| [review-code-and-comment](./review-code-and-comment/SKILL.md) | `review-code-and-comment` | Run `review-code` then **post all findings as a single GitHub PR review** with line-level inline comments and an executive summary body. Findings not mappable to diff lines go into the review body. Requires `review-code`. |
| [tech-debt-assessor](./tech-debt/SKILL.md) | `tech-debt-assessor` | **Tech debt assessment**: scans local repos, architecture documents, and Linear projects listed in `tech-debt-config.md` (or `project-tracking.md` as fallback) to identify debt themes and writes a stakeholder-ready report using [tech-debt-report-template.md](./tech-debt/tech-debt-report-template.md). Copy [tech-debt-config-template.md](./tech-debt/tech-debt-config-template.md) to `tech-debt-config.md` per workspace. Trigger: tech debt assessment, debt report, debt backlog, architecture risk review. |
| [team-report](./team-report/SKILL.md) | `team-report` | **Team activity report** for a time window: Linear issue counts per person and per project (with optional portfolio share and project blurbs from `get_project`), plus Git commit counts per person and per repo from local clones. Reads `team.md` (roster emails) and `project-tracking.md` (portfolio project names). Use for "what did the team ship," portfolio vs assignees, or Linear plus commit summaries. Writes a dated markdown file at the repo root (for example `report-team-activity-YYYY-MM-DD.md`). |
| [tune-the-ticket](./tune-the-ticket/SKILL.md) | `tune-the-ticket` | **Development readiness** for a Linear issue (read-only MCP) or pasted text: verdict (READY/NOT READY/NEEDS INFO), AC/scope/DoD/engineering implementation notes, optional repo review and implementation plan, suggested Linear deltas; writes one markdown file and **does not** update Linear. |
| [weekly-brief](./weekly-brief/SKILL.md) | `weekly-brief` | Builds a personal weekly status brief: reads Linear project names from `project-tracking.md`, pulls current project state via the Linear MCP, optionally cross-checks recent commits/PRs, correlates related **Statsig experiments** via the Statsig MCP (days running / days left, hypothesis, primary metrics + statistical significance), and writes a dated markdown report (`brief-[date].md`). Use for weekly updates, status, or progress reviews. |

## Categories

Skills are grouped below by the part of the engineering workflow they support.

### Ticket & Delivery

The full pipeline from ticket creation to merged code.

| Skill | Role |
|-------|------|
| [concept-to-spec](./concept-to-spec/SKILL.md) | Turn a raw concept into a SOLID product spec via interview + devil's-advocate (feeds `prd-to-linear`) |
| [prd-to-linear](./prd-to-linear/SKILL.md) | Convert a PRD document into milestones and a full implementation backlog |
| [tune-the-ticket](./tune-the-ticket/SKILL.md) | Assess and refine a Linear issue before anyone picks it up |
| [prepare-for-agent](./prepare-for-agent/SKILL.md) | Ready a ticket for unattended execution by an autonomous coding agent |
| [find-ticket-dependencies](./find-ticket-dependencies/SKILL.md) | Detect and mark `blocks`/`relatedTo` relations across a filtered ticket set |
| [implement-linear-ticket](./implement-linear-ticket/SKILL.md) | End-to-end autonomous implementation: ticket → code → tests → draft PR → green CI |

### Code Review

Three skills that together cover the full review cycle.

| Skill | Role |
|-------|------|
| [review-code](./review-code/SKILL.md) | Two-pass structured review with findings (local output, no GitHub writes) |
| [review-code-and-comment](./review-code-and-comment/SKILL.md) | Same review, posted as line-level GitHub PR comments |
| [address-review-comments](./address-review-comments/SKILL.md) | Triage, apply, push, and reply to existing PR review comments |

### Analysis & Insight

Deeper analytical modes that inform direction or decisions.

| Skill | Role |
|-------|------|
| [architecture-survey](./architecture-survey/SKILL.md) | Map a codebase or org structure from source code |
| [tech-debt-assessor](./tech-debt/SKILL.md) | Prioritised tech debt assessment across repos and Linear |
| [eng-review](./eng-review/SKILL.md) | Assess a decision document's readiness for engineering review and generate a checklist |
| [devils-advocate](./devils-advocate/SKILL.md) | Stress-test a proposal, plan, or document |

### Reporting & Visibility

Recurring outputs for you or your team.

| Skill | Role |
|-------|------|
| [weekly-brief](./weekly-brief/SKILL.md) | Personal weekly status from Linear projects |
| [team-report](./team-report/SKILL.md) | Team activity — Linear issues + Git commits |
| [meeting-prep](./meeting-prep/SKILL.md) | Pull context from past meetings before a call |

### Personal Knowledge

Long-running context about you and your work.

| Skill | Role |
|-------|------|
| [memorize](./memorize/SKILL.md) | Durable wiki-style memory file at `~/.memory.md` |
| [personal-context-builder](./personal-context-builder/SKILL.md) | Structured interview to build a reusable context portfolio |

## External dependencies

Some skills assume MCP servers, CLIs, or files outside the skill folder. Enable and authenticate MCP integrations in your client (for example Cursor **Settings → MCP**) using the server that exposes **Linear** tools; the exact server id varies by setup (`user-linear`, `plugin-linear-linear`, and so on).

| Skill | External tools and inputs |
|-------|---------------------------|
| [address-review-comments](./address-review-comments/SKILL.md) | **GitHub CLI** (`gh`, authenticated). **`push-code` skill** must be installed (used for committing and pushing changes). No MCP. |
| [architecture-survey](./architecture-survey/SKILL.md) | **GitHub CLI** (`gh`, authenticated to the org), **`python3`** for JSON filtering in the documented examples, and normal **git** / filesystem access to clone and inspect repos. |
| [concept-to-spec](./concept-to-spec/SKILL.md) | None required — works on the concept text in the session and writes a markdown spec file. Optional **web search / fetch** tools for the research-enrichment step; optional structured multiple-choice question tool (else asks inline). No MCP. |
| [devils-advocate](./devils-advocate/SKILL.md) | None—works on text or documents in the session. |
| [eng-review](./eng-review/SKILL.md) | None—assesses a decision document or draft supplied in the session. Uses [decision-doc-template.md](./eng-review/references/decision-doc-template.md) in the skill folder. No MCP. |
| [find-ticket-dependencies](./find-ticket-dependencies/SKILL.md) | **Linear MCP** — `list_issues`, `get_issue` (with `includeRelations: true`), `save_issue` (`blocks`, `blockedBy`, `relatedTo`). **GitHub CLI** (`gh`) for PR file lists and bodies. **Local git** as fallback for branch inspection. |
| [implement-linear-ticket](./implement-linear-ticket/SKILL.md) | **Linear MCP** for reading the ticket (`get_issue`, etc.). **`push-code` skill** must be installed. **GitHub CLI** (`gh`) for creating the draft PR and polling CI run status. |
| [meeting-prep](./meeting-prep/SKILL.md) | Optional maintainer-owned **stakeholder context** file (see the skill bundle). No MCP described in the skill. |
| [memorize](./memorize/SKILL.md) | Writes **`~/.memory.md`** in the user's home directory; may read workspace paths the user names. No MCP. |
| [personal-context-builder](./personal-context-builder/SKILL.md) | Templates under the skill folder; optional user-supplied samples (exports, transcripts). No MCP. |
| [prd-to-linear](./prd-to-linear/SKILL.md) | **Linear MCP** (`list_projects`, `get_project`, `list_documents`, `get_document`, `list_milestones`, `list_teams`, `get_team`, `save_milestone`, `save_issue`). Optional **GitHub CLI** (`gh`) and **git / Read** for lightweight repo architecture survey. |
| [prepare-for-agent](./prepare-for-agent/SKILL.md) | **Linear MCP** (`get_issue`, `list_teams`, `list_projects`, `list_cycles`, `list_issue_labels`, `save_issue`); **`mcp_auth`** on auth failure. **Local repo access** (or **GitHub CLI** `gh api` fallback) to read `AGENTS.md`/`CLAUDE.md`/`.cursor/rules`/`CONTRIBUTING.md`/`README.md` for coding standards and test conventions — no company-specific config or repo allow-list required. |
| [review-code](./review-code/SKILL.md) | **GitHub CLI** (`gh`) for PR metadata and diff. **Linear MCP** (read-only) when a ticket identifier is found in the PR. Local repo checkout preferred; falls back to the GitHub API. No writes to GitHub. |
| [review-code-and-comment](./review-code-and-comment/SKILL.md) | Everything `review-code` requires, plus the **GitHub Reviews API** (`gh api repos/{owner}/{repo}/pulls/{number}/reviews`) to post the review. **`review-code` skill** must be installed. |
| [tech-debt-assessor](./tech-debt/SKILL.md) | **Linear MCP** (`get_project`, `list_issues` with pagination). **`tech-debt-config.md`** at the workspace root (from [tech-debt-config-template.md](./tech-debt/tech-debt-config-template.md)): **Linear project titles**, architecture doc paths, repo roots, labels, report period. Falls back to **`project-tracking.md`** if the config project list is empty. **Local git repos** under the workspace (or configured paths) for code/deps/CI signals. Writes `tech-debt-report-YYYY-MM-DD.md` at the workspace root. |
| [team-report](./team-report/SKILL.md) | **Linear MCP** with **`list_issues`** (assignee filters, optional `team`, pagination via `cursor` / `limit`), and **`get_project`** for portfolio blurbs; read tool schemas under the workspace **`mcps`** folder before calling. **`team.md`** at the workspace root: one person per line, `Name; email@domain` (emails used for Linear assignee filters and Git author matching). **`project-tracking.md`** at the workspace root: one Linear project **title** per line (must match Linear for `get_project` / project columns). **Local `git` clones** under the workspace (or paths the user names); the skill prefers `git log` over the GitHub API unless the user asks otherwise. Optional **Linear team** name (for example `iOS`) when scoping `list_issues`. |
| [tune-the-ticket](./tune-the-ticket/SKILL.md) | **Linear MCP**, read-only (`get_issue`, `list_comments`, `get_document`, etc.); **`mcp_auth`** if reads fail. Optional **local repo** inspection when path/name is known. Ask user for **PRD/design/repo** when missing. |
| [weekly-brief](./weekly-brief/SKILL.md) | **Linear MCP** for projects, issues, and status (use **`mcp_auth`** when the host requires it). **`project-tracking.md`** at the workspace root lists project names. **Git** in sibling repos for recent commits/PRs; **GitHub** access if you use `gh` or remote history the same way. **Statsig MCP** (`user-statsig`) for experiment correlation — `Get_List_of_Experiments`, `Get_Experiment_Details_by_ID`, `Get_Experiment_Overall_Results` (use **`mcp_auth`** if a call returns an auth error); candidate experiments are derived from Linear ticket content and commit/PR text. |

## Layout

```
address-review-comments/SKILL.md   — PR review-comment triage, apply, push, and reply
architecture-survey/SKILL.md       — Org/repo architecture methodology
concept-to-spec/
  SKILL.md                         — Concept → SOLID product spec (interview + devil's-advocate)
  references/spec-template.md      — Target spec document structure
  references/interview-guide.md    — Batched thematic question bank
  references/devils-advocate-check.md — Spec-tuned critique + verdict checklist
devils-advocate/SKILL.md           — Structured critique workflow
eng-review/
  SKILL.md                         — Eng review readiness assessment + checklist workflow
  references/decision-doc-template.md — 2–4 page decision document structure
find-ticket-dependencies/
  SKILL.md                         — Dependency detection and relation marking workflow
  references/dependency-patterns.md — Heuristics for cross-reference, structural, and functional signals
implement-linear-ticket/SKILL.md   — End-to-end ticket → implementation → PR
meeting-prep/SKILL.md              — Prep + embedded meeting-sim content
memorize/SKILL.md                  — ~/.memory.md wiki-style memory
personal-context-builder/          — Interview protocol + templates/
prd-to-linear/
  SKILL.md                         — PRD → milestones + Linear tickets workflow
  references/prd-analysis-guide.md — Milestone/feature/gap extraction patterns
  references/ticket-template.md    — Standard ticket body format
prepare-for-agent/SKILL.md         — Agent-ready Linear ticket creation/refinement
review-code/
  SKILL.md                         — Two-pass structured PR review (local output)
  checklist.md                     — Review criteria by category
  context-gathering.md             — Context-gathering methodology
  output-format.md                 — Structured output contract
review-code-and-comment/SKILL.md   — review-code + post findings as GitHub PR comments
tech-debt/
  SKILL.md                         — Tech debt assessor workflow
  tech-debt-report-template.md     — Report output structure
  tech-debt-config-template.md     — Copy to workspace as tech-debt-config.md
team-report/SKILL.md               — Linear + git team activity report
tune-the-ticket/
  SKILL.md                         — Ticket readiness + refinement workflow
  readiness-checklist.md           — Rubric for AC, scope, implementation notes
weekly-brief/SKILL.md              — Linear-backed weekly report
```

Deploy copies each **top-level** folder that contains `SKILL.md` (nested `meeting-prep/skills/` is not deployed separately unless promoted to its own top-level folder).

## Deployment

Deploying copies every top-level folder that contains a `SKILL.md` into `~/.sync-skills/skills` and into the home skills folders for `claude`, `codex`, `cursor`, and `gemini`. It also mirrors the **entire repo** (minus `.git`, `node_modules`, and `.DS_Store`) into Google Drive as a single `skills` folder.

Prerequisite: install Node.js with npm. The deploy script is dependency-free and does not require `sync-skills`.

Target folders:

```text
~/.claude/skills
~/.codex/skills
~/.cursor/skills
~/.gemini/skills
~/.sync-skills/skills
~/Library/CloudStorage/GoogleDrive-<account>/My Drive/skills   # full repo copy
```

The Google Drive account defaults to `rafal.kuklinski@soundcloud.com`. Override it with the `SKILLS_GDRIVE_ACCOUNT` env var, or point at an arbitrary Drive root with `SKILLS_GDRIVE_DIR` (the repo is copied to `<dir>/skills`). If the Drive folder is not mounted, the copy is skipped with a warning. Pass `--no-gdrive` to skip it explicitly; `--common-only` also skips it.

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

Copy only to `~/.sync-skills/skills` and skip assistant folders and Google Drive:

```bash
node scripts/deploy-skills.mjs --common-only
```

Or:

```bash
make deploy-common-only
```

### Skip Google Drive

Run a full deploy but skip the Google Drive mirror:

```bash
node scripts/deploy-skills.mjs --no-gdrive
```

## Usage

Invoke a skill when the task matches its description; agents that support skills usually load them from this directory automatically. If your environment uses slash commands, the skill name in the YAML frontmatter is what those commands are keyed on—check your client's docs for the exact syntax.

**Frontmatter `name` values** (alphabetical): `address-review-comments`, `concept-to-spec`, `context-builder`, `devils-advocate`, `find-ticket-dependencies`, `implement-linear-ticket`, `memorize`, `prepare-for-agent`, `repo-architecture-survey`, `review-code`, `review-code-and-comment`, `simulating-meeting` (embedded in [meeting-prep](./meeting-prep/SKILL.md)), `team-report`, `tech-debt-assessor`, `tune-the-ticket`, `weekly-brief`.
