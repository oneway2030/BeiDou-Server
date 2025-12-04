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
        text += "#L0#维护补偿#l\t\r\n\r\n";
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
            发放补偿奖励()
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


var 枫叶奖励 = 4001126;
var 枫叶数量 = 50;
var 补偿奖励_KEY = "补偿奖励_v1"

function 发放补偿奖励() {
    //检查是否已领取过礼包
    if (cm.getAccountExtendValue(补偿奖励_KEY) === "1") {
        cm.sendOk("你已经领取过维护补偿啦！");
        cm.dispose();
        return;
    }
    var player = cm.getPlayer();
    if (cm.canHold(枫叶奖励, 枫叶数量)) {
        cm.gainItem(枫叶奖励, 枫叶数量);
        cm.getPlayer().getCashShop().gainCash(1, 5000);//点券
        cm.saveOrUpdateAccountExtendValue(补偿奖励_KEY, "1");
        cm.sendOk("恭喜你领取成功");
        const PacketCreator = Java.type('org.gms.util.PacketCreator');
        player.getWorldServer().broadcastPacket(PacketCreator.serverNotice(6, "恭喜玩家 " + player.getName() + " 领取维护补偿!"));
        cm.dispose();
    } else {
        cm.sendOk("背包空间不足");
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
    cm.saveOrUpdateAccountExtendValue(TEST_PACKAGE_KEY, "1", true);

    // 弹窗展示领取内容
    cm.sendOk(rewardText);
    cm.dispose();
}

function openNpc(scriptName) {
    cm.dispose();
    cm.openNpc(9900001, scriptName);
}