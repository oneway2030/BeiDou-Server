-- 枫城 BOSS 自定义掉落 (chance/1000000)
-- 甲胄武士(9400405)、天皇蟾蜍(9400409) 装备 2% = 20000

-- ========== 甲胄武士(9400405) ==========
INSERT INTO `drop_data` (`dropperid`, `itemid`, `minimum_quantity`, `maximum_quantity`, `questid`, `chance`) VALUES
(9400405, 1053226, 1, 1, 0, 20000),
(9400405, 1052463, 1, 1, 0, 20000)
ON DUPLICATE KEY UPDATE `chance` = VALUES(`chance`);

-- ========== 天皇蟾蜍(9400409) 灵珠长杖 ==========
INSERT INTO `drop_data` (`dropperid`, `itemid`, `minimum_quantity`, `maximum_quantity`, `questid`, `chance`) VALUES
(9400409, 1382045, 1, 1, 0, 20000),
(9400409, 1382046, 1, 1, 0, 20000),
(9400409, 1382047, 1, 1, 0, 20000),
(9400409, 1382048, 1, 1, 0, 20000)
ON DUPLICATE KEY UPDATE `chance` = VALUES(`chance`);
