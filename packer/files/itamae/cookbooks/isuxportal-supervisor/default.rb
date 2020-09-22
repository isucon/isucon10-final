execute "install -o root -g root -m 0755 /dev/shm/files-generated/isuxportal-supervisor /usr/local/bin/isuxportal-supervisor"

remote_file "/etc/systemd/system/isuxportal-supervisor.service" do
  owner 'root'
  group 'root'
  mode  '0755'
  notifies :run, 'execute[systemctl daemon-reload]'
end
