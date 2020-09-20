#!/bin/zsh -xe
cd "$(dirname $0)/.."
BASE_DIR=$(pwd)

cd ${BASE_DIR}/webapp/frontend
rm -rf javascript/pb*.js javascript/pb*.d.ts || true
npx pbjs -p ../../proto -t static-module -w commonjs -o javascript/pb.js ../../proto/**/*.proto
npx pbts -o javascript/pb.d.ts javascript/pb.js

npx pbjs -p ../../proto -t static-module -w commonjs -o sw/src/pb.js \
  ../../proto/google/**/*.proto \
  ../../proto/xsuportal/resources/notification.proto
npx pbts -o sw/src/pb.d.ts sw/src/pb.js

cd ${BASE_DIR}/webapp/ruby
rm -rf lib/**/*_pb.rb || true
bundle exec grpc_tools_ruby_protoc -I../../proto --ruby_out=./lib --grpc_out=./lib ../../proto/**/*.proto
