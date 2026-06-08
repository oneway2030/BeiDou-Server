/**
 * 功能：展示当前地图存活的怪物种类以及物品爆率
 * 作者：Magical-H (安全优化版)
 * 版本：4.0 - 针对多BOSS崩溃问题进行彻底修复
 */
// 全局常量
const MonsterInformationProvider = Java.type('org.gms.server.life.MonsterInformationProvider');
const ItemInformationProvider = Java.type('org.gms.server.ItemInformationProvider');
const QuestInfo = Java.type('org.gms.server.quest.Quest');

// 安全阈值配置 - 调整后保持合理但不过度限制
const SAFE_CONFIG = {
    MAX_MOBS: 50,            // 单地图最多处理50种怪物（放宽限制）
    MAX_BOSSES: 50,         // 最多显示20个BOSS（放宽限制）
    MAX_LARGE_BOSSES: 20,    // 最多显示5个大型BOSS（放宽限制）
    MAX_DROPS_PER_MOB: 100,  // 单怪物最多展示30个掉落物（放宽限制）
    MAX_TEXT_LENGTH: 8000,  // 最大文本长度（大幅增加）
    MAX_DROP_TEXT_LENGTH: 10000, // 掉落列表最大长度（增加）
    TIMEOUT_MS: 500,         // 超时时间（毫秒）- 放宽限制
};

// 已知大型BOSS列表（有爆率的主体）
const LARGE_BOSSES = new Set([
    8800002, // 扎昆主体（有爆率）
    8810018, // 暗黑龙王 HORNTAIL（有爆率）
    8810026, // 暗黑龙王 SUMMON_HORNTAIL（有爆率）
]);

// 大型BOSS的部件列表（需要过滤掉，不显示）
const LARGE_BOSS_PARTS = new Set([
    // 扎昆部件（只保留8800002本体）
    8800000, // 扎昆1
    8800001, // 扎昆2
    8800003, // 扎昆手臂1
    8800004, // 扎昆手臂2
    8800005, // 扎昆手臂3
    8800006, // 扎昆手臂4
    8800007, // 扎昆手臂5
    8800008, // 扎昆手臂6
    8800009, // 扎昆手臂7
    8800010, // 扎昆手臂8
    // 暗黑龙王部件
    8810002, // HORNTAIL_HEAD_A
    8810003, // HORNTAIL_HEAD_B
    8810004, // HORNTAIL_HEAD_C
    8810005, // HORNTAIL_HAND_LEFT
    8810006, // HORNTAIL_HAND_RIGHT
    8810007, // HORNTAIL_WINGS
    8810008, // HORNTAIL_LEGS
    8810009, // HORNTAIL_TAIL
]);

// 超高风险BOSS - 完全禁止查询掉落（已禁用）
const DANGEROUS_BOSSES = new Set([
]);

/**
 * 判断是否是大型BOSS部件（需要过滤）
 */
function isLargeBossPart(mobId) {
    return LARGE_BOSS_PARTS.has(mobId);
}

/**
 * 安全获取怪物属性
 */
function safeGetMobProp(mob, prop) {
    try {
        if (!mob) return null;
        const getter = mob['get' + prop.charAt(0).toUpperCase() + prop.slice(1)];
        if (typeof getter === 'function') {
            return getter.call(mob);
        }
        return mob[prop];
    } catch (e) {
        return null;
    }
}

function getMobId(mob) {
    return safeGetMobProp(mob, 'Id');
}

function getMobName(mob) {
    try {
        const name = safeGetMobProp(mob, 'Name');
        const mobId = getMobId(mob);
        if (!name || name === 'MISSINGNO' || name.trim() === '') {
            return mobId ? `怪物(${mobId})` : '未知怪物';
        }
        return name;
    } catch (e) {
        return '未知怪物';
    }
}

function getMobLevel(mob) {
    return safeGetMobProp(mob, 'Level') || 0;
}

