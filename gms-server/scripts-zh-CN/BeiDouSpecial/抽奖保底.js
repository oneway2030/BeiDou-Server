/**
 * @description 抽奖保底系统脚本
 */
var OldTitle = "\t\t\t\t\t#e#k欢迎来到#r[抽奖保底]#k系统#n\t\t\t\t\r\n";
var status = -1;
var i = 0;
var 保底次数 = 6000;
var 奖池ID = 37;

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
        text += "#r1.当前总抽奖次数：" + cm.getTotalGachaponCount() + "\r\n";
        text += "2.每" + 保底次数 + "次可以保底抽奖一次\r\n";
        text += "3.保底抽奖将会从最高奖池中随机抽取一件装备\r\n";
        text += "\r\n";
        var 当前抽奖次数 = cm.getTotalGachaponCount();
        var 可保底次数 = Math.floor(当前抽奖次数 / 保底次数);
        text += "#b#L1#抽奖一次保底#r（当前可抽奖" + 可保底次数 + "次）#l\r\n";
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
            doGuaranteedDraw();
            break;
        default:
            cm.sendOk("该功能暂不支持，敬请期待！");
            cm.dispose();
    }
}

function doGuaranteedDraw() {
    var 当前抽奖次数 = cm.getTotalGachaponCount();
    var 可保底次数 = Math.floor(当前抽奖次数 / 保底次数);

    if (可保底次数 <= 0) {
        cm.sendOk("当前抽奖次数不足，无法进行保底抽奖！");
        cm.dispose();
        return;
    }

    // 检查背包是否有空位
    if (!cm.canHold(1302000) || !cm.canHold(2000000) || !cm.canHold(3010001) || !cm.canHold(4000000)) {
        cm.sendOk("请确保你的#r装备、消耗、设置#k和#r其他#k物品栏中至少有一个空位。");
        cm.dispose();
        return;
    }

    // 执行保底抽奖，从奖池37获取奖励，消耗保底次数
    cm.doGuaranteedGachapon(奖池ID, 保底次数);

    cm.sendOk("恭喜你获得保底奖励！已消耗 " + 保底次数 + " 次抽奖次数。");
    cm.dispose();
}

function openNpc(scriptName) {
    cm.dispose();
    cm.openNpc(9900001, scriptName);
}