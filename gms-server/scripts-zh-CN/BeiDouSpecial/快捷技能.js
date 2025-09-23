/*
脚本：新人福利礼包
作者：SpicyBurgerKing
日期：2024-10-31
备注：北斗开发组
 */

var status;
var textMsg;
var Title = "#e注意事项:#r请确保Y按键上没有技能或者其他物品，#b领取技能后切换频道或者重新登陆游戏，#r键盘上即可显示该技能#n\r\n";
//Start
function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (CheckStatus(mode)) {
        if (status == 0) {
            let text = Title;
            text += " \r\n";
            text += "#b请选择您要领取的技能";
            text += " \r\n";
            text += " \r\n";
            text += " #s2201002# #L0##r快速移动#n#l\r\n";
            text += " \r\n";
            text += " \r\n";
            text += " #s4111006# #L1##r二段跳#n#l\r\n";
            cm.sendSimple(text);
        } else if (status == 1) {
            doSelect(selection)
        } else {
            //最后一层对话完继续循环至此，推出结束
            cm.dispose();
        }
    }
}

function doSelect(selection) {
    switch (selection) {
        case 0://瞬移
            getKill(2201002)
            break;
        case 1://二段跳
            getKill(4111006)
            break;
        default:
            cm.dispose();
    }
    cm.sendOk("恭喜你，获取技能成功，请切换频道或重启生效！");
    cm.dispose();
}


// 获取瞬移
function getKill(killId) {
    cm.teachSkill(killId, 20, 20, -1);
    cm.getPlayer().addSkillToKeyboard(21, killId)
}

function CheckStatus(mode) {
    if (mode == -1) {
        cm.dispose();
        return false;
    }

    if (mode == 1) {
        status++;
    } else {
        status--;
    }

    if (status == -1) {
        cm.dispose();
        return false;
    }
    return true;
}