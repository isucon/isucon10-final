include_cookbook 'langs::ruby'

execute "rm -rf ~isucon/webapp; tar xf /dev/shm/files-generated/archive.tar -C ~isucon/ webapp" do
  user "isucon"
  not_if "test -e ~isucon/webapp"
end

execute "rm -rf ~isucon/proto; tar xf /dev/shm/files-generated/archive.tar -C ~isucon/ proto" do
  user "isucon"
  not_if "test -e ~isucon/proto"
end

template "/home/isucon/env" do
  owner 'isucon'
  group 'root'
  mode  '0640'
end

remote_file "/opt/isucon-env-ensure-benchmark-server" do
  owner 'root'
  owner 'root'
  mode  '0755'
end

remote_file "/etc/systemd/system/isucon-env-ensure-benchmark-server.service" do
  owner 'root'
  owner 'root'
  mode  '0644'
  notifies :run, 'execute[systemctl daemon-reload]', :immediately
end

service 'isucon-env-ensure-benchmark-server.service' do
  action [:enable]
end


if node.dig(:xsuportal, :ci_cache)
  execute "cd /opt/ci-cache && rm /opt/ci-cache/.do && for x in *; do mkdir -p ~isucon/webapp/${x}; mv -v ${x}/* -t ~isucon/webapp/${x}/; done" do
    only_if 'test -e /opt/ci-cache/.do'
  end
end
