# Tech debt assessor — workspace config
#
# Copy this file to your repo/workspace root as:
#   tech-debt-config.md
# Comment lines (starting with #) are ignored. Section headers use:
#   # --- Section name ---

# --- Linear projects ---
# One Linear project title per line (must match Linear for get_project / list_issues).
# Required unless you use project-tracking.md at the workspace root instead (see below).
Platform Modernization
# Mobile Core
# API Reliability

# --- Architecture documents ---
# One path per line, relative to workspace root. Read in order; all are used.
docs/architecture.md
# ARCHITECTURE.md
# eng-doc/overview.md

# --- Repo roots to scan ---
# One path per line. If this section is empty or omitted, every subdirectory
# containing .git under the workspace root is scanned.
# api-mobile/
# ios/
# backend/

# --- Linear issue labels ---
# Issue must have one of these labels to be pulled as explicit debt (names, not IDs).
# Defaults if omitted: tech-debt, technical-debt, debt
# tech-debt
# technical-debt

# --- Linear team (optional) ---
# Scopes extra list_issues searches when set (team name or ID).
# iOS

# --- Report period (optional) ---
# Default: last 90 days through today. Use ISO dates.
# 2026-02-01 to 2026-05-26

# --- Prepared by (optional) ---
# Shown in the report header. Default: user name from context or "Agent assessment".
# Jane Doe

# --- Fallback: project-tracking.md (optional) ---
# If the Linear projects section above has no entries, the assessor reads
# project-tracking.md at the workspace root (one project title per line), same as
# weekly-brief / team-report. Prefer listing projects in this config file so each
# repo/workspace is self-contained.
