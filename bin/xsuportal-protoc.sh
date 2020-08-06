#!/bin/zsh -xe
cd "$(dirname $0)/.."
BASE_DIR=$(pwd)

cd ${BASE_DIR}/webapp/frontend
rm -rf javascript/pb*.js javascript/pb*.d.ts || true
npx pbjs -p ../../proto -t static-module -w commonjs -o javascript/pb.js ../../proto/**/*.proto
npx pbts -o javascript/pb.d.ts javascript/pb.js

cd ${BASE_DIR}/webapp/ruby
rm -rf lib/**/*_pb.rb || true
bundle exec grpc_tools_ruby_protoc -I../../proto --ruby_out=./lib --grpc_out=./lib ../../proto/**/*.proto
