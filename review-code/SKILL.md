---
name: review-code
description: Review a GitHub PR and produce structured findings with severity, category, file/line references, and standard citations
allowed-tools: Read, Glob, Grep, Bash(git:*), Bash(gh:*)
metadata:
    version: 1.0.0
---

# review-code

## Trigger

When the user provides a GitHub PR reference (URL or `owner/repo#number`) and asks for a code review. This skill performs a fully autonomous review — do not stop for user confirmation at any intermediate step.

## Reference Files — MANDATORY

Before starting the review, read all reference files:
- [checklist.md](checklist.md) — review criteria by category
- [context-gathering.md](context-gathering.md) — how to gather context before reviewing
- [output-format.md](output-format.md) — structured output contract

## Steps

### 1. Gather context

Follow the instructions in [context-gathering.md](context-gathering.md) to:

1. Resolve the PR metadata (title, description, branch, base, author, changed files).
2. Locate the repo locally (current working directory or immediate subdirectory) and generate the diff. Fall back to the GitHub API if no local checkout is found.
3. Read repository standards (`AGENTS.md`, `CLAUDE.md`, and all linked documents). These are authoritative — they always take precedence over your own judgment.
4. Extract and fetch the Linear ticket if a ticket identifier is found in the PR title, branch name, or description.
5. Explore the code deeply (local repo only): read full changed files, follow imports, check callers, read related tests.

### 2. Pass 1 — General review

Review the diff holistically using your general software engineering knowledge. Consider:

- Code correctness
- Readability and maintainability
- Error handling
- Performance implications
- Security concerns

Use all gathered context — repo standards, ticket acceptance criteria, and your understanding of the surrounding code — to inform your judgment.

Produce a preliminary list of findings.

### 3. Pass 1.5 — Cross-reference against repo standards

Compare every finding from Pass 1 against the repository standards gathered in Step 1.

- If a finding **contradicts** a repo standard, **drop it**. The repo's rules always take precedence. Do not tell a developer to do something their own repo guidelines say not to do.
- If a finding is **reinforced** by a repo standard, upgrade it: add a `standard_reference` citing the specific source document and rule.

### 4. Pass 2 — Checklist review

Follow the checklist in [checklist.md](checklist.md). Evaluate the diff against each category explicitly:

- **Category 0: Repository Standards** — violations of AGENTS.md/CLAUDE.md and linked docs. Cite the specific source and rule.
- **Category 1: Data & Storage** — breaking migrations, rollback blockers, DynamoDB schema issues.
- **Category 2: API & Schema Contracts** — breaking REST, Twirp/Protobuf, or Kafka event schema changes.
- **Category 3: Infrastructure & Workflows** — Inngest breakage, config/env var issues.
- **Category 4: Correctness & Reliability** — acceptance criteria, bugs, nil/null safety, race conditions, error handling.
- **Category 5: Security** — secrets/PII, injection, auth gaps.
- **Category 6: General Quality** — test coverage, dead code, code smells.

Skip categories that are not relevant to the PR. Only report categories where there are actual findings.

### 5. Deduplicate

If Pass 1 and Pass 2 surface the same issue, keep the Pass 2 (checklist) version — it has the specific category and is more structured. Drop the duplicate from the general findings.

### 6. Produce output

Format the findings according to [output-format.md](output-format.md):

1. **Executive summary** — verdict (APPROVE / COMMENT / REQUEST_CHANGES), one-sentence assessment, severity counts.
2. **Findings list** — each finding with all required fields: severity, category, file, line_start, line_end, title, description, standard_reference.
