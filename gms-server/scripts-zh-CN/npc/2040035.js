/**
 * 玩具101
 */
let 副本类型 = 2;
// 奖励
var rewards = [
    {id: 2049100, qty: 1},//混沌卷
    {id: 2340000, qty: 2},//祝福
];


// 10%成功率卷轴ID数组(type=2)
const itemlist2 = [
    2040915, // 盾牌攻击
    2043002, // 单手剑攻击
    2043102, // 单手斧攻击
    2043202, // 单手钝器
    2043302, // 短剑攻击
    2044002, // 双手剑攻击
    2044102, // 双手斧攻击
    2044202, // 双手钝器攻击
    2044302, // 抢攻击
    2044402, // 矛攻击
    2044502, // 弓攻击
    2044602, // 弩攻击
    2044702, // 拳套攻击
    2044802, // 拳甲攻击
    2044902, // 短枪攻击
    2043802, // 长杖魔力
    2043702, // 短杖魔力

    2040026, // 10%头盔智力卷轴
    2040031, // 10%头盔敏捷卷轴
    2040805, // 10%手套攻击卷轴
    2040816, // 10%手套魔力卷轴

    2040702, // 10%鞋子敏捷卷轴
    2040705, // 10%鞋子跳跃卷轴
    2040708, // 10%鞋子速度卷轴

    2041014, // 10%披风力量卷轴
    2041017, // 10%披风智力卷轴
    2041020, // 10%披风敏捷卷轴
    2041023, // 10%披风运气卷轴

    2040412, // 10%上衣运气卷轴
    2040419, // 10%上衣力量卷轴

    2040612, // 10%裤裙敏捷卷轴

    2040502, // 10%全身铠甲敏捷卷轴
    2040514, // 10%全身铠甲智力卷轴
    2040517, // 10%全身铠甲运气卷轴

    2040302, // 10%耳环智力卷轴
    2040318, // 10%耳环敏捷卷轴
    2040323, // 10%耳环运气卷轴
    2040330, // 10%耳环智力卷轴
];

// 60%成功率卷轴ID数组(type=3)
const itemlist3 = [
    2040914, // 盾牌攻击
    2043001, // 单手剑攻击
    2043101, // 单手斧攻击
    2043201, // 单手钝器攻击
    2043301, // 短剑攻击
    2044001, // 双手剑攻击
    2044101, // 双手斧攻击
    2044201, // 双手钝器攻击
    2044301, // 抢攻击
    2044401, // 矛攻击
    2044501, // 弓攻击
    2044601, // 弩攻击
    2044701, // 拳套攻击
    2044801, // 拳甲攻击
    2044901, // 短枪攻击
    2043801, // 长杖魔力
    2043701, // 短杖魔力

    2040025, // 10%头盔智力卷轴
    2040029, // 10%头盔敏捷卷轴
    2040804, // 10%手套攻击卷轴
    2040817, // 10%手套魔力卷轴

    2040701, // 10%鞋子敏捷卷轴
    2040704, // 10%鞋子跳跃卷轴
    2040707, // 10%鞋子速度卷轴

    2041013, // 10%披风力量卷轴
    2041016, // 10%披风智力卷轴
    2041019, // 10%披风敏捷卷轴
    2041022, // 10%披风运气卷轴

    2040413, // 10%上衣运气卷轴
    2040425, // 10%上衣运气卷轴
    2040418, // 10%上衣力量卷轴

    2040613, // 10%裤裙敏捷卷轴

    2040501, // 10%全身铠甲敏捷卷轴
    2040504, // 10%全身铠甲防御卷轴
    2040513, // 10%全身铠甲智力卷轴
    2040516, // 10%全身铠甲运气卷轴

    2040301, // 10%耳环智力卷轴
    2040317, // 10%耳环敏捷卷轴
    2040321, // 10%耳环装饰运气卷轴

];

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode < 0) {
        cm.dispose();
    } else {
        if (mode == 1) {
            status++;
        } else {
            status--;
        }
        if (status == 0 && mode == 1) {
            let tip = "恭喜你成功封印了次元裂缝！为了表彰你的辛勤工作，我有一份礼物送给你！拿去吧，这是你的奖品。\r\n";
            let completedCount = cm.getPQEnteredCount(副本类型);
            tip += `#b今天已完成${completedCount}次副本\r\n`;
            cm.sendNext(tip);
        } else if (status == 1) {
            发放奖励();
        }
    }
}

function 发放奖励() {
    var mapId = cm.getPlayer().getMapId();
    if (mapId != 922011100) {
        cm.getPlayer().dropMessage("地图不匹配无法获取奖励.");
        return;
    }
    let completedCount = cm.getPQEnteredCount(副本类型);
    if (cm.isNotCanHold(2, 5)) {
        return;
    }
    //只有前三次才有特殊奖励
    if (completedCount < 30) {
        if (!能获取奖励()) {
            cm.sendOk("背包空间不足,无法获取奖励!");
            cm.dispose();
            return;
        }
        //每天第一次完成发放一次阳光
        if (completedCount < 1) {
            if (!cm.canHold(4001246, 1)) {
                cm.sendOk("背包空间不足,无法获取奖励!");
                cm.dispose();
                return;
            }
            cm.gainItem(4001246, 1); //温暖的阳光，兑换划痕眼镜1022073
        }
        for (var i = 0; i < rewards.length; i++) {
            var reward = rewards[i];
            if (reward.id === 0) {
                // 发放金币，10W = 10 * 10000
                cm.gainMeso(reward.qty * 10000);
            } else {
                // 发放物品
                var randomRate = Math.random(); // 生成0~1之间的随机数
                if (randomRate < 0.5) { // 50%概率触发
                    cm.gainItem(reward.id, reward.qty);
                }
            }
        }
        //获取经验
        cm.gainPQExp(200);
        // 发放金币
        cm.gainMeso(100 * 10000);
    }
    发放随机卷轴奖励();
    //记录当天副本完成次数
    cm.recordEntryPQ(副本类型);
    //记录一次副本完成积分
    if (completedCount < 5) {
        cm.addPqPoints();
    }
    //发送副本完成广播
    cm.getPlayer().sendAllWordPQNotice("玩具副本");
    cm.warp(221024500);
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

function 发放随机卷轴奖励() {
    const randomScrolls10 = getRandomUniqueItems(itemlist2, 2);
    // 遍历发放3个随机不重复的卷轴
    for (let scrollId of randomScrolls10) {
        cm.gainItem(scrollId, 3);
    }
    const randomScrolls60 = getRandomUniqueItems(itemlist3, 3);
    // 遍历发放3个随机不重复的卷轴
    for (let scrollId of randomScrolls60) {
        cm.gainItem(scrollId, 2);
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
