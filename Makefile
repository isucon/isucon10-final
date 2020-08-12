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
test: go.mod $(GOPROTOFILES) $(GOFILES)
	go test -count=1 -v github.com/isucon/isucon10-final/benchmarker/story

.PHONY: clean
clean: ## Cleanup working directory
	find ./proto -name '*.pb.go' | xargs rm
	go clean
	rm -rf bin/benchmarker

.PHONY: help
help: ## Display this help screen
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

go.sum: go.mod
	go mod download

bin/benchmarker: go.mod $(GOFILES) $(GOPROTOFILES)
	go build -o bin/benchmarker -v ./benchmarker

$(GOPROTOFILES): $(PROTOFILES)
	protoc  --go_out=plugins=grpc:./benchmarker/proto --go_opt=paths=source_relative -I ./proto $(PROTOFILES)
