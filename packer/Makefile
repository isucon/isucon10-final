PACKER_QEMU_MEM ?= 4096M
PACKER_QEMU_SMP ?= 4
export PACKER_QEMU_MEM
export PACKER_QEMU_SMP

default: generate

files-generated:  files-generated/REVISION files-generated/archive.tar files-generated/isuxportal-supervisor files-generated/benchmarker-vendor.tar files/tls-cert.pem files/tls-key.pem
	mkdir -p files-cached/

files/tls-cert.pem:
	cp ../secrets/cert.pem files/tls-cert.pem

files/tls-key.pem:
	cp ../secrets/key.pem files/tls-key.pem

files-generated/REVISION: 
	mkdir -p files-generated/
	if [ -n "$(GITHUB_SHA)" ]; then echo "$(GITHUB_SHA)" > files-generated/REVISION; fi
	if [ ! -e files-generated/REVISION ]; then git rev-parse HEAD > files-generated/REVISION; fi
	test -e files-generated/REVISION

files-generated/archive.tar: files-generated/REVISION
	mkdir -p files-generated/
	git -C "$(shell git rev-parse --show-toplevel)" archive "$(shell cat files-generated/REVISION)" > files-generated/archive.tar

files-generated/benchmarker-vendor.tar: files-generated/REVISION
	( cd ../benchmarker && make vendor )
	tar cf files-generated/benchmarker-vendor.tar -C ../benchmarker vendor

files-generated/isuxportal-supervisor: 
	mkdir -p files-generated/
	touch files-generated/isuxportal-supervisor
	#aws s3 cp s3://isucon10-machine-images/supervisor/isuxportal-supervisor-ubuntu2004-amd64 files-generated/isuxportal-supervisor

generate: target/contestant.json target/benchmarker.json target/full.json target/ci.json

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

target/ci.json: files-generated *.libsonnet ci.jsonnet
	mkdir -p target/
	jsonnet --jpath . ci.jsonnet > target/ci.json
	packer validate target/ci.json

target/ci-run.json: *.libsonnet ci-run.jsonnet
	mkdir -p target/
	jsonnet --jpath . ci-run.jsonnet > target/ci-run.json
	packer validate target/ci-run.json


build: build-contestant build-benchmarker

build-contestant: files-generated target/contestant.json
	packer build -var "revision=$(shell cat files-generated/REVISION)" target/contestant.json
build-benchmarker: files-generated target/benchmarker.json
	packer build -var "revision=$(shell cat files-generated/REVISION)" target/benchmarker.json
build-full: files-generated target/full.json
	packer build -var "revision=$(shell cat files-generated/REVISION)" -var "full_source_img=$(shell jq -r '"output/" + .name + "/" + .name' < output/manifest-amd64-contestant.json)" -var  "full_source_checksum=$(shell jq -r '.qcow2_sha256' < output/manifest-amd64-contestant.json)" target/full.json

build-full-ec2: files-generated target/full.json
	packer build -var "revision=$(shell cat files-generated/REVISION)" -only amazon-ebs target/full.json

build-full-qemu: files-generated target/full.json
	packer build -var "revision=$(shell cat files-generated/REVISION)" -only qemu target/full.json



CI_LATEST_LAST_PATH ?= tmp/ci-latest-last.json
PACKER_CACHE_DIR ?= packer_cache/
.PHONY: tmp/ci-latest.json
tmp/ci-latest.json:
	mkdir -p tmp/
	ruby scripts/latest.rb --presign isucon10f-amd64-contestant > tmp/ci-latest.json
	if [ -e $(CI_LATEST_LAST_PATH) -a "_$$(jq -r .sum < tmp/ci-latest.json)" != "_$$(jq -r .sum < ${CI_LATEST_LAST_PATH})" ]; then rm -fv $(PACKER_CACHE_DIR)/$$(jq -r .sum < ~/tmp/ci-latest-last.json).iso; fi
	sum="$$(jq -r .sum < tmp/ci-latest.json)"; if [ -n "$(CI_PACKER_CACHE_HOST)" -a ! -e "$(PACKER_CACHE_DIR)/$${sum}.iso" ]; \
			then ( curl -fo "$(PACKER_CACHE_DIR)/$${sum}.iso.new" "http://$(CI_PACKER_CACHE_HOST)/packer_cache/$${sum}.iso" \
			&& mv "$(PACKER_CACHE_DIR)/$${sum}.iso.new" "$(PACKER_CACHE_DIR)/$${sum}.iso" ) || true ; \
		fi
	cp tmp/ci-latest.json $(CI_LATEST_LAST_PATH)

build-ci: files-generated target/ci.json tmp/ci-latest.json
	mkdir -p output/ tmp/ ~/tmp

	packer build -var "revision=$(CI_REVISION_PREFIX)$(shell cat files-generated/REVISION)" -var "full_source_img=$(shell jq -r .url < tmp/ci-latest.json)" -var "full_source_checksum=$(shell jq -r .sum < tmp/ci-latest.json)" $(CI_PACKER_ARGS) target/ci.json


