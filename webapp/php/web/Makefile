.PHONY: help install dependencies setup public/% run clean

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

vendor:
	composer install

setup: \
	public/admin.html \
	public/audience.html \
	public/contestant.html \
	public/packs \
	public/sw.js \
	public/sw.js.map

run:
	php -S 0.0.0.0:80 -t public public/index.php

public/%: ../../frontend
	[[ -f "$@" ]] || cp -r $</$@ $@

clean:
	rm -rf vendor
	rm -rf \
		public/admin.html \
		public/audience.html \
		public/contestant.html \
		public/packs \
		public/sw.js \
		public/sw.js.map