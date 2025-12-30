var itemSet = Array(
    Array(4001163, 1),//紫色魔力晶石
    Array(2022345, 1),//大力药水
    Array(2022273, 2),//土司奶酪
    // Array(2022282, 2),//玛瑙苹果
    // Array(2022282, 4),//恶魔药剂
    Array(2340000, 3),//祝福
    Array(2049100, 3),//混沌
    Array(2049115, 10),//正向
    Array(4039020, 3),//金蛋
);

var status = 0;
var selectedItem;
var item;
var cost;
var qty;
var co;

function start() {
    action(1, 0, 0);
}

function action(mode, type, selection) {
    status++;
    if (mode == -1) {
        cm.dispose();
        return;
    } else if (mode == 0) {
        // cm.sendOk("欢迎下次再来!.");
        cm.dispose();
        return;
    }
    if (status == 1) {
        var add = "请选择你要兑换的道具\r\n";
        add += "#d剩余积分余额：#b" + cm.getPqPoints() + "#k          ";
        for (var i = 0; i < itemSet.length; i++) {
            // add += "\r\n#L" + i + "##v " + itemSet[i][0] + "#";
            // add += "         需要积分:" + itemSet[i][1];
            add += `\r\n#L${i}##v${itemSet[i][0]}# #b#z${itemSet[i][0]}#  #k需要积分 #bx ${itemSet[i][1]}#k`;
        }
        cm.sendSimple(add);
    } else if (status == 2) {
        selectedItem = selection;
        item = itemSet[selectedItem][0];
        co = itemSet[selectedItem][1];
        var bdd = "你想要兑换：\r\n";
        bdd += "\r\n#i" + item + "# " + " #t" + item + "#";
        bdd += " 单个物品需要积分:#r " + co + "\r\n\r\n\r\n";
        bdd += "请输入兑换个数\r\n";
        cm.sendGetNumber(bdd, 1, 1, 100)
    } else if (status == 3) {
        qty = (selection > 0) ? selection : (selection < 0 ? -selection : 1);
        cm.sendYesNo("你确定要兑换：" + qty + "个#b#t" + item + "##k吗？\r\n");
    } else if (status == 4) {
        cost = co * qty;   //花费为物品单价*输入的数量
        if (cm.getPqPoints() < cost) {
            cm.sendOk("积分不足。");
        } else {
            if (cm.canHold(item, qty)) {
                cm.consumptionPqPoints(cost);
                cm.gainItem(item, qty);
                cm.sendOk("兑换成功。");
                cm.getPlayer().sendAllWordNoticeNew(6, "副本兑换", `恭喜玩家${cm.getPlayer().getName()}兑换了一个【${cm.getPlayer().getItemName(item)}】!`);
            }else {
                cm.sendOk("背包空间不足。");
            }
        }
        cm.dispose();
    }
}
