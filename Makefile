GOTIMEOUT?=20s
GOARGS?=-race
GOMAXPROCS?=$(shell nproc)
GOPRIVATE="github.com/isucon"

GOFILES=$(shell find . -name *.go)
PROTOFILES=$(shell find proto -name *.proto)
GOPROTOFILES=$(addprefix benchmarker/,$(PROTOFILES:%.proto=%.pb.go))

.PHONY: all
all: setup build ## Execute all tasks

.PHONY: setup
setup: go.sum ## Setup dependency modules

.PHONY: build
build: bin/benchmarker ## Build benchmarker

.PHONY: test
test:
	@mkdir -p tmp
	@echo "mode: atomic" > tmp/cover.out
	@for d in $(shell go list ./... | grep -v vendor | grep -v proto); do \
		GOPRIVATE=$(GOPRIVATE) GOMAXPROCS=$(GOMAXPROCS) \
			go test \
			$(GOARGS) \
			-timeout $(GOTIMEOUT) \
			-coverprofile=tmp/pkg.out -covermode=atomic \
			"$$d" || exit 1; \
		tail -n +2 tmp/pkg.out >> tmp/cover.out && \
		rm tmp/pkg.out; \
	done
	@go tool cover -html=tmp/cover.out -o tmp/coverage.html

.PHONY: clean
clean: ## Cleanup working directory
	$(RM) bin/benchmarker $(GOPROTOFILES)
	go clean

.PHONY: help
help: ## Display this help screen
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

go.sum: go.mod
	GOPRIVATE=$(GOPRIVATE) go mod download

bin/benchmarker: go.mod $(GOFILES) $(GOPROTOFILES)
	GOPRIVATE=$(GOPRIVATE) go build -race -o bin/benchmarker -v ./benchmarker

$(GOPROTOFILES): $(PROTOFILES)
	protoc  --go_out=plugins=grpc:./benchmarker/proto --go_opt=paths=source_relative -I ./proto $(PROTOFILES)
