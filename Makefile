.PHONY: help deploy deploy-dry-run deploy-common-only list-skills

# Top-level folders under this repo that contain SKILL.md (same rule as scripts/deploy-skills.mjs)
list-skills:
	@for d in */; do \
		if [ -f "$${d}SKILL.md" ]; then printf '%s\n' "$${d%/}"; fi; \
	done | sort

help:
	@echo "Skills repo — available targets:"
	@echo ""
	@echo "  make list-skills          List skill folders deployed by deploy-skills.mjs"
	@echo "  make deploy               Copy all skills to ~/.sync-skills/skills and assistant dirs"
	@echo "  make deploy-dry-run       Preview deploy without writing files"
	@echo "  make deploy-common-only   Copy only to ~/.sync-skills/skills"
	@echo ""
	@echo "npm equivalents: npm run deploy | npm run deploy:dry-run"
	@echo "See README.md for skill descriptions and workspace inputs."

deploy:
	node scripts/deploy-skills.mjs

deploy-dry-run:
	node scripts/deploy-skills.mjs --dry-run

deploy-common-only:
	node scripts/deploy-skills.mjs --common-only
