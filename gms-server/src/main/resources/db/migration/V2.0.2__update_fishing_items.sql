CREATE TABLE IF NOT EXISTS `fishing_items`
(
    `id`          BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键',
    `item_type`   INT    NOT NULL COMMENT '物品类型：1=COMMON(普通) / 2=UNCOMMON(稀有) / 3=RARE(超稀有) / 4/5/6=新增类型',
    `item_id`     INT    NOT NULL COMMENT '物品ID（对应游戏内ItemId）',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX         `idx_item_type` (`item_type`) COMMENT '按类型索引，加速查询'
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='钓鱼系统物品配置表';

INSERT INTO `fishing_items` (`item_type`, `item_id`)
VALUES (5, 1112752),
       (5, 1113235),
       (5, 1113149),
       (5, 1113162),
       (5, 1113227),

       (6, 1113096),
       (6, 1113211),
       (6, 1113187),
       (6, 1113191);