/*
脚本：新人福利礼包
作者：SpicyBurgerKing
日期：2024-10-31
备注：北斗开发组
 */
var OldTitle = "#e欢迎您的到来，请选择您需要的服务#n\t\t\t\t\r\n";
var status = -1;

//Start
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
        text += "#L0#新人福利#l \t #L1#领取二段跳#l\t \r\n";
        cm.sendSimple(text);
    } else if (status === 1) {
        doSelect(selection);
    } else {
        cm.dispose();
    }
}

function doSelect(selection) {
    switch (selection) {
        case 0:
            openNpc("新人福利");
            break;
        case 1:
            openNpc("快捷技能");
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