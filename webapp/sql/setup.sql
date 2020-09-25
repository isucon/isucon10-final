CREATE DATABASE IF NOT EXISTS `xsuportal` DEFAULT CHARACTER SET utf8mb4;
CREATE USER IF NOT EXISTS `isucon`@`localhost` IDENTIFIED WITH mysql_native_password BY 'isucon';
GRANT ALL ON `xsuportal`.* TO `isucon`@`localhost`;
