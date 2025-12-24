/**
 * @author: Ronan
 * @npc: Ellin
 * @map: Ellin PQ
 * @func: Ellin PQ Coordinator
 */

var status = 0;
var mapid;

function start() {
    mapid = cm.getPlayer().getMapId();

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

        if (status == 0) {
            var ellinStr = ellinMapMessage(mapid);

            if (mapid == 930000000) {
                cm.sendNext(ellinStr);
            } else if (mapid == 930000300) {
                var eim = cm.getEventInstance();

                if (eim.getIntProperty("statusStg4") == 0) {
                    eim.showClearEffect(cm.getMap().getId());
                    eim.setIntProperty("statusStg4", 1);
                }

                cm.sendNext(ellinStr);
            } else if (mapid == 930000700) {//领奖npc
                cm.sendYesNo(ellinStr);
            } else {
                cm.sendYesNo(ellinStr + "\r\n\r\n你想离开？请再三考虑，也许你的队友还在尝试这个任务.");
            }
        } else if (status == 1) {
            if (mapid == 930000000) {
                cm.warp(300030100);
                cm.dispose();
            } else if (mapid == 930000300) {
                cm.getEventInstance().warpEventTeam(930000500);
                cm.dispose();
            } else {
                发放奖励();
            }
        }
    }
}

function ellinMapMessage(mapid) {
    switch (mapid) {
        case 930000000:
            return "欢迎来到毒雾森林。进入入口继续.";

        case 930000100:
            return "#b#o9300172##k 已经占领了这个地区。我们必须消灭所有这些被污染的怪物才能继续前.";

        case 930000200:
            return "一根大刺藤挡住了前面的路。为了消除这个障碍，我们必须找回#b#o9300173##k以阻止过度生长的脊柱。然而，天然状态下的毒药是不能处理的，因为它太浓了.我们需要再#b泉水#k那边稀释";

        case 930000300:
            return "太棒了,你们来到这里了.我们现在可以继续深入树林探索了.";

        case 930000400:
            return "#b#o9300175##k空这里这里.然而他们并不是普通的怪物,他们生长的很快,#r普通的攻击和魔法完全不法伤害他们#k.我们必须使用#b#t2270004##k净化这些被污染的怪物!让你的队长给我20个怪物毒珠.";

        case 930000600:
            return "这个森林问题的根源就在这里了! 把得到的#z4001163#放到祭坛上,保护好自己!";

        case 930000700:
            let completedCount = cm.getPQEnteredCount(副本类型);
            let tip = "你们成功了!感谢你们净化了森林!!\r\n\r\n";
            tip += `#b今天已完成${completedCount}次副本\r\n`;
            tip += `点击确定后领取奖励并离开`;
            return tip;

    }
}

// 水晶宝石列表 (type=0)
var itemlist0 = [
    4005000, 4005001, 4005002, 4005003, 4005004,
    4021000, 4021001, 4021002, 4021003, 4021004,
    4021005, 4021006, 4021007, 4021008,
    4011006, 4011005, 4011004, 4011003, 4011002, 4011001, 4011000,
    4011007, 4021009, 4011008
];

// 母矿列表 (type=1)
var itemlist1 = [
    4004000, 4004001, 4004002, 4004003, 4004004,
    4010000, 4010001, 4010002, 4010003, 4010004,
    4010005, 4010006,
    4020000, 4020001, 4020002, 4020003, 4020004,
    4020005, 4020006, 4020007, 4020008, 4010007
];

let 副本类型 = 4;
// 奖励
var rewards = [
    {id: 2049100, qty: 1},//混沌卷
    {id: 2340000, qty: 1},//祝福
];

function 发放奖励() {
    var mapId = cm.getPlayer().getMapId();
    if (mapId != 930000700) {
        cm.getPlayer().dropMessage("地图不匹配无法获取奖励.1");
        cm.dispose();
        return;
    }
    let completedCount = cm.getPQEnteredCount(副本类型);
    if (cm.isNotCanHold(3, 4)) {
        return;
    }
    //只有前三次才有特殊奖励
    if (completedCount < 20) {
        if (!能获取奖励()) {
            cm.sendOk("背包空间不足,无法获取奖励!");
            cm.dispose();
            return;
        }
        //每天第一次完成发放一次阿尔泰碎片
        if (completedCount < 1) {
            if (!cm.canHold(4001198, 1)) {
                cm.sendOk("背包空间不足,无法获取奖励!");
                cm.dispose();
                return;
            }
            cm.gainItem(4001198, 1); //阿尔泰碎片
        }
        for (var i = 0; i < rewards.length; i++) {
            var reward = rewards[i];
            if (reward.id === 0) {
                // 发放金币，10W = 10 * 10000
                cm.gainMeso(reward.qty * 10000);
            } else {
                // 核心修改：添加50%概率判断
                var randomRate = Math.random(); // 生成0~1之间的随机数
                if (randomRate < 0.7) { // 50%概率触发
                    cm.gainItem(reward.id, reward.qty);
                }
            }
        }
        //获取经验
        cm.gainPQExp(500);
        // 发放金币
        cm.gainMeso(300 * 10000);
    }
    发放随机矿石奖励();
    //记录当天副本完成次数
    cm.recordEntryPQ(副本类型);
    //记录一次副本完成积分
    if (completedCount < 5) {
        cm.addPqPoints();
    }
    //发送副本完成广播
    cm.getPlayer().sendAllWordPQNotice("毒物副本");
    cm.warp(930000800, 0);
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

function 发放随机矿石奖励() {
    const 母矿 = getRandomUniqueItems(itemlist1, 3);
    // 遍历发放3个随机不重复的卷轴
    for (let scrollId of 母矿) {
        cm.gainItem(scrollId, 3);
    }
    var randomRate = Math.random(); // 生成0~1之间的随机数
    if (randomRate < 0.3) {
        const 成品矿 = getRandomUniqueItems(itemlist0, 1);
        // 遍历发放3个随机不重复的卷轴
        for (let scrollId of 成品矿) {
            cm.gainItem(scrollId, 1);
        }
    }
}

/**
 * 从数组中随机获取指定数量的不重复元素
 * @param {Array} arr - 源数组
 * @param {number} count - 要获取的元素数量
 * @returns {Array} 随机且不重复的元素数组
 */
function getRandomUniqueItems(arr, count) {
    // 1. 复制原数组（避免修改原数据）
    const copyArr = [...arr];
    // 2. 存储结果的数组
    const result = [];

    // 3. 容错处理：如果需要的数量大于数组长度，只返回全部元素
    const realCount = Math.min(count, copyArr.length);

    // 4. 循环选取随机元素（选一个删一个，确保不重复）
    for (let i = 0; i < realCount; i++) {
        // 生成0 ~ 剩余数组长度-1的随机索引
        const randomIndex = Math.floor(Math.random() * copyArr.length);
        // 取出该索引的元素并加入结果
        result.push(copyArr[randomIndex]);
        // 从复制数组中删除该元素（避免重复选取）
        copyArr.splice(randomIndex, 1);
    }
    return result;
}