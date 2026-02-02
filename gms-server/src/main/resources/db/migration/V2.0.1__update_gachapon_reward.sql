SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE IF NOT EXISTS `gachapon_reward`  (
                                                  `id` int NOT NULL AUTO_INCREMENT COMMENT '自增ID',
                                                  `pool_id` int NOT NULL COMMENT '绑定奖池ID',
                                                  `item_id` int NOT NULL COMMENT '道具ID',
                                                  `quantity` int NOT NULL DEFAULT 1 COMMENT '单次抽取数量',
                                                  `create_time` datetime NULL DEFAULT NULL COMMENT '创建日期',
                                                  `comment` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '备注',
    PRIMARY KEY (`id`) USING BTREE
    ) ENGINE = InnoDB AUTO_INCREMENT = 2082 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

INSERT INTO `gachapon_reward`
(pool_id, item_id, quantity, create_time, comment)
VALUES
    (37, 1042392, 1, '2026-02-02 11:00:00', 'Common equipment'),
    (37, 1042393, 1, '2026-02-02 11:00:00', 'Common equipment'),
    (37, 1042394, 1, '2026-02-02 11:00:00', 'Common equipment'),
    (37, 1042395, 1, '2026-02-02 11:00:00', 'Common equipment'),
    (37, 1042396, 1, '2026-02-02 11:00:00', 'Common equipment'),

    (37, 1062165, 1, '2026-02-02 11:00:00', 'Common equipment'),
    (37, 1062166, 1, '2026-02-02 11:00:00', 'Common equipment'),
    (37, 1062167, 1, '2026-02-02 11:00:00', 'Common equipment'),
    (37, 1062168, 1, '2026-02-02 11:00:00', 'Common equipment'),
    (37, 1062169, 1, '2026-02-02 11:00:00', 'Common equipment'),

--     (37, 1113084, 1, '2026-02-02 11:00:00', 'Common equipment'),
--     (37, 1114306, 1, '2026-02-02 11:00:00', 'Common equipment'),

    (37, 1082543, 1, '2026-02-02 11:00:00', 'Common equipment'),
    (37, 1082544, 1, '2026-02-02 11:00:00', 'Common equipment'),
    (37, 1082545, 1, '2026-02-02 11:00:00', 'Common equipment'),
    (37, 1082546, 1, '2026-02-02 11:00:00', 'Common equipment'),
    (37, 1082547, 1, '2026-02-02 11:00:00', 'Common equipment');
SET FOREIGN_KEY_CHECKS = 1;