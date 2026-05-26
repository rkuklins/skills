---
name: tech-debt-assessor
description: Scans repositories, architecture documents, and Linear projects (from tech-debt-config.md or project-tracking.md) to identify technical debt themes and produces a prioritized tech debt assessment report. Use when the user asks for a tech debt assessment, tech debt report, debt backlog, architecture risk review, or wants debt items classified for stakeholders.
---

# Tech Debt Assessor

Produce a **Tech Debt Assessment Report** by combining evidence from code/repos, architecture docs, and Linear. Output must follow [tech-debt-report-template.md](tech-debt-report-template.md) exactly (sections 1–5, item template, summary backlog).

## Workspace inputs

| File | Required | Purpose |
| --- | --- | --- |
| [tech-debt-report-template.md](tech-debt-report-template.md) | Yes (in skill folder) | Report structure — copy section headings and tables; fill placeholders. |
| `tech-debt-config.md` | Yes (workspace root) | Per-workspace config — copy from [tech-debt-config-template.md](tech-debt-config-template.md). Includes **Linear projects**, architecture paths, repo roots, labels, report period. |
| `project-tracking.md` | No | Fallback project list if `Linear projects` in config is empty (same format as weekly-brief / team-report). |

If no Linear project list is available after resolving config + fallback, stop and ask the user to add a `Linear projects` section to `tech-debt-config.md` (or `project-tracking.md`).

### `tech-debt-config.md` (workspace root)

Copy [tech-debt-config-template.md](tech-debt-config-template.md) to the workspace root as `tech-debt-config.md`, then edit for that repo. Lines starting with `#` are comments and are ignored. Sections use headers like `# --- Linear projects ---`; non-comment lines under a header belong to that section until the next header.

If the user names architecture paths, repos, or Linear projects in chat, those override or extend the config file (dedupe project names).

### Resolving Linear projects

1. Parse the **`Linear projects`** section from `tech-debt-config.md` (one project **title** per non-comment line).
2. If that list is empty, read `project-tracking.md` at the workspace root (one title per line).
3. If still empty, stop and ask the user to add projects to the config (preferred) or `project-tracking.md`.
4. Merge any project names the user provides in chat; dedupe case-insensitively, preserve first-seen casing.

## Workflow

Copy this checklist and track progress:

```
- [ ] 1. Load inputs (config, Linear project list, template)
- [ ] 2. Read architecture document(s)
- [ ] 3. Scan repository(ies) for debt signals
- [ ] 4. Query Linear projects and debt-related issues
- [ ] 5. Consolidate themes into debt items (dedupe)
- [ ] 6. Score and write report from template
- [ ] 7. Save dated artifact
```

### 1. Load inputs

- Read `tech-debt-config.md` and resolve the **Linear project list** (config section first, then `project-tracking.md` fallback — see above).
- Set **report period** from config or user request; default **last 90 days** through today.
- Set **Prepared by** from config or user context, else `_Agent assessment_`.

### 2. Architecture document(s)

Read every path from `tech-debt-config.md` or paths the user provided. If none configured, search the workspace for likely architecture sources (first match wins unless user listed more):

- `ARCHITECTURE.md`, `docs/architecture.md`, `docs/architecture/*.md`
- `eng-doc/`, `**/ADR*.md`, `**/adr/*.md`
- Output of a prior [architecture-survey](../architecture-survey/SKILL.md) (`arch-*.md`, synthesis index)

Extract **known gaps**, **planned migrations**, **deprecated systems**, **scale/security risks**, and **explicit debt** called out in prose. Tag each finding with source file and section.

### 3. Repository scan

Discover repos: paths in config, else subdirectories under the workspace that contain `.git` (and any extra roots the user names).

Per repo, look for debt signals in this order (config files and code trump stale README):

