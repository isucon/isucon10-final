#!/bin/bash -e
cd $(dirname $0)

bundle install

openssl ecparam -name prime256v1 -genkey -out vapid_private.pem
ruby -ropenssl -e "puts [OpenSSL::PKey::EC.new(ARGF.read,'').public_key.to_bn.to_s(2)].pack('m0').tr('+/','-_').gsub(/=/,'')" vapid_private.pem > vapid_public.txt

openssl ecparam -name prime256v1 -genkey -out vapid_private2.pem
ruby -ropenssl -e "puts [OpenSSL::PKey::EC.new(ARGF.read,'').public_key.to_bn.to_s(2)].pack('m0').tr('+/','-_').gsub(/=/,'')" vapid_private2.pem > vapid_public2.txt

openssl req -x509 -nodes -days 3650 -newkey ec:<(openssl ecparam -name prime256v1) -keyout https_key.pem -out https_crt.pem -subj '/CN=localhost/'

mkdir -p certs/
cp https_crt.pem certs/
openssl rehash certs || /usr/local/opt/openssl/bin/openssl rehash certs
