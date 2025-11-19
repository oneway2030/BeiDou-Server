var status = 0;
const slotSrc = 1; // 源装备槽位（固定）
const slotDest = 2; // 目标装备槽位（固定）
// 消耗道具配置
const CONSUME_ITEM_ID = 4000313; // 消耗道具ID
const CONSUME_ITEM_COUNT = 10; // 消耗数量
// 提前引入需要的Java类
const InventoryType = Java.type('org.gms.client.inventory.InventoryType');
const ItemInformationProvider = Java.type('org.gms.server.ItemInformationProvider');
const ii = ItemInformationProvider.getInstance();
const PacketCreator = Java.type('org.gms.util.PacketCreator');
const Stat = Java.type('org.gms.client.Stat');
const ModifyInventory = Java.type('org.gms.client.inventory.ModifyInventory');
const Collections = Java.type('java.util.Collections');

function start() {
    status = 0;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode < 1) {
        cm.dispose();
        return;
    }
    status++;

    // 获取装备栏并检查有效性
    const player = cm.getPlayer();
    const eqpInv = player.getInventory(InventoryType.EQUIP);
    if (!eqpInv && status > 1) { // 仅在需要操作装备时检查
        cm.sendOk("无法获取装备栏数据，请重试。");
        cm.dispose();
        return;
    }

    // 第一层：规则说明
    if (status === 1) {
        showTransferRules();
    }
    // 第二层：检查道具消耗
    else if (status === 2) {
        // 检查并消耗道具，成功则继续，失败则终止
        if (checkAndConsumeItem(player)) {
            handleFirstStep(eqpInv); // 道具足够，继续检查装备
        } else {
            cm.dispose(); // 道具不足，直接结束
        }
    }
    // 第三层：确认并执行转移
    else if (status === 3) {
        handleSecondStep(eqpInv, player);
    }
}

/**
 * 显示时装属性转移规则说明（包含消耗提示）
 */
function showTransferRules() {
    const itemName = ii.getName(CONSUME_ITEM_ID) || "未知道具";
    const ruleMsg = "\t\t\t\t\t#b【时装属性转移系统】#k\r\n\r\n"+
        `欢迎使用时装属性转移功能，请注意以下规则：\r\n` +
        `1.请将源装备放在装备栏第${slotSrc}位，目标装备放在第${slotDest}位\r\n` +
        `2.两件装备必须是同一部位的现金时装\r\n` +
        `3.源装备必须至少拥有一项属性（力量、敏捷、运气、智力、攻击等）\r\n` +
        `4.转移后源装备的所有属性将被清空\r\n` +
        `5.目标装备的原有属性会被源装备的属性完全覆盖\r\n` +
        `6.操作不可逆，请确认后再进行转移\r\n` +
        `7.#r每次转移需消耗 ${CONSUME_ITEM_COUNT} 个#v4000313##b${itemName}#k\r\n\r\n` +
        `是否继续？`;

    cm.sendYesNo(ruleMsg);
}

/**
 * 检查并消耗所需道具
 * @param {Player} player 玩家对象
 * @returns {boolean} 是否成功消耗
 */
function checkAndConsumeItem(player) {
    const useInv = player.getInventory(InventoryType.ETC); // 消耗栏背包
    if (!useInv) {
        cm.sendOk("无法获取消耗栏数据，请重试。");
        return false;
    }

    const itemCount = useInv.countById(CONSUME_ITEM_ID);
    const itemName = ii.getName(CONSUME_ITEM_ID) || "未知道具";

    // 检查数量是否足够
    if (itemCount < CONSUME_ITEM_COUNT) {
    // if (!cm.haveItem(4000313, CONSUME_ITEM_COUNT)) {
        cm.sendOk(`#r转移失败：#k需要消耗 #v4000313##r${CONSUME_ITEM_COUNT} 个#k，当前仅拥有 #r${itemCount} 个`);
        return false;
    }
    cm.gainItem(CONSUME_ITEM_ID, -CONSUME_ITEM_COUNT);
    return true;
}

/**
 * 第二步：检查装备有效性并确认操作
 */
function handleFirstStep(eqpInv) {
    const srcEquip = eqpInv.getItem(slotSrc);
    const destEquip = eqpInv.getItem(slotDest);

    // 基础存在性检查
    if (!srcEquip || !destEquip) {
        cm.sendOk("装备栏第1或第2槽位没有装备，请检查后重试。");
        cm.dispose();
        return;
    }

    const itemId1 = srcEquip.getItemId();
    const itemId2 = destEquip.getItemId();

    // 现金装备检查
    if (!ii.isCashItem(itemId1) || !ii.isCashItem(itemId2)) {
        cm.sendOk("装备栏前两个位置必须都是现金装备。");
        cm.dispose();
        return;
    }

    // 部位一致性检查
    if (!ii.isSamePart(itemId1, itemId2)) {
        cm.sendOk("两件装备必须是同一部位才能转移属性。");
        cm.dispose();
        return;
    }

    // 源装备属性存在性检查
    if (!hasTransferableStats(srcEquip)) {
        cm.sendOk("源装备没有可转移的属性（至少需要力量、敏捷、运气、智力、攻击中的一项有值）。");
        cm.dispose();
        return;
    }

    // 显示确认信息
    const confirmMsg = `确认将以下时装属性转移到目标装备？\r\n` +
        `#b源装备：#i${itemId1}##t${itemId1}# (槽位 ${slotSrc})\r\n` +
        `目标装备(转移后)：#i${itemId2}##t${itemId2}# (槽位 ${slotDest})\r\n` +
        `#r注意：转移后源装备属性将被清空，目标装备原有属性会被覆盖！#k`;
    cm.sendYesNo(confirmMsg);
}

