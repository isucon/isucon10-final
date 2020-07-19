#!/bin/zsh -xe
cd "$(dirname $0)/.."

JS_PB_PATH="webapp/frontend/javascript"
RUBY_PB_PATH="webapp/ruby/lib"

rm -rf ${JS_PB_PATH}/pb*.js ${JS_PB_PATH}/pb*.d.ts ${RUBY_PB_PATH}/**/*_pb.rb || true

protoc -Iproto --ruby_out=${RUBY_PB_PATH} proto/**/*.proto

cd webapp/frontend

npx pbjs -p ../../proto -t static-module -w commonjs -o javascript/pb.js ../../proto/**/*.proto
npx pbts -o javascript/pb.d.ts javascript/pb.js
