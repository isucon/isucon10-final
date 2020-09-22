node.reverse_merge!(
  envoy: {
    slice: nil,
  },
)

include_cookbook 'apt-source-getenvoy'

package 'getenvoy-envoy'

template '/etc/systemd/system/envoy.service' do
  owner 'root'
  group 'root'
  mode  '0644'
  notifies :run, 'execute[systemctl daemon-reload]'
end
