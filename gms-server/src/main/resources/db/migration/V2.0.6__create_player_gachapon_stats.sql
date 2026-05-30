-- 玩家抽奖统计表
CREATE TABLE IF NOT EXISTS `player_gachapon_stats` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    `character_id` INT NOT NULL UNIQUE COMMENT '角色ID',
    `character_name` VARCHAR(13) NOT NULL COMMENT '角色名称',
    `total_gachapon_count` INT NOT NULL DEFAULT 0 COMMENT '抽奖机抽奖总次数',
    `remote_gachapon_count` INT NOT NULL DEFAULT 0 COMMENT '远程抽奖总次数',
    `total_count` INT NOT NULL DEFAULT 0 COMMENT '总抽奖次数',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX `idx_character_id` (`character_id`),
    INDEX `idx_total_count` (`total_count`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='玩家抽奖统计表';