include_cookbook 'xbuild'

version = node[:langs][:versions].fetch(:nodejs)

execute "rm -rf /home/isucon/local/nodejs; /opt/xbuild/node-install #{version} /home/isucon/local/nodejs" do
  user 'isucon'
  not_if "/home/isucon/local/nodejs/bin/node --version | grep -q '^#{version}$'"
end

execute 'curl -o- -L https://yarnpkg.com/install.sh | bash' do
  user 'isucon'
  not_if "test -e /home/isucon/.yarn"
end
