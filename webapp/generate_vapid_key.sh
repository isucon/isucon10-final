#!/bin/sh -e
DST_PATH="$(cd $(dirname $0); pwd)/vapid_private.pem"
if [ -f $DST_PATH ]; then
  echo "${DST_PATH} already exists"
  exit 1
fi
openssl ecparam -name prime256v1 -genkey -noout -out $DST_PATH
echo "Created: ${DST_PATH}"

