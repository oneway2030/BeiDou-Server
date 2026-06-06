-- 创建战力排行榜表
CREATE TABLE IF NOT EXISTS `combat_power_ranking` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `character_id` INT NOT NULL COMMENT '角色ID',
    `character_name` VARCHAR(50) DEFAULT NULL COMMENT '角色名称',
    `job_id` INT DEFAULT NULL COMMENT '职业ID',
    `combat_power` DECIMAL(20, 2) DEFAULT 0.00 COMMENT '战力评分',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_character_id` (`character_id`),
    KEY `idx_combat_power` (`combat_power` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='战力排行榜表';
