const ExpTable = Java.type('org.gms.constants.game.ExpTable');
var 完成金币 = 1000;  // 1000W金币
var 基础经验奖励系数 = 2;  // e经验
var 奖励 = [
    [4032170, 10],  // 奖励道具1及数量
    [4032171, 10],  // 奖励道具2及数量
    [2029004, 2],  //双倍爆率
    [2029005, 2],    //三倍经验
    [4032133, 2]   //钻石
];
var 全部完成奖励 = [
    [1113231, 1],  //戒指
    [2049116, 15],  //正向
];

const targetCounts = [5, 10, 15, 20, 25];
var 基础任务ID = 700200;  // 任务ID基础值，用于标记完成状态
// 【新增】25档新奖励补领任务ID（和原有targetCounts错开，选30/99等都可以，避免冲突）
var 全部完成奖励任务ID = 基础任务ID + 50;
var completedCount = 0;
var icon_exp = "#fUI/UIWindow.img/QuestIcon/8/0#";

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode === -1) {
        cm.dispose();
        return;
    } else if (mode === 0) {
        status--;
    } else {
        status++;
    }

    if (status === 0) {
        let text = "当前世界任务完成情况如下：\r\n\r\n";
        let count = 0;
        completedCount = 0;

        // 遍历200001到200025的任务并统计完成数量
        for (let i = 200001; i <= 200025; i++) {
            const questNum = i - 200000;
            const isCompleted = cm.isQuestCompleted(i);
            if (isCompleted) completedCount++;

            // 已完成显示红色，未完成显示蓝色
            const colorCode = isCompleted ? "#r" : "#b";
            const num = isCompleted ? "1" : "0";
            const placeholder = questNum < 10 ? "0" : "";
            text += `${colorCode}世界任务${placeholder}${questNum} [${num} / 1]#k    `;

            count++;
            // 每行显示3个任务
            if (count % 3 === 0 && i !== 200025) {
                text += "\r\n";
            }
        }
        // 根据选择的奖励等级判断是否可领取
        let isCompleted1 = cm.isQuestCompleted(基础任务ID + targetCounts[0]) ? "#r已领取#b" : "未领取";
        let isCompleted2 = cm.isQuestCompleted(基础任务ID + targetCounts[1]) ? "#r已领取#b" : "未领取";
        let isCompleted3 = cm.isQuestCompleted(基础任务ID + targetCounts[2]) ? "#r已领取#b" : "未领取";
        let isCompleted4 = cm.isQuestCompleted(基础任务ID + targetCounts[3]) ? "#r已领取#b" : "未领取";
        // 【修改】25档显示优化：老用户领过原奖励的话，显示「补领新奖励」，否则显示原状态
        let isCompleted5 = cm.isQuestCompleted(基础任务ID + targetCounts[4]);
        let isGotNewReward = cm.isQuestCompleted(全部完成奖励任务ID);
        let fiveStatus = "";
        if (isCompleted5) {
            fiveStatus = isGotNewReward ? "#r已补领#b" : "#b可补领新奖励#k";
        } else {
            fiveStatus = "未领取";
        }
        text += "\r\n\r\n";
        text += `已完成 ${completedCount}/25 个世界任务\r\n\r\n`;
        text += "#L0##b5次任务完成奖励(" + isCompleted1 + ")#l\r\n";
        text += "#L1#10次任务完成奖励(" + isCompleted2 + ")#l\r\n";
        text += "#L2#15次任务完成奖励(" + isCompleted3 + ")#l\r\n";
        text += "#L3#20次任务完成奖励(" + isCompleted4 + ")#l\r\n";
        text += "#L4#25次任务完成奖励(" + fiveStatus + ")#l\r\n"; // 替换原25档显示
        cm.sendSimple(text);
    } else {
        if (status === 1) {
            const targetCount = targetCounts[selection];
            var realExp = 获取奖励经验(selection + 1);
            let 任务id = 基础任务ID + targetCount;
            // 重新计算已完成任务数量
            let completedCount = 0;
            for (let i = 200001; i <= 200025; i++) {
                if (cm.isQuestCompleted(i)) completedCount++;
            }
            // 检查是否达到领取条件
            if (completedCount >= targetCount) {
                // 【核心修改】单独处理25档（selection=4），其他档位保留原有逻辑
                if (selection === 4) {
                    handle25LevelReward(completedCount, realExp);
                } else {
                    // 原有0-3档逻辑，完全不变
                    if (cm.isQuestCompleted(任务id)) {
                        cm.sendOk(`你已经领取过${targetCount}次任务的奖励了哦！`);
                    } else {
                        if (cm.isNotCanHold(2)) { cm.dispose(); return; }
                        if (cm.isNotCanHold(4)) { cm.dispose(); return; }
                        cm.gainMeso(完成金币 * 10000);
                        cm.gainExp(realExp);
                        for (var k = 0; k < 奖励.length; k++) {
                            cm.gainItem(奖励[k][0], 奖励[k][1]);
                        }
                        cm.completeQuest(任务id); // 标记该档位奖励已领取
                        cm.sendOk(`成功领取${targetCount}次任务奖励！`);
                    }
                }
            } else {
                // 未达条件的提示逻辑，新增25档的奖励预览（包含新奖励）
                showNotEnoughTip(targetCount, completedCount, realExp, selection);
            }
            cm.dispose();
        }
    }
}

