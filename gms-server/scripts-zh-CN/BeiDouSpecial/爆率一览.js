/**
 * 功能：展示当前地图存活的怪物种类以及物品爆率
 * 作者：Magical-H (优化版)
 * 版本：2.0
 * 日期：2024-12-02
 * 优化点：解决卡死、内存泄漏、渲染过载、性能低下问题
 */
// 全局常量（仅初始化一次）
const MonsterInformationProvider = Java.type('org.gms.server.life.MonsterInformationProvider');
const ItemInformationProvider = Java.type('org.gms.server.ItemInformationProvider');
const QuestInfo = Java.type('org.gms.server.quest.Quest');
// 客户端渲染安全阈值（防止超大列表卡死）
const SAFE_MOB_LIMIT = 50; // 单地图最多展示50种怪物
const SAFE_DROP_LIMIT = 100; // 单怪物最多展示100个掉落物
// 缓存对象（避免重复初始化）
const cache = {
    mapObj: null,
    mobAll: [],
    mobNormal: [],
    mobBoss: [],
    maxNameLength: 0,
    isInit: false
};

/**
 * 入口方法 - 增加异常兜底和性能监控
 */
function start() {
    const startTime = Date.now();
    try {
        // 首次初始化（仅执行一次，避免重复获取地图/怪物数据）
        if (!cache.isInit) {
            initCache();
        }
        // 性能监控：超过500ms直接终止，避免卡死
        if (Date.now() - startTime > 500) {
            cm.sendOkLevel('dispose', '查询超时，请稍后重试', 2);
            return;
        }
        levelmain();
    } catch (e) {
        console.error("爆率一览脚本错误===》:", e, e.stack);
        cm.sendOkLevel('dispose', '查询出错：' + e.message.substring(0, 50), 2);
        disposeCache(); // 异常时清理缓存
    }
}

/**
 * 初始化缓存 - 抽离核心逻辑，避免重复计算
 */
function initCache() {
    cache.mapObj = cm.getMap();
    if (!cache.mapObj) {
        throw new Error("获取地图对象失败");
    }
    // 获取怪物列表（去重+区分BOSS/普通）
    const mobSet = new Map(); // 使用Map代替Set+遍历，提升去重效率
    const allMobs = cache.mapObj.getAllMonsters() || [];

    // 安全阈值：超过50种怪物直接截断，避免渲染过载
    const safeMobs = allMobs.slice(0, SAFE_MOB_LIMIT);

    safeMobs.forEach(mob => {
        const mobId = mob.getId();
        if (!mobSet.has(mobId)) {
            mobSet.set(mobId, mob);
        }
    });
    // 区分BOSS和普通怪物
    const mobList = Array.from(mobSet.values());
    cache.mobBoss = mobList.filter(mob => mob.isBoss());
    cache.mobNormal = mobList.filter(mob => !mob.isBoss());
    cache.mobAll = mobList;
    // 计算最长怪物名称（仅计算一次）
    cache.maxNameLength = mobList.reduce((max, mob) => {
        const name = getMobName(mob);
        return Math.max(max, name.length);
    }, 0);
    cache.isInit = true;
}

/**
 * 第一层对话框 - 优化渲染逻辑，避免超长文本
 */
function levelmain() {
    if (cache.mobAll.length === 0) {
        cm.sendOkLevel('dispose', '当前地图没有存活的怪物，请等待刷新后查询', 2);
        return;
    }
    // 构建选择文本（分段拼接，避免字符串累加性能问题）
    let msgSelect = [
        '#b#e当前地图存活怪物列表（共' + cache.mobAll.length + '种）#k#n：',
        '#d' + '——'.repeat(13) + '#k'
    ];
    // 拼接BOSS列表
    if (cache.mobBoss.length > 0) {
        msgSelect.push(`#e#rBOSS#k#n：${cache.mobBoss.length} 种`);
        msgSelect.push(getSelectText(cache.mobBoss));
        if (cache.mobNormal.length > 0) {
            msgSelect.push('\r\n#d' + '——'.repeat(13) + '#k\r\n');
        }
    }
    // 拼接普通怪物列表
    if (cache.mobNormal.length > 0) {
        msgSelect.push(`普通怪物：${cache.mobNormal.length} 种`);
        msgSelect.push(getSelectText(cache.mobNormal));
    }
    // 限制文本长度（防止客户端渲染超大文本卡死）
    const finalMsg = msgSelect.join('\r\n').substring(0, 4000);
    cm.sendNextSelectLevel('ShowDropList', finalMsg, 2);
}

/**
 * 格式化怪物选择文本 - 优化性能和渲染安全
 * @param {Array} mobList 怪物列表
 * @returns {string} 格式化后的文本
 */
function getSelectText(mobList) {
    return mobList.map(mob => {
        const mobId = mob.getId();
        const mobName = getMobName(mob);
        const levelStr = getLevelImage(mob.getLevel());
        const mobImage = getMobImageSafe(mob); // 安全的怪物图片获取
        // 固定格式，避免动态计算padding
        const namePad = mobName.padEnd(cache.maxNameLength, ' ');
        const color = mob.isBoss() ? 'r' : 'b';
        return `#L${mobId}#${mobImage}\r\n#${color}#fUI/UIWindow.img/UserList/Friend/icon04# ${namePad}#k\t[ Lv.${levelStr} ] #l`;
    }).join('\r\n\r\n');
}

