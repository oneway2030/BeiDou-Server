/**
 * 废弃副本,最后发放奖励的npc
 * 对应的任务配置文件KerningPQ
 */
var status;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == 1) {
        status++;
    } else {
        cm.dispose();
        return;
    }
    var mapId = cm.getPlayer().getMapId();
    if (mapId == 103000890) {
        if (status == 0) {
            cm.sendNext("返回城市，请沿着这条路走。");
        } else {
            //返回废弃
            cm.warp(103000000);
            cm.dispose();
        }
    } else {
        if (status == 0) {
            var outText = "如果出去了,如果想要再挑战就要从头再来了.确定要离开吗?";
            if (mapId == 103000805) {
                outText = "确定要离开吗?\r\n";
                outText += `#b(每天只有前面#r${max_reward_count}次#b副本才有额外奖励,当前已完成#r${cm.getPQEnteredCount(副本类型)}次#b)`;
            }
            cm.sendYesNo(outText);
        } else if (mode == 1) {
            发放奖励();
        }
    }
}

let max_reward_count = 3;
let 副本类型 = 1;
// 奖励
var rewards = [
    {id: 2049100, qty: 1},//混沌卷
    {id: 2340000, qty: 2},//祝福
    {id: 2049115, qty: 1},//正向
];

function 发放奖励() {
    var mapId = cm.getPlayer().getMapId();
    if (mapId != 103000805) {
        //返回废弃
        cm.warp(103000000,32);
        cm.dispose();
        return;
    }
    let completedCount = cm.getPQEnteredCount(副本类型);
    //只有前三次才有特殊奖励
    if (completedCount < max_reward_count) {
        if (!能获取奖励()) {
            cm.sendOk("背包空间不足,无法获取奖励!");
            cm.dispose();
            return;
        }
        for (var i = 0; i < rewards.length; i++) {
            var reward = rewards[i];
            if (reward.id === 0) {
                // 发放金币，10W = 10 * 10000
                cm.gainMeso(reward.qty * 10000);
            } else if (reward.id === 2049115) {   // 正向
                var randomRate = Math.random(); // 生成0~1之间的随机数
                if (randomRate < 0.3) { // 30%概率触发
                    cm.gainItem(reward.id, reward.qty);
                }
            } else {
                // 发放物品
                cm.gainItem(reward.id, reward.qty);
            }
        }
        //获取经验
        gainPQExp();
        // 发放金币
        cm.gainMeso(300 * 10000);
    }
    //记录当天副本完成次数
    cm.recordEntryPQ(副本类型);
    //记录一次副本完成积分
    if (completedCount < 5) {
        cm.addPqPoints();
    }
    //发送副本完成广播
    cm.getPlayer().sendAllWordPQNotice("废弃副本");
    传送到出口();
}

function 传送到出口() {
    cm.warp(103000890, "st00"); // Warp player
    cm.dispose();
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

const ExpTable = Java.type('org.gms.constants.game.ExpTable');

/**
 * 副本经验奖励
 */
function gainPQExp() {
    let rewardExp = 1000 * 10000; // 初始经验值（整数）
    let level = cm.getPlayer().getLevel();
    let needExp = ExpTable.getExpNeededForLevel(level);
    if (needExp <= rewardExp) {
        // 计算0.98倍经验，并用Math.floor向下取整（转为整数）
        rewardExp = Math.floor(needExp * 0.99);
    }
    // 兜底：确保最终值是整数（防止极端情况）
    rewardExp = Math.floor(rewardExp);
    // 发放整数经验
    cm.getPlayer().gainExp(rewardExp);
}