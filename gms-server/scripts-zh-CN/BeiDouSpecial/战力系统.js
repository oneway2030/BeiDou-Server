const DatabaseConnection = Java.type("org.gms.util.DatabaseConnection");
const Job = Java.type("org.gms.client.Job");

// ============ 常量定义 ============
const ICON = "#fUI/UIWindow.img/UserInfo/bossPetCrown#";
const EQUIPMENT_SLOTS = [
    -1, -2, -3, -4, -5, -6, -7, -8, -9, -10, -11, -12, -13, -15, -16, -17, -18,
    -19, -26, -27, -28, -29, -101, -102, -103, -104, -105, -106, -107, -108, -109,
    -110, -111, -112, -113, -114, -115, -116, -118, -119, -121, -127, -128,
];
const EQUIPMENT_SLOT_NAMES = [
    "帽子",
    "脸饰",
    "眼饰",
    "耳环",
    "衣服",
    "裤子",
    "鞋子",
    "手套",
    "披风",
    "盾牌",
    "武器",
    "戒指",
    "戒指",
    "戒指",
    "戒指",
    "项链",
    "骑宠",
    "鞍子",
    "勋章",
    "戒指",
    "戒指",
    "腰带",
    "时帽",
    "时脸",
    "时眼",
    "时耳",
    "时衣",
    "时裤",
    "时鞋",
    "时手",
    "时披",
    "时盾",
    "时武",
    "时戒",
    "时戒",
    "宠装",
    "时戒",
    "时戒",
    "时骑",
    "时鞍",
    "时项",
    "时戒",
    "时戒",
];
const COMBAT_POWER_WEIGHTS = {
    STR: 10,
    DEX: 10,
    INT: 10,
    LUK: 10,
    WATK: 50,
    MATK: 50,
    WDEF: 1,
    MDEF: 1
};

// ============ 全局变量 ============
var dialogText, selectedCharacterIndex;
var combatPowerRankings = [];
var characterEquipments = [];
var calendar = java.util.Calendar.getInstance();
var status = 0;

