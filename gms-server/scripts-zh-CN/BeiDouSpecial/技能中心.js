
/**
 * @description 拍卖行中心脚本
 */
var OldTitle = "\t\t\t\t\t#e#k欢迎来到#r[技能中心]#k系统#n\t\t\t\t\r\n";
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
        text += "#L1##b快捷技能(获取二段跳)#l\t\r\n\r\n";
        text += "#L2#技能全满#l\t\r\n\r\n";
        text += "#L3#三宠技能#l\t\r\n\r\n";
        text += "#L4#技能偷学#l\t\r\n\r\n";
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
            openNpc("快捷技能");
            break;
        case 2:
            openNpc("技能全满");
            break;
        case 3:
            openNpc("三宠技能");
            break;
        case 4:
            openNpc("技能偷学");
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


