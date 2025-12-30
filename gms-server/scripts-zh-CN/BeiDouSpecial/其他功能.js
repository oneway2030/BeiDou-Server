/**
 * @description 拍卖行中心脚本
 */
var OldTitle = "\t\t\t\t\t#e#k欢迎来到#r[其他功能]#k系统#n\t\t\t\t\r\n";
var status = -1;
var 公测金币奖励 = 5000;  // 修正为1000W金币（原1000单位可能为笔误）
var 公测道具奖励 = [[4000313, 800],  // 黄金枫叶
    [2029005, 20],    // 三倍经验卡
    [2029003, 20],  // 双倍爆率卡
];
// 存储键：用于标记是否已领取公测礼包（避免重复领取）
const TEST_PACKAGE_KEY = "公测测试礼包领取状态";

function start() {
    action(1, 0, 0)
}

function action(mode, type, selection) {
    if (mode === 1) {
        status++;
    } else if (mode === -1) {
        cm.dispose();
        return;
    } else {
        cm.dispose();
        return;
    }
    if (status === 0) {
        let text = OldTitle;
        text += " \r\n";
        text += "#L0#平安夜&圣诞节礼物#l\t\r\n\r\n";
        text += "#b#L2#常用指令查询#l\t\r\n\r\n";
        // text += "#b#L1#领取公测测试礼包（正式开服无该礼包）#l\t\r\n\r\n";
        // text += "#b#L3#测试期间道具领取#l\t\r\n\r\n";
        cm.sendSimple(text);
    } else if (status === 1) {
        doSelect(selection);
    } else {
        cm.dispose();
    }
}


function doSelect(selection) {
    switch (selection) {
        case 0:
            try {
                发放补偿奖励();
            } catch (e) {
                cm.dispose();
                // 打印错误日志便于调试
                console.error("主菜单脚本错误===》:", e);
            }

            break;
        case 2:
            openNpc("常用指令");
            break;
        case 3:
            cm.gainItem(4032133, 500);
            cm.gainItem(2049100, 500);
            cm.gainItem(2029005, 200);
            break;
        default:
            cm.sendOk("该功能暂不支持，敬请期待！");
            cm.dispose();
    }
}


var 枫叶奖励 = 4032133;
var 枫叶数量 = 5;
var 补偿奖励_KEY = "补偿奖励_v4"
var meso_id = 9999999;
var cash_id = 9999998;

var rewards = [
    {id: cash_id, qty: 10000},//点卷
    {id: meso_id, qty: 2000},
    {id: 4032133, qty: 5},//红色钻石
    {id: 2029005, qty: 4},//三倍经验
    {id: 2029002, qty: 4},//双倍爆率
    {id: 2049115, qty: 5},//正向
    {id: 2340000, qty: 10},//祝福
];

function 发放补偿奖励() {
    // 检查是否已领取过礼包
    if (cm.getAccountExtendValue(补偿奖励_KEY, false) === "1") {
        cm.sendOk("你已经领取过维护补偿啦！");
        cm.dispose();
        return;
    }
    var player = cm.getPlayer();
    if (!cm.isNotCanHold(1) && !cm.isNotCanHold(2) && !cm.isNotCanHold(3, 3)) {
        rewards.forEach(reward => {
            if (reward.id === meso_id) {
                cm.gainMeso(reward.qty * 10000);
            } else if (reward.id === cash_id) {
                cm.getPlayer().getCashShop().gainCash(1, reward.qty);//点券
            } else {
                let qty = reward.qty;
                // 生成 -1 ~ +2 的随机偏移量（关键）
                const randomOffset = Math.floor(Math.random() * 4) - 1; // 0~3 随机数 -1 → -1/0/1/2
                qty+=randomOffset;
                qty = Math.max(qty, 1);
                cm.gainItem(reward.id, qty);
            }
        });
        sendEquipment(1702920,3*24*60);
        cm.saveOrUpdateAccountExtendValue(补偿奖励_KEY, "1");
        cm.sendOk("恭喜你领取成功");
        cm.getPlayer().sendAllWordNoticeNew("外国节日",`恭喜玩家【${cm.getPlayer().getName()}】领取平安&夜圣诞节礼物! 祝大家节日快来~`);
        cm.dispose();
    }
}


function 公测奖励() {
    //检查是否已领取过礼包
    if (cm.getAccountExtendValue(TEST_PACKAGE_KEY, true) === "1") {
        cm.sendOk("你已经领取过公测测试礼包啦！");
        cm.dispose();
        return;
    }
    // 检查背包空间
    if (cm.isNotCanHold(2, 4)) {  // 检查消耗类型背包
        return;
    }
    // 检查背包空间
    if (cm.isNotCanHold(4, 4)) {  // 检查其他类型背包
        return;
    }
    // 发放奖励
    let rewardText = "恭喜你成功领取公测测试礼包！获得以下奖励：\r\n\r\n";
    rewardText += `- 金币：${公测金币奖励} W\r\n`;  // 格式化金币显示

    公测道具奖励.forEach(([itemId, quantity]) => {
        cm.gainItem(itemId, quantity);
        rewardText += `- #v${itemId}##t${itemId}# × ${quantity}\r\n`;
    });

    cm.gainMeso(公测金币奖励 * 10000);  // 发放金币
    cm.getPlayer().getCashShop().gainCash(1, 100000);//点券
    // 标记为已领取（通过AccountExtendValue存储，账号级唯一）
    cm.saveOrUpdateAccountExtendValue(TEST_PACKAGE_KEY, "1");

    // 弹窗展示领取内容
    cm.sendOk(rewardText);
    cm.dispose();
}

function openNpc(scriptName) {
    cm.dispose();
    cm.openNpc(9900001, scriptName);
}

function sendEquipment(fashionItemId,time) {
    cm.getPlayer().gainEquip(fashionItemId,
        30,
        30,
        100,
        30,
        1000,
        1000,
        30,
        60,
        0,
        0,
        0,
        0,
        0,
        50,
        50,
        0,
        time
    );
}