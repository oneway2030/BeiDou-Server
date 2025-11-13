/**
 * 每日任务脚本
 * 功能：每日10轮任务，按等级匹配道具要求，支持提交/跳过，依赖AccountExtendValue的24小时自动清除机制重置
 */

var status = -1;
var currentRound = 1; // 当前轮次
const maxRounds = 10; // 最大轮次
const CashPoint1Num = 500; // 点券奖励
const MesoNum = 20; // 金币奖励,单位W
var selectedItemId = 0; // 当前任务道具ID
var requiredItemCount = 0; // 当前任务所需道具数量
var drop_rate_card_id = 5360042; // 爆率卡id


// 存储键名定义
const ROUND_KEY = "每日任务当前第几轮";
const ITEM_ID_KEY = "每日任务当前道具ID";
const ITEM_COUNT_KEY = "每日任务当前道具数量";

// 任务道具配置（按等级段划分）
var itemPools = [
    [[4000019, 50], [4000012, 50], [4000002, 50], [4000215, 50], [4000249, 10], [4000331, 50]],    //20 绿色蜗牛壳, 绿蘑菇盖, 蝴蝶结, 斧头,蛇皮,仙人掌的花
    [[4000007, 30], [4000020, 50], [4000196, 50], [4000106, 30]],   // 30级 火独眼兽之尾, 野猪尖牙, 木板, 玩具熊猫的棉花团
    [[4000032, 30], [4000073, 30], [4000108, 30], [4000096, 30], [4000110, 30], [4000031, 30]],   // 40级 鳄鱼皮, 独角狮硬角,熊猫娃娃, 硬胡桃,木马骑兵的剑,诅咒娃娃
    [[4000014, 50], [4000023, 30], [4000178, 50], [4000060, 30], [4000205, 30]],   // 50级 龙的头骨, 冰独眼兽之尾, 钢甲猪盔甲,月光精灵的月块,绷带
    [[4000069, 30], [4000022, 30], [4000051, 30], [4000440, 30]],   // 60级 僵尸丢失的臼齿, 石块, 野狼之尾, 粗糙的皮革
    [[4000074, 30], [4000295, 30], [4000289, 30], [4000027, 10]],   // 70级 黑色飞狮尾, 鳄鳄的皮, 猫咪娃娃、怪猫的眼
    [[4000226, 30], [4000028, 5], [4000232, 30], [4000242, 30]],   // 80级 莱西毛球、月牙牛魔王的角、半人马的火花、恶魔绵羊尾巴
    [[4000262, 30], [4000477, 30], [4000430, 30]],   // 90级 有裂痕的背壳 海盗头盔 怪虫迪波之角
    [[4000184, 30], [4000135, 30], [4000268, 30], [4000269, 30], [4000270, 30], [4000135, 30]],   // 100级 奶油烤章鱼 大海贼王的帽子 飞龙的翅膀 飞龙的腮 飞龙的指甲 大海贼王的帽子
    [[4000274, 50], [4000434, 50]]   // 110级 断裂的角 大花草
];


function start() {
    // 加载存储的任务数据
    loadTaskData();
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode === -1) {
        // 关闭对话框时保存当前进度
        saveTaskProgress();
        cm.dispose();
        return;
    }

    // 处理状态流转
    if (mode === 1) {
        status++;
    } else {
        status--;
    }
    // 主界面逻辑
    if (status === 0) {
        if (currentRound > maxRounds) {
            cm.sendOk("今日10轮任务已全部完成，明天再来挑战吧！\r\n\r\n");
            cm.dispose();
            return;
        }
        // 显示当前轮次任务信息和操作选项
        cm.sendSimple(
            `#k每日任务 第 #r${currentRound}/${maxRounds} #k轮\r\n\r\n` +
            `每轮奖励：#b\r\n` +
            `- ${CashPoint1Num} 点券\r\n` +
            `- ${MesoNum} w金币\r\n` +
            `- #r每天完成10次额外获得：双倍爆率30分钟：#v${drop_rate_card_id}# x1\r\n\r\n` +
            `#k当前任务要求：\r\n` +
            `#b#i${selectedItemId}# #t${selectedItemId}# × ${requiredItemCount}\r\n\r\n` +
            `#k请选择操作：\r\n` +
            `#r#L0#提交任务#l\r\n` +  // 使用换行符分隔选项，避免索引识别错误
            `#k#L1#跳过本轮#l`
        );
    } else if (status === 1) {
        if (selection === 0) {//点击提交
            completeTask();
        } else if (selection === 1) {//点击跳过
            // 显示跳过确认提示
            cm.sendYesNo(`确定要跳过第 ${currentRound} 轮任务吗？\r\n跳过本轮将不会获得任何奖励，直接进入下一轮。`);
        }
    } else if (status === 2) {//确认跳过
        // 确认跳过（mode=1），取消跳过（mode=0）
        if (mode === 1) {
            skipTask();
        }
    }
}

/**
 * 加载存储的任务数据
 */
