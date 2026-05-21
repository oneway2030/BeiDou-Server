/*
    多地图BOSS召唤 NPC (9900002)
    - 根据不同地图召唤不同BOSS
    - 支持门票消耗（DEBUG模式可关闭）
    - 每天每人召唤次数限制（按配置区分）
    - 参照 VanLeon_ExpeditionEnter.js / custom9600086Boss.js 的召唤方式
*/

// ====== 调试开关（true=不消耗道具、不计次数） ======
// var DEBUG = true;
var DEBUG = false;
// ====== BOSS配置数组 ======
// mapId:    地图ID
// bossId:   BOSS ID
// bossName: BOSS名称
// ticketId: 门票道具ID（0=无需门票）
// dailyLimit: 每天每人最多召唤次数
// spawnX / spawnY: 出生坐标
var BOSS_CONFIGS = [
    { mapId: 211070100, bossId: 8840000, bossName: "班·雷昂",  ticketId: 4001254, dailyLimit: 3, spawnX: -300, spawnY: -192 },
    // { mapId: 703011000, bossId: 9600086, bossName: "钻机BOSS", ticketId: 4001254, dailyLimit: 3, spawnX: -120, spawnY: 83 },
    { mapId: 703011000, bossId: 9600087, bossName: "钻机BOSS", ticketId: 4001254, dailyLimit: 3, spawnX: -120, spawnY: 83 }
];

var FREE_MARKET_ID = 910000000;
var COUNT_KEY_PREFIX = "BOSS_COUNT_";  // 每日次数Key前缀，每天自动清空

var status = 0;
var matchedConfigs = [];   // 当前地图匹配的配置索引数组
var selectedConfigIdx = -1;

