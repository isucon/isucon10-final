.PHONY: help install dependencies setup run protoc clean

SHELL := bash

help:
	@cat $(firstword $(MAKEFILE_LIST))

install: \
	dependencies \
	vendor \
	setup \
	protoc

dependencies:
	type php > /dev/null
	type composer > /dev/null

setup: \
	public/admin.html \
	public/audience.html \
	public/contestant.html \
	public/packs \
	public/sw.js \
	public/sw.js.map

run:
	php-fpm

vendor:
	composer install

public: ../../frontend/public
	ln -s $< $@

protoc: \
	src/Protobuf

src/Protobuf: ../../../proto
	mkdir -p $@
	find $< -name '*.proto' | xargs -I@ protoc -I $< --php_out=./src/Protobuf @

clean:
	rm -rf vendor
	rm -f public
	rm -rf src/Protobuf