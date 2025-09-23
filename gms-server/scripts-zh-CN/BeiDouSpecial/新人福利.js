/*
脚本：新人福利礼包
作者：SpicyBurgerKing
日期：2024-10-31
备注：北斗开发组
 */

var status;
var textMsg;

//Start
function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (CheckStatus(mode)) {
        if (status == 0) {
            //第一层对话
            var strGetText = cm.getCharacterExtendValue("新人福利礼包13");
            if (strGetText == "已领取") {
                cm.sendOk("您已经领取了新手奖励了。每个角色#r限领一次。#k");
                cm.dispose();
            } else {
                cm.sendAcceptDecline("您确定要领取新手礼包吗？一个角色#r限领一次。#k");
            }
        } else if (status == 1) {
            //第二层对话
            if(isCanHold(2)){
                cm.saveOrUpdateCharacterExtendValue("新人福利礼包13", "已领取");
                cm.gainItem(2430033, 10);
                cm.gainItem(2029001, 1);
                cm.sendOk("恭喜您获得新手奖励，祝您游戏愉快！");
                cm.dispose();
            }
        } else {
            //最后一层对话完继续循环至此，推出结束
            cm.dispose();
        }
    }

}

/**
 * 背包是否满了
 * type 背包类型:1 装备 2 消耗 3 设置 4 其他 5 特殊
 * count 查询的格子数量,最少1格
 */
function isCanHold(type) {
    if (cm.getPlayer().isFull(type, 3)) {
        cm.sendOk("#r背包空间不足，请确保空间大于等于3格子！");
        cm.dispose();
        return false
    }
    return true
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