// 【新增】25档奖励处理核心方法（分新老用户）
function handle25LevelReward(completedCount, realExp) {
    let 原25档任务ID = 基础任务ID + 25;
    let 已领原奖励 = cm.isQuestCompleted(原25档任务ID);
    let 已领新奖励 = cm.isQuestCompleted(全部完成奖励任务ID);

    // 检查背包空间（通用+专属+新增奖励都要检查）
    if (cm.isNotCanHold(1)) { cm.dispose(); return; }
    if (cm.isNotCanHold(2)) { cm.dispose(); return; }
    if (cm.isNotCanHold(4)) { cm.dispose(); return; }

    // 情况1：老用户 - 已领原25档奖励，未领新奖励 → 仅补领新奖励
    if (已领原奖励 && !已领新奖励) {
        // 仅发放新增奖励
        for (var x = 0; x < 全部完成奖励.length; x++) {
            cm.gainItem(全部完成奖励[x][0], 全部完成奖励[x][1]);
        }
        cm.completeQuest(全部完成奖励任务ID); // 标记新奖励已领，避免重复
        cm.sendOk(`你之前已领过该奖励，成功补领25档新增专属奖励！`);
    }
    // 情况2：新用户 - 未领原25档奖励 → 发放全部（通用+全部完成+新增奖励）
    else if (!已领原奖励) {
        // 发放通用奖励
        cm.gainMeso(完成金币 * 10000);
        cm.gainExp(realExp);
        for (var k = 0; k < 奖励.length; k++) {
            cm.gainItem(奖励[k][0], 奖励[k][1]);
        }
        // 补上原代码漏发的「全部完成奖励」
        for (var m = 0; m < 全部完成奖励.length; m++) {
            cm.gainItem(全部完成奖励[m][0], 全部完成奖励[m][1]);
        }
        cm.completeQuest(原25档任务ID);
        cm.completeQuest(全部完成奖励任务ID);
        cm.sendOk(`成功领取25次全部任务奖励！包含通用奖励+新增专属奖励！`);
    }
    // 情况3：已领原奖励+已领新奖励 → 无法重复领取
    else {
        cm.sendOk(`你已经领取过25次任务的全部奖励（含新增奖励），无法重复领取！`);
    }
}

// 【新增】未达领取条件的提示方法（优化25档预览）
function showNotEnoughTip(targetCount, completedCount, realExp, selection) {
    let maxExp = 基础经验奖励系数 * (selection + 1);
    let text = `#r无法领取,#k需要完成${targetCount}个世界任务才能领取该奖励哦！\r\n当前已完成：${completedCount}个`;
    text += "\r\n\r\n";
    text += "#fUI/CashShop.img/CSDiscount/bonus#：\r\n";
    text += "金币" + 完成金币 + "W \r\n";
    text += icon_exp + ` × ${realExp}\r\n#b(等级越高获取的经验越多,最高${maxExp}E经验)#k\r\n`;
    // 通用奖励预览
    for (var j = 0; j < 奖励.length; j++) {
        var 奖励ID = 奖励[j][0];
        var 奖励个数 = 奖励[j][1];
        text += `#v${奖励ID}##z${奖励ID}##k × ${奖励个数}\r\n`;
    }
    // 25档额外预览「全部完成奖励+新增奖励」
    if (selection === 4) {
        text += "\r\n#r【全部完成专属奖励】#k\r\n";
        for (var m = 0; m < 全部完成奖励.length; m++) {
            text += `#v${全部完成奖励[m][0]}##z${全部完成奖励[m][0]}##k × ${全部完成奖励[m][1]}\r\n`;
        }
    }
    cm.sendOk(text);
}

function 获取奖励经验(Rate) {
    var 经验奖励;
    let levelExp = getNeedExp();
    let realExp = 基础经验奖励系数 * 100000000 * Rate;
    if (levelExp < realExp) {
        经验奖励 = levelExp;
    } else {
        经验奖励 = realExp;
    }
    return 经验奖励;
}

function getNeedExp() {
    return ExpTable.getExpNeededForLevel(cm.getPlayer().getLevel());
}