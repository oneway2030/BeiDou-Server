/*
 * @description 装备分解脚本 - 分解装备栏第一格装备，返还使用过的红钻
 */
var OldTitle = "\t\t\t\t\t#e#k欢迎来到#r[装备分解]#k系统#n\t\t\t\t\r\n\r\n";
var status = -1;
var firstEquip;
var refundRedDiamond = 0;

var RED_DIAMOND_ID = 4032133;       // 红钻道具ID
var RED_DIAMOND_PER_WASH = 1;       // 每次洗练消耗红钻数量（与装备洗练.js一致）
var DEFAULT_MESO = 50000;           // 未使用过红钻时返还的金币

const InventoryType = Java.type('org.gms.client.inventory.InventoryType');
const InventoryManipulator = Java.type('org.gms.client.inventory.manipulator.InventoryManipulator');

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode === 1) {
        status++;
    } else if (mode === -1) {
        status--;
    } else {
        cm.dispose();
        return;
    }

    switch (status) {
        case 0:
            showMain();
            break;
        case 1:
            if (selection === 0) {
                doDecompose();
            } else {
                cm.sendOk("已取消分解。");
                cm.dispose();
            }
            break;
        default:
            cm.dispose();
    }
}

function showMain() {
    firstEquip = cm.getInventory(1).getItem(1);
    let text = OldTitle;
    text += "#b功能说明：#k\r\n";
    text += "1.将要分解的装备放在#r装备栏第一格#k\r\n";
    text += "2.分解后将#r永久销毁#k该装备\r\n";
    text += "3.按装备#b已洗练次数#k返还红钻（每次洗练消耗#v" + RED_DIAMOND_ID + "##t" + RED_DIAMOND_ID + "# x " + RED_DIAMOND_PER_WASH + "）\r\n";
    text += "4.未使用过红钻的装备将返还少量金币\r\n\r\n";

    if (!firstEquip) {
        text += "#r装备栏第一格没有装备，无法分解！#k\r\n";
        cm.sendOk(text);
        cm.dispose();
        return;
    }

    refundRedDiamond = calcRedDiamondRefund(firstEquip);
    text += "#b待分解装备：#k#v" + firstEquip.getItemId() + "##t" + firstEquip.getItemId() + "#\r\n";
    text += "已洗练次数：#r" + firstEquip.getUpgradeResetCount() + "#k\r\n";
    text += "已返还红钻次数：#r" + firstEquip.getUpgradeReturn() + "#k\r\n\r\n";

    if (refundRedDiamond > 0) {
        text += "#b预计返还：#k#v" + RED_DIAMOND_ID + "##t" + RED_DIAMOND_ID + "# x #r" + refundRedDiamond + "#k\r\n\r\n";
        text += "#r#e注意：分解后装备将消失，此操作不可撤销！#k#n\r\n\r\n";
        text += "#L0##b确认分解#l\t#L1##r取消#l\r\n";
        cm.sendSimple(text);
    } else {
        text += "#b预计返还：#k金币 #r" + DEFAULT_MESO + "#k\r\n\r\n";
        text += "#r#e注意：分解后装备将消失，此操作不可撤销！#k#n\r\n\r\n";
        text += "#L0##b确认分解#l\t#L1##r取消#l\r\n";
        cm.sendSimple(text);
    }
}

/**
 * 计算可返还的红钻数量
 * upgradeResetCount：洗练消耗次数；upgradeReturn：已返还次数
 */
function calcRedDiamondRefund(equip) {
    var washCount = equip.getUpgradeResetCount() || 0;
    var returnedCount = equip.getUpgradeReturn() || 0;
    var refundable = washCount - returnedCount;
    if (refundable < 0) {
        refundable = 0;
    }
    return refundable * RED_DIAMOND_PER_WASH;
}

function doDecompose() {
    var equip = cm.getInventory(1).getItem(1);
    if (!equip) {
        cm.sendOk("#r装备栏第一格没有装备，分解失败！#k");
        cm.dispose();
        return;
    }

    // 防止预览后更换装备
    if (firstEquip && equip.getItemId() !== firstEquip.getItemId()) {
        cm.sendOk("#r第一格装备已变更，请重新操作！#k");
        cm.dispose();
        return;
    }

    refundRedDiamond = calcRedDiamondRefund(equip);
    var resultText = "";

    if (refundRedDiamond > 0) {
        if (!cm.canHold(RED_DIAMOND_ID, refundRedDiamond)) {
            cm.sendOk("#r背包空间不足，无法容纳返还的 " + refundRedDiamond + " 个红钻！#k");
            cm.dispose();
            return;
        }
        cm.gainItem(RED_DIAMOND_ID, refundRedDiamond);
        resultText = "#b分解成功！#k\r\n";
        resultText += "已返还 #v" + RED_DIAMOND_ID + "##t" + RED_DIAMOND_ID + "# x #r" + refundRedDiamond + "#k\r\n";
    } else {
        cm.gainMeso(DEFAULT_MESO);
        resultText = "#b分解成功！#k\r\n";
        resultText += "该装备未消耗过红钻，已返还金币 #r" + DEFAULT_MESO + "#k\r\n";
    }

    InventoryManipulator.removeFromSlot(
        cm.getClient(),
        InventoryType.EQUIP,
        1,
        1,
        true
    );

    cm.sendOk(resultText);
    cm.dispose();
}
