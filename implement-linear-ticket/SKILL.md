---
name: implement-linear-ticket
description: Read a Linear ticket, plan, implement, validate, push, and open a draft PR — end-to-end autonomous ticket implementation
allowed-tools: Read, Edit, Write, Grep, Glob, Bash(git:*), Bash(gh:*), Bash(sleep:*)
metadata:
    version: 1.0.0
---

# implement-linear-ticket

## Dependencies

Requires [push-code](../push-code/SKILL.md) to be installed.

## Trigger

When the user provides a Linear ticket reference (e.g. `CD-580`) and asks to implement it. This skill handles the full lifecycle: read the ticket, plan, implement, validate, push, and open a draft PR.

Work as independently as possible — do not stop for user confirmation at intermediate steps. Execute end-to-end autonomously.

## Steps

### 1. Read the ticket

- Use the Linear MCP tools to fetch the ticket by its identifier (e.g. `CD-580`).
- Read the full description, acceptance criteria, and any comments.

### 2. Create a feature branch

- Run `git checkout main && git pull origin main` to start from the latest main.
- Create and check out a new branch following the branch naming convention described in AGENTS.md, using the ticket identifier and a short description derived from the ticket title.

### 3. Plan the implementation

- Think carefully and deeply about what needs to change.
- Consider the existing codebase architecture, patterns, and conventions.
- Explore the relevant parts of the codebase to understand how things work before writing any code.

### 4. Implement

- Implement the changes according to your plan.
- Read AGENTS.md and its linked documents for coding conventions, test guidelines, and how to run commands in this repository. Follow them.
- Make sure that all added code is covered with tests, following the test guidelines described in AGENTS.md.

### 5. Review

- Re-read the ticket description and acceptance criteria.
- Review your implementation to make sure every requirement is addressed.
- If anything is missing, go back and implement it.

### 6. Push code

- Perform the `push-code` skill to validate, fix, commit, and push.

### 7. Create a draft PR

- Create a draft PR with `gh pr create --draft`.
- Follow the PR conventions described in AGENTS.md for title format, description structure, and any required disclosures.
- In addition to what AGENTS.md specifies, include in the PR body:
  - Any open questions, assumptions you made, or design choices that weren't specified in the ticket — so reviewers are aware.
  - Include the ticket identifier in the PR title (e.g. `feat: add retry logic (TICKET-123)`).

### 8. Wait for CI and fix failures

- After pushing, wait for the CI build to finish. Use `sleep 10` then check with `gh run list --branch <branch> --limit 1 --json status,conclusion`.
- If the run is still in progress, keep polling (sleep and check again).
- Once complete, if the build **failed**:
  - Inspect the failure with `gh run view <run-id> --log-failed`.
  - Fix the issues.
  - Repeat from step 6 (push-code, then check CI again).
- Loop until CI passes.

### 9. Done

- Report the PR URL and summarize what was implemented.