CI_IMAGE_LAST_PATH ?= tmp/ci-image-last.txt
.PHONY: test-ci
test-ci: files-generated/REVISION target/ci-run.json
	mkdir -p tmp/ output/
	test -e output/manifest-amd64-ci.json
	#if [ -e $(CI_IMAGE_LAST_PATH) -a "_$$(jq -r .qcow2_sha256 < output/manifest-amd64-ci.json )" != "_$$(cat $(CI_IMAGE_LAST_PATH))" ]; then rm -fv $(PACKER_CACHE_DIR)/$$(jq -r .qcow2_sha256 < output/manifest-amd64-ci.json ).iso; fi
	#sum="$$(jq -r .qcow2_sha256 < output/manifest-amd64-ci.json )"; if [ -n "$(CI_PACKER_CACHE_HOST)" -a ! -e "$(PACKER_CACHE_DIR)/$${sum}.iso" ]; \
	#		then ( curl -fo "$(PACKER_CACHE_DIR)/$${sum}.iso.new" "http://$(CI_PACKER_CACHE_HOST)/packer_cache/$${sum}.iso" \
	#		&& mv "$(PACKER_CACHE_DIR)/$${sum}.iso.new" "$(PACKER_CACHE_DIR)/$${sum}.iso" ) || true ; \
	#	fi; \
	#	echo "$${sum}" > $(CI_IMAGE_LAST_PATH)

	sum="$$(jq -r .qcow2_sha256 < output/manifest-amd64-ci.json )"; packer build -only qemu -var "revision=$(CI_REVISION_PREFIX)$(shell cat files-generated/REVISION)" -var "source_img=$$(aws s3 presign s3://isucon10-machine-images/$$(jq -r .qcow2_key < output/manifest-amd64-ci.json))" -var "source_checksum=$${sum}" -var "lang=$(CI_LANG)" target/ci-run.json


clean:
	rm -rf files-generated/
	rm -rf target/
	rm -rf tmp/

clean-cache:
	rm -rf files-cached/

clean-output:
	rm -rf output/

upload:
	if [ -e output/manifest-amd64-contestant.json ]; then ruby scripts/upload.rb output/manifest-amd64-contestant.json; fi
	if [ -e output/manifest-amd64-benchmarker.json ]; then ruby scripts/upload.rb output/manifest-amd64-benchmarker.json; fi

upload-full:
	if [ -e output/manifest-amd64-full.json ]; then ruby scripts/upload.rb output/manifest-amd64-full.json; fi

cache-contestant-local:
	true
	#cp ./output/$$(jq -r .name < output/manifest-amd64-contestant.json)/$$(jq -r .name < output/manifest-amd64-contestant.json) $(PACKER_CACHE_DIR)/$$(jq -r .qcow2_sha256 < output/manifest-amd64-contestant.json).iso
	#if [ -e ~/contestant-last-sha.txt ]; then rm -fv $(PACKER_CACHE_DIR)/$$(cat ~/contestant-last-sha.txt).iso; fi
	#echo $$(jq -r .qcow2_sha256 < output/manifest-amd64-contestant.json) > ~/contestant-last-sha.txt

upload-ci:
	if [ -e output/manifest-amd64-ci.json ]; then ruby scripts/upload.rb output/manifest-amd64-ci.json; fi
	#if [ -e output/manifest-amd64-ci.json -a -n "$(CI_PACKER_CACHE_HOST)" ]; \
	#	then scp ./output/$$(jq -r .name < output/manifest-amd64-ci.json)/$$(jq -r .name < output/manifest-amd64-ci.json) $(CI_PACKER_CACHE_HOST):packer_cache/$$(jq -r .qcow2_sha256 < output/manifest-amd64-ci.json).iso \
	#	&& ( echo $$(jq -r .qcow2_sha256 < output/manifest-amd64-ci.json) | ssh $(CI_PACKER_CACHE_HOST) 'tee -a ~/ci-images.txt') \
	#	&& ssh $(CI_PACKER_CACHE_HOST) 'cat ~/ci-images.txt | head -n -1 | xargs -I XXX rm -f packer_cache/XXX.iso' \
	#	; fi


prune:
	if [ -e output/manifest-amd64-contestant.json ]; then ruby scripts/prune.rb output/manifest-amd64-contestant.json; fi
	if [ -e output/manifest-amd64-benchmarker.json ]; then ruby scripts/prune.rb output/manifest-amd64-benchmarker.json; fi
	if [ -e output/manifest-amd64-full.json ]; then ruby scripts/prune.rb output/manifest-amd64-full.json; fi
	if [ -e output/manifest-amd64-ci.json ]; then ruby scripts/prune.rb output/manifest-amd64-ci.json; fi

cache:
	mkdir -p files-cached/
	if [ -e output/cache-amd64-contestant-qemu/files-cached/local.tar.gz ]; then mv output/cache-amd64-contestant-qemu/files-cached/local.tar.gz files-cached/local.tar.gz; fi

cache-ci:
	mkdir -p files-cached/
	if [ -e output/cache-amd64-ci-amazon-ebs/files-cached/local.tar.gz ]; then mv output/cache-amd64-ci-amazon-ebs/files-cached/local.tar.gz files-cached/local.tar.gz; fi
