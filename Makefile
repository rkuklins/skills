.PHONY: deploy install-sync-skills configure-sync-skills copy-skills sync-skills

SYNC_SKILLS_CONFIG_DIR := $(HOME)/.sync-skills
SYNC_SKILLS_CONFIG_FILE := $(SYNC_SKILLS_CONFIG_DIR)/config.json
SYNC_SKILLS_SKILLS_DIR := $(SYNC_SKILLS_CONFIG_DIR)/skills
SOURCE_DIR := $(CURDIR)

deploy: install-sync-skills configure-sync-skills copy-skills sync-skills

install-sync-skills:
	@command -v sync-skills >/dev/null 2>&1 || npm install -g sync-skills

configure-sync-skills:
	@mkdir -p "$(SYNC_SKILLS_CONFIG_DIR)"
	@printf '%s\n' '{' \
	'  "version": 1,' \
	'  "assistants": [' \
	'    "claude",' \
	'    "codex",' \
	'    "cursor",' \
	'    "gemini"' \
	'  ]' \
	'}' > "$(SYNC_SKILLS_CONFIG_FILE)"

copy-skills:
	@mkdir -p "$(SYNC_SKILLS_SKILLS_DIR)"
	@for skill_file in "$(SOURCE_DIR)"/*/SKILL.md; do \
		if [ -f "$$skill_file" ]; then \
			skill_dir="$$(dirname "$$skill_file")"; \
			cp -R "$$skill_dir" "$(SYNC_SKILLS_SKILLS_DIR)/"; \
		fi; \
	done

sync-skills:
	@cd "$(HOME)" && sync-skills --verbose
