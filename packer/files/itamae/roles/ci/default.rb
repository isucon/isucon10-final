node.reverse_merge!(
  benchmarker: {
    enable: false,
    slice: 'benchmarker.slice',
  },
  xsuportal: {
    enable: nil,
    disable_default: true,
    slice: 'contestant.slice',
    ci_cache: true,
    ignore_failed_build: true,
  },
  envoy: {
    slice: 'contestant.slice',
  },
  cmdline: {
    maxcpus: nil,
    mem: nil,
  },
)

define :ci_cache, directories: [] do
  name = params[:name]
  params[:directories].each do |dir|
    execute "mkdir -p /opt/ci-cache/#{name} && mv ~isucon/webapp/#{name}/#{dir} /opt/ci-cache/#{name}/#{dir} && touch /opt/ci-cache/.do" do
      only_if "test -e ~isucon/webapp/#{name}/#{dir}"
    end
  end
end

ci_cache 'tools' do
  directories %w(.bundle vendor)
end

ci_cache 'ruby' do
  directories %w(.bundle vendor)
end

ci_cache 'rust' do
  directories %w(target)
end

ci_cache 'frontend' do
  directories %w(node_modules)
end


execute 'rm -rf ~isucon/proto ~isucon/benchmarker ~isucon/webapp'

######

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

######

remote_file '/home/isucon/ci.sh' do
  owner 'root'
  group 'root'
  mode  '0755'
end
