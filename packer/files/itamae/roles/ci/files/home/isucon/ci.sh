#!/bin/bash -xe

lang=$1

if [ -e /home/isucon/builderror-$lang ]; then
  echo "build is failing..."
  cat /home/isucon/build.$lang.log || :
  exit 1
fi

sudo systemctl start xsuportal-web-${lang}.service
sudo systemctl start xsuportal-api-${lang}.service

sleep 5

~isucon/bin/benchmarker -tls -target "local.t.isucon.dev:443" -host-advertise "localbench.t.isucon.dev" 2>&1 | tee ~isucon/ci.log
