include_cookbook 'langs::golang'

execute "rm -rf ~isucon/webapp; tar xf /dev/shm/files-generated/archive.tar -C ~isucon/ benchmarker" do
  user "isucon"
  not_if "test -e ~isucon/benchmarker"
end

