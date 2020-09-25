include_cookbook 'tls-certificate'
include_cookbook 'envoy'

directory '/etc/ssl/private' do
  owner 'root'
  group 'root'
  mode  '0755'
end

remote_file '/etc/envoy/config.yaml' do
  owner 'root'
  group 'root'
  mode  '0644'
end
