# This file is used for build caching. Improper cache key will reduce build efficiency (cache will not be updated while xbuild re-run).
# cache-epoch: 1

node.reverse_merge!(
  langs: {
    versions: {
      golang: '1.15.2',
      nodejs: 'v12.18.4', # 'v' prefix is important.
      perl: '5.32.0',
      php: '7.4.10',
      ruby: '2.7.1',
      rust: '1.46.0',
    },
  },
)

execute "tar xpf /var/tmp/files-cached/local.tar.gz -C ~isucon/local --xattrs" do
  only_if 'test -e /var/tmp/files-cached/local.tar.gz'
end

file "/home/isucon/local/.versions" do
  content "#{node[:langs][:versions].to_a.map { |k,v| [k,v] }.sort_by(&:first).to_json}\n"
  owner 'isucon'
  group 'isucon'
  mode  '0644'
  notifies :run, 'execute[rm -f /home/isucon/local/.cache]'
end

execute 'rm -f /home/isucon/local/.cache' do
  action :nothing
end

include_cookbook 'langs::verify'
