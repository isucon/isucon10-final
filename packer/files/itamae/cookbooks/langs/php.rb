include_cookbook 'langs::versions'
include_cookbook 'xbuild'

version = node[:langs][:versions].fetch(:php)

execute "rm -rf /home/isucon/local/php; /opt/xbuild/php-install #{version} /home/isucon/local/php -- ..." do
  command "/opt/xbuild/php-install #{version} /home/isucon/local/php -- " \
    ' --enable-bcmath' \
    ' --enable-calendar' \
    ' --enable-cli' \
    ' --enable-fpm' \
    ' --enable-mbregex' \
    ' --enable-mbstring' \
    ' --enable-opcache' \
    ' --enable-pcntl' \
    ' --enable-pdo' \
    ' --enable-shmop' \
    ' --enable-sockets' \
    ' --enable-sysvmsg' \
    ' --enable-sysvsem' \
    ' --enable-sysvshm' \
    ' --with-bz2' \
    ' --with-curl' \
    ' --with-mysqli=mysqlnd' \
    ' --with-openssl' \
    ' --with-pdo-mysql=mysqlnd' \
    ' --with-zlib'

  user 'isucon'
  not_if "/home/isucon/local/php/bin/php --version | grep -q 'PHP #{version} '"
end
