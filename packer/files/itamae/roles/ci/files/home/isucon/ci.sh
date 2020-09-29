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

sudo systemd-run \
  --working-directory=/home/isucon/benchmarker \
  --pipe \
  --wait \
  --collect \
  --uid=$(id -u)\
  --gid=$(id -g) \
  --slice=benchmarker.slice \
  --service-type=oneshot \
  -p AmbientCapabilities=CAP_NET_BIND_SERVICE \
  -p CapabilityBoundingSet=CAP_NET_BIND_SERVICE \
  -p LimitNOFILE=2000000 \
  -p TimeoutStartSec=110s \
    ~isucon/benchmarker/bin/benchmarker \
    -exit-status \
    -tls \
    -target local.t.isucon.dev:443 \
    -host-advertise localbench.t.isucon.dev \
    -push-service-port 11001 \
    -tls-cert /etc/ssl/private/tls-cert.pem \
    -tls-key /etc/ssl/private/tls-key.pem \
   > ~isucon/ci.log  2>&1
