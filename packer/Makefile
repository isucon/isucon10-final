default: generate

files-generated:  files-generated/REVISION files-generated/archive.tar
	mkdir -p files-cached/

files-generated/REVISION: 
	mkdir -p files-generated/
	if [ -n "$(GITHUB_SHA)" ]; then echo "$(GITHUB_SHA)" > files-generated/REVISION; fi
	if [ ! -e files-generated/REVISION ]; then git rev-parse HEAD > files-generated/REVISION; fi
	test -e files-generated/REVISION

files-generated/archive.tar: files-generated/REVISION
	mkdir -p files-generated/
	git -C "$(shell git rev-parse --show-toplevel)" archive "$(shell cat files-generated/REVISION)" > files-generated/archive.tar


generate: target/contestant.json target/benchmarker.json target/full.json

target/contestant.json: files-generated *.libsonnet contestant.jsonnet
	mkdir -p target/
	jsonnet --jpath . contestant.jsonnet > target/contestant.json
	packer validate target/contestant.json

target/benchmarker.json: files-generated *.libsonnet benchmarker.jsonnet
	mkdir -p target/
	jsonnet --jpath . benchmarker.jsonnet > target/benchmarker.json
	packer validate target/benchmarker.json

target/full.json: files-generated *.libsonnet full.jsonnet
	mkdir -p target/
	jsonnet --jpath . full.jsonnet > target/full.json
	packer validate target/full.json

build: build-contestant build-benchmarker

build-contestant: files-generated target/contestant.json
	packer build -var "revision=$(shell cat files-generated/REVISION)" target/contestant.json
build-benchmarker: files-generated target/benchmarker.json
	packer build -var "revision=$(shell cat files-generated/REVISION)" target/benchmarker.json
build-full: files-generated target/full.json
	packer build -var "revision=$(shell cat files-generated/REVISION)" -var "full_source_img=$(shell jq -r '"output/" + .name + "/" + .name' < output/manifest-amd64-contestant.json)" -var  "full_source_checksum=$(shell jq -r '.qcow2_sha256' < output/manifest-amd64-contestant.json)" target/full.json

clean:
	rm -rf files-generated/
	rm -rf files-cached/
	rm -rf target/

clean-output:
	rm -rf output/

upload:
	if [ -e output/manifest-amd64-contestant.json ]; then ruby scripts/upload.rb output/manifest-amd64-contestant.json; fi
	if [ -e output/manifest-amd64-benchmarker.json ]; then ruby scripts/upload.rb output/manifest-amd64-benchmarker.json; fi

upload-full:
	if [ -e output/manifest-amd64-full.json ]; then ruby scripts/upload.rb output/manifest-amd64-full.json; fi

prune:
	if [ -e output/manifest-amd64-contestant.json ]; then ruby scripts/prune.rb output/manifest-amd64-contestant.json; fi
	if [ -e output/manifest-amd64-benchmarker.json ]; then ruby scripts/prune.rb output/manifest-amd64-benchmarker.json; fi
	if [ -e output/manifest-amd64-full.json ]; then ruby scripts/prune.rb output/manifest-amd64-full.json; fi

cache:
	mkdir -p files-cached/
	if [ -e output/cache-amd64-contestant-qemu/files-cached/local.tar.gz ]; then mv output/cache-amd64-contestant-qemu/files-cached/local.tar.gz files-cached/local.tar.gz; fi