| Signal | Where to look |
| --- | --- |
| Explicit debt | `TODO`, `FIXME`, `HACK`, `TECH DEBT`, `XXX` in source (sample; do not dump every hit — cluster by theme/component) |
| Outdated runtime / deps | `package.json`, `go.mod`, `Gemfile`, `requirements.txt`, `Dockerfile`, CI images — EOL language versions, major version lag |
| Test gaps | Missing `*_test.*` / `spec/` vs production code; skipped tests; `# skip` in CI |
| Fragile ops | Brittle CI (no caching, long serial jobs), missing health checks, absent retries/circuit breakers in service configs |
| Security | Hardcoded secrets (flag only — do not copy values), `verify=False`, disabled TLS, broad `0.0.0.0` binds in committed config |
| Scalability | N+1 patterns in hot paths, missing indexes noted in migrations, monolith comments, queue backpressure TODOs |
| Documentation | Undocumented public APIs, empty README on active services |

Reuse the **per-repo scan order** from [architecture-survey](../architecture-survey/SKILL.md) Phase 3 when depth is needed: top-level layout → README → entrypoint → config → contracts.

Do not fabricate items — every debt item needs at least one **evidence pointer** (file path, Linear issue id, or architecture doc quote).

### 4. Linear (MCP)

1. Read MCP tool schemas under the workspace `mcps` folder before calling (`get_project`, `list_issues`, pagination `cursor`). Use `mcp_auth` if reads fail.
2. For each project in the resolved Linear project list, call `get_project` (include description, status, resources if useful).
3. Per project, `list_issues` with `project` set; paginate until `hasNextPage` is false. Collect issues that are debt-related:
   - Labels from config (default: `tech-debt`, `technical-debt`, `debt`), or
   - Title/description containing: tech debt, refactor, migration, deprecation, EOL, upgrade, legacy, cleanup, paydown
4. Also run `list_issues` with `query` terms like `tech debt`, `deprecated`, `upgrade` scoped by `team` if the user names one.
5. Map Linear issues to report items: prefer one consolidated item per theme; link issue identifiers in Technical Description.

### 5. Consolidate and classify

Merge overlapping findings (same component + same theme → one item). Assign sequential IDs: `ID-101`, `ID-102`, …

**Category** (section 2 of template) — pick exactly one per item:

- Velocity / Developer Efficiency
- Stability & Reliability
- Scalability & Performance
- Security & Compliance

**Priority tier** (section 4) — use the contagion model:

| Tier | Use when |
| --- | --- |
| Critical | High risk (security, compliance, outage) or high velocity blocker |
| Strategic | Low immediate risk but materially slows delivery — schedule next 1–2 sprints |
| Opportunistic | Low risk and low velocity impact — bundle with feature work |

**Effort (T-Shirt)** — Small (1–3 days), Medium (1 sprint), Large (multi-sprint / cross-team). State assumptions in Notes.

Fill **Owner / Reporter** from Linear assignee or `_TBD_`. **Component / Microservice** from repo name, service folder, or Linear project.

### 6. Write the report

1. Open [tech-debt-report-template.md](tech-debt-report-template.md) and reproduce **all sections** (1–5).
2. Section 1: Executive summary — total items, top themes, 3–5 recommended actions.
3. Section 2: Keep the classification table **verbatim** from the template.
4. Section 3: One `### [ID-xxx]` block per item with full fields and subsections A–C.
5. Section 4: Keep matrix tables verbatim; fill **Summary Backlog** for every item.
6. Section 5: Numbered next steps tied to Critical / Strategic / Opportunistic tiers.

Use clear, stakeholder-friendly language in **Business & Engineering Impact**; keep **Technical Description** factual with evidence.

### 7. Save artifact

Write to the workspace root unless the user names a path:

`tech-debt-report-YYYY-MM-DD.md`

Use today's date in the filename and in **Last updated**.

## Anti-patterns

- Do not invent debt without repo, doc, or Linear evidence.
- Do not paste secrets, tokens, or credentials into the report.
- Do not list hundreds of raw TODO lines — cluster into themes.
- Do not skip pagination on Linear — state lower bounds if truncated.
- Keep changes limited to the report file unless the user asks to update tracking/config files.

## Additional resources

- Workspace config starter: [tech-debt-config-template.md](tech-debt-config-template.md)
- Full report skeleton: [tech-debt-report-template.md](tech-debt-report-template.md)
- Deep multi-repo structure discovery: [architecture-survey](../architecture-survey/SKILL.md)
