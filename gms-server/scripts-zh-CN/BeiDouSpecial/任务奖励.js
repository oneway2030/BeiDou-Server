var itemId = 2000005;   //奖励道具ID
var itemNum = 1;        //奖励道具数量
var CashPoint1Num = 1;  //点券数量
var CashPoint2Num = 1;  //抵用券数量
var MesoNum = 1;        //金币数量
var ApNum = 1;          //属性点数量


function start() {
    var str = ""
    if (itemId > 0 && itemNum > 0) {
        cm.gainItem(itemId, itemNum);
        str += `道具${itemId} x${itemNum}`;
    }
    if (CashPoint1Num > 0) {
        str += " ";
        cm.getPlayer().getCashShop().gainCash(1, CashPoint1Num);
        str += `点券 x${CashPoint1Num}`;
    }
    if (CashPoint2Num > 0) {
        str += " ";
        cm.getPlayer().getCashShop().gainCash(2, CashPoint2Num);
        str += `抵用券 x${CashPoint2Num}`;
    }
    if (MesoNum > 0) {
        str += " ";
        cm.gainMeso(MesoNum);
        str += `金币 x${MesoNum}`;
    }
    if (ApNum > 0) {
        str += " ";
        cm.getPlayer().gainAp(ApNum, false);
        str += `属性点 x${MesoNum}`;
    }
    if (str != "") {
        cm.getPlayer().dropMessage(6, "完成任务！获得奖励：" + str);
    }
    cm.dispose();
}