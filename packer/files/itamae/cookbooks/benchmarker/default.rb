include_cookbook 'tls-certificate'
include_cookbook 'xsuportal::files'
include_cookbook 'xsuportal::frontend'
include_cookbook 'langs::golang'
include_cookbook 'protoc'

execute "rm -rf ~isucon/benchmarker; tar xf /dev/shm/files-generated/archive.tar -C ~isucon/ benchmarker" do
  user "isucon"
  not_if "test -e ~isucon/benchmarker"
end

execute "rm -rf ~isucon/benchmarker/vendor; tar xf /dev/shm/files-generated/benchmarker-vendor.tar -C ~isucon/benchmarker" do
  user "isucon"
  not_if "test -e ~isucon/isucandar/vendor"
end

execute "cd ~isucon/benchmarker && PATH=/home/isucon/local/golang/bin:${PATH} make" do
  user 'isucon'
  not_if "test -e ~isucon/bin/benchmarker"
end

# include_cookbook 'isuxportal-supervisor'
