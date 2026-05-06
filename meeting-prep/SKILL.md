Meeting Prep — Full Skill Folder
5 files + 1 nested skill. The SKILL.md is shown above in Level 2. Below: the supporting files that make it non-trivial.

meeting-prep/
├── SKILL.md              # shown in Level 2 above
├── stakeholder-context.md  # below
├── output-template.md      # below
├── scenarios.md            # below
├── examples.md             # below
└── skills/meeting-sim/
    └── SKILL.md            # below
👤



meeting-prep/stakeholder-context.md
EXTERNAL POINTER
▼
# Stakeholder Context

This file lives OUTSIDE the skill folder (pointed externally)
because it's shared across multiple skills and changes
independently. The skill references it; you maintain it.

## Template — copy and fill for each key stakeholder

### [Name]
Role: [Title, team, reporting line]
Communication style: [Direct/diplomatic, data-driven/narrative]
Known priorities: [What they care about most right now]
Relationship history: [Ally/neutral/skeptic, past friction]
Hot buttons: [Topics that trigger strong reactions]
Decision pattern: [Decides fast/deliberates/defers to boss]
Last interaction: [Date, topic, outcome]

Update this file regularly — stale context is worse than
no context. The Morning Briefing and Devil's Advocate skills
also reference this file.
📄





meeting-prep/output-template.md
TEMPLATE
▼
# Meeting Prep Brief — [Meeting Name]
Date: [Date] | Time: [Time] | Duration: [Est.]

## Executive Summary
[3 sentences max: purpose, key dynamics, your primary objective]

## Attendee Cards

| Name | Role | Stance on Key Topics | Watch For |
|------|------|---------------------|-----------|
| [Name] | [Title] | [Their known position] | [Risk/opportunity] |

## Agenda Analysis

| Topic | Who Cares Most | Potential Tension | Your Talking Point |
|-------|---------------|-------------------|-------------------|
| [Topic] | [Name] | [Conflict risk] | [Your prepared point] |

## Risk Scenarios

| Scenario | Likelihood | Your Response |
|----------|-----------|---------------|
| [From scenarios.md] | [H/M/L] | [1-2 sentence response] |

## Questions to Ask
1. [Question that surfaces hidden information]
2. [Question that tests a key assumption]
3. [Question nobody else will ask]

## Open Items
- [Pending decisions or action items involving these attendees]
💡






meeting-prep/examples.md
EXAMPLES
▼
# Meeting Prep Examples — Good vs. Mediocre

## Mediocre Prep (what most people do)

Attendees: Sarah (VP Ops), Mike (Dir Eng), Lisa (PM)
Agenda: Q2 planning
Notes: Discuss priorities for next quarter.

^ No context on dynamics. No scenario prep.
  No specific talking points. Generic output.

## Great Prep (what this skill produces)

Executive Summary: Q2 planning with Sarah, Mike, and Lisa.
Key dynamic: Sarah wants to expand the platform team; Mike
wants to consolidate. Lisa is caught between — her roadmap
depends on the outcome. Your objective: align on staffing
before the budget discussion next Friday.

Attendee Cards:
- Sarah (VP Ops): Pushing for platform expansion since
  January. Cites customer churn data. WATCH: may try to
  reframe Mike's consolidation as "cutting corners."
- Mike (Dir Eng): Sent a detailed consolidation proposal
  last Tuesday (see email thread 3/14). Data-driven,
  won't respond to emotional arguments. WATCH: may
  shut down if he feels outnumbered.
- Lisa (PM): Her Q2 roadmap draft (shared 3/12) assumes
  current team size. If staffing changes, her timeline
  breaks. WATCH: may stay quiet to avoid picking sides.

Risk Scenario: Decision Reversal (MEDIUM likelihood)
Sarah wasn't in the March 8 meeting where Mike's proposal
was tentatively approved. She may reopen it.
Your response: "We discussed this on March 8 — here's the
decision log. Happy to review offline if there are new
concerns."

^ Notice the difference: specific dynamics, named tensions,
  prepared responses, evidence-based attendee cards.
📅
meeting-prep/scenarios.md
REFERENCE
▼
# Meeting Scenarios — What Can Go Off the Rails

Use this file to anticipate and prepare for common meeting
derailment patterns. For each scenario, the skill should:
1. Assess likelihood given the attendees and agenda
2. Prepare a 1-2 sentence response strategy

## Scenario: Hostile Stakeholder
Signs: history of pushback, known opposing position
Risk: derails agenda, creates adversarial dynamic
Prep: acknowledge their concern upfront, have data ready,
propose offline follow-up if discussion exceeds 5 min

## Scenario: Scope Creep Ambush
Signs: attendee with adjacent project, "while we're here..."
Risk: meeting loses focus, decisions get deferred
Prep: "Great point — let's capture that for a separate
session. For today, let's focus on [agenda item]."

## Scenario: Decision Reversal
Signs: senior attendee who wasn't in prior meetings
Risk: previously agreed decisions get reopened
Prep: have the decision log ready, reference who agreed
and when, propose "let's discuss offline if concerns remain"

## Scenario: "Let's Take This Offline"
Signs: complex topic, insufficient data, discomfort
Risk: important decisions get indefinitely deferred
Prep: propose specific follow-up: who, when, what outcome

## Scenario: Surprise Attendee
Signs: last-minute addition, unclear agenda relationship
Risk: hidden agenda, context mismatch, power dynamic shift
Prep: acknowledge their presence, ask for their perspective
early, adjust talking points based on their likely priorities
💡




meeting-prep/skills/meeting-sim/SKILL.md
NESTED SKILL
▼
---
name: simulating-meeting
description: >
  Use when the user says "simulate the meeting", "rehearse
  my talking points", "role-play the meeting", "play devil's
  advocate as [attendee]", or "what will [person] say about
  this". Triggers after meeting prep is complete. Role-plays
  each attendee based on their known positions, challenges
  the user's talking points from each perspective.
---

# Meeting Simulation

## Steps

1. Read the meeting prep brief for attendee profiles
2. Read stakeholder-context.md for relationship dynamics
3. For each attendee, adopt their known position and style:
   - What would they push back on?
   - What would they champion?
   - What questions would they ask?
4. Simulate the meeting flow:
   - Present each agenda item
   - Voice each attendee's likely response
   - Challenge the user's talking points from each perspective
5. After simulation, provide:
   - Talking points that held up well
   - Talking points that need strengthening
   - Questions you weren't prepared for

## Gotcha Section

- Don't make all attendees agree — tension is the point
- Stay in character for each attendee, including their biases
- If you don't have enough context on an attendee to simulate
  them, say so rather than inventing a generic persona
- The value is in surfacing UNEXPECTED pushback, not
  confirming what the user already expects
