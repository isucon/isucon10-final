package 'prometheus-node-exporter'

directory '/etc/systemd/system/prometheus-node-exporter.service.d' do
  owner 'root'
  group 'root'
  mode  '0755'
end

remote_file '/etc/systemd/system/prometheus-node-exporter.service.d/dropin.conf' do
  owner 'root'
  group 'root'
  mode  '0644'
  notifies :run, 'execute[systemctl daemon-reload]'
end

service 'prometheus-node-exporter.service' do
  action :enable
end


