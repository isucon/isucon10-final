.PHONY: ruby php

ruby: ruby/docker-compose.override.yml
	ln -s $< docker-compose.override.yml

php: php/docker-compose.override.yml
	ln -s $< docker-compose.override.yml

clean:
	rm docker-compose.override.yml