node.reverse_merge!(
  benchmarker: {
    enable: true,
  },
)

include_cookbook 'benchmarker'

if node[:benchmarker][:enable]
  service 'isuxportal-supervisor.service' do
    action :enable
  end
else
  service 'isuxportal-supervisor.service' do
    action :disable
  end
end

package 'dstat'
package 'htop'

include_cookbook 'prometheus-node-exporter'
