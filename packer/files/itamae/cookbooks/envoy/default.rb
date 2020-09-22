node.reverse_merge!(
  envoy: {
    slice: nil,
  },
)

include_cookbook 'apt-source-getenvoy'

package 'getenvoy-envoy'

directory '/etc/envoy' do
  owner 'root'
  group 'root'
  mode  '0755'
end

template '/etc/systemd/system/envoy.service' do
  owner 'root'
  group 'root'
  mode  '0644'
  notifies :run, 'execute[systemctl daemon-reload]'
end