function loadTaskData() {
    const savedRound = cm.getAccountExtendValue(ROUND_KEY, true);
    currentRound = savedRound ? parseInt(savedRound) : 1;
    currentRound = savedRound <= 0 ? 1 : parseInt(savedRound);


    const savedItemId = cm.getAccountExtendValue(ITEM_ID_KEY, true);
    selectedItemId = savedItemId ? parseInt(savedItemId) : 0;
    const savedItemCount = cm.getAccountExtendValue(ITEM_COUNT_KEY, true);
    requiredItemCount = savedItemCount ? parseInt(savedItemCount) : 0;
    if (selectedItemId === 0 || requiredItemCount === 0) {
        generateTask();
        saveTaskProgress();
    }
}

/**
 * 重置每日任务状态
 */
function resetDailyTask() {
    currentRound = 1;
    selectedItemId = 0;
    requiredItemCount = 0;
}

/**
 * 保存当前任务进度
 */
function saveTaskProgress() {
    cm.saveOrUpdateAccountExtendValue(ROUND_KEY, currentRound.toString(), true);
    cm.saveOrUpdateAccountExtendValue(ITEM_ID_KEY, selectedItemId.toString(), true);
    cm.saveOrUpdateAccountExtendValue(ITEM_COUNT_KEY, requiredItemCount.toString(), true);
}

/**
 * 根据玩家等级生成对应任务道具
 */
function generateTask() {
    const playerLevel = cm.getPlayer().getLevel();
    let availableItems = [];

    // 按等级筛选可用道具池
    if (playerLevel < 20) {
        availableItems = [...itemPools[0]];
    } else if (playerLevel < 30) {
        availableItems = [...itemPools[0], ...itemPools[1]];
    } else if (playerLevel < 40) {
        availableItems = [...itemPools[0], ...itemPools[1], ...itemPools[2]];
    } else if (playerLevel < 50) {
        availableItems = [...itemPools[0], ...itemPools[1], ...itemPools[2], ...itemPools[3]];
    } else if (playerLevel < 60) {
        availableItems = [...itemPools[0], ...itemPools[1], ...itemPools[2], ...itemPools[3], ...itemPools[4]];
    } else if (playerLevel < 70) {
        availableItems = [...itemPools[0], ...itemPools[1], ...itemPools[2], ...itemPools[3], ...itemPools[4], ...itemPools[5]];
    } else if (playerLevel < 80) {
        availableItems = [...itemPools[0], ...itemPools[1], ...itemPools[2], ...itemPools[3], ...itemPools[4], ...itemPools[5], ...itemPools[6]];
    } else if (playerLevel < 90) {
        availableItems = [...itemPools[0], ...itemPools[1], ...itemPools[2], ...itemPools[3], ...itemPools[4], ...itemPools[5], ...itemPools[6], ...itemPools[7]];
    } else if (playerLevel < 100) {
        availableItems = [...itemPools[0], ...itemPools[1], ...itemPools[2], ...itemPools[3], ...itemPools[4], ...itemPools[5], ...itemPools[6], ...itemPools[7], ...itemPools[8]];
    } else {
        availableItems = [...itemPools[0], ...itemPools[1], ...itemPools[2], ...itemPools[3], ...itemPools[4], ...itemPools[5], ...itemPools[6], ...itemPools[7], ...itemPools[8], ...itemPools[9]];
    }

    // 随机选择一个道具
    const randomIndex = Math.floor(Math.random() * availableItems.length);
    selectedItemId = availableItems[randomIndex][0];
    requiredItemCount = availableItems[randomIndex][1];
    //test
    // selectedItemId=4000330;
    // requiredItemCount=1;
}

/**
 * 处理任务完成逻辑
 */
function completeTask() {
    if (cm.haveItem(selectedItemId, requiredItemCount)) {
        // 进入下一轮
        currentRound++;
        if (currentRound === 10) {
            if (!cm.isNotCanHold(2)) {
                cm.gainItem(drop_rate_card_id, 1);
            } else {
                return;
            }
        }
        // 扣除道具
        cm.gainItem(selectedItemId, -requiredItemCount);
        // 发放金币
        cm.gainMeso(MesoNum * 10000);
        // 发放点卷
        cm.getPlayer().getCashShop().gainCash(1, CashPoint1Num);
        if (currentRound - 1 === 10) {
            cm.gainItem(2029002, 1);
            cm.gainItem(2029003, 1);
        }
        if (currentRound <= maxRounds) {
            generateTask();
        }
        saveTaskProgress();
        status = -1;
        let text =
            `#b恭喜完成第 #r${currentRound - 1}/${maxRounds} #b轮任务！\r\n\r\n` +
            `获得奖励：\r\n` +
            `- #r${CashPoint1Num} #b点券\r\n` +
            `- #r${MesoNum} #bW金币\r\n`;
        if (currentRound === 10) {
            text += `- #r#v${道具ID} x1##t\r\n\r\n`;
        }
        cm.sendNext(text);
    } else {
        // 道具不足时返回主界面
        cm.sendOk(
            `你的 #t${selectedItemId}# #r数量不足\r\n` +
            `#b需要：#r${requiredItemCount} #b个  当前持有：#r${cm.getItemQuantity(selectedItemId) || 0} #b个\r\n\r\n`
        );
        cm.dispose();
    }
}

/**
 * 跳过当前任务（带确认流程）
 */
function skipTask() {
    // 进入下一轮并生成新任务
    currentRound++;
    if (currentRound <= maxRounds) {
        generateTask();
    }
    saveTaskProgress();
    // 显示跳过成功提示后返回主界面
    status = -1;
    action(1, 0, 0);
}