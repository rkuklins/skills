---
name: weekly-brief
description: Generate a personal weekly status brief by reading Linear project names from project-tracking.md in the workspace root, fetching their current status via the Linear MCP, correlating Statsig experiments via the Statsig MCP, and producing a structured markdown report. Use when the user asks for a weekly brief, weekly update, weekly status, weekly summary, or wants to review their project progress for the week.
---

# Weekly Brief

Generate a personal bi-weekly (last 2 weeks) status report from Linear projects listed in `project-tracking.md` and related github repos (same folder).

## Workflow

1. **Read project list** — Read `project-tracking.md` from the workspace root. It contains a list of Linear project names to include in the brief.
2. **Authenticate Linear** — If the Linear MCP tool requires auth, call `mcp_auth` first.
3. **Fetch project data** — For each project name, use the Linear MCP to search for the project and retrieve:
   - Overall status / health
   - Purpose or goal (from description)
   - Issues completed this week (filter by `completedAt` in the last 7 days)
   - Blocked or at-risk issues (filter by `blocked` state or overdue)
   - Upcoming issues (planned / in backlog / scheduled)
4. Read the latest status update for the linear project (even if it has been created more then a week ago)
5. If there are milestones - collect information about the progress on the milestone (along the goal of the milestone and % of tickets completed if the milestone is not achieved yet)
6. Get all the commits and PRs in the last week to verify what has been done and what is progressing for all the subfolders (repos). Check the commits related to the projects in the project-tracking.md 
7. In the linear updates and git commits look for mentions of statsig and A/B tests that either got started, are progressing with some results or got ended for any reason - call them out explicitely in the report along with names of experiments (if available)
8. **Correlate Statsig experiments** — Use the Statsig MCP to find and detail the experiments owned by / scheduled / started / planned by the team. See the "Statsig experiment lookup" section below for the exact procedure.
9. **Compile the brief** — Write the report using the template below and store it in a file named brief-[date of generation].md

TODO: I WOULD LIKE TO EXTEND IT WITH ABILITY FOR ME TO ASK FOLLOW-UP QUESTIONS ABOUT THE STATUS (and extend skill that way)

## Statsig experiment lookup

Goal: for every experiment relevant to the tracked projects, report **how long it has been running, how many days are left, the hypothesis, and the primary metrics (with whether they are statistically significant)**.

Note on IDs: every Statsig experiment tool below takes the experiment's Statsig `id` as `path_id` (it's the same `id` field returned by `Get_List_of_Experiments`/`Get_Experiment_Details_by_ID`, and the same value that appears as the last path segment in a `console.statsig.com/.../experiments/<id>` permalink). Capture this `id` as soon as you discover an experiment (step 3) and carry it through every later step (`Get_Experiment_Details_by_ID`, `Get_Experiment_Overall_Results`) as `path_id`.

1. **Authenticate** — If a Statsig MCP tool fails with an auth/authorization error, call `mcp_auth` for the `user-statsig` server, then retry. Always read a tool's descriptor (in the MCP FileSystem) before calling it.
2. **Build candidate experiment names/links** — Derive experiment identifiers from the evidence you already collected:
   - Scan Linear ticket titles/descriptions/comments and git commit messages + PR titles for Statsig experiment names, IDs, or `console.statsig.com` permalinks (step 7 above).
   - Extract the experiment ID from any permalink (the segment after `/experiments/`) — this is the `path_id` you'll reuse in steps 4 and 6.
3. **Discover experiments** — Fetch the candidate set with the Statsig MCP:
   - If you have specific IDs, call `Get_List_of_Experiments` with `query_ids` (batches of ≤100) to read them in one request.
   - Otherwise call `Get_List_of_Experiments` filtered by `query_status` (include at least `active`, `setup`, and recently `decision_made`/`experiment_stopped`) and, if the team's Statsig `teamID` is known, `query_teamID`. Include `"id"` in `query_fields` (e.g. `["id","name","status","hypothesis","primaryMetrics","groups","startTime","permalink"]`) to keep responses small while still capturing the identifier you'll need later.
   - Match discovered experiments back to the projects by name/keyword overlap. Only include experiments that plausibly belong to the tracked team/projects; note the matching evidence (which ticket/commit referenced it). For each match, record its `id` — this is the `path_id` used in steps 4 and 6.
