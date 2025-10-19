var status;
var item;

//Start
function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (CheckStatus(mode)) {
        if (status == 0) {
            item = cm.getInventory(1).getItem(1);
            if (!item) {
                cm.sendOk("装备栏第一格道具不存在！");
                cm.dispose();
                return;
            }
            var usedTime = item.getLevel();
            var hasTime = item.getUpgradeSlots();
            if (usedTime + hasTime >= 255) {
                cm.sendOk("已经达到最高砸卷次数255！");
                cm.dispose();
                return;
            }
            if (cm.getPlayer().getCashShop().getCash(1) < 10000) {
                cm.sendOk("点券数量不足10000！");
                cm.dispose();
                return;
            }
            cm.sendYesNo("您想要使用10000点券为装备栏第一格的装备增加升级次数吗？（最高255次）");
        }
        else if (status == 1) {
            cm.getPlayer().getCashShop().gainCash(1, -10000);
            item.setUpgradeSlots(item.getUpgradeSlots() + 1);
            var newItem = item.copy();
            const InventoryManipulator = Java.type('org.gms.client.inventory.manipulator.InventoryManipulator');
            const InventoryType = Java.type('org.gms.client.inventory.InventoryType');
            InventoryManipulator.removeFromSlot(cm.getClient(), InventoryType.EQUIP, 1, 1, true);
            InventoryManipulator.addFromDrop(cm.getClient(), newItem);
            cm.sendOk("增加砸卷次数成功！")
            cm.dispose();
        }
        else {
            //最后一层对话完继续循环至此，退出结束
            cm.dispose();
        }
    }

}

function CheckStatus(mode) {
    if (mode == -1) {
        cm.dispose();//点击了取消，停止，结束
        return false;
    }

    if (mode == 1) {
        status++;
    }
    else {
        status--;
    }

    if (status == -1) {
        cm.dispose();//防止第一层对话带有上一项或者取消按钮而产生bug。
        return false;
    }
    return true;
}