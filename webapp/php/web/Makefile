.PHONY: help install dependencies clean

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

public/%: ../../frontend
	ln -s $</$@ $@

clean:
	rm rf vendor