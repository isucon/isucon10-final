include_cookbook 'langs::golang'

execute 'install protoc' do
  command 'curl -Lo /dev/shm/protoc.zip https://github.com/protocolbuffers/protobuf/releases/download/v3.13.0/protoc-3.13.0-linux-x86_64.zip && ( cd /dev/shm && echo "22a179b8c785b531841ee3c5fb710e6e06dc55fa45a2bd896c34552bd6068051f7f812de1f478583015912b54dd4f347 protoc.zip" | sha384sum -c --strict ) && ( mkdir -p /tmp/protoc && cd /tmp/protoc && unzip /dev/shm/protoc.zip && install -Dm 0755 bin/protoc /usr/local/bin/protoc && find include/ -type f -exec install -Dm 644 "{}" "/usr/local/{}" ";" )'
  not_if 'test -e /usr/local/bin/protoc'
end

execute 'GOBIN=/root/go/bin /home/isucon/.x go get google.golang.org/protobuf/cmd/protoc-gen-go && mv /root/go/bin/protoc-gen-go /usr/local/bin/protoc-gen-go' do
  not_if 'test -e /usr/local/bin/protoc-gen-go'
end

execute 'GOBIN=/root/go/bin /home/isucon/.x go get google.golang.org/grpc/cmd/protoc-gen-go-grpc && mv /root/go/bin/protoc-gen-go-grpc /usr/local/bin/protoc-gen-go-grpc' do
  not_if 'test -e /usr/local/bin/protoc-gen-go-grpc'
end
