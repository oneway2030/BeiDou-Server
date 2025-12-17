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
const targetCounts = [5, 10, 15, 20, 25];
var 基础任务ID = 700200;  // 任务ID基础值，用于标记完成状态
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
        let isCompleted5 = cm.isQuestCompleted(基础任务ID + targetCounts[4]) ? "#r已领取#b" : "未领取";
        text += "\r\n\r\n";
        text += `已完成 ${completedCount}/25 个世界任务\r\n\r\n`;
        text += "#L0##b5次任务完成奖励(" + isCompleted1 + ")#l\r\n";
        text += "#L1#10次任务完成奖励(" + isCompleted2 + ")#l\r\n";
        text += "#L2#15次任务完成奖励(" + isCompleted3 + ")#l\r\n";
        text += "#L3#20次任务完成奖励(" + isCompleted4 + ")#l\r\n";
        text += "#L4#25次任务完成奖励(" + isCompleted5 + ")#l\r\n";
        cm.sendSimple(text);
    } else {
        if (status === 1) {
            // 根据选择的奖励等级判断是否可领取
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
                // 检查是否已经领取过该奖励（使用临时变量存储领取状态）
                if (cm.isQuestCompleted(任务id)) {
                    cm.sendOk(`你已经领取过${targetCount}次任务的奖励了哦！`);
                } else {
                    // 检查背包空间
                    if (cm.isNotCanHold(2)) {  // 检查消耗类型背包
                        return;
                    }
                    // 检查背包空间
                    if (cm.isNotCanHold(4)) {  // 检查其他类型背包
                        return;
                    }
                    // 发放100万金币奖励
                    cm.gainMeso(完成金币 * 10000);
                    //发放经验奖励
                    cm.gainExp(realExp);
                    //发放道具
                    for (var k = 0; k < 奖励.length; k++) {
                        cm.gainItem(奖励[k][0], 奖励[k][1]);
                    }
                    //标记领取过了
                    cm.completeQuest(任务id);
                    let text = `#b恭喜你领取了${targetCount}次任务完成奖励#k`
                    text += "\r\n\r\n";
                    text += "#fUI/CashShop.img/CSDiscount/bonus#：\r\n";
                    text += "金币" + 完成金币 + "W \r\n";
                    text += icon_exp + ` × ${realExp}\r\n`;
                    for (var j = 0; j < 奖励.length; j++) {
                        var 奖励ID = 奖励[j][0];
                        var 奖励个数 = 奖励[j][1];
                        text += `#v${奖励ID}##t${奖励ID}##k × ${奖励个数}\r\n`;
                    }
                    cm.getPlayer().sendAllWordNoticeNew("世界任务", `恭喜肝帝${cm.getPlayer().getName()}领取世界任务累计${targetCount}次奖励!`)
                    cm.sendOk(text)
                }
            } else {
                let maxExp = 基础经验奖励系数 * (selection + 1)
                let text = `#r无法领取,#k需要完成${targetCount}个世界任务才能领取该奖励哦！\r\n当前已完成：${completedCount}个`;
                text += "\r\n\r\n";
                text += "#fUI/CashShop.img/CSDiscount/bonus#：\r\n";
                text += "金币" + 完成金币 + "W \r\n";
                text += icon_exp + ` × ${realExp}\r\n#b(等级越高获取的经验越多,最高${maxExp}E经验)#k\r\n`;
                for (var j = 0; j < 奖励.length; j++) {
                    var 奖励ID = 奖励[j][0];
                    var 奖励个数 = 奖励[j][1];
                    text += `#v${奖励ID}##t${奖励ID}##k × ${奖励个数}\r\n`;
                }
                cm.sendOk(text);
            }
            cm.dispose();
        }
    }
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