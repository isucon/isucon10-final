execute 'cd ~isucon/webapp/frontend && /home/isucon/.x yarn' do
  user 'isucon'
end

execute 'cd ~isucon/webapp/frontend && rm -rf public; NODE_ENV=production /home/isucon/.x npx webpack --mode production' do
  user 'isucon'
  not_if 'test -e ~isucon/webapp/frontend/public'
end