// ============ 主流程函数 ============
function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        if (status >= 0 && mode == 0) {
            cm.dispose();
            return;
        }
        if (mode == 1) status++;
        else status--;
        if (status == 0) {
            var totalCombatPower = 0;
            for (i in EQUIPMENT_SLOTS) {
                var equipment = cm.getInventory(-1).getItem(EQUIPMENT_SLOTS[i]);
                if (equipment == null) continue;
                totalCombatPower += calculateCombatPower(equipment);
            }
            dialogText = "\r\n                       #i03994060# #i03994063# #i03994067# #i03994062# #i03994073# #i03994079#\r\n\r\n";
            dialogText += `\t\t\t\t\t\t\t#L997#${ICON} #r查看战力排行傍#k ${ICON}#l\r\n\r\n\r\n`;

            dialogText += `#d我的战力评分 : #r${totalCombatPower}#k`;
            var itemNum = 0;
            for (i in EQUIPMENT_SLOTS) {
                var equipment = cm.getInventory(-1).getItem(EQUIPMENT_SLOTS[i]);
                if (equipment) {
                    if (itemNum++ % 4 == 0) dialogText += "\r\n";
                    dialogText += `#L${i}##d${EQUIPMENT_SLOT_NAMES[i]} #b${rightPadSpace(calculateCombatPower(equipment), 7)}#l`;
                }
            }
            cm.sendSimple(dialogText);
        } else if (status == 1) {
            if (selection == 998) {
                cm.openNpc(9040004, "战力奖励");
            } else if (selection == 997) {
                dialogText = `\t\t\t\t\t\t\t\t\t ${ICON} #r战力排行榜#k ${ICON}\r\n`;
                combatPowerRankings = getCombatPowerRankings();
                for (i in combatPowerRankings) {
                    var rank = parseInt(i) + 1;
                    var totalCombatPower = combatPowerRankings[i]["totalCombatPower"];
                    var name = combatPowerRankings[i]["name"];
                    var job = Job.getById(combatPowerRankings[i]["job"]).getName();
                    dialogText += `#L${i}##d[#b第${rank}名#d]  [#r${totalCombatPower}#b]  #d${name} - ${job}#k#l\r\n`;
                }

                cm.sendSimple(dialogText);
            } else {
                var equipment = cm.getInventory(-1).getItem(EQUIPMENT_SLOTS[selection]);
                if (equipment == null) {
                    dialogText = "\r\n\r\n\t\t\t抱歉..该类型为空\r\n ";
                } else {
                    var itemId = equipment.getItemId();
                    dialogText = `#i${itemId}:# #d#t${itemId}##k\r\n`;
                    dialogText += `#d力量 : #r${rightPadSpace(equipment.getStr(), 6)}#k`;
                    dialogText += `#d敏捷 : #r${rightPadSpace(equipment.getDex(), 6)}#k`;
                    dialogText += `#d智力 : #r${rightPadSpace(equipment.getInt(), 6)}#k`;
                    dialogText += `#d运气 : #r${rightPadSpace(equipment.getLuk(), 6)}#k\r\n`;
                    dialogText += `#d物攻 : #r${rightPadSpace(equipment.getWatk(), 6)}#k`;
                    dialogText += `#d魔攻 : #r${rightPadSpace(equipment.getMatk(), 6)}#k`;
                    dialogText += `#d物防 : #r${rightPadSpace(equipment.getWdef(), 6)}#k`;
                    dialogText += `#d魔防 : #r${rightPadSpace(equipment.getMdef(), 6)}#k\r\n`;
                    dialogText += `#d可升 : #r${rightPadSpace(equipment.getUpgradeSlots(), 6)}#k`;
                    dialogText += `#d已升 : #r${rightPadSpace(equipment.getLevel(), 6)}#k`;
                }
                cm.sendOk(dialogText);
                cm.dispose();
            }
        } else if (status == 2) {
            selectedCharacterIndex = selection;
            var totalCombatPower = 0;
            characterEquipments = getCharacterEquipments(combatPowerRankings[selection]["id"]);
            for (i in characterEquipments) {
                totalCombatPower += characterEquipments[i]["equipmentCombatPower"];
            }
            dialogText = `#d#r${combatPowerRankings[selection]["name"]}#d#b 的战力评分 : #r${totalCombatPower}#k`;
            var itemNum = 0;
            for (i in characterEquipments) {
                if (EQUIPMENT_SLOTS.indexOf(characterEquipments[i]["position"]) >= 0) {
                    if (itemNum++ % 4 == 0) dialogText += "\r\n";
                    dialogText += `#L${i}##d${EQUIPMENT_SLOT_NAMES[EQUIPMENT_SLOTS.indexOf(characterEquipments[i]["position"])]} #b${rightPadSpace(characterEquipments[i]["equipmentCombatPower"], 7)}#l`;
                }
            }
            cm.sendSimple(dialogText);
        } else if (status == 3) {
            var itemId = characterEquipments[selection]["itemid"];
            dialogText = `#i${itemId}:# #d#t${itemId}##k\r\n`;
            dialogText += `#d力量 : #r${rightPadSpace(characterEquipments[selection]["str"], 6)}#k`;
            dialogText += `#d敏捷 : #r${rightPadSpace(characterEquipments[selection]["dex"], 6)}#k`;
            dialogText += `#d智力 : #r${rightPadSpace(characterEquipments[selection]["int"], 6)}#k`;
            dialogText += `#d运气 : #r${rightPadSpace(characterEquipments[selection]["luk"], 6)}#k\r\n`;
            dialogText += `#d物攻 : #r${rightPadSpace(characterEquipments[selection]["watk"], 6)}#k`;
            dialogText += `#d魔攻 : #r${rightPadSpace(characterEquipments[selection]["matk"], 6)}#k`;
            dialogText += `#d物防 : #r${rightPadSpace(characterEquipments[selection]["wdef"], 6)}#k`;
            dialogText += `#d魔防 : #r${rightPadSpace(characterEquipments[selection]["mdef"], 6)}#k\r\n`;
            dialogText += `#d可升 : #r${rightPadSpace(characterEquipments[selection]["upgradeslots"], 6)}#k`;
            dialogText += `#d已升 : #r${rightPadSpace(characterEquipments[selection]["level"], 6)}#k`;
            cm.sendOk(dialogText);
            cm.dispose();
        }
    }
}

// ============ 数据获取函数 ============

