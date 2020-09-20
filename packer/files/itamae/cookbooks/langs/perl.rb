include_cookbook 'langs::versions'
include_cookbook 'xbuild'

version = node[:langs][:versions].fetch(:perl)

execute "rm -rf /home/isucon/local/perl; /opt/xbuild/perl-install #{version} /home/isucon/local/perl -- -Duselongdouble -j $(nproc)" do
  user 'isucon'
  not_if "/home/isucon/local/perl/bin/perl --version |grep -q '(v#{version})'"
end
