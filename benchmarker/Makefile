COMMIT=$(shell cat /etc/REVISION 2>/dev/null || git rev-parse --short HEAD)
DIRTY=$(shell git diff --quiet || echo '+dirty')

GOTIMEOUT?=20s
GOARGS?=
GOMAXPROCS?=$(shell nproc)
GOPRIVATE="github.com/isucon"
GOLDFLAGS=-X main.COMMIT=$(COMMIT)$(DIRTY)

GOFILES=$(wildcard *.go **/*.go)
PROTOFILES=$(shell find ../proto -name *.proto)
GOPROTOFILES=$(addprefix proto/,$(PROTOFILES:%.proto=%.pb.go))

PUBLIC_FILES=$(wildcard ../webapp/frontend/public/*.* ../webapp/frontend/public/**/*.*)
PUBLIC_FILES_CHECKSUM=$(patsubst ../webapp/frontend/public/%,checksum/%,$(PUBLIC_FILES))

EXE=./bin/benchmarker

.PHONY: all
all: build ## Execute all tasks

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

.PHONY: vendor
vendor: $(GOPROTOFILES)
	GOPRIVATE=$(GOPRIVATE) go mod vendor

.PHONY: help
help: ## Display this help screen
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

$(EXE): Makefile go.mod $(GOFILES) $(GOPROTOFILES) $(PUBLIC_FILES_CHECKSUM)
	GOPRIVATE=$(GOPRIVATE) go build $(GOARGS) -ldflags "$(GOLDFLAGS)" -o $(EXE) -v github.com/isucon/isucon10-final/benchmarker

$(GOPROTOFILES): Makefile $(PROTOFILES)
	@protoc --go_out=./proto --go-grpc_out=./proto --go_opt=paths=source_relative --go-grpc_opt=paths=source_relative -I ../proto $(PROTOFILES)
	@find ./proto -name '*.go' | xargs sed -i.bak -e 's|webapp/golang|benchmarker|g'
	@find ./proto -name '*.go.bak' -delete

$(PUBLIC_FILES_CHECKSUM): $(PUBLIC_FILES)
	@mkdir -p $(shell dirname $@)
	@SRC=$(patsubst checksum/%,../webapp/frontend/public/%,$@) && \
		echo "$$(sha384sum "$$SRC" | cut -d' ' -f1)" > $@
