/**
 * 狩猎任务UI - 仅用于查看和提交任务
 * 所有逻辑已移到Java
 */

// 全局变量（供Java调用）
var status = -1;
var taskData = null;
var selectedTask = null;

// 常量
var TASK_DATA_KEY = "HUNT_TASK_DATA";
var DAILY_COUNT_PREFIX = "HUNT_DAILY_";

/**
 * 入口函数
 */
function start() {
    action(1, 0, 0);
}

/**
 * 动作处理
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
    // 从Java获取数据
    var task = taskData; // Java会设置这个变量
    var text = "";

    text += "#e#d╔═══════════════════════════════════╗#n#k\r\n";
    text += "#d║         #r【狩猎任务系统】#d         ║#k\r\n";
    text += "#d╚═══════════════════════════════════╝#n#k\r\n\r\n";

    if (!task) {
        text += "#e当前没有进行中的狩猎任务#k\r\n";
        text += "#e等待系统自动发布...#k\r\n";
    } else {
        var taskInfo = task.taskInfo;
        var playerCount = getPlayerItemCount(taskInfo.itemId);
        var dailyCount = getDailyCompleteCount();

        text += "#e当前任务：#b" + taskInfo.icon + " " + taskInfo.itemName + "#k#n\r\n";
        text += "#e任务ID：#k" + task.taskId + "\r\n";
        text += "#e需求数量：#k" + taskInfo.requiredCount + "个\r\n";
        text += "#e你的持有：#k" + playerCount + "个\r\n";

        if (task.completed) {
            text += "\r\n#r【任务已完成】#k\r\n";
            text += "#e完成玩家：#k" + (task.completedBy ? task.completedBy.name : "未知") + "\r\n";
            text += "#e完成时间：#k" + formatTime(task.completedBy ? task.completedBy.time : 0);
        } else {
            text += "\r\n#e任务状态：#g进行中#k\r\n";
            text += "#e剩余时间：#k" + formatRemainingTime(task.endTime) + "\r\n";
            text += "#e今日完成次数：#k" + dailyCount + "/" + HUNT_CONFIG.DAILY_LIMIT + "\r\n";

            var canSubmit = playerCount >= taskInfo.requiredCount && dailyCount < HUNT_CONFIG.DAILY_LIMIT;
            if (canSubmit) {
                text += "\r\n#b#L1#【提交任务】#l#n\r\n";
            } else {
                if (playerCount < taskInfo.requiredCount) {
                    text += "\r\n#r道具不足，无法提交（还需 " + (taskInfo.requiredCount - playerCount) + " 个）#k\r\n";
                }
                if (dailyCount >= HUNT_CONFIG.DAILY_LIMIT) {
                    text += "\r\n#r今日完成次数已达上限#k\r\n";
                }
            }
        }
    }

    text += "\r\n#L0#刷新任务状态#k";
    cm.sendSimple(text);
}

/**
 * 处理提交选择
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
 * 提交任务（由Java处理）
 */
function submitTask() {
    // 实际逻辑在Java中处理
    cm.sendOk("#e请等待系统处理...#k");
}

// 辅助函数（Java会提供或调用）
function getPlayerItemCount(itemId) { return 0; }
function getDailyCompleteCount() { return 0; }
function formatTime(timestamp) { return "未知"; }
function formatRemainingTime(endTime) { return "未知"; }
