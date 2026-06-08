/**
 * 狩猎任务UI脚本
 * 仅作为界面展示和任务提交
 * 支持两种任务类型：
 * - type=1: 收集物品，需要玩家提交道具
 * - type=2: 打BOSS，第一个击杀该BOSS的玩家获得奖励
 */

// 导入Java类
var HuntTaskAutoPublisher = Java.type('org.gms.server.timer.HuntTaskAutoPublisher');
var Server = Java.type('org.gms.net.server.Server');
var InventoryType = Java.type('org.gms.client.inventory.InventoryType');

// 全局变量
var status = -1;

/**
 * 入口函数
 */
function start() {
    action(1, 0, 0);
}

/**
 * 动作处理函数
 */
function action(mode, type, selection) {
    if (mode === 1) {
        status++;
    } else if (mode === -1) {
        status--;
    } else {
        cm.dispose();
        return;
    }

    try {
        switch (status) {
            case 0:
                showMainMenu();
                break;
            case 1:
                handleSubmit(selection);
                break;
            default:
                cm.dispose();
                break;
        }
    } catch (e) {
        cm.sendOk("系统错误：" + e.message);
        cm.dispose();
    }
}

/**
 * 显示主菜单
 */
function showMainMenu() {
    var publisher = HuntTaskAutoPublisher.getInstance();
    var currentTask = publisher.getCurrentTask();

    var text = "#e#r【狩猎任务系统】#n#k\r\n\r\n";
    text += "#d玩法说明：\r\n";
    
    // 获取配置信息
    var taskInterval = publisher.getTaskInterval() / 3600; // 转换为小时
    var rewardItems = publisher.getRewardItems();
    
    text += "1.每隔" + taskInterval + "小时发布一次任务\r\n";
    text += "2.全服只有第一个完成的人能获取奖励：\r\n#b";
    text += "   - 金币 +" + publisher.getGoldReward() + "\r\n";
    text += "   - 经验 +" + publisher.getExpReward() + "\r\n";
    text += "   - 点券 +" + publisher.getCashReward() + "#d\r\n";
    text += "3.并且有几率获取如下道具：#r\r\n";
    
    if (rewardItems != null && rewardItems.length > 0) {
        for (var i = 0; i < rewardItems.length; i++) {
            var item = rewardItems[i];
            text += "   - #z" + item.getItemId() + "#"+"  x"+item.getCount()+"\r\n";
            if (i < rewardItems.length - 1) {
                text += "";
            }
        }
    } else {
        text += "无#d";
    }
    text += "\r\n";
    
    text += "\r\n";
    // 检查任务是否存在（BOSS任务有bossId，收集任务有itemId）
    if (!currentTask || (currentTask.getItemId() === 0 && currentTask.getBossId() === 0)) {
        text += "#r当前没有进行中的狩猎任务#k\r\n";
        text += "等待系统自动发布...\r\n";
        cm.sendOk(text);
        cm.dispose();
        return;
    }

    // 判断是否是BOSS狩猎任务
    if (currentTask.isBossTask()) {
        // BOSS狩猎任务
        text += "#e任务类型：狩猎BOSS#n\r\n";
        text += "目标怪物：" + currentTask.getItemName() + "\r\n";

        if (currentTask.isCompleted()) {
            text += "\r\n#r任务状态：已完成#k\r\n";
            text += "#b完成玩家：" + currentTask.getCompletedByName() + "#k\r\n";
            text += "#r下次刷新：" + formatTime(currentTask.getEndTime()) + "#k\r\n";
        } else {
            text += "\r\n#b任务状态：进行中#k\r\n";
            text += "#r下次刷新：" + formatTime(currentTask.getEndTime()) + "#k\r\n";
            text += "\r\n#r第一个击杀该BOSS的玩家直接获得奖励！#k";
        }
        cm.sendOk(text);
        cm.dispose();
        return;
    }

    // 收集物品任务
    var player = cm.getPlayer();
    var itemCount = player.getItemQuantity(currentTask.getItemId(), false);
    text += "#b任务类型：收集物品#n\r\n";
    text += "#v" + currentTask.getItemId() + "# #z" + currentTask.getItemId() + "#\r\n";
    text += "需求数量：" + currentTask.getNeedCount() + "个\r\n";
    text += "你的持有：" + itemCount + "个\r\n";

    if (currentTask.isCompleted()) {
        text += "\r\n#r任务状态：已完成#k\r\n";
        text += "#b完成玩家：" + currentTask.getCompletedByName() + "\r\n";
        text += "#r下次刷新：" + formatTime(currentTask.getEndTime()) + "#k\r\n";
        cm.sendOk(text);
        cm.dispose();
        return;
    }

    text += "\r\n#b任务状态：进行中#k\r\n";
    text += "#r下次刷新：" + formatTime(currentTask.getEndTime()) + "#k\r\n";

    var canSubmit = itemCount >= currentTask.getNeedCount();

    if (canSubmit) {
        text += "\r\n#b#L1#提交任务#l#k\r\n";
    }else {
        text += "\r\n#e道具数量不足，无法提交任务#k\r\n";
    }
    cm.sendSimple(text);
}

