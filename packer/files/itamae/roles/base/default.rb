# include_cookbook 'isucon-admin-user'
include_cookbook 'isucon-user'
include_cookbook 'systemd-timesyncd'
include_cookbook 'langs::exec'

%w(
  build-essential
  git-core
  unzip

  autoconf
  bison
  pkg-config

  libbz2-dev
  libc-client2007e-dev
  libcurl4-openssl-dev
  libffi-dev
  libfreetype6-dev
  libjpeg-dev
  libkrb5-dev
  libonig-dev
  libpng-dev
  libreadline-dev
  libsqlite3-dev
  libssl-dev
  libtidy-dev
  libxml2-dev
  libxslt-dev
  libzip-dev
  zlib1g-dev
).each do |_|
  package _
end


