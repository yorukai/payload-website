.SILENT:
.DEFAULT_GOAL := help

PROGRESS_COLOR="$$(tput setaf 7)"
WARNING_COLOR="$$(tput setaf 3)"
SUCCESS_COLOR="$$(tput setaf 2)"
TARGET_COLOR="$$(tput setaf 2)"
CLEAR_STYLE="$$(tput sgr0)"

PROGRESS_ICON="$(PROGRESS_COLOR)○$(CLEAR_STYLE)"
WARNING_ICON="$(WARNING_COLOR)⚠$(CLEAR_STYLE)"
SUCCESS_ICON="$(SUCCESS_COLOR)✓$(CLEAR_STYLE)"

# Docker Compose configurations
COMPOSE=docker compose -f docker-compose.yml

# Containers and package manager
PAYLOAD_SERVICE=payload
EXEC=$(COMPOSE) exec $(PAYLOAD_SERVICE)


.PHONY: help
help:
	@MAKEFILES="$(MAKEFILE_LIST)" bash ./generate-makefile-help.sh

## @section Project Setup

.PHONY: init
## Initialize the project
## This sets up git hooks and initializes the environment file
init: git-hooks-install init-env

.PHONY: git-hooks-install
# Install git hooks from .git-hooks directory
# This sets the git hooks path to .githooks in the repository
git-hooks-install:
	echo " $(PROGRESS_ICON) Installing git hooks..."
	git config core.hooksPath .githooks
	echo -e "\e[1A $(SUCCESS_ICON) "

.PHONY: init-env
# Initialize the environment file from the example and generate random secrets
init-env:
	echo " $(PROGRESS_ICON) Initializing environment..."
	if [ -f .env ]; then \
		echo -e "\e[1A $(WARNING_ICON) " && \
		echo -e "   $(WARNING_COLOR)Warning$(CLEAR_STYLE): .env file already exists. Skipping initialization."; \
	else \
		cp .env.example .env && \
		payload_secret=$$(openssl rand -base64 32 | tr -dc 'a-zA-Z0-9' | head -c 32) && \
		cron_secret=$$(openssl rand -base64 32 | tr -dc 'a-zA-Z0-9' | head -c 32) && \
		preview_secret=$$(openssl rand -base64 32 | tr -dc 'a-zA-Z0-9' | head -c 32) && \
		sed -i.bak "s|PAYLOAD_SECRET=YOUR_SECRET_HERE|PAYLOAD_SECRET=$$payload_secret|" .env && \
		sed -i.bak "s|CRON_SECRET=YOUR_CRON_SECRET_HERE|CRON_SECRET=$$cron_secret|" .env && \
		sed -i.bak "s|PREVIEW_SECRET=YOUR_SECRET_HERE|PREVIEW_SECRET=$$preview_secret|" .env && \
		rm -f .env.bak && \
		echo -e "\e[1A $(SUCCESS_ICON) "; \
	fi

## @section Docker Development

.PHONY: is-running
is-running:
	if [ "$$(docker compose ps payload -q | wc -l)" -eq 0 ]; then \
		echo -e "No containers running. Please run $(TARGET_COLOR)make start$(CLEAR_STYLE) first"; \
		exit 1; \
	fi

.PHONY: start
## Start the development environment
## @param detach=true If defined, do not attach to the payload container terminal
start:
	$(COMPOSE) up -d --force-recreate
ifndef detach
	$(COMPOSE) attach $(PAYLOAD_SERVICE)
endif

.PHONY: stop
## Stop the development environment
stop:
	$(COMPOSE) down

.PHONY: exec
## Open a shell in the payload container
exec: is-running
	$(COMPOSE) exec -it $(PAYLOAD_SERVICE) bash

.PHONY: build
## Build the Project in Production Mode
build:
	APP_ENV=prod $(COMPOSE) up -d --force-recreate
ifndef detach
	APP_ENV=prod $(COMPOSE) attach $(PAYLOAD_SERVICE)
endif

## @section Node.js and PNPM

.PHONY: reinstall-deps
## Reinstall Node.js dependencies
reinstall-deps: is-running
	$(EXEC) pnpm run reinstall

.PHONY: update-deps
## Update Node.js dependencies
update-deps: is-running
	$(EXEC) pnpm run ncu

## @section Payload

.PHONY: migrate-create
## Create a new migration
## @param name=<migration_name> The name of the migration
migrate-create: is-running
ifndef name
	$(error name is undefined. Usage: make migrate-create name=<migration_name>)
endif
	$(EXEC) pnpm run payload migrate:create $$name

.PHONY: generate-importmap
## Generate import map
generate-importmap: is-running
	$(EXEC) pnpm run payload generate:importmap

.PHONY: generate-types
## Generate types
generate-types: is-running
	$(EXEC) pnpm run payload generate:types

## @section Code Quality

.PHONY: lint
## Run linting
lint:
	$(EXEC) pnpm run lint

.PHONY: lint-fix
## Run linting and fix issues
lint-fix:
	$(EXEC) pnpm run lint:fix

.PHONY: format
## Run code formatting
format:
	$(EXEC) pnpm run format
