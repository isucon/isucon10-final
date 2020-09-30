DROP TABLE IF EXISTS `contestants`;
CREATE TABLE `contestants` (
  `id` VARCHAR(255) PRIMARY KEY,
  `password` VARCHAR(255) NOT NULL,
  `team_id` BIGINT,
  `name` VARCHAR(255),
  `student` TINYINT(1) DEFAULT FALSE,
  `staff` TINYINT(1) DEFAULT FALSE,
  `created_at` DATETIME(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARACTER SET=utf8mb4;

DROP TABLE IF EXISTS `teams`;
CREATE TABLE `teams` (
  `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `leader_id` VARCHAR(255),
  `email_address` VARCHAR(255) NOT NULL,
  `invite_token` VARCHAR(255) NOT NULL,
  `withdrawn` TINYINT(1) DEFAULT FALSE,
  `created_at` DATETIME(6) NOT NULL,
  UNIQUE KEY (`leader_id`)
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4;

DROP TABLE IF EXISTS `benchmark_jobs`;
CREATE TABLE `benchmark_jobs` (
  `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `team_id` BIGINT NOT NULL,
  `status` INT NOT NULL,
  `target_hostname` VARCHAR(255) NOT NULL,
  `handle` VARCHAR(255),
  `score_raw` INT,
  `score_deduction` INT,
  `reason` VARCHAR(255),
  `passed` TINYINT(1),
  `started_at` DATETIME(6),
  `finished_at` DATETIME(6),
  `created_at` DATETIME(6) NOT NULL,
  `updated_at` DATETIME(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARACTER SET=utf8mb4;

ALTER TABLE `benchmark_jobs` ADD INDEX idx1 (`team_id`,`id`);
ALTER TABLE `benchmark_jobs` ADD INDEX idx2 (`status`,`team_id`,`id`);
ALTER TABLE `benchmark_jobs` ADD INDEX idx3 (`status`,`team_id`,`finished_at`);

DROP TABLE IF EXISTS `clarifications`;
CREATE TABLE `clarifications` (
  `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `team_id` BIGINT NOT NULL,
  `disclosed` TINYINT(1),
  `question` VARCHAR(255),
  `answer` VARCHAR(255),
  `answered_at` DATETIME(6),
  `created_at` DATETIME(6) NOT NULL,
  `updated_at` DATETIME(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARACTER SET=utf8mb4;

DROP TABLE IF EXISTS `notifications`;
CREATE TABLE `notifications` (
  `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `contestant_id` VARCHAR(255) NOT NULL,
  `read` TINYINT(1) NOT NULL DEFAULT FALSE,
  `encoded_message` VARCHAR(255) NOT NULL,
  `created_at` DATETIME(6) NOT NULL,
  `updated_at` DATETIME(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARACTER SET=utf8mb4;

ALTER TABLE `notifications` ADD INDEX idx1 (`contestant_id`,`id`);

DROP TABLE IF EXISTS `push_subscriptions`;
CREATE TABLE `push_subscriptions` (
  `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `contestant_id` VARCHAR(255) NOT NULL,
  `endpoint` VARCHAR(255) NOT NULL,
  `p256dh` VARCHAR(255) NOT NULL,
  `auth` VARCHAR(255) NOT NULL,
  `created_at` DATETIME(6) NOT NULL,
  `updated_at` DATETIME(6) NOT NULL,
  UNIQUE KEY (`contestant_id`, `endpoint`)
) ENGINE=InnoDB DEFAULT CHARACTER SET=utf8mb4;

DROP TABLE IF EXISTS `contest_config`;
CREATE TABLE `contest_config` (
  `registration_open_at` DATETIME(6) NOT NULL,
  `contest_starts_at` DATETIME(6) NOT NULL,
  `contest_freezes_at` DATETIME(6) NOT NULL,
  `contest_ends_at` DATETIME(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARACTER SET=utf8mb4;