function isBoss(mob) {
    return safeGetMobProp(mob, 'Boss') || false;
}

function isLargeBoss(mobId) {
    return LARGE_BOSSES.has(mobId);
}

function isDangerousBoss(mobId) {
    return DANGEROUS_BOSSES.has(mobId);
}

/**
 * 获取等级图片（简化版）
 */
function getLevelImage(level) {
    if (level > 999) return '???';
    const uiPath = 'UI/Basic/LevelNo/';
    return level.toString().split('').map(num => `#f${uiPath}${num}#`).join('');
}

/**
 * 获取怪物列表（安全版）
 */
function getMonsterList() {
    try {
        const map = cm.getMap();
        if (!map) return [];
        
        const allMobs = map.getAllMonsters();
        if (!allMobs || !allMobs.iterator) return [];
        
        const mobSet = new Map();
        const iter = allMobs.iterator();
        let count = 0;
        
        // 检测是否有扎昆部件
        let hasZakumParts = false;
        // 记录已有的大型BOSS
        let hasZakumMain = false;
        
        // 第一轮：检测扎昆部件和已有的本体
        const tempMobs = [];
        while (iter.hasNext()) {
            const mob = iter.next();
            tempMobs.push(mob);
            if (mob) {
                const mobId = getMobId(mob);
                if (mobId === 8800002) {
                    hasZakumMain = true;
                }
                // 检查是否是扎昆部件
                if (isZakumPart(mobId)) {
                    hasZakumParts = true;
                }
            }
        }
        
        // 第二轮：构建怪物列表
        for (let i = 0; i < tempMobs.length && count < SAFE_CONFIG.MAX_MOBS; i++) {
            try {
                const mob = tempMobs[i];
                if (mob) {
                    const mobId = getMobId(mob);
                    if (mobId && !mobSet.has(mobId)) {
                        // 过滤掉大型BOSS的部件（手臂、翅膀、尾巴等）
                        if (isLargeBossPart(mobId)) {
                            continue;
                        }
                        mobSet.set(mobId, mob);
                        count++;
                    }
                }
            } catch (e) {
                // 跳过异常
            }
        }
        
        // 如果有扎昆部件但没有本体，添加一个虚拟的扎昆本体
        if (hasZakumParts && !hasZakumMain) {
            // 创建一个虚拟的扎昆本体对象
            const virtualZakum = {
                getId: function() { return 8800002; },
                getName: function() { return '扎昆'; },
                getLevel: function() { return 85; },
                isBoss: function() { return true; }
            };
            mobSet.set(8800002, virtualZakum);
        }
        
        return Array.from(mobSet.values());
    } catch (e) {
        return [];
    }
}

/**
 * 判断是否是扎昆部件
 */
function isZakumPart(mobId) {
    return [8800000, 8800001, 8800003, 8800004, 8800005, 8800006, 8800007, 8800008, 8800009, 8800010].includes(mobId);
}

/**
 * 入口方法 - 简化版
 */
