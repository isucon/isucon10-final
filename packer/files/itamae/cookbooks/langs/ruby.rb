include_cookbook 'langs::versions'
include_cookbook 'xbuild'

version = node[:langs][:versions].fetch(:ruby)

execute "rm -rf /home/isucon/local/ruby; /opt/xbuild/ruby-install #{version} /home/isucon/local/ruby" do
  user 'isucon'
  not_if "/home/isucon/local/ruby/bin/ruby -v | grep '^ruby #{version}p'"
end
