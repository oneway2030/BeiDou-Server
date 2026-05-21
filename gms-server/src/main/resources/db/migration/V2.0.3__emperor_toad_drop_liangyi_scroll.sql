-- 天皇蟾蜍(9400409) 掉落良医卷轴，30% 概率 (chance/1000000)
INSERT INTO `drop_data` (`dropperid`, `itemid`, `minimum_quantity`, `maximum_quantity`, `questid`, `chance`)
VALUES (9400409, 2049920, 1, 1, 0, 150000)
ON DUPLICATE KEY UPDATE `chance` = 300000;
