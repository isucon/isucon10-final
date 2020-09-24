node.reverse_merge!(
  benchmarker: {
  },
)
include_cookbook 'langs::ruby'

execute "install -o root -g root -m 0755 /dev/shm/files-generated/isuxportal-supervisor /usr/local/bin/isuxportal-supervisor"

remote_file "/opt/isuxportal-supervisor-init" do
  owner 'root'
  group 'root'
  mode  '0755'
  notifies :run, 'execute[systemctl daemon-reload]'
end

remote_file "/etc/systemd/system/isuxportal-supervisor-init.service" do
  owner 'root'
  group 'root'
  mode  '0644'
  notifies :run, 'execute[systemctl daemon-reload]'
end

template "/etc/systemd/system/isuxportal-supervisor.service" do
  owner 'root'
  group 'root'
  mode  '0644'
  notifies :run, 'execute[systemctl daemon-reload]'
end
