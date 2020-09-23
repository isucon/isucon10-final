execute 'cd ~isucon/webapp/frontend && yarn'

execute 'cd ~isucon/webapp/frontend && rm -rf public; NODE_ENV=production npx webpack --mode production' do
  not_if 'test -e ~isucon/webapp/frontend/public'
end
