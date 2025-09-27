.SILENT:
.DEFAULT_GOAL := help

# Docker Compose configurations
COMPOSE=docker compose -f docker-compose.yml

# Containers and package manager
PAYLOAD_SERVICE=payload
EXEC=$(COMPOSE) exec $(PAYLOAD_SERVICE)


.PHONY: help
help:
	@MAKEFILES="$(MAKEFILE_LIST)" bash $(mkfile_dir)generate-makefile-help.sh

## @section Git Hooks

.PHONY: git-hooks-install
## Install git hooks from .git-hooks directory
## This sets the git hooks path to .githooks in the repository
git-hooks-install:
	git config core.hooksPath .githooks

.PHONY: git-hooks-uninstall
## Uninstall git hooks by resetting the git hooks path to default
git-hooks-uninstall:
	git config --unset core.hooksPath

## @section Docker Development

.PHONY: is-running
is-running:
	@if [ "$$(docker compose ps payload -q | wc -l)" -eq 0 ]; then \
		echo -e "No containers running. Please run \033[0;36mmake start\033[0m first"; \
		exit 1; \
	fi

.PHONY: start
## Start the development environment
## @param detach=true If defined, do not attach to the payload container terminal
start:
	$(COMPOSE) --profile dev up -d --force-recreate
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