4. **Get details per experiment** — For each matched experiment, call `Get_Experiment_Details_by_ID` with `path_id` set to the experiment's `id` from step 2/3 (or reuse the list response if it already has everything) to read: `hypothesis`, `primaryMetrics`, `groups` (control/test group names), `status`, `startTime`, and target duration/end date if present. Capture the `permalink` for the report link.
5. **Compute timing**:
   - **Days running** = today − `startTime` (only for experiments that have started).
   - **Days left** = target end date − today, or (`startTime` + target duration) − today. If no target duration is set, state "no target end date set".
   - For `setup`/planned experiments that have not started, report the scheduled start instead of days running.
6. **Get results & significance** — For started experiments, call `Get_Experiment_Overall_Results` with `path_id` set to the same experiment `id` used in step 4, plus `query_control` and `query_test` set to the control/test group names from `groups` (step 4). For each **primary** metric report the lift/direction and whether it is **statistically significant** (based on the significance/confidence flag in the results). If results are not yet available (too early / insufficient exposure), say so explicitly.
7. If an experiment referenced in Linear/git cannot be found in Statsig, list it as "referenced but not found in Statsig" so the gap is visible.

## Output Template

```markdown
# Weekly Brief — [Date]

## Exec Summary
Main projects that were worked on. Projects that were not worked on. Summary of the entire mission

## [Project Name]
> [One-sentence purpose/goal of the project from its description]
> bring projects which are at risk first. Sort projects my amount of work done there (the projects that were not worked on last)
**Status**: [e.g. On Track / At Risk / Off Track]
The status should be in format "The project to do [here goal of the project] is [here health of the project] for the date [here is ETA of the project]. Currently we have delivered XX% of stories. The risks are [here any risks if highlighted]

### Milestones progress
- [Milestone title and number] - [Milestone description/goals]

### Done this week
- [Issue title] — [issue identifier]
- ...

### Blocked / At risk
- [Issue title] — [issue identifier] — [reason if available]
- ...

### Upcoming
- [Issue title] — [issue identifier]
- ...

### Statsig experiments
- **[Experiment name]** ([link to Statsig permalink]) — status: [active / setup / decision_made / stopped]
  - **Running**: [N days] (started [start date]) · **Days left**: [M days until target end / "no target end date set" / "scheduled to start [date]"]
  - **Hypothesis**: [one-line hypothesis]
  - **Primary metrics**: [metric name] — [lift/direction] — [statistically significant? yes/no, or "too early / insufficient data"]
  - _Referenced in_: [ticket id / commit that surfaced this experiment]
- _[Experiment referenced in Linear/git but not found in Statsig]_ — flagged as a gap.

## Action Items 
- 
---
```

Repeat the project block for each project. End the document with a brief overall summary paragraph.

## Tips
- Start with Executive summary and then bring status project by project
- Use today's date for the report heading.
- If a section has no items, write `_Nothing to report._` rather than omitting the section.
- Keep issue titles concise; omit long descriptions.
- If `project-tracking.md` is missing, tell the user to create it in the workspace root with one Linear project name per line.
- If the project has status but lacking dates, missing issues or is incomplete or has not been updated for a along time - call it out
- Prefer `query_ids` + `query_fields` on `Get_List_of_Experiments` for batch reads to keep Statsig responses small and cheap.
- Always link experiments to their Statsig permalink so I can click through.

## Gotcha Section
 - Dont just refer to tickets by ID (number) - add at least some context/summary so that I know what you are referring to
 - Only include Statsig experiments you can tie back to the tracked projects (via a ticket, commit, name match, or team ID). Don't dump every experiment in the project.
 - "How long running" and "days left" must be computed against today's date — don't just echo raw timestamps.
 - Statistical significance must come from the actual Statsig results (`Get_Experiment_Overall_Results`), not inferred from the lift number alone. If it's too early to tell, say so.