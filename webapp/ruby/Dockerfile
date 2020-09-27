FROM ruby:2.6.3

WORKDIR /isucon10/isucon10-final/webapp/ruby

COPY ./Gemfile /tmp
COPY ./Gemfile.lock /tmp

RUN cd /tmp && \
    gem install bundler -v 2.1.4 && \
    bundle install && \
    rm -rf /tmp/{Gemfile,Gemfile.lock}

CMD ["bundle", "exec", "rackup", "config.ru", "-p", "80", "-o", "0.0.0.0"]
