node.reverse_merge!(
  benchmarker: {
    enable: false,
    slice: 'benchmarker.slice',
  },
  xsuportal: {
    enable: nil,
    disable_default: true,
    slice: 'contestant.slice',
  },
  envoy: {
    slice: 'contestant.slice',
  },
  cmdline: {
    maxcpus: nil,
    mem: nil,
  },
)

include_role 'contestant'
include_role 'benchmarker'

remote_file '/etc/systemd/system/isucon.slice' do
  owner 'root'
  group 'root'
  mode  '0644'
  notifies :run, 'execute[systemctl daemon-reload]'
end


remote_file '/etc/systemd/system/contestant.slice' do
  owner 'root'
  group 'root'
  mode  '0644'
  notifies :run, 'execute[systemctl daemon-reload]'
end

remote_file '/etc/systemd/system/benchmarker.slice' do
  owner 'root'
  group 'root'
  mode  '0644'
  notifies :run, 'execute[systemctl daemon-reload]'
end

directory '/etc/systemd/system/mysql.service.d' do
  owner 'root'
  group 'root'
  mode  '0755'
end

remote_file '/etc/systemd/system/mysql.service.d/slice.conf' do
  owner 'root'
  group 'root'
  mode  '0644'
  notifies :run, 'execute[systemctl daemon-reload]'
end


