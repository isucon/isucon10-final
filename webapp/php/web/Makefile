.PHONY: help install dependencies setup run clean

SHELL := bash

help:
	@cat $(firstword $(MAKEFILE_LIST))

install: \
	dependencies \
	vendor \
	setup

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

clean:
	rm -rf vendor
	rm -f public