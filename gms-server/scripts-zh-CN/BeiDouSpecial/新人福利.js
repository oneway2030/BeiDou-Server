/*
脚本：新人福利礼包
作者：SpicyBurgerKing
日期：2024-10-31
备注：北斗开发组
 */

var status;
var textMsg;
var key = "新人福利礼包"
var meso_id = 9999999;
var cash_id = 9999998;

var dailyRewards = [
    {id: meso_id, qty: 100},//金币单位W
    {id: cash_id, qty: 25000},//点卷
    {id: 2029001, qty: 1},//快捷菜单
    {id: 4000325, qty: 1},//胡罗卜
    {id: 2430033, qty: 10},//北斗书
];


var icon = "#fUI/UIWindow.img/QuestIcon/7/0#";

//Start
function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (CheckStatus(mode)) {
        if (status == 0) {
            //第一层对话
            var strGetText = cm.getCharacterExtendValue(key);
            if (strGetText == "已领取") {
                cm.sendOk("您已经领取了新手奖励了。每个角色#r限领一次。#k");
                cm.dispose();
            } else {
                let text = "您确定要领取新手礼包吗？一个角色#r限领一次。#k\r\n\r\n";
                text += "奖励：\r\n\r\n";
                dailyRewards.forEach(reward => {
                    if (reward.id === meso_id) {
                        text += icon + ` × ${reward.qty} W \t \r\n`;
                    } else if (reward.id === cash_id) {
                        text +=`点卷 × ${reward.qty} \t \r\n`;
                    } else {
                        text += `#v${reward.id}##t${reward.id}# x ${reward.qty}\r\n`;
                    }
                });
                cm.sendAcceptDecline(text);
            }
        } else if (status == 1) {
            //第二层对话
            if (!cm.isNotCanHold(2, 3)) {
                cm.saveOrUpdateCharacterExtendValue(key, "已领取");
                dailyRewards.forEach(reward => {
                    if (reward.id === meso_id) {
                        cm.gainMeso(reward.qty * 10000);
                    } else if (reward.id === cash_id) {
                        cm.getPlayer().getCashShop().gainCash(1, reward.qty);//点券
                    } else {
                        cm.gainItem(reward.id, reward.qty);
                    }
                });
                cm.sendOk("恭喜您获得新手奖励，祝您游戏愉快！");
                cm.dispose();
            }
        } else {
            //最后一层对话完继续循环至此，推出结束
            cm.dispose();
        }
    }

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