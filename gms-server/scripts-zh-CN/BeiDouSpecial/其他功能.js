/**
 * @description 拍卖行中心脚本
 */
var OldTitle = "\t\t\t\t\t#e#k欢迎来到#r[其他功能]#k系统#n\t\t\t\t\r\n";
var status = -1;
var 公测金币奖励 = 5000;  // 修正为1000W金币（原1000单位可能为笔误）
var 公测道具奖励 = [
    [4000313, 800],  // 黄金枫叶
    [2029005, 20],    // 三倍经验卡
    [2029003, 20],  // 双倍爆率卡
];
// 存储键：用于标记是否已领取公测礼包（避免重复领取）
const TEST_PACKAGE_KEY = "公测测试礼包领取状态1";

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
        text += "#L0#领取节假日礼物#l\t\r\n\r\n";
        text += "#b#L1#领取公测测试礼包（正式开服无该礼包）#l\t\r\n\r\n";
        text += "#b#L2#常用指令查询#l\t\r\n\r\n";
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
            cm.sendOk("还不是节假日！");
            cm.dispose();
            break;
        case 1:
            公测奖励();
            break;
        case 2:
            openNpc("常用指令");
            break;
        default:
            cm.sendOk("该功能暂不支持，敬请期待！");
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