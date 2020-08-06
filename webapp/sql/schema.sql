DROP TABLE IF EXISTS `contestants`;
CREATE TABLE `contestants` (
  `id` VARCHAR(255) PRIMARY KEY,
  `password` VARCHAR(255) NOT NULL,
  `team_id` BIGINT,
  `name` VARCHAR(255),
  `student` TINYINT(1) DEFAULT FALSE,
  `created_at` DATETIME(6) NOT NULL,
  `updated_at` DATETIME(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARACTER SET=utf8mb4;

DROP TABLE IF EXISTS `teams`;
CREATE TABLE `teams` (
  `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `leader_id` VARCHAR(255),
  `is_hidden` TINYINT(1) DEFAULT FALSE NOT NULL,
  `final_participation` TINYINT(1) DEFAULT FALSE NOT NULL,
  `email_address` VARCHAR(255) NOT NULL,
  `invite_token` VARCHAR(255) NOT NULL,
  `withdrawn` TINYINT(1) DEFAULT FALSE,
  `disqualified` TINYINT(1) DEFAULT FALSE,
  `created_at` DATETIME(6) NOT NULL,
  `updated_at` DATETIME(6) NOT NULL,
  UNIQUE KEY (`leader_id`)
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4;

DROP TABLE IF EXISTS `benchmark_jobs`;
CREATE TABLE `benchmark_jobs` (
  `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `team_id` BIGINT NOT NULL,
  `status` INT NOT NULL,
  `target_hostname` VARCHAR(255) NOT NULL,
  -- `instance_name` VARCHAR(255),
  -- `handle` VARCHAR(255),
  `latest_benchmark_result_id` BIGINT,
  `started_at` DATETIME(6),
  `finished_at` DATETIME(6),
  `created_at` DATETIME(6) NOT NULL,
  `updated_at` DATETIME(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARACTER SET=utf8mb4;

DROP TABLE IF EXISTS `benchmark_results`;
CREATE TABLE `benchmark_results` (
  `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `benchmark_job_id` BIGINT NOT NULL,
  `score` INT,
  `score_raw` INT,
  `score_deduction` INT,
  `finished` TINYINT(1) NOT NULL,
  `passed` TINYINT(1),
  `marked_at` DATETIME(6),
  `reason` TEXT,
  `stdout` TEXT,
  `stderr` TEXT,
  -- `exit_status` INT,
  -- `exit_signal` INT,
  `created_at` DATETIME(6) NOT NULL,
  `updated_at` DATETIME(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARACTER SET=utf8mb4;
