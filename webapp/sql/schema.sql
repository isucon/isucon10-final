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
  `student` TINYINT(1),
  UNIQUE KEY (`leader_id`)
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4;

DROP TABLE IF EXISTS `leaderboard`;
CREATE TABLE `leaderboard` (
  `team_id` BIGINT NOT NULL PRIMARY KEY,
  `best_score` INT,
  `best_score_started_at` DATETIME(6),
  `best_score_marked_at` DATETIME(6),
  `frozen_best_score` INT,
  `frozen_best_score_started_at` DATETIME(6),
  `frozen_best_score_marked_at` DATETIME(6),
  `latest_score` INT,
  `latest_score_started_at` DATETIME(6),
  `latest_score_marked_at` DATETIME(6),
  `frozen_latest_score` INT,
  `frozen_latest_score_started_at` DATETIME(6),
  `frozen_latest_score_marked_at` DATETIME(6),
  `finish_count` INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4;

ALTER TABLE `leaderboard` ADD INDEX `idx1`(`frozen_latest_score` DESC, `frozen_score_marked_at` DESC);

DROP TABLE IF EXISTS `benchmark_jobs`;
CREATE TABLE `benchmark_jobs` (
  `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `team_id` BIGINT NOT NULL,
  `status` INT NOT NULL,
  `target_hostname` VARCHAR(255) NOT NULL,
  `handle` VARCHAR(255),
  `score_raw` INT,
  `score_deduction` INT,
  `reason` TEXT,
  `passed` TINYINT(1),
  `started_at` DATETIME(6),
  `finished_at` DATETIME(6),
  `created_at` DATETIME(6) NOT NULL,
  `updated_at` DATETIME(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARACTER SET=utf8mb4;

DROP TABLE IF EXISTS `contest_config`;
CREATE TABLE `contest_config` (
  `registration_open_at` DATETIME(6) NOT NULL,
  `contest_starts_at` DATETIME(6) NOT NULL,
  `contest_freezes_at` DATETIME(6) NOT NULL,
  `contest_ends_at` DATETIME(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARACTER SET=utf8mb4;
