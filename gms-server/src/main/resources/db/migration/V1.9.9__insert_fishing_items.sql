INSERT INTO command_info (syntax, level, enabled, clazz, default_level)
VALUES ('fishdrop', 4, 1, 'FishDropCommand', 4);

ALTER TABLE `characters`
    ADD COLUMN `fishLevel` INT NOT NULL DEFAULT 1 COMMENT '角色钓鱼等级' AFTER `level`;

CREATE TABLE `fishing_items`
(
    `id`          BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键',
    `item_type`   INT    NOT NULL COMMENT '物品类型：1=COMMON(普通) / 2=UNCOMMON(稀有) / 3=RARE(超稀有)',
    `item_id`     INT    NOT NULL COMMENT '物品ID（对应游戏内ItemId）',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX         `idx_item_type` (`item_type`) COMMENT '按类型索引，加速查询'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='钓鱼系统物品配置表';

INSERT INTO `fishing_items` (`item_type`, `item_id`)
VALUES (1, 4031627),
       (1, 4031628),
       (1, 4031630),
       (1, 4031631),
       (2, 4031633),
       (2, 4031641),
       (2, 4031637),
       (2, 4031645),
       (3, 4031634),
       (3, 4031642),
       (3, 4031638),
       (3, 4031646),
       (4, 4031635),
       (4, 4031643),
       (4, 4031639),
       (4, 4031647),
       (5, 4031636),
       (5, 4031644),
       (5, 4031640),
       (5, 4031648),
       (6, 4031629),
       (6, 4031632);