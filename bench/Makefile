GOFILES=$(shell find . -name *.go)

.PHONY: all
all: setup build ## Execute all tasks

.PHONY: setup
setup: go.mod ## Setup dependency modules
	go mod download

.PHONY: build
build: bin/bench ## Build benchmarker

bin/bench: go.mod $(GOFILES)
	go build -o bin/bench -v

.PHONY: clean
clean: ## Cleanup working directory
	go clean
	rm -rf bin

.PHONY: help
help: ## Display this help screen
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'
