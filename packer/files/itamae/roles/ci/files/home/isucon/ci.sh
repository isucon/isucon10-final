#!/bin/bash -xe

lang=$1

systemctl start xsuportal-web-${lang}.service
systemctl start xsuportal-api-${lang}.service

sleep 5

~isucon/bin/benchmarker -tls -target "local.t.isucon.dev:443" -host-advertise "localbench.t.isucon.dev" 2>&1 | tee ~isucon/ci.log
