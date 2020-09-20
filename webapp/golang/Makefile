PREFIX=.
BINDIR=$(PREFIX)/bin
WEBEXE=$(BINDIR)/webapp
BENCHEXE=$(BINDIR)/benchmark_server

COMPILER=go
GOFLAGS=-v

GOFILES=$(wildcard ./*.go ./**/*.go)

.PHONY: all
all: clean build ## Cleanup and Build

.PHONY: build
build: $(WEBEXE) $(BENCHEXE) ## Build executable files

$(WEBEXE): Makefile $(GOFILES) go.mod go.sum
	@$(COMPILER) build $(GOFLAGS) -o $(WEBEXE) ./webapp

$(BENCHEXE): Makefile $(GOFILES) go.mod go.sum
	@$(COMPILER) build $(GOFLAGS) -o $(BENCHEXE) ./benchmark_server

.PHONY: run
run: build ## Build and launch webapp and benchmark server (Stop with Ctrl-C)
	@(trap 'kill 0' SIGINT; $(WEBEXE) & $(BENCHEXE))

.PHONY: clean
clean: ## Cleanup files
	@$(RM) $(WEBEXE) $(BENCHEXE)

.PHONY: help
help: ## Show help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
