var status = -1;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        if (mode == 0 && status == 0) {
            cm.dispose();
            return;
        }

        if (mode == 1) {
            status++;
        } else {
            status--;
        }

        if (cm.getMapId() == 925100500) {
            if (status == 0) {
                if (cm.isEventLeader()) {
                    cm.sendOk("多亏了你们的努力，我得救了！谢谢，伙计们！");
                } else {
                    cm.sendOk("多亏了你们的努力，我得救了！谢谢你们！在我给你们奖励之前，让你们的队长先和我说话...");
                    cm.dispose();
                }
            } else {
                cm.getEventInstance().clearPQ();
                cm.dispose();
            }
        } else {
            if (status == 0) {
                let tip = "#k点击确定后领取奖励并离开\r\n";
                let completedCount = cm.getPQEnteredCount(副本类型);
                tip += `#b今天已完成${completedCount}次副本\r\n\r\n`;
                cm.sendYesNo(tip);
            } else if (status == 1) {
                发放奖励();
            }
        }

    }
}

let 副本类型 = 3;
// 奖励
var rewards = [
    {id: 2049100, qty: 1},//混沌卷
    {id: 2340000, qty: 1},//祝福
];

function 发放奖励() {
    var mapId = cm.getPlayer().getMapId();
    if (mapId != 925100600) {
        cm.getPlayer().dropMessage("地图不匹配无法获取奖励.");
        return;
    }
    let completedCount = cm.getPQEnteredCount(副本类型);
    //只有前三次才有特殊奖励
    if (completedCount < 50) {
        if (!能获取奖励()) {
            cm.sendOk("背包空间不足,无法获取奖励!");
            cm.dispose();
            return;
        }
        //每天第一次完成发放一次阳光
        if (completedCount < 1) {
            if (!cm.canHold(4032266, 1)) {
                cm.sendOk("背包空间不足,无法获取奖励!");
                cm.dispose();
                return;
            }
            cm.gainItem(4032266, 1); //温暖的阳光，兑换划痕眼镜1022073
        }
        for (var i = 0; i < rewards.length; i++) {
            var reward = rewards[i];
            if (reward.id === 0) {
                // 发放金币，10W = 10 * 10000
                cm.gainMeso(reward.qty * 10000);
            } else {
                // 核心修改：添加50%概率判断
                var randomRate = Math.random(); // 生成0~1之间的随机数
                if (randomRate < 0.3) { // 50%概率触发
                    cm.gainItem(reward.id, reward.qty);
                }
            }
        }
        //获取经验
        cm.gainPQExp(100);
        // 发放金币
        cm.gainMeso(200 * 10000);
        cm.warp(251010404, 0);
        cm.dispose();
    }
    // 随机40-60个枫叶
    var randomNum = Math.floor(Math.random() * (60 - 40 + 1)) + 40;
    cm.gainItem(4001126, randomNum);
    //记录当天副本完成次数
    cm.recordEntryPQ(副本类型);
    //记录一次副本完成积分
    if (completedCount < 5) {
        cm.addPqPoints();
    }
    //发送副本完成广播
    cm.getPlayer().sendAllWordPQNotice("海盗副本");
}

function 能获取奖励() {
    for (var i = 0; i < rewards.length; i++) {
        var reward = rewards[i];
        if (reward.id != 0 && !cm.canHold(reward.id, reward.qty)) {
            return false;
        }
    }
    return true;
}