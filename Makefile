.PHONY: deploy deploy-dry-run

deploy:
	node scripts/deploy-skills.mjs

deploy-dry-run:
	node scripts/deploy-skills.mjs --dry-run
