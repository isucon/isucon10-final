execute "rm -rf ~isucon/webapp; tar xf /dev/shm/files-generated/archive.tar -C ~isucon/ webapp" do
  user "isucon"
  not_if "test -e ~isucon/webapp"
end

execute "rm -rf ~isucon/proto; tar xf /dev/shm/files-generated/archive.tar -C ~isucon/ proto" do
  user "isucon"
  not_if "test -e ~isucon/proto"
end


