#!/usr/bin/env node

import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ASSISTANTS = [
  { name: "claude", skillsDir: join(homedir(), ".claude", "skills") },
  { name: "codex", skillsDir: join(homedir(), ".codex", "skills") },
  { name: "cursor", skillsDir: join(homedir(), ".cursor", "skills") },
  { name: "gemini", skillsDir: join(homedir(), ".gemini", "skills") },
];

const scriptDir = dirname(fileURLToPath(import.meta.url));
const sourceDir = resolve(scriptDir, "..");
const syncSkillsSkillsDir = join(homedir(), ".sync-skills", "skills");

const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run");
const commonOnly = args.has("--common-only");

if (args.has("--help") || args.has("-h")) {
  printUsage();
  process.exit(0);
}

for (const arg of args) {
  if (!["--dry-run", "--common-only", "--help", "-h"].includes(arg)) {
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
  log(`Skills: ${skillDirs.map(({ name }) => name).join(", ")}`);

  copySkills(skillDirs, syncSkillsSkillsDir, "common");
  deployAssistantSkills(skillDirs);

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
  --common-only  Copy only to ~/.sync-skills/skills and skip assistant folders.
  -h, --help     Show this help message.`;
}
