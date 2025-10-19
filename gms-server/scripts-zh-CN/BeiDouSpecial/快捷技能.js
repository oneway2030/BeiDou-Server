/*
脚本：新人福利礼包
作者：SpicyBurgerKing
日期：2024-10-31
备注：北斗开发组
 */

var status;
var textMsg;
var Title = "#e注意事项:#r请确保Y按键上没有技能或者其他物品，#b领取后在键盘Y键上自动生成该技能.获取技能后是满级的,因此会各占用二转和三转技能点20点,加技能时会提示技能点不足,可以使用删除二段跳后在加点,加完可以重新学习\r\n";

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
            text += " \r\n";
            text += " \r\n";
            text += "#L2#删除二段跳#n#l\r\n";
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
            getKill(2101002)
            break;
        case 1://二段跳
            getKill(4111006)
            break;
        case 2://删除二段跳
            cm.teachSkill(2101002, 0, 20, -1,true);
            cm.teachSkill(4111006, 0, 20, -1,true);
            cm.sendOk("已将技能瞬移和二段跳重置到0级,可以加技能点了,如需使用技能请重新学习！");
            cm.dispose();
            break;
        default:
            cm.dispose();
    }
}


// 获取瞬移
function getKill(killId) {
    cm.teachSkill(killId, 20, 20, -1);
    cm.getPlayer().addSkillToKeyboard(21, killId)
    cm.sendOk("恭喜你，获取技能成功！");
    cm.dispose();
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