// 获取角色装备列表
function getCharacterEquipments(characterId) {
    const conn = DatabaseConnection.getConnection();
    const ps = conn.prepareStatement(`
  SELECT
      chr.name,
      it.itemid,
      it.position,
      men.str,
      men.dex,
      men.int,
      men.luk,
      men.watk,
      men.matk,
      men.mdef,
      men.wdef,
      men.upgradeslots,
      men.level
  FROM inventoryitems it
  JOIN inventoryequipment men
      ON it.inventoryitemid = men.inventoryitemid
  JOIN characters chr
      ON it.characterid = chr.id
  WHERE
      it.position < 0
      AND chr.id = ?
  ORDER BY it.position DESC`);
    ps.setInt(1, characterId);

    const equipmentList = [];
    var rs;

    try {
        rs = ps.executeQuery();
        while (rs.next()) {
            var item = {
                name: rs.getString("name"),
                itemid: rs.getInt("itemid"),
                position: rs.getInt("position"),
                str: rs.getInt("str"),
                dex: rs.getInt("dex"),
                int: rs.getInt("int"),
                luk: rs.getInt("luk"),
                watk: rs.getInt("watk"),
                matk: rs.getInt("matk"),
                wdef: rs.getInt("wdef"),
                mdef: rs.getInt("mdef"),
                upgradeslots: rs.getInt("upgradeslots"),
                level: rs.getInt("level"),
            };
            item.equipmentCombatPower = calculateCombatPower(item);

            equipmentList.push(item);
        }
        rs.close();
    } catch (e) {
        console.error("获取角色装备失败: " + e.message);
    } finally {
        if (rs) rs.close();
        ps.close();
        conn.close();
    }

    return equipmentList;
}

// 获取战力排行榜（前100名）
function getCombatPowerRankings() {
    const conn = DatabaseConnection.getConnection();
    const ps = conn.prepareStatement(`
SELECT
    chr.id,
    chr.name,
    chr.job,
    SUM(
        men.str * ${COMBAT_POWER_WEIGHTS.STR} +
        men.dex * ${COMBAT_POWER_WEIGHTS.DEX} +
        men.int * ${COMBAT_POWER_WEIGHTS.INT} +
        men.luk * ${COMBAT_POWER_WEIGHTS.LUK} +
        men.watk * ${COMBAT_POWER_WEIGHTS.WATK} +
        men.matk * ${COMBAT_POWER_WEIGHTS.MATK} +
        men.wdef * ${COMBAT_POWER_WEIGHTS.WDEF} +
        men.mdef * ${COMBAT_POWER_WEIGHTS.MDEF}
    ) AS totalCombatPower
FROM
    inventoryitems it,
    inventoryequipment men,
    characters chr
WHERE
    it.position < 0
    AND it.inventoryitemid = men.inventoryitemid
    AND chr.id = it.characterid
    AND chr.gm <= 0
GROUP BY
    chr.id
ORDER BY
    totalCombatPower DESC
LIMIT 100`);

    var rankingList = [];
    var rs;

    try {
        rs = ps.executeQuery();
        while (rs.next()) {
            var ranking = [];
            ranking["id"] = rs.getInt("id");
            ranking["name"] = rs.getString("name");
            ranking["job"] = rs.getInt("job");
            ranking["totalCombatPower"] = rs.getInt("totalCombatPower");
            rankingList.push(ranking);
        }
        rs.close();
    } catch (e) {
        console.error("获取战力排行榜失败: " + e.message);
    } finally {
        if (rs) rs.close();
        ps.close();
        conn.close();
    }

    return rankingList;
}

// ============ 工具函数 ============

// 计算装备战力值
function calculateCombatPower(equip) {
    return (
        (equip.getStr ? equip.getStr() : equip.str) * COMBAT_POWER_WEIGHTS.STR +
        (equip.getDex ? equip.getDex() : equip.dex) * COMBAT_POWER_WEIGHTS.DEX +
        (equip.getInt ? equip.getInt() : equip.int) * COMBAT_POWER_WEIGHTS.INT +
        (equip.getLuk ? equip.getLuk() : equip.luk) * COMBAT_POWER_WEIGHTS.LUK +
        (equip.getWatk ? equip.getWatk() : equip.watk) * COMBAT_POWER_WEIGHTS.WATK +
        (equip.getMatk ? equip.getMatk() : equip.matk) * COMBAT_POWER_WEIGHTS.MATK +
        (equip.getMdef ? equip.getMdef() : equip.mdef) * COMBAT_POWER_WEIGHTS.MDEF +
        (equip.getWdef ? equip.getWdef() : equip.wdef) * COMBAT_POWER_WEIGHTS.WDEF
    );
}

function rightPadSpace(content, length) {
    content = content.toString();
    if (length > content.length) {
        return content + " ".repeat(length - content.length);
    } else {
        return content;
    }
}