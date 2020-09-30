include_cookbook 'langs::ruby'

execute "( cd ~isucon/webapp/tools && /home/isucon/.x bundle config set deployment true && /home/isucon/.x bundle config set path vendor/bundle && /home/isucon/.x bundle install --jobs 20 ) #{node[:xsuportal][:ignore_failed_build]['ruby']}" do
  user 'isucon'
  not_if 'cd ~isucon/webapp/tools && test -e .bundle && /home/isucon/.x bundle check'
end

execute 'cd ~isucon/webapp/tools && /home/isucon/.x bundle config set deployment "false"' do
  user 'isucon'
end
