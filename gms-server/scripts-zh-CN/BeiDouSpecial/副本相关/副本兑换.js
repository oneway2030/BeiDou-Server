/**
 * @description 拍卖行中心脚本
 */
var OldTitle = "\t\t\t\t\t#e#k欢迎来到#r[副本兑换]#k系统#n\t\t\t\t\r\n";
var status = -1;
var i = 0;

function start() {
    action(1, 0, 0)
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
    if (status === 0) {
        let text = OldTitle;
        text += " \r\n";
        text += "#k累计副本积分:#r" + cm.getPqTotalPoints() + "\t\t";
        text += "#k剩余副本积分:#r" + cm.getPqPoints() + " \r\n";
        text += "\r\n";
        text += "#L1#积分兑换#l\t\r\n\r\n";
        text += "#L2#副本道具兑换道具#l\t\r\n\r\n";
        text += "#L3#累计积分奖励#l\t\r\n\r\n";
        cm.sendSimple(text);
    } else if (status === 1) {
        doSelect(selection);
    } else {
        cm.dispose();
    }
}

function doSelect(selection) {
    switch (selection) {
        case 1:
            openNpc("副本相关/副本积分兑换");
            break;
        case 2:
            openNpc("副本相关/副本道具兑换道具");
            break;
        case 3:
            openNpc("副本相关/副本积分累计奖励");
            break;
        default:
            cm.sendOk("该功能暂不支持，敬请期待！");
            cm.dispose();
    }
}

function openNpc(scriptName) {
    cm.dispose();
    cm.openNpc(9900001, scriptName);
}