# Output Format

The structured output that `review-code` produces. `review-code-and-comment` consumes this format to post GitHub PR review comments.

## Executive Summary

Begin the review output with an executive summary block:

### Verdict

One of:
- **APPROVE** — no findings.
- **COMMENT** — only minor findings.
- **REQUEST_CHANGES** — any critical or important findings.

### Summary

One sentence describing the overall assessment of the PR.

### Counts

Report the number of findings by severity: X critical, Y important, Z minor.

## Findings

After the executive summary, list each finding as a structured entry. Each finding must include ALL of the following fields:

### Fields

- **severity** — `critical`, `important`, or `minor`
- **category** — one of: `repo-standards`, `data-storage`, `api-schema-contracts`, `infrastructure-workflows`, `correctness-reliability`, `security`, `general-quality`, or `general`
- **file** — file path relative to the repo root
- **line_start** — first line number of the relevant code range in the changed file
- **line_end** — last line number of the range (omit if single-line)
- **title** — short one-line summary of the issue
- **description** — detailed explanation: what is wrong, why it matters, and what to do instead
- **standard_reference** — if the finding comes from or is reinforced by a repository standard document, cite the source file and the specific rule. Format: "source-file.md specifies that [rule], but the code here does [violation]". Set to null if not applicable.

### Severity Definitions

- **Critical** — must fix before merge. Bugs, data loss risk, security vulnerabilities, breaking changes to APIs or schemas, database migration rollback blockers.
- **Important** — should fix. Architecture problems, missing error handling, test coverage gaps, acceptance criteria misses.
- **Minor** — nice to have. Code style, naming, minor optimizations, documentation suggestions.

## Formatting

Present the output as structured markdown. Use headings, bold labels, and consistent formatting so that downstream consumers (human or skill) can reliably parse the findings.

Example finding:

---

**severity:** critical
**category:** data-storage
**file:** db/migrations/20260415_drop_column.sql
**line_start:** 12
**title:** Column drop prevents rollback
**description:** Dropping the `legacy_status` column is irreversible. If the previous code version is redeployed, it will fail with a missing column error. Use a two-phase approach: first deploy code that stops reading the column, then drop it in a subsequent release.
**standard_reference:** null

---
