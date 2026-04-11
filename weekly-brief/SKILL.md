---
name: weekly-brief
description: Generate a personal weekly status brief by reading Linear project names from project-tracking.md in the workspace root, fetching their current status via the Linear MCP, and producing a structured markdown report. Use when the user asks for a weekly brief, weekly update, weekly status, weekly summary, or wants to review their project progress for the week.
---

# Weekly Brief

Generate a personal weekly status report from Linear projects listed in `project-tracking.md`.

## Workflow

1. **Read project list** — Read `project-tracking.md` from the workspace root. It contains a list of Linear project names to include in the brief.
2. **Authenticate Linear** — If the Linear MCP tool requires auth, call `mcp_auth` first.
3. **Fetch project data** — For each project name, use the Linear MCP to search for the project and retrieve:
   - Overall status / health
   - Purpose or goal (from description)
   - Issues completed this week (filter by `completedAt` in the last 7 days)
   - Blocked or at-risk issues (filter by `blocked` state or overdue)
   - Upcoming issues (planned / in backlog / scheduled)
4. **Compile the brief** — Write the report using the template below.

## Output Template

```markdown
# Weekly Brief — [Date]

## [Project Name]
> [One-sentence purpose/goal of the project from its description]

**Status**: [e.g. On Track / At Risk / Off Track]

### Done this week
- [Issue title] — [issue identifier]
- ...

### Blocked / At risk
- [Issue title] — [issue identifier] — [reason if available]
- ...

### Upcoming
- [Issue title] — [issue identifier]
- ...

---
```

Repeat the project block for each project. End the document with a brief overall summary paragraph.

## Tips

- Use today's date for the report heading.
- If a section has no items, write `_Nothing to report._` rather than omitting the section.
- Keep issue titles concise; omit long descriptions.
- If `project-tracking.md` is missing, tell the user to create it in the workspace root with one Linear project name per line.
- If the project has status but lacking dates, missing issues or is incomplete or has not been updated for a along time - call it out
