FROM php:7.4.9-fpm

RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" && \
    php -r "if (hash_file('sha384', 'composer-setup.php') ==='795f976fe0ebd8b75f26a6dd68f78fd3453ce79f32ecb33e7fd087d39bfeb978342fb73ac986cd4f54edd0dc902601dc') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;" && \
    php composer-setup.php --install-dir=/usr/local/bin --filename=composer && \
    php -r "unlink('composer-setup.php');"

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        libzip-dev \
        libcurl4-openssl-dev \
        && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN pecl install grpc
RUN pecl install protobuf

RUN docker-php-ext-configure zip && \
    docker-php-ext-install zip && \
    docker-php-ext-install curl && \
    docker-php-ext-install pdo_mysql && \
    docker-php-ext-enable grpc

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        protobuf-compiler \
        && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

CMD ["make", "install", "run"]

WORKDIR /isucon10/isucon10-final/webapp/php/web