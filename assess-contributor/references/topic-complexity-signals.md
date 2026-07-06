# Topic Complexity Signals

Use these signals to score the complexity of the Linear tickets / topics a contributor worked on.

## Data sources

- Ticket title, description, labels
- Estimate / story points (if set)
- Priority
- Comment count (proxy for design discussion / back-and-forth)
- Project / epic name
- Cross-reference with git file-area breadth (step 3c) for the same period — touching many
  distinct top-level directories/repos in one period is itself a complexity signal

## Complexity score (1–5)

Assign one score per ticket, then average across all tickets (and per period for the trend).

| Score | Description |
|-------|-------------|
| 1 | Trivial: typo/copy fix, config value change, single-line bug fix, no design decisions |
| 2 | Simple: well-defined bug fix or small feature, single file/service, clear acceptance criteria |
| 3 | Moderate: multi-file feature within one service, some design choices, moderate estimate |
| 4 | Complex: cross-service/cross-repo change, migration, new architecture pattern, ambiguous requirements needing clarification, security/compliance implications |
| 5 | Highly complex: distributed-systems/infra-level change, novel design with no precedent, large blast radius (affects many teams/users), extended multi-sprint effort, high-stakes (data migration, auth, billing) |

## Positive complexity signals

- Labels or keywords in title/description: "migration", "architecture", "security", "infra",
  "performance", "concurrency", "distributed", "breaking change", "compliance", "billing", "auth"
- Large estimate/story points relative to the team's typical ticket size
- High comment count (extended design discussion, multiple reviewers weighing in)
- Ticket spans multiple projects/epics, or is explicitly a dependency for other tickets
- Description mentions trade-offs, alternatives considered, or open questions
- Git evidence: commits from the same period touch multiple distinct repos/top-level directories
  (cross-cutting change)

## Low-complexity signals

- Single-sentence description, no discussion/comments
- Labels: "typo", "docs", "chore", "copy"
- Very small estimate or no estimate needed
- Single file changed

## Interpretation

| Avg complexity score | Assessment |
|----------------------|-----------|
| 1.0–1.5 | Mostly routine/maintenance work |
| 1.5–2.5 | Standard feature/bug-fix work |
| 2.5–3.5 | Regularly tackles moderate-complexity problems |
| 3.5–4.5 | Frequently owns complex, cross-cutting work |
| 4.5–5.0 | Primarily handles the hardest, highest-stakes problems on the team |

## Canvas presentation

Report in the **Topic complexity** section:
- Complexity mix: share of tickets in low (1–2), medium (2.5–3.5), and high (4–5) bands
- Avg complexity score, plus the trend (trailing quarter vs. prior quarter, trailing year vs.
  prior year), reusing the same date boundaries and accelerating/steady/slowing labels as the
  git activity trend (step 3f) — but interpret "accelerating" as "taking on harder problems,"
  not just "more of them"
- Top 5 most complex tickets handled (title, project, score, one-line rationale)
- Related Linear projects touched (name, ticket count, first/last activity date)

## Note when Linear MCP is unavailable or no tickets are found

State clearly that ticket-level complexity could not be assessed, and fall back to git file-area
breadth (step 3c) as a rough proxy: touching more distinct top-level directories/repos per period
suggests broader, more cross-cutting work — but this is not a substitute for ticket-level signals
like ambiguity, blast radius, or discussion depth, and should be labeled as a weaker proxy in the
canvas.
