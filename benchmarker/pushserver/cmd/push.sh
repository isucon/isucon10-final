#!/bin/bash
export SSL_CERT_DIR=$(pwd)/certs
exec ruby push.rb "$@"
