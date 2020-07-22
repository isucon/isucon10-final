CREATE DATABASE IF NOT EXISTS `xsuportal` DEFAULT CHARACTER SET utf8mb4;
CREATE USER IF NOT EXISTS `xsuportal`@`localhost` IDENTiFIED BY 'xsuportal';
GRANT ALL ON `xsuportal`.* TO `xsuportal`@`localhost`;
