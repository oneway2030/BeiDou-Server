ALTER TABLE `inventoryequipment`
ADD COLUMN `levelExpand` INT NOT NULL DEFAULT 0 COMMENT '可额外升级的等级',
ADD COLUMN `combinationType` INT NOT NULL DEFAULT 0 COMMENT '套装类型',
ADD COLUMN `maxStar` INT NOT NULL DEFAULT 0 COMMENT '最高星级',
ADD COLUMN `starLevel` INT NOT NULL DEFAULT 0 COMMENT '已升星次数',
ADD COLUMN `starCount` INT NOT NULL DEFAULT 0 COMMENT '当前星级数失败次数',
ADD COLUMN `upgradeResetCount` INT NOT NULL DEFAULT 0 COMMENT '洗练次数',
ADD COLUMN `upgradeReturn` INT NOT NULL DEFAULT 0 COMMENT '是否返还洗练道具',
ADD COLUMN `chaosHistory` TEXT COMMENT '混沌卷升级记录',
ADD COLUMN `absorbHistory` TEXT COMMENT '装备吸收历史',
ADD COLUMN `expandAttribute1` INT NOT NULL DEFAULT 0 COMMENT '扩展属性1',
ADD COLUMN `expandAttribute2` INT NOT NULL DEFAULT 0 COMMENT '扩展属性2',
ADD COLUMN `expandAttribute3` TEXT COMMENT '扩展属性3',
ADD COLUMN `expandAttribute4` TEXT COMMENT '扩展属性4';

ALTER TABLE `mts_items`
ADD COLUMN `levelExpand` INT NOT NULL DEFAULT 0 COMMENT '可额外升级的等级',
ADD COLUMN `combinationType` INT NOT NULL DEFAULT 0 COMMENT '套装类型',
ADD COLUMN `maxStar` INT NOT NULL DEFAULT 0 COMMENT '最高星级',
ADD COLUMN `starLevel` INT NOT NULL DEFAULT 0 COMMENT '已升星次数',
ADD COLUMN `starCount` INT NOT NULL DEFAULT 0 COMMENT '当前星级数失败次数',
ADD COLUMN `upgradeResetCount` INT NOT NULL DEFAULT 0 COMMENT '洗练次数',
ADD COLUMN `upgradeReturn` INT NOT NULL DEFAULT 0 COMMENT '是否返还洗练道具',
ADD COLUMN `chaosHistory` TEXT COMMENT '混沌卷升级记录',
ADD COLUMN `absorbHistory` TEXT COMMENT '装备吸收历史',
ADD COLUMN `expandAttribute1` INT NOT NULL DEFAULT 0 COMMENT '扩展属性1',
ADD COLUMN `expandAttribute2` INT NOT NULL DEFAULT 0 COMMENT '扩展属性2',
ADD COLUMN `expandAttribute3` TEXT COMMENT '扩展属性3',
ADD COLUMN `expandAttribute4` TEXT COMMENT '扩展属性4';




