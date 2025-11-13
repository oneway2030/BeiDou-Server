-- 自定义仓库
CREATE TABLE IF NOT EXISTS `extrastorage`
(
    `inventoryequipmentid` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
    `characterid`      INT(10) UNSIGNED NOT NULL DEFAULT '0',
    `accountid`      INT(10) UNSIGNED NOT NULL DEFAULT '0',
    `itemid`      INT(10) UNSIGNED NOT NULL DEFAULT '0',
    `quantity`         INT(11)          NOT NULL DEFAULT '0',
    `type`                INT(11)          NOT NULL DEFAULT '0',
-- type 0是散矿
-- type 1是母矿(成品矿石)
-- type 2是卷轴
-- type 3是各种币
    PRIMARY KEY (`inventoryequipmentid`),
    KEY `CHARID` (`characterid`)
    ) ENGINE = InnoDB
    DEFAULT CHARSET = utf8mb4
    AUTO_INCREMENT = 1;