GOFILES=$(shell find . -name *.go)
PROTOFILES=$(shell find ./proto -name *.proto)
GOPROTOFILES=$(PROTOFILES:%.proto=%.pb.go)

.PHONY: all
all: setup build ## Execute all tasks

.PHONY: setup
setup: go.sum ## Setup dependency modules

.PHONY: build
build: bin/benchmarker ## Build benchmarker

.PHONY: clean
clean: ## Cleanup working directory
	find ./proto -name '*.pb.go' | xargs rm
	go clean
	rm -rf bin/benchmarker

.PHONY: help
help: ## Display this help screen
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

go.sum: go.mod
	go mod update

bin/benchmarker: go.mod $(GOFILES) $(GOPROTOFILES)
	go build -o bin/benchmarker -v ./benchmarker

%.pb.go: %.proto
	protoc  --go_out=plugins=grpc:./proto --go_opt=paths=source_relative -I ./proto $<
