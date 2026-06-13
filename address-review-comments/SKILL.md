---
name: address-review-comments
description: Fetch PR review comments, recommend actions, apply approved changes, push, and reply to each comment
allowed-tools: Read, Edit, Write, Bash(git:*), Bash(gh:*)
metadata:
    version: 1.0.0
---

# address-review-comments

## Dependencies

Requires [push-code](../push-code/SKILL.md) to be installed.

## Trigger

When the user wants to address review comments on a PR for the current branch. This skill fetches unresolved comments, analyzes each one, recommends a course of action, lets the user decide, implements changes, pushes, and replies to each comment.

## Steps

### 1. Find the PR for the current branch

- Run `gh pr view --json number,url,headRefName` to get the PR associated with the current branch.
- If no PR exists, tell the user and stop.

### 2. Fetch unresolved review comments

- Fetch all review comments using `gh api repos/{owner}/{repo}/pulls/{number}/comments --paginate`.
- Filter out comments that are resolved or hidden (e.g. minimized/outdated). Use the `minimized` and `in_reply_to_id` fields — skip minimized comments and skip replies (we only care about top-level comments).
- Also fetch general PR review bodies (not inline comments) using `gh api repos/{owner}/{repo}/pulls/{number}/reviews --paginate` — include any with a non-empty body and state `CHANGES_REQUESTED` or `COMMENTED`.
- If there are no actionable comments, tell the user and stop.

### 3. Analyze each comment and recommend a course of action

For each comment, think carefully and deeply:

- Read the relevant code in the file at the referenced line(s).
- Understand what the reviewer is asking for or suggesting.
- Evaluate whether the suggestion is correct, beneficial, and aligned with the codebase conventions.
- Decide on one of two recommendations:
  - **(a) Make a change** — describe the specific change you would make and why it addresses the comment.
  - **(b) No change needed** — provide a clear explanation and rationale for why the code should stay as-is.

### 4. Present recommendations to the user

Present all comments and your recommendations in a clear, structured format:

For each comment:
- Show the reviewer name, file, line(s), and the comment text (quoted).
- Show your recommendation (change or no-change) with rationale.

Then ask the user to review. The user can:
- **Confirm** all recommendations as-is.
- **Modify** specific recommendations (e.g. change a "no change" to "make a change" or vice versa).
- **Ignore** specific comments entirely (these will be dropped — no change made and no reply posted).

Wait for the user's response before proceeding.

### 5. Implement approved changes

For each comment where the agreed action is to make a code change:

1. Implement the change for **that comment only**.
2. Stage and commit the change immediately before moving to the next comment:
   - `git add -A`
   - `git commit -m "review: <short description of what was changed and why>"`
   - Use a concise, imperative-mood commit message that references what the comment asked for (e.g. `review: extract helper to reduce duplication`).
3. Repeat for every remaining comment that requires a change — one commit per comment.

Make all changes carefully, following the coding and testing conventions described in AGENTS.md.

### 6. Push changes (if any were made)

- If any commits were created in step 5, execute the `push-code` skill.

### 7. Reply to each comment on the PR

For each comment that was NOT ignored by the user:

- If a code change was made: reply explaining what was changed and why, referencing the commit if helpful.
- If no change was made: reply with the rationale for keeping the code as-is.

Post replies using `gh api repos/{owner}/{repo}/pulls/{number}/comments -f body="..." -F in_reply_to={comment_id}` for inline comments (note: `-F` for `in_reply_to` so it is sent as a number, not a string — the GitHub API rejects string values for this field), or `gh api repos/{owner}/{repo}/issues/{number}/comments -f body="..."` for general review comments.

Keep replies concise, respectful, and constructive.

### 8. Resolve addressed comment threads

After posting replies, resolve each addressed inline comment thread:

1. Fetch review thread IDs using the GraphQL query:
   ```
   gh api graphql -f query='query { repository(owner: "{owner}", name: "{repo}") { pullRequest(number: {number}) { reviewThreads(first: 100) { nodes { id isResolved comments(first: 1) { nodes { databaseId } } } } } } }'
   ```
2. Match each thread to the inline comments addressed in this session using the `databaseId` of the first comment in each thread.
3. Resolve matched threads (skipping already-resolved ones) using the GraphQL mutation:
   ```
   gh api graphql -f query='mutation { resolveReviewThread(input: {threadId: "{thread_id}"}) { thread { isResolved } } }'
   ```
