include_cookbook 'langs::versions'
include_cookbook 'xbuild'

version = node[:langs][:versions].fetch(:golang)
execute "rm -rf /home/isucon/local/golang; /opt/xbuild/go-install #{version} /home/isucon/local/golang" do
  user 'isucon'
  not_if "/home/isucon/local/golang/bin/go version | grep -q 'go#{version} '"
end
