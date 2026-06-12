# Context Gathering

Before reviewing any code, gather all available context. Execute these steps in order.

## Step 1 — Resolve the PR

Use `gh pr view` to fetch PR metadata. Extract: title, description, branch name, base branch, author, and the list of changed files.

If the PR is in a different repo than the current directory, use the `-R owner/repo` flag.

```bash
gh pr view <PR_NUMBER> -R <owner/repo> --json title,body,headRefName,baseRefName,author,files
```

## Step 2 — Get the diff and code

Locate the repository on the local filesystem:

1. Check if the current working directory is the repo: compare the output of `git remote get-url origin` against the PR's repository URL.
2. If not, scan immediate subdirectories: for each directory in the current working directory, check if it is a git repo with a matching remote.
3. If a local repo is found:
   - `cd` into the repo directory (if it is a subdirectory).
   - Fetch latest: `git fetch origin`.
   - Check out the PR branch: `git checkout <head_branch>` (or `git checkout -b <head_branch> origin/<head_branch>` if the branch does not exist locally).
   - Generate the diff: `git diff <base_branch>...<head_branch>`.
   - Full code exploration is available via the local filesystem.
4. If no local repo is found:
   - Fall back to `gh api repos/{owner}/{repo}/pulls/{number}` with `Accept: application/vnd.github.v3.diff` header to fetch the diff.
   - Note in the review output that deep code exploration is limited because no local checkout was found.
   - If the diff cannot be retrieved via the API either, error out with a clear message.

## Step 3 — Read repository standards

Look for these files in the repo root (use local filesystem if available, otherwise fetch via `gh api`):

- `AGENTS.md`
- `CLAUDE.md`

For each file found:

1. Read the full contents.
2. Parse for references to other files — look for relative path links (e.g., `@file.md`, `[text](path/to/file.md)`, or bare paths like `docs/testing.md`).
3. Follow each reference and read the linked file.
4. Also follow web URLs if they point to internal documentation.

These documents and their linked files become the authoritative standards for the review. Repository standards ALWAYS take precedence over the LLM's own judgment. If a repo standard says to do something the LLM would normally flag as an issue, the repo standard wins.

## Step 4 — Extract the Linear ticket

Scan the following fields for a Linear ticket identifier (pattern: one or more uppercase letters followed by a dash and one or more digits, e.g., `ENG-1234`, `CD-580`):

1. PR title
2. Branch name
3. PR description body

Check all three — the identifier may appear in any of them.

If a ticket identifier is found:
- Fetch the ticket using Linear MCP tools.
- Read the full description, acceptance criteria, and any comments.
- This context feeds into the Correctness & Reliability checklist category (acceptance criteria adherence).

If no ticket identifier is found, proceed without it. This is not an error — not all PRs have associated tickets.

## Step 5 — Deep code exploration (local repo only)

This step requires a local checkout. Skip if running in API-fallback mode.

For each changed file in the diff:

1. **Read the full file** — not just the changed lines. Understand the full context of the module.
2. **Follow imports** — read the files that the changed code imports from. Understand the interfaces and types being used.
3. **Check callers** — use grep/glob to find other files that call the changed functions, methods, or use the changed types. This reveals the blast radius of the change.
4. **Read related tests** — find and read test files that cover the changed code. Understand what is currently tested and what the change might break.
