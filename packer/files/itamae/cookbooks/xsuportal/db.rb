include_cookbook 'mysql'

execute %|mysql -uroot -e 'create database if not exists `xsuportal` default character set utf8mb4;'| do
  user 'root'
end

execute %|MYSQL_PWD=isucon mysql -uisucon xsuportal < ~isucon/webapp/sql/schema.sql| do
  user 'isucon'
end