/**
 * 格式化时间戳为 时:分 格式
 */
function formatTime(timestamp) {
    var date = new java.util.Date(timestamp);
    var hours = date.getHours();
    var minutes = date.getMinutes();

    if (hours < 10) {
        hours = "0" + hours;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }

    return hours + ":" + minutes;
}

/**
 * 处理提交
 */
function handleSubmit(selection) {
    if (selection === 0) {
        status = -1;
        start();
        return;
    }

    if (selection === 1) {
        submitTask();
        return;
    }

    cm.dispose();
}

/**
 * 提交任务
 */
function submitTask() {
    var publisher = HuntTaskAutoPublisher.getInstance();
    var currentTask = publisher.getCurrentTask();
    var player = cm.getPlayer();

    // 检查任务是否存在（BOSS任务有bossId，收集任务有itemId）
    if (!currentTask || (currentTask.getItemId() === 0 && currentTask.getBossId() === 0)) {
        cm.sendOk("#r当前没有进行中的狩猎任务#k");
        cm.dispose();
        return;
    }

    // BOSS任务不能通过这里提交
    if (currentTask.isBossTask()) {
        cm.sendOk("#rBOSS狩猎任务无需提交！\r\n请击杀对应BOSS即可获得奖励。#k");
        cm.dispose();
        return;
    }

    if (currentTask.isCompleted()) {
        cm.sendOk("#r任务已被其他玩家完成！\r\n你未能抢先完成。#k");
        cm.dispose();
        return;
    }

    var itemCount = player.getItemQuantity(currentTask.getItemId(), false);

    if (itemCount < currentTask.getNeedCount()) {
        cm.sendOk("#r道具数量不足！\r\n需要：" + currentTask.getNeedCount() + "个\r\n当前：" + itemCount + "个\r\n还差：" + (currentTask.getNeedCount() - itemCount) + "个#k");
        cm.dispose();
        return;
    }

    // 调用Java方法检测是否可以完成任务
    var canComplete = publisher.canCompleteTask(player);

    if (canComplete === 1) {
        cm.sendOk("#r任务已被其他玩家完成！\r\n你未能抢先完成。#k");
        cm.dispose();
        return;
    }

    if (canComplete === 2) {
        cm.sendOk("#r任务已过期！#k");
        cm.dispose();
        return;
    }

    if (canComplete === 3) {
        cm.sendOk("#r道具数量不足！#k");
        cm.dispose();
        return;
    }

    // 扣除道具（使用负数表示扣除）
    cm.gainItem(currentTask.getItemId(), -currentTask.getNeedCount());

    // 标记任务完成
    publisher.markTaskCompleted(player.getName());

    // 显示奖励（从配置文件读取奖励值）
    var text = "#e#r【狩猎任务完成！】#n#k\r\n\r\n";
    text += "恭喜你完成了狩猎任务！\r\n\r\n";
    text += "奖励如下：\r\n";
    text += "#b金币 +" + publisher.getGoldReward() + "#k\r\n";
    text += "#b经验 +" + publisher.getExpReward() + "#k\r\n";
    text += "#b点券 +" + publisher.getCashReward() + "#k\r\n";

    cm.sendOk(text);
    cm.dispose();
}