/**
 * 检查装备是否有可转移的属性
 */
function hasTransferableStats(equip) {
    return equip.getStr() > 0 ||
        equip.getDex() > 0 ||
        equip.getLuk() > 0 ||
        equip.getInt() > 0 ||
        equip.getWatk() > 0 ||
        equip.getMatk() > 0;
}

/**
 * 第三步：执行属性转移逻辑
 */
function handleSecondStep(eqpInv, player) {
    // 二次获取装备（防止操作过程中装备变动）
    const srcEquip = eqpInv.getItem(slotSrc);
    const destEquip = eqpInv.getItem(slotDest);

    // 二次验证装备状态
    if (!srcEquip || !destEquip) {
        cm.sendOk("装备位置发生变化，请重新操作。");
        cm.dispose();
        return;
    }

    // 二次验证源装备属性
    if (!hasTransferableStats(srcEquip)) {
        cm.sendOk("源装备没有可转移的属性，请重新选择。");
        cm.dispose();
        return;
    }

    try {
        // 保存源装备属性（使用不可变对象存储）
        const srcStats = Object.freeze({
            str: srcEquip.getStr(),
            dex: srcEquip.getDex(),
            luk: srcEquip.getLuk(),
            int_: srcEquip.getInt(),
            hp: srcEquip.getHp(),
            mp: srcEquip.getMp(),
            watk: srcEquip.getWatk(),
            matk: srcEquip.getMatk(),
            wdef: srcEquip.getWdef(),
            mdef: srcEquip.getMdef(),
            acc: srcEquip.getAcc(),
            avo: srcEquip.getAvoid(),
            hands: srcEquip.getHands(),
            speed: srcEquip.getSpeed(),
            jump: srcEquip.getJump()
        });

        // 锁定装备栏进行原子操作
        eqpInv.lockInventory();
        try {
            // 清除源装备属性
            clearEquipStats(srcEquip);
            // 应用属性到目标装备
            applyStatsToEquip(destEquip, srcStats);
        } finally {
            eqpInv.unlockInventory(); // 确保解锁
        }

        // 同步客户端显示
        syncClientDisplay(player, srcEquip, destEquip);

        const itemName = ii.getName(CONSUME_ITEM_ID) || "未知道具";
        cm.sendOk(`属性转移成功！\r\n` +
            `源装备：#i${srcEquip.getItemId()}##t${srcEquip.getItemId()}#\r\n` +
            `目标装备：#i${destEquip.getItemId()}##t${destEquip.getItemId()}#\r\n` +
            `已消耗 #r${CONSUME_ITEM_COUNT} 个#v4000313##k`);
    } catch (e) {
        cm.sendOk(`属性转移失败：${e.message || '未知错误'}`);
        cm.getClient().getLogger().error("时装属性转移失败", e);
    } finally {
        cm.dispose();
    }
}

/**
 * 清除装备的所有属性
 */
function clearEquipStats(equip) {
    equip.setStr(0);
    equip.setDex(0);
    equip.setLuk(0);
    equip.setInt(0);
    equip.setHp(0);
    equip.setMp(0);
    equip.setWatk(0);
    equip.setMatk(0);
    equip.setWdef(0);
    equip.setMdef(0);
    equip.setAcc(0);
    equip.setAvoid(0);
    equip.setHands(0);
    equip.setSpeed(0);
    equip.setJump(0);
}

/**
 * 将保存的属性应用到目标装备
 */
function applyStatsToEquip(equip, stats) {
    equip.setStr(stats.str);
    equip.setDex(stats.dex);
    equip.setLuk(stats.luk);
    equip.setInt(stats.int_);
    equip.setHp(stats.hp);
    equip.setMp(stats.mp);
    equip.setWatk(stats.watk);
    equip.setMatk(stats.matk);
    equip.setWdef(stats.wdef);
    equip.setMdef(stats.mdef);
    equip.setAcc(stats.acc);
    equip.setAvoid(stats.avo);
    equip.setHands(stats.hands);
    equip.setSpeed(stats.speed);
    equip.setJump(stats.jump);
}

/**
 * 同步客户端显示，确保装备属性正确刷新
 */
function syncClientDisplay(player, srcEquip, destEquip) {
    const client = cm.getClient();
    // 1. 发送库存更新包（先删后加强制刷新）
    const updates = Collections.unmodifiableList([
        new ModifyInventory(3, srcEquip),  // 删除源装备
        new ModifyInventory(0, srcEquip),  // 重新添加源装备
        new ModifyInventory(3, destEquip), // 删除目标装备
        new ModifyInventory(0, destEquip)  // 重新添加目标装备
    ]);
    client.sendPacket(PacketCreator.modifyInventory(true, updates));
}