var LifeFactory = Java.type("org.gms.server.life.LifeFactory");
var Point = Java.type("java.awt.Point");

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode < 0) {
        cm.dispose();
        return;
    }
    if (mode == 0) {
        cm.dispose();
        return;
    }
    status++;

    if (status == 0) {
        // ---- 筛选当前地图可用的BOSS配置 ----
        var mapId = cm.getMapId();
        matchedConfigs = [];
        for (var i = 0; i < BOSS_CONFIGS.length; i++) {
            if (BOSS_CONFIGS[i].mapId == mapId) {
                matchedConfigs.push(i);
            }
        }

        if (matchedConfigs.length == 0) {
            cm.sendOk("该地图没有可召唤的BOSS。");
            cm.dispose();
            return;
        }

        // ---- 构建菜单 ----
        var menu = "#b请选择要执行的操作：#k\r\n\r\n";
        for (var j = 0; j < matchedConfigs.length; j++) {
            var cfg = BOSS_CONFIGS[matchedConfigs[j]];
            var remaining = getDailyRemaining(matchedConfigs[j]);

            var ticketStr = "";
            if (cfg.ticketId > 0) {
                ticketStr = " (需要 #v" + cfg.ticketId + "##z" + cfg.ticketId + "# 1个)";
            }
            if (DEBUG) {
                ticketStr = " [#d调试模式，免门票#k]";
            }
            menu += "#L" + j + "# 召唤 #r" + cfg.bossName + "#k" + ticketStr + " [今日剩余:#b" + remaining + "#k/#b" + cfg.dailyLimit + "#k]#l\r\n";
        }

        // 调试模式下显示清除BOSS选项
        if (DEBUG) {
            menu += "\r\n#d----- 调试: 清除地图BOSS -----#k\r\n";
            for (var k = 0; k < matchedConfigs.length; k++) {
                var clearCfg = BOSS_CONFIGS[matchedConfigs[k]];
                var exists = cm.getMap().getMonsterById(clearCfg.bossId) != null;
                var existsStr = exists ? " [#g已存在#k]" : " [#r不存在#k]";
                menu += "#L" + (matchedConfigs.length + 1 + k) + "# 清除 " + clearCfg.bossName + existsStr + "#l\r\n";
            }
        }

        menu += "\r\n#L" + matchedConfigs.length + "# 传送到自由市场#l";
        cm.sendSimple(menu);

    } else if (status == 1) {
        if (selection < matchedConfigs.length) {
            // ========== 召唤BOSS ==========
            selectedConfigIdx = matchedConfigs[selection];
            var cfg = BOSS_CONFIGS[selectedConfigIdx];
            var map = cm.getMap();

            // 检查BOSS是否已存在
            if (map.getMonsterById(cfg.bossId) != null) {
                cm.sendOk(cfg.bossName + "已经出现了！");
                cm.dispose();
                return;
            }

            // 检查每日次数（DEBUG模式跳过）
            if (!DEBUG && getDailyRemaining(selectedConfigIdx) <= 0) {
                cm.sendOk("你今天召唤" + cfg.bossName + "的次数已经用完了！(每日限制:#b" + cfg.dailyLimit + "#k次)");
                cm.dispose();
                return;
            }

            // 检查门票（DEBUG模式跳过）
            if (!DEBUG && cfg.ticketId > 0 && !cm.haveItem(cfg.ticketId, 1)) {
                cm.sendOk("你没有 #v" + cfg.ticketId + "##z" + cfg.ticketId + "#，无法召唤" + cfg.bossName + "！");
                cm.dispose();
                return;
            }

            // 二次确认
            var confirmMsg = "确定要召唤 #r" + cfg.bossName + "#k 吗？";
            if (!DEBUG && cfg.ticketId > 0) {
                confirmMsg += "\r\n将消耗 1个 #v" + cfg.ticketId + "##z" + cfg.ticketId + "#";
            }
            if (DEBUG) {
                confirmMsg += "\r\n#d(调试模式，不消耗道具，不计次数)#k";
            } else {
                confirmMsg += "\r\n召唤后今日剩余次数:#b" + (getDailyRemaining(selectedConfigIdx) - 1) + "#k/#b" + cfg.dailyLimit + "#k";
            }
            cm.sendYesNo(confirmMsg);

        } else if (DEBUG && selection > matchedConfigs.length && selection <= matchedConfigs.length * 2) {
            // ========== 清除BOSS（仅DEBUG模式显示） ==========
            var clearIdx = matchedConfigs[selection - matchedConfigs.length - 1];
            var clearCfg = BOSS_CONFIGS[clearIdx];
            var map = cm.getMap();

            if (map.getMonsterById(clearCfg.bossId) == null) {
                cm.sendOk("地图上没有 " + clearCfg.bossName + "！");
            } else {
                map.killMonster(clearCfg.bossId);
                cm.getPlayer().dropMessage(5, "已清除地图上的 " + clearCfg.bossName + "！");
                cm.sendOk("已清除地图上的 " + clearCfg.bossName + "！");
            }
            cm.dispose();

        } else if (selection == matchedConfigs.length) {
            // 传送到自由市场
            cm.warp(FREE_MARKET_ID);
            cm.dispose();
        }

    } else if (status == 2) {
        var cfg = BOSS_CONFIGS[selectedConfigIdx];
        var map = cm.getMap();

        // 消耗门票（DEBUG模式跳过）
        if (!DEBUG && cfg.ticketId > 0) {
            cm.gainItem(cfg.ticketId, -1);
        }

        // 记录每日次数（DEBUG模式跳过）
        if (!DEBUG) {
            addDailyCount(selectedConfigIdx);
        }

        // 召唤BOSS（与 VanLeon_ExpeditionEnter.js / custom9600086Boss.js 一致的方式）
        var mob = LifeFactory.getMonster(cfg.bossId);
        map.spawnMonsterOnGroundBelow(mob, new Point(cfg.spawnX, cfg.spawnY));
        cm.getPlayer().dropMessage(5, cfg.bossName + " 出现了！");

        cm.dispose();
    }
}

// ==================== 每日次数管理（getAccountExtendValue + true 自动每日清空） ====================

function getCountKey(configIdx) {
    var cfg = BOSS_CONFIGS[configIdx];
    return COUNT_KEY_PREFIX + cfg.bossId + "_" + cfg.mapId;
}

function getDailyUsed(configIdx) {
    var v = cm.getAccountExtendValue(getCountKey(configIdx), true);
    if (v == null || v === "") {
        return 0;
    }
    return parseInt(v, 10) || 0;
}

function getDailyRemaining(configIdx) {
    var cfg = BOSS_CONFIGS[configIdx];
    if (cfg.dailyLimit <= 0) return 0;
    return cfg.dailyLimit - getDailyUsed(configIdx);
}

function addDailyCount(configIdx) {
    var used = getDailyUsed(configIdx) + 1;
    cm.saveOrUpdateAccountExtendValue(getCountKey(configIdx), String(used), true);
}
