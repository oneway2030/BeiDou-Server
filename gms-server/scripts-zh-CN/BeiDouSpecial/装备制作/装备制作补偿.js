/**
 * 装备制作属性补偿：合成未继承时，尝试从数据库恢复上一阶腰带属性。
 * 须把成品腰带放在装备栏第1格；合成后、下线保存前成功率最高。
 */
var status = -1;

/** 成品 id -> 应继承的上一阶材料 id（与装备制作.js 腰带配方一致） */
var 腰带合成上一级 = {
    1132296: 1132115,
    1132211: 1132296,
    1132212: 1132211,
    1132213: 1132212,
    1132214: 1132213,
    1132215: 1132214
};

const InventoryType = Java.type('org.gms.client.inventory.InventoryType');
const ItemInformationProvider = Java.type('org.gms.server.ItemInformationProvider');
const LoggerFactory = Java.type('org.slf4j.LoggerFactory');
const log = LoggerFactory.getLogger('BeiDouCraftCompensate');

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode === 1) {
        status++;
    } else {
        cm.dispose();
        return;
    }

    switch (status) {
        case 0:
            showMainMenu();
            break;
        case 1:
            if (selection === 0) {
                tryAutoRecoverFromDb();
            } else if (selection === 1) {
                copyFromSlot2ToSlot1();
            }
            cm.dispose();
            break;
        default:
            cm.dispose();
    }
}

function showMainMenu() {
    var text = "#e#b[装备制作属性恢复]#k#n\r\n\r\n";
    text += "请先把#r需要修复的腰带成品#k放在#b装备栏第1格#k。\r\n";
    text += "系统将尝试从数据库读取上一阶装备的星级与洗练记录。\r\n\r\n";
    text += "#L0##b从数据库恢复上一阶属性#k#l\r\n\r\n";
    text += "#L1##b从装备栏第2格复制到第1格#k#l\r\n";
    text += "（第2格仍保留带属性的旧腰带时使用）\r\n";
    cm.sendSimple(text);
}

/** 按成品查上一阶材料，取库中最近一条有洗练历史的记录 */
function findSourceRowFromDb(charId, sourceItemId) {
    var sql = "SELECT it.inventoryitemid, it.itemid, ie.upgradehistory, ie.itemlevel, ie.starLevel, " +
        "ie.starCount, ie.upgradeResetCount, ie.maxStar, ie.levelExpand, " +
        "LENGTH(COALESCE(ie.upgradehistory,'')) AS hist_len " +
        "FROM inventoryitems it " +
        "JOIN inventoryequipment ie ON it.inventoryitemid = ie.inventoryitemid " +
        "WHERE it.characterid = " + charId + " AND it.itemid = " + sourceItemId + " " +
        "AND LENGTH(COALESCE(ie.upgradehistory,'')) > 0 " +
        "ORDER BY it.inventoryitemid DESC LIMIT 1";
    var rs;
    try {
        rs = cm.sql_Select(sql);
    } catch (e) {
        log.error("[装备制作补偿] 查询失败 charId={} sourceItemId={}", charId, sourceItemId, e);
        return null;
    }
    if (!rs || rs.size() === 0) {
        return null;
    }
    return rs.get(0);
}

function tryAutoRecoverFromDb() {
    var player = cm.getPlayer();
    var inv = player.getInventory(InventoryType.EQUIP);
    var target = inv.getItem(1);
    if (!target) {
        cm.sendOk("请先把需要修复的腰带放在#b装备栏第1格#k。");
        return;
    }

    var targetId = target.getItemId();
    var sourceItemId = 腰带合成上一级[targetId];
    if (!sourceItemId) {
        cm.sendOk("当前第1格的 #t" + targetId + "# 不支持通过本功能恢复。\r\n请联系管理员处理。");
        return;
    }

    var row = findSourceRowFromDb(player.getId(), sourceItemId);
    if (!row) {
        cm.sendOk("#r找不到可恢复的属性记录。#k\r\n\r\n" +
            "可能原因：\r\n" +
            "1. 合成后已经下线或触发存档，上一阶数据已从数据库清除；\r\n" +
            "2. 上一阶腰带本身没有洗练/升级记录。\r\n\r\n" +
            "若第2格仍有旧腰带，可尝试「从第2格复制到第1格」。");
        return;
    }

    var template = buildEquipFromDbRow(row);
    if (!template) {
        cm.sendOk("读取属性数据失败，请联系管理员。");
        return;
    }

    var histBefore = target.getUpgradeHistoryDes().size();
    target.replaceData(template);
    target.setFlag(1);
    player.forceUpdateItem(target);

    log.info("[装备制作补偿] 角色={} charId={} 目标={} 源={} invId={} 历史 {}->{}",
        player.getName(), player.getId(), targetId, sourceItemId, row.get("inventoryitemid"),
        histBefore, target.getUpgradeHistoryDes().size());

    cm.sendOk("恢复成功！\r\n\r\n" +
        "已将 #t" + sourceItemId + "# 的属性继承到第1格 #t" + targetId + "#。\r\n" +
        "洗练历史：" + histBefore + " 条 -> " + target.getUpgradeHistoryDes().size() + " 条\r\n\r\n" +
        "#r请不要再下线前重复操作。#k");
}

function copyFromSlot2ToSlot1() {
    var player = cm.getPlayer();
    var inv = player.getInventory(InventoryType.EQUIP);
    var target = inv.getItem(1);
    var source = inv.getItem(2);
    if (!target || !source) {
        cm.sendOk("请把需修复的腰带放在#b装备栏第1格#k，把带属性的旧腰带放在#b第2格#k。");
        return;
    }
    var beforeHist = target.getUpgradeHistoryDes().size();
    target.replaceData(source);
    target.setFlag(1);
    player.forceUpdateItem(target);
    log.info("[装备制作补偿] 角色={} charId={} slot2->slot1 目标={} 源={}",
        player.getName(), player.getId(), target.getItemId(), source.getItemId());
    cm.sendOk("已从第2格继承属性到第1格。\r\n洗练历史：" + beforeHist + " 条 -> " +
        target.getUpgradeHistoryDes().size() + " 条");
}

function buildEquipFromDbRow(row) {
    var itemId = parseInt(String(row.get("itemid")), 10);
    var equip = ItemInformationProvider.getInstance().getEquipById(itemId);
    if (!equip) {
        return null;
    }
    var hist = row.get("upgradehistory");
    equip.setUpgradeHistory(hist != null ? String(hist) : "");
    equip.setItemLevel(byteVal(row, "itemlevel", 1));
    equip.setStarLevel(intVal(row, "starLevel", 0));
    equip.setStarCount(intVal(row, "starCount", 0));
    equip.setUpgradeResetCount(intVal(row, "upgradeResetCount", 0));
    equip.setMaxStar(intVal(row, "maxStar", 0));
    equip.setLevelExpand(intVal(row, "levelExpand", 0));
    return equip;
}

function intVal(row, key, def) {
    var v = row.get(key);
    if (v == null) {
        return def;
    }
    return parseInt(String(v), 10) || def;
}

function byteVal(row, key, def) {
    return intVal(row, key, def);
}
