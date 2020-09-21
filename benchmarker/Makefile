GOTIMEOUT?=20s
GOARGS?=-race
GOMAXPROCS?=$(shell nproc)
GOPRIVATE="github.com/isucon"

GOFILES=$(shell find . -name *.go)
PROTOFILES=$(shell find ../proto -name *.proto)
GOPROTOFILES=$(addprefix proto/,$(PROTOFILES:%.proto=%.pb.go))

EXE=../bin/benchmarker

.PHONY: all
all: setup build ## Execute all tasks

.PHONY: setup
setup: go.sum ## Setup dependency modules

.PHONY: build
build: $(EXE) ## Build benchmarker

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
	@$(RM) $(EXE) $(GOPROTOFILES)
	@go clean

.PHONY: help
help: ## Display this help screen
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

$(EXE): Makefile go.mod $(GOFILES) $(GOPROTOFILES)
	GOPRIVATE=$(GOPRIVATE) go build -race -o $(EXE) -v github.com/isucon/isucon10-final/benchmarker

$(GOPROTOFILES): Makefile $(PROTOFILES)
	echo $(GOPROTOFILES)
	@protoc --go_out=plugins=grpc:./proto --go_opt=paths=source_relative -I ../proto $(PROTOFILES)
	@find ./proto -name '*.go' | xargs sed -i '' -e 's|webapp/golang|benchmarker|g'
