directory "/opt/xbuild" do
  owner 'isucon'
  group 'isucon'
  mode  '0755'
end

execute "git clone --depth 1 https://github.com/tagomoris/xbuild /opt/xbuild" do
  user 'isucon'
  not_if "test -e /opt/xbuild/.git"
end
