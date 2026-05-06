---
name: weekly-brief
description: Generate a personal weekly status brief by reading Linear project names from project-tracking.md in the workspace root, fetching their current status via the Linear MCP, and producing a structured markdown report. Use when the user asks for a weekly brief, weekly update, weekly status, weekly summary, or wants to review their project progress for the week.
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
8. **Compile the brief** — Write the report using the template below and store it in a file named brief-[date of generation].md

TODO: I would like to be able to read statsig experiments as well
TODO: I WOULD LIKE TO EXTEND IT WITH ABILITY FOR ME TO ASK FOLLOW-UP QUESTIONS ABOUT THE STATUS (and extend skill that way)

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

### A/B tests running
- [Name of the A/B test in statsig] - [details of treatment groups] - results for primary metrics (including the statistical significance)

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

## Gotcha Section
 - Dont just refer to tickets by ID (number) - add at least some context/summary so that I know what you are referring to