function start() {
    const startTime = Date.now();
    
    try {
        // 获取怪物列表
        const mobs = getMonsterList();
        
        // 超快速超时检查
        if (Date.now() - startTime > SAFE_CONFIG.TIMEOUT_MS) {
            cm.sendOkLevel('dispose', '查询超时', 2);
            return;
        }
        
        if (mobs.length === 0) {
            cm.sendOkLevel('dispose', '当前地图没有存活的怪物', 2);
            return;
        }
        
        // 分离BOSS和普通怪物
        const bosses = [];
        const normalMobs = [];
        let largeBossCount = 0;
        let hasDangerousBoss = false;
        
        for (let i = 0; i < mobs.length; i++) {
            try {
                const mob = mobs[i];
                const mobId = getMobId(mob);
                
                if (isBoss(mob)) {
                    if (mobId && isDangerousBoss(mobId)) {
                        hasDangerousBoss = true;
                    }
                    if (mobId && isLargeBoss(mobId)) {
                        largeBossCount++;
                    }
                    bosses.push(mob);
                } else {
                    normalMobs.push(mob);
                }
            } catch (e) {
                normalMobs.push(mobs[i]);
            }
        }
        
        // 如果存在多个大型BOSS，给出警告并限制显示
        let hasMultipleLargeBosses = largeBossCount > SAFE_CONFIG.MAX_LARGE_BOSSES;
        
        // 构建显示文本（使用数组避免字符串累加）
        const msgParts = [];
        
        // 标题
        msgParts.push('#b#e当前地图怪物#k#n');
        msgParts.push('#d' + '——'.repeat(10) + '#k');
        
        // BOSS列表（简化显示）
        if (bosses.length > 0) {
            msgParts.push(`#e#rBOSS#k#n：${bosses.length} 种`);
            
            let bossDisplayed = 0;
            
            for (let i = 0; i < bosses.length && bossDisplayed < SAFE_CONFIG.MAX_BOSSES; i++) {
                try {
                    const mob = bosses[i];
                    const mobId = getMobId(mob);
                    const name = getMobName(mob);
                    const level = getMobLevel(mob);
                    const isLarge = mobId && isLargeBoss(mobId);
                    
                    // 所有BOSS都显示，只是标记大型BOSS
                    if (isLarge) {
                        msgParts.push(`#L${mobId}##r#fUI/UIWindow.img/UserList/Friend/icon04# ${name} #r[大型BOSS]#k\t[ Lv.${getLevelImage(level)} ] #l`);
                    } else {
                        msgParts.push(`#L${mobId}##r#fUI/UIWindow.img/UserList/Friend/icon04# ${name}#k\t[ Lv.${getLevelImage(level)} ] #l`);
                    }
                    
                    bossDisplayed++;
                } catch (e) {
                    // 跳过异常BOSS
                }
            }
            
            // 提示未显示的BOSS
            if (bosses.length > bossDisplayed) {
                msgParts.push(`#r...还有 ${bosses.length - bossDisplayed} 个BOSS#k`);
            }
        }
        
        // 普通怪物列表
        if (normalMobs.length > 0) {
            if (bosses.length > 0) msgParts.push('\r\n#d' + '——'.repeat(10) + '#k\r\n');
            msgParts.push(`普通怪物：${normalMobs.length} 种`);
            
            const normalLimit = SAFE_CONFIG.MAX_MOBS - Math.min(bosses.length, SAFE_CONFIG.MAX_BOSSES);
            let normalDisplayed = 0;
            
            for (let i = 0; i < normalMobs.length && normalDisplayed < normalLimit; i++) {
                try {
                    const mob = normalMobs[i];
                    const mobId = getMobId(mob);
                    const name = getMobName(mob);
                    const level = getMobLevel(mob);
                    
                    msgParts.push(`#L${mobId}##b#fUI/UIWindow.img/UserList/Friend/icon04# ${name}#k\t[ Lv.${getLevelImage(level)} ] #l`);
                    normalDisplayed++;
                } catch (e) {
                    // 跳过异常怪物
                }
            }
            
            if (normalMobs.length > normalDisplayed) {
                msgParts.push(`#b...还有 ${normalMobs.length - normalDisplayed} 个怪物#k`);
            }
        }
        
        // 限制总长度
        const finalMsg = msgParts.join('\r\n').substring(0, SAFE_CONFIG.MAX_TEXT_LENGTH);
        cm.sendNextSelectLevel('ShowDropList', finalMsg, 2);
        
    } catch (e) {
        cm.sendOkLevel('dispose', '查询出错', 2);
    }
}

/**
 * 展示掉落列表（极度简化版）
 */
