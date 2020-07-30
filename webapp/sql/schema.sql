CREATE TABLE IF NOT EXISTS `contestants` (
  `id` VARCHAR(255) PRIMARY KEY,
  `password` VARCHAR(255) NOT NULL,
  `team_id` BIGINT,
  `name` VARCHAR(255),
  `student` TINYINT(1) DEFAULT FALSE,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS `teams` (
  `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `leader_id` VARCHAR(255),
  `is_hidden` TINYINT(1) DEFAULT FALSE NOT NULL,
  `final_participation` TINYINT(1) DEFAULT FALSE NOT NULL,
  `email_address` VARCHAR(255) NOT NULL,
  `invite_token` VARCHAR(255) NOT NULL,
  `withdrawn` TINYINT(1) DEFAULT FALSE,
  `disqualified` TINYINT(1) DEFAULT FALSE,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  UNIQUE KEY (`leader_id`)
);