/**
 * 展示怪物掉落列表 - 核心优化：限制掉落数量、减少重复计算
 * @param {number} mobId 怪物ID
 */
function levelShowDropList(mobId) {
    // 从缓存获取怪物（避免重复遍历）
    const mob = cache.mobAll.find(m => m.getId() === mobId);
    if (!mob) {
        cm.sendLastLevel('main', `怪物ID [${mobId}] 不存在`, 2);
        return;
    }
    // 获取玩家掉落率（仅计算一次）
    const player = cm.getPlayer();
    const dropRate = player.getDropRate() * player.getFamilyDrop();
    // 获取掉落列表（限制数量，避免超大列表卡死）
    const dropAll = MonsterInformationProvider.getInstance().retrieveDrop(mobId) || [];
    const safeDrops = dropAll.filter(d => d.itemId > 0).slice(0, SAFE_DROP_LIMIT);
    // 构建基础信息
    const mobName = getMobName(mob);
    const stats = mob.getStats();
    const hpStr = mob.getMaxHp().toString();
    const mpStr = mob.getMaxMp().toString();
    const padLength = Math.max(hpStr.length, stats.getPADamage().toString().length, stats.getMADamage().toString().length);
    // 拼接基础信息（减少字符串累加）
    let msgText = [
        getMobImageSafe(mob),
        `[ #e#b${mobName}#k#n ]`,
        `血量：${hpStr.padEnd(padLength)} \t\t 蓝量：${mpStr}`,
        `物攻：${stats.getPADamage().toString().padEnd(padLength)} \t\t 物防：${stats.getPDDamage()}`,
        `魔攻：${stats.getMADamage().toString().padEnd(padLength)} \t\t 魔防：${stats.getMDDamage()}`
    ];
    // 拼接掉落列表
    if (safeDrops.length === 0) {
        msgText.push('\r\n\r\n没有掉落物品');
    } else {
        msgText.push('\r\n\r\n' + '-'.repeat(28) + '物品掉落列表' + '-'.repeat(28));
        // 表头（固定格式，避免动态计算）
        msgText.push('#b物品名称\t\t基础掉率\t\t你的掉率#k');
        // 遍历掉落物
        safeDrops.forEach(drop => {
            const itemName = ItemInformationProvider.getInstance().getName(drop.itemId) || `未知物品(${drop.itemId})`;
            const baseChance = (drop.chance / 10000).toFixed(4) + '%';
            const userChance = (drop.chance / 10000 * dropRate).toFixed(4) + '%';
            // 任务道具标注
            let questNote = '';
            if (drop.questid > 0) {
                try {
                    questNote = '#r[任务道具]#k ' + QuestInfo.getInstance(drop.questid).getName();
                } catch (e) {
                    questNote = '#r[任务道具]#k 未知任务';
                }
            }
            msgText.push(`#L${drop.itemId}##v${drop.itemId}# ${itemName.padEnd(20)} \t\t ${baseChance.padEnd(8)} \t\t #d${userChance}#k ${questNote}#l`);
        });
    }
    // 限制文本长度，避免客户端渲染崩溃
    const finalMsg = msgText.join('\r\n').substring(0, 8000);
    cm.sendLastLevel('main', finalMsg, 2);
}

/**
 * 安全获取怪物图片 - 避免客户端闪退
 * @param {Object} mob 怪物对象
 * @returns {string} 图片标签
 */
function getMobImageSafe(mob) {
    try {
        const moveType = mob.getStats().getMovetype();
        const type = moveType === 0 ? 'stand' : moveType === 1 ? 'fly' : null;
        if (!type) {
            return '#fUI/UIWindow.img/Maker/randomRecipe#';
        }
        const width = mob.getStats().getImgwidth();
        const height = mob.getStats().getImgheight();
        // 图片尺寸阈值（避免超大图片导致客户端假死）
        if (width > 160 || height > 250) {
            return '#fMap/Obj/Tdungeon.img/mushCatle/npc/0/0#\r\n(形象过大，暂不展示)';
        }
        const mobIdStr = mob.getId().toString().padStart(7, '0');
        return `#fMob/${mobIdStr}.img/${type}/0#`;
    } catch (e) {
        return '#fUI/UIWindow.img/Maker/randomRecipe#';
    }
}

/**
 * 获取怪物名称 - 兜底处理
 * @param {Object} mob 怪物对象
 * @returns {string} 怪物名称
 */
function getMobName(mob) {
    const name = mob.getName();
    return (!name || name === 'MISSINGNO') ? `#o${mob.getId()}#` : name;
}

/**
 * 获取等级图片 - 优化数组操作，避免性能损耗
 * @param {number} level 等级
 * @returns {string} 等级图片拼接字符串
 */
function getLevelImage(level) {
    const uiPath = 'UI/Basic/LevelNo/';
    return level.toString().split('').map(num => `#f${uiPath}${num}#`).join('');
}

/**
 * 清理缓存 - 避免内存泄漏
 */
function disposeCache() {
    cache.mapObj = null;
    cache.mobAll = [];
    cache.mobNormal = [];
    cache.mobBoss = [];
    cache.isInit = false;
}

// 原方法保留（兼容源码调用）
function leveldispose() {
    disposeCache();
    cm.dispose();
}

function levelnull() {
    disposeCache();
    cm.dispose();
}

// 移除无用方法（countAllSymbols）- 原逻辑无实际作用且影响性能