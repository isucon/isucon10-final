PREFIX=.
BINDIR=$(PREFIX)/bin
WEBEXE=$(BINDIR)/webapp
BENCHEXE=$(BINDIR)/benchmark_server

COMPILER=go
GOFLAGS=

GOFILES=$(wildcard ./*.go ./**/*.go)

.PHONY: build
build: $(WEBEXE) $(BENCHEXE)

$(WEBEXE): $(GOFILES) go.mod go.sum
	$(COMPILER) $(GOFLAGS) build -o $(WEBEXE) ./webapp

$(BENCHEXE): $(GOFILES) go.mod go.sum
	$(COMPILER) $(GOFLAGS) build -o $(BENCHEXE) ./benchmark_server

.PHONY: clean
clean:
	@$(RM) $(WEBEXE) $(BENCHEXE)

.PHONY: help
help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
