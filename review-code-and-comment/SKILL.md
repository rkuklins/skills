---
name: review-code-and-comment
description: Review a GitHub PR and post findings as line-level comments in a single GitHub review
allowed-tools: Read, Glob, Grep, Bash(git:*), Bash(gh:*)
metadata:
    version: 1.0.0
---

# review-code-and-comment

## Dependencies

Requires [review-code](../review-code/SKILL.md) to be installed.

## Trigger

When the user provides a GitHub PR reference (URL or `owner/repo#number`) and wants a code review posted directly as GitHub PR comments. This skill performs a fully autonomous review and comment cycle — do not stop for user confirmation at any intermediate step.

## Steps

### 1. Run the review-code skill

Execute the `review-code` skill with the same PR reference the user provided. Capture the full structured output: executive summary (verdict, summary sentence, severity counts) and all findings (each with severity, category, file, line_start, line_end, title, description, standard_reference).

### 2. Map findings to review comments

For each finding from the review-code output, construct a review comment body:

```
(severity) title

description

_Per [standard_reference]_
```

Where:
- `(severity)` is one of `(critical)`, `(important)`, or `(minor)`.
- `title` is the finding's title.
- `description` is the finding's detailed description.
- The `_Per [standard_reference]_` line is only included when `standard_reference` is not null.

For each finding, also determine the diff position for the comment:
- Use the `file` and `line_start` / `line_end` fields to anchor the comment to the correct location in the diff.
- If a finding cannot be mapped to a specific diff position (e.g., a file-level or repo-level concern), include it in the review body instead.

### 3. Submit as a single GitHub review

Use the GitHub API to submit one review containing all comments. Build a single JSON payload with all fields and submit via stdin:

```bash
jq -n \
  --arg event "COMMENT" \
  --arg body "$REVIEW_BODY" \
  --argjson comments "$COMMENTS_JSON" \
  '{event: $event, body: $body, comments: $comments}' | \
  gh api repos/{owner}/{repo}/pulls/{number}/reviews \
    --method POST --input -
```

The review body contains the executive summary:

```
## Code Review

**Verdict: <VERDICT>**

<one-sentence summary>

<X> critical · <Y> important · <Z> minor

<any findings that could not be mapped to specific diff lines>
```

The full payload structure:

```json
{
  "event": "COMMENT",
  "body": "<review_body>",
  "comments": [
    {
      "path": "src/handler.go",
      "line": 42,
      "side": "RIGHT",
      "body": "(critical) Missing nil check\n\n..."
    }
  ]
}
```

Each comment object in the `comments` array has:
- `path` — the file path relative to the repo root.
- `line` — the line number in the diff (use `line_start`).
- `side` — `RIGHT` (comment on the new version of the file).
- `body` — the formatted comment body from Step 2.

For multi-line findings (where `line_end` is set and differs from `line_start`), use:
- `start_line` — set to `line_start`.
- `line` — set to `line_end`.
- `start_side` — `RIGHT`.
- `side` — `RIGHT`.

The review event is always `COMMENT`. Never submit as `APPROVE` or `REQUEST_CHANGES`. The verdict in the review body is informational only.

### 4. Report result

Output:
- The PR URL.
- How many comments were posted.
- The verdict (from the executive summary).
- If any findings could not be mapped to specific lines, note how many were included in the review body instead.