function levelShowDropList(mobId) {
    try {
        // 获取怪物信息
        const map = cm.getMap();
        if (!map) {
            cm.sendLastLevel('main', '无法获取地图', 2);
            return;
        }
        
        let mob = null;
        const allMobs = map.getAllMonsters();
        if (allMobs && allMobs.iterator) {
            const iter = allMobs.iterator();
            while (iter.hasNext()) {
                const m = iter.next();
                if (getMobId(m) === mobId) {
                    mob = m;
                    break;
                }
            }
        }
        
        // 获取掉落列表（限制数量）
        const drops = getDropsLimited(mobId);
        
        // 获取怪物名称（优先从实际怪物获取，否则从数据配置获取）
        let mobName = null;
        if (mob) {
            mobName = getMobName(mob);
        } else {
            // 如果怪物不存在，尝试从MonsterInformationProvider获取名称
            try {
                mobName = MonsterInformationProvider.getInstance().getMobName(mobId);
            } catch (e) {
                mobName = null;
            }
        }
        
        // 如果还是获取不到名称，使用默认名称
        if (!mobName || mobName === 'MISSINGNO' || mobName.trim() === '') {
            mobName = `怪物(${mobId})`;
        }
        
        // 构建消息
        const msgParts = [];
        msgParts.push(`[ #e#b${mobName}#k#n ]`);
        
        // 只有实际存在的怪物才显示属性
        if (mob && !isLargeBoss(mobId)) {
            const maxHp = safeGetMobProp(mob, 'MaxHp') || 0;
            const maxMp = safeGetMobProp(mob, 'MaxMp') || 0;
            msgParts.push(`血量：${maxHp}`);
            msgParts.push(`蓝量：${maxMp}`);
        }
        
        // 掉落列表
        if (drops.length === 0) {
            msgParts.push('\r\n没有掉落物品');
        } else {
            msgParts.push('\r\n' + '-'.repeat(20) + '掉落列表' + '-'.repeat(20));
            msgParts.push('#b物品名称\t\t掉率#k');
            
            const player = cm.getPlayer();
            const dropRate = player.getDropRate() * player.getFamilyDrop();
            
            for (let i = 0; i < drops.length; i++) {
                try {
                    const drop = drops[i];
                    const itemName = getItemNameSafe(drop.itemId);
                    const chance = (drop.chance / 10000 * dropRate).toFixed(4) + '%';
                    msgParts.push(`#L${drop.itemId}##v${drop.itemId}# ${itemName.padEnd(15)} \t\t #d${chance}#k#l`);
                } catch (e) {
                    // 跳过异常掉落物
                }
            }
        }
        
        const finalMsg = msgParts.join('\r\n').substring(0, SAFE_CONFIG.MAX_DROP_TEXT_LENGTH);
        cm.sendLastLevel('main', finalMsg, 2);
        
    } catch (e) {
        cm.sendLastLevel('main', '查询失败', 2);
    }
}

/**
 * 安全获取掉落列表（限制数量）
 */
function getDropsLimited(mobId) {
    try {
        const drops = MonsterInformationProvider.getInstance().retrieveDrop(mobId);
        if (!drops || !drops.iterator) return [];
        
        const result = [];
        const iter = drops.iterator();
        let count = 0;
        
        while (iter.hasNext() && count < SAFE_CONFIG.MAX_DROPS_PER_MOB) {
            try {
                const drop = iter.next();
                if (drop && drop.itemId > 0) {
                    result.push({
                        itemId: drop.itemId,
                        chance: drop.chance
                    });
                    count++;
                }
            } catch (e) {
                // 跳过
            }
        }
        
        return result;
    } catch (e) {
        return [];
    }
}

/**
 * 安全获取物品名称
 */
function getItemNameSafe(itemId) {
    try {
        if (!itemId || itemId <= 0) return `物品(${itemId})`;
        const name = ItemInformationProvider.getInstance().getName(itemId);
        if (!name || name === 'MISSINGNO') {
            return `未知(${itemId})`;
        }
        return name;
    } catch (e) {
        return `物品(${itemId})`;
    }
}

function disposeCache() {}
function leveldispose() { cm.dispose(); }
function levelnull() { cm.dispose(); }