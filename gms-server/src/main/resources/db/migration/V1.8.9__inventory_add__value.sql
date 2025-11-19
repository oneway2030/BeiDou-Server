-- 为 inventoryequipment 表添加 upgradehistory 字段（TEXT类型，允许为NULL，无注释）
ALTER TABLE `inventoryequipment`
    ADD COLUMN `upgradehistory` TEXT;