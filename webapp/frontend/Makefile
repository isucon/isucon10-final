.PHONY: help install dependencies build watch clean

help:
	@cat $(firstword $(MAKEFILE_LIST))

install: \
	dependencies \
	node_modules \
	build

node_modules:
	yarn install

build:
	npm run build

watch:
	npm run watch

clean:
	rm -rf node_modules
	rm -rf public/sw.js
	rm -rf public/sw.js.map
