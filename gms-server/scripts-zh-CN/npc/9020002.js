/**
 * 废弃副本,最后发放奖励的npc
 * 对应的任务配置文件KerningPQ
 */
var status;
var KERNING_COMPLETION_COUNT = "废弃副本完成次数"
//每日奖励最大次数
var max_reward_count = 3;
//当前副本完成次数
var completionCount;
// 奖励
var rewards = [
    {id: 0, qty: 10}, //金币单位W
    {id: 2049100, qty: 1},//混沌卷
];

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
    completionCount = 获取废弃副本完成次数();
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
                outText += `#b(每天只有前面#r${max_reward_count}次#b副本才有额外奖励,当前已完成#r${completionCount}次#b)`;
            }
            cm.sendYesNo(outText);
        } else if (mode == 1) {
            判断是否发奖励();
        }
    }
}

function 判断是否发奖励() {
    var mapId = cm.getPlayer().getMapId();
    //如果在组队训练场则发放奖励
    if (mapId == 103000805) {
        if (completionCount < max_reward_count) {
            if (能获取奖励()) {
                发放奖励();
                传送到出口();
            } else {
                cm.sendOk("背包空间不足,无法获取奖励!");
                cm.dispose();
            }
        } else {
            传送到出口();
        }
    } else {
        传送到出口();
    }
}

function 传送到出口() {
    cm.warp(103000890, "st00"); // Warp player
    cm.dispose();
}

function 发放奖励() {
    for (var i = 0; i < rewards.length; i++) {
        var reward = rewards[i];
        if (reward.id === 0) {
            // 发放金币，10W = 10 * 10000
            cm.gainMeso(reward.qty * 10000);
        } else {
            // 发放物品
            cm.gainItem(reward.id, reward.qty);
        }
    }
    保存废弃副本完成次数();
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

function 获取废弃副本完成次数() {
    let dayCount = cm.getCharacterExtendValue(KERNING_COMPLETION_COUNT, true);
    return Number(dayCount) || 0; // 处理未签到过的情况
}

function 保存废弃副本完成次数() {
    cm.saveOrUpdateCharacterExtendValue(KERNING_COMPLETION_COUNT, String(获取废弃副本完成次数() + 1), true);
}