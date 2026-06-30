#!/usr/bin/env node

import { basename, dirname, join, resolve, sep } from "node:path";
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { homedir } from "node:os";
import { fileURLToPath } from "node:url";

const ASSISTANTS = [
  { name: "claude", skillsDir: join(homedir(), ".claude", "skills") },
  { name: "codex", skillsDir: join(homedir(), ".codex", "skills") },
  { name: "cursor", skillsDir: join(homedir(), ".cursor", "skills") },
  { name: "gemini", skillsDir: join(homedir(), ".gemini", "skills") },
];

// Entire repo is mirrored into Google Drive as a single "skills" folder.
// Override the account with SKILLS_GDRIVE_ACCOUNT, or the full base path with SKILLS_GDRIVE_DIR.
const GDRIVE_ACCOUNT = process.env.SKILLS_GDRIVE_ACCOUNT || "rafal.kuklinski@soundcloud.com";
const gdriveBaseDir =
  process.env.SKILLS_GDRIVE_DIR ||
  join(homedir(), "Library", "CloudStorage", `GoogleDrive-${GDRIVE_ACCOUNT}`, "My Drive");
// Files/folders never copied into the Google Drive mirror.
const GDRIVE_EXCLUDES = new Set([".git", "node_modules", ".DS_Store"]);

const scriptDir = dirname(fileURLToPath(import.meta.url));
const sourceDir = resolve(scriptDir, "..");
const syncSkillsSkillsDir = join(homedir(), ".sync-skills", "skills");
const gdriveTargetDir = join(gdriveBaseDir, "skills");

const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run");
const commonOnly = args.has("--common-only");
const noGdrive = args.has("--no-gdrive");

if (args.has("--help") || args.has("-h")) {
  printUsage();
  process.exit(0);
}

for (const arg of args) {
  if (!["--dry-run", "--common-only", "--no-gdrive", "--help", "-h"].includes(arg)) {
    fail(`Unknown option: ${arg}\n\n${usageText()}`);
  }
}

main();

function main() {
  const skillDirs = getSkillDirs();

  if (skillDirs.length === 0) {
    fail(`No skill directories with SKILL.md found in ${sourceDir}`);
  }

  log(`Source: ${sourceDir}`);
  log(`Common skills target: ${syncSkillsSkillsDir}`);
  log(`Assistants: ${ASSISTANTS.map(({ name }) => name).join(", ")}`);
  log(`Google Drive target: ${gdriveTargetDir}`);
  log(`Skills: ${skillDirs.map(({ name }) => name).join(", ")}`);

  copySkills(skillDirs, syncSkillsSkillsDir, "common");
  deployAssistantSkills(skillDirs);
  deployToGoogleDrive();

  log(dryRun ? "Dry run completed successfully." : "Deployment completed successfully.");
}

function getSkillDirs() {
  return readdirSync(sourceDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => ({
      name: entry.name,
      source: join(sourceDir, entry.name),
      target: join(syncSkillsSkillsDir, entry.name),
    }))
    .filter(({ source }) => existsSync(join(source, "SKILL.md")))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function copySkills(skillDirs, targetRoot, label) {
  if (dryRun) {
    for (const { name } of skillDirs) {
      log(`Dry run: would copy ${name} to ${join(targetRoot, name)} (${label})`);
    }
    return;
  }

  mkdirSync(targetRoot, { recursive: true });

  for (const { name, source } of skillDirs) {
    const target = join(targetRoot, name);
    rmSync(target, { recursive: true, force: true });
    cpSync(source, target, { recursive: true });
    log(`Copied ${name} to ${label}`);
  }
}

function deployAssistantSkills(skillDirs) {
  if (commonOnly) {
    log("Common-only mode: skipping assistant skill directories.");
    return;
  }

  for (const { name, skillsDir } of ASSISTANTS) {
    copySkills(skillDirs, skillsDir, name);
  }
}

// Mirror the entire repo (minus GDRIVE_EXCLUDES) into <Google Drive>/My Drive/skills.
function deployToGoogleDrive() {
  if (noGdrive) {
    log("Skipping Google Drive copy (--no-gdrive).");
    return;
  }

  if (commonOnly) {
    log("Common-only mode: skipping Google Drive copy.");
    return;
  }

  if (!existsSync(gdriveBaseDir)) {
    log(`Google Drive folder not found at ${gdriveBaseDir}; skipping Google Drive copy.`);
    return;
  }

  if (dryRun) {
    log(`Dry run: would copy entire skills folder to ${gdriveTargetDir}`);
    return;
  }

  rmSync(gdriveTargetDir, { recursive: true, force: true });
  cpSync(sourceDir, gdriveTargetDir, { recursive: true, filter: gdriveFilter });
  log(`Copied entire skills folder to Google Drive (${gdriveTargetDir})`);
}

function gdriveFilter(src) {
  const relative = src.slice(sourceDir.length).split(sep).filter(Boolean);
  return !relative.some((segment) => GDRIVE_EXCLUDES.has(segment));
}

function log(message) {
  console.log(`[deploy-skills] ${message}`);
}

function fail(message) {
  console.error(`[deploy-skills] ${message}`);
  process.exit(1);
}

function printUsage() {
  console.log(usageText());
}

function usageText() {
  return `Usage: node scripts/deploy-skills.mjs [options]

Options:
  --dry-run      Show what would happen without writing files.
  --common-only  Copy only to ~/.sync-skills/skills (skips assistant folders and Google Drive).
  --no-gdrive    Skip copying the repo to Google Drive.
  -h, --help     Show this help message.

Environment:
  SKILLS_GDRIVE_ACCOUNT  Google account whose Drive to use (default: ${GDRIVE_ACCOUNT}).
  SKILLS_GDRIVE_DIR      Full path to the Drive root to copy into (overrides the account-based path).
                         The repo is copied to <dir>/skills.`;
}
