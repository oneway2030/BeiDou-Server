// 冒险岛083怪物卡片戒指脚本
// 戒指的物品代码范围：1112880-1112889（共10个）

var status;
var cardCount;
var selectedReward;
var rewards = [
    {cards: 100, item: 1112880, costItem: 4001126, costMeso: 1000000},  //第一级戒指需要枫叶1个
    {cards: 200, item: 1112881, costItem: 1112880, costMeso: 2000000},
    {cards: 300, item: 1112882, costItem: 1112881, costMeso: 3000000},
    {cards: 400, item: 1112883, costItem: 1112882, costMeso: 4000000},
    {cards: 500, item: 1112884, costItem: 1112883, costMeso: 5000000},
    {cards: 600, item: 1112885, costItem: 1112884, costMeso: 6000000},
    {cards: 750, item: 1112886, costItem: 1112885, costMeso: 7000000},
    {cards: 900, item: 1112887, costItem: 1112886, costMeso: 8000000},
    {cards: 1200, item: 1112888, costItem: 1112887, costMeso: 9000000},
    {cards: 1500, item: 1112889, costItem: 1112888, costMeso: 10000000}  //一共343种怪物卡，每种5张，合计超过1700张。
];

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == 1) {
        status++;
    } else {
        status--;
    }
    
    if (status == 0) {
        cardCount = cm.getPlayer().getMonsterBook().getTotalCards();
        var text = "你当前收集了 #b" + cardCount + "#k 张怪物卡。\r\n";
        //text += "每次领取奖励需要一定的金币。#k\r\n";
        text += "可选择以下奖励：\r\n";
        
        for (var i = 0; i < rewards.length; i++) {
            var reward = rewards[i];
            var hasHigherItem = false;
            
            // 检查是否持有更高等级的怪物卡戒指，需要丢掉才允许换低等级的，避免同时佩戴多个
            for (var j = i + 1; j < rewards.length; j++) {
                if (cm.haveItem(rewards[j].item, 1) || cm.getPlayer().haveItemEquipped(rewards[j].item)) {
                    hasHigherItem = true;
                    break;
                }
            }
            
            if (hasHigherItem) {
                text += "#b#L" + i + "##v"+ reward.item + "##b#z"+ reward.item + "#收集" + reward.cards + "张 (可领取)#l#k\r\n";
            } else if (cardCount >= reward.cards) {
                text += "#b#L" + i + "##v"+ reward.item + "##b#z"+ reward.item + "#收集" + reward.cards + "张 (可领取)#l#k\r\n";
            } else {
                text += "#b#L" + i + "##v"+ reward.item + "##b#z"+ reward.item + "##k收集" + reward.cards + "张 (还需" + (reward.cards - cardCount) + "张)#l\r\n";
            }
        }
        
        cm.sendSimple(text);
    } else if (status == 1) {
        if (selection >= 0 && selection < rewards.length) {
            selectedReward = rewards[selection];
            
            // 再次检查是否有更高编号的物品
            var hasHigherItem = false;
            for (var i = selection + 1; i < rewards.length; i++) {
                if (cm.haveItem(rewards[i].item, 1) || cm.getPlayer().haveItemEquipped(rewards[i].item)) {
                    hasHigherItem = true;
                    break;
                }
            }
            
            if (hasHigherItem) {
                cm.sendOk("你已经拥有更高等级的怪物卡片戒指，无法领取此物品。");
                cm.dispose();
            } else {
                cm.sendYesNo("你确定领取#v" + selectedReward.item + "# #b#z" + selectedReward.item + "##k吗？\r\n需要花费 #b" + selectedReward.costMeso/10000 + "#k 万金币。");
            }
        } else {
            cm.dispose();
        }
    } else if (status == 2) {
        if (cardCount >= selectedReward.cards) {
            // 检查背包空间、装备栏和消耗品
            if (cm.haveItem(selectedReward.item, 1) || cm.getPlayer().haveItemEquipped(selectedReward.item)) {
                cm.sendOk("你已经领取了该奖励，无需重复领取。");
            } else if (cm.getMeso() < selectedReward.costMeso) {
                cm.sendOk("领取失败！你需要 #b" + selectedReward.costMeso/10000 + "#k 万金币。");
            } else if (!cm.canHold(selectedReward.item)) {
                cm.sendOk("请确保背包有至少1个空位。");
            } else if (!cm.haveItem(selectedReward.costItem, 1)) {
                cm.sendOk("领取失败！你需要1个#v" + selectedReward.costItem + "# #b#t" + selectedReward.costItem + "##k，并取下戒指放在背包。");
            } else {
                // 扣除消耗品
                cm.gainItem(selectedReward.costItem, -1);
                cm.gainMeso(-selectedReward.costMeso);
                // 发放奖励
                cm.gainItem(selectedReward.item, 1);
                cm.sendOk("成功领取奖励：#v" + selectedReward.item + "# #b#t" + selectedReward.item + "##k！");
            }
        } else {
            cm.sendOk("你还没有收集足够的怪物卡。");
        }
        cm.dispose();
    } else {
        cm.dispose();
    }
}
