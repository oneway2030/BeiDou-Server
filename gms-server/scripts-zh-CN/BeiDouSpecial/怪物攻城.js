/**
 * @description 怪物攻城系统
 * @author hzh
 */

var LifeFactory = Java.type('org.gms.server.life.LifeFactory');

var status = 0;
var summonedMonsters = []; // 记录已召唤的怪物
var meso_id = 9999999;//金币
var cash_id = 9999998;//点卷

// 召唤全部怪物时需要的通用消耗材料
var globalNeedItems = [
    {id: 2020009, qty: 1, tip: ""},
];

// 怪物配置数据 - 使用正确的怪物ID
var monsterConfigs = {
    // 扎昆 - 多个部件组成
    zakum: {
        name: "扎昆",
        parts: [
            {id: 8800000, name: "扎昆主体"},
            {id: 8800003, name: "扎昆手臂1"},
            {id: 8800004, name: "扎昆手臂2"},
            {id: 8800005, name: "扎昆手臂3"},
            {id: 8800006, name: "扎昆手臂4"},
            {id: 8800007, name: "扎昆手臂5"},
            {id: 8800008, name: "扎昆手臂6"},
            {id: 8800009, name: "扎昆手臂7"},
            {id: 8800010, name: "扎昆手臂8"},
        ],
        spacing: 300,
        point: [2483, 334],
        isMultiPart: true
    },
    // 黑龙 - 多个部件组成
    blackDragon: {
        name: "黑龙",
        parts: [
            {id: 8800000, name: "暗黑龙王主体"},
            {id: 8800001, name: "暗黑龙王左头"},
            {id: 8800002, name: "暗黑龙王右头"},
            {id: 8800003, name: "暗黑龙王尾巴"}
        ],
        spacing: 300,
        isMultiPart: true
    },
    // 班雷昂
    banley: {
        name: "班雷昂",
        parts: [{id: 8840000, name: "班雷昂"}],
        isMultiPart: false
    },
    // 品克缤
    pinkBeen: {
        count: 3,
        name: "品克缤",
        parts: [{id: 8820001, name: "品克缤"}],
        isMultiPart: false
    }
};

// 射手村6个地块区域（y轴固定，x轴在区间内随机）
var groundAreas = [
    {minX: -822, maxX: 814, y: 274},      // 地块1
    {minX: 1012, maxX: 3330, y: 334},      // 地块2
    {minX: 3620, maxX: 6250, y: 454},     // 地块3
    {minX: 3683, maxX: 4250, y: 124},     // 地块4
    {minX: 4779, maxX: 5410, y: -116},    // 地块5
    {minX: 5601, maxX: 6174, y: -176}     // 地块6
];
// 射手村地图ID
var SHOOTING_STAR_VILLAGE = 100000000;

function start() {
    status = 1;
    action(1, 0, 0);
}

var OldTitle = "\t\t\t\t\t#e#k欢迎来到#r[怪物攻城系统]#k系统#n\t\t\t\t\r\n";

function action(mode, type, selection) {
    if (mode == 0) {
        cm.dispose();
        return;
    }

    // 第一层：主菜单
    if (status == 1) {
        var txt = OldTitle;
        txt += "\r\n";
        txt += "#r说明:#k\r\n\r\n";
        txt += "#b1.必须在射手村召唤:#k\r\n\r\n";
        txt += "#b2.xxxxx:#k\r\n\r\n";
        txt += "\r\n";
        txt += "#L1##r开启怪物攻城#l\r\n";
        txt += "\r\n";
        if (cm.getPlayer().isGM()) {
            txt += "\r\n\r\n\t GM调试功能：\r\n";
            txt += "#L0##b1. 召唤怪物（选择单个）#l\r\n";
            txt += "#L2#3. 清除当前地图上所有的怪物#l\r\n";
            txt += "#L3#4. 获取当前坐标#l\r\n";
        }
        cm.sendSimple(txt);
        status = 2;
    }
    // 第二层：选择操作
    else if (status == 2) {
        if (selection == 0) {
            // 召唤怪物（选择单个）
            showMonsterList();
            status = 3;
        } else if (selection == 1) {
            // 召唤全部怪物
            summonAllMonsters();
            cm.dispose();
        } else if (selection == 2) {
            // 清除所有怪物
            clearAllMonsters();
            cm.dispose();
        } else if (selection == 3) {
            let x = cm.getPlayer().getPosition().getX();
            let y = cm.getPlayer().getPosition().getY();
            console.info("主菜单脚本错误===》:" + "X=" + x + " " + y);
            cm.sendOk("当前人物坐标：" + "#r X: " + x + "  Y: " + y);
            cm.dispose();
        }
    }
    // 第三层：选择怪物
    else if (status == 3) {
        summonMonster(selection);
        cm.dispose();
    }
}

function showMonsterList() {
    var txt = "#r请选择要召唤的怪物#k\r\n\r\n";
    var index = 0;
    for (var key in monsterConfigs) {
        var config = monsterConfigs[key];
        txt += "#L" + index + "#" + (index + 1) + ". " + config.name + "#l\r\n";
        index++;
    }
    cm.sendSimple(txt);
}

function summonMonster(selection) {
    var monsterKeys = Object.keys(monsterConfigs);
    var key = monsterKeys[selection];
    var config = monsterConfigs[key];

    if (!config) {
        cm.sendOk("无效的怪物选择");
        return;
    }

    // 获取射手村地图
    var map = cm.getPlayer().getMap();
    if (map.getId() != SHOOTING_STAR_VILLAGE) {
        cm.sendOk("请先前往射手村！");
        return;
    }

    // 获取坐标：优先使用配置的point，否则使用随机位置
    var spawnX, spawnY;
    if (config.point) {
        spawnX = config.point[0];
        spawnY = config.point[1];
    } else {
        // 随机选择一个地块
        var selectedArea = groundAreas[Math.floor(Math.random() * groundAreas.length)];
        // 在该地块的x轴范围内随机生成坐标，y轴固定
        spawnX = Math.floor(Math.random() * (selectedArea.maxX - selectedArea.minX + 1)) + selectedArea.minX;
        spawnY = selectedArea.y;
    }

    // 召唤怪物
    if (key === "zakum") {
        // 扎昆：参考ZakumCommand
        // 主体使用spawnFakeMonsterOnGroundBelow（fake状态）
        var LifeFactory = Java.type('org.gms.server.life.LifeFactory');
        var zakumBody = LifeFactory.getMonster(8800000); // 扎昆主体
        map.spawnFakeMonsterOnGroundBelow(zakumBody, new java.awt.Point(spawnX, spawnY));
        summonedMonsters.push({id: 8800000, x: spawnX, y: spawnY});

        // 手臂使用spawnMonsterOnGroundBelow
        for (var armId = 8800003; armId <= 8800010; armId++) {
            var arm = LifeFactory.getMonster(armId);
            map.spawnMonsterOnGroundBelow(arm, new java.awt.Point(spawnX, spawnY));
            summonedMonsters.push({id: armId, x: spawnX, y: spawnY});
        }
    } else if (key === "blackDragon") {
        // 黑龙：参考HorntailCommand，使用spawnHorntailOnGroundBelow
        map.spawnHorntailOnGroundBelow(new java.awt.Point(spawnX, spawnY));
        summonedMonsters.push({id: 8810018, x: spawnX, y: spawnY}); // 记录主体ID
    } else if (config.isMultiPart) {
        // 其他多部件怪物，在同一水平位置召唤所有部件
        for (var i = 0; i < config.parts.length; i++) {
            var part = config.parts[i];
            // 不同部件在水平方向上偏移，形成整体
            var offsetX = (i - Math.floor(config.parts.length / 2)) * 60;
            spawnMonster(part.id, spawnX + offsetX, spawnY);
        }
    } else {
        // 单部件怪物，直接召唤
        spawnMonster(config.parts[0].id, spawnX, spawnY);
    }

    cm.sendOk("已成功召唤 " + config.name + "！");
}

function summonAllMonsters() {
    // 获取射手村地图
    var map = cm.getPlayer().getMap();
    if (map.getId() != SHOOTING_STAR_VILLAGE) {
        cm.sendOk("请先前往射手村！");
        return;
    }

    // 检查地图上是否有怪物
    var mobs = map.getMonsters();
    if (mobs.size() > 0) {
        cm.sendOk("当前地图上已有怪物，请先杀死后在召唤！");
        return;
    }

    // ========== 第一步：收集所有needItems并检查材料是否满足 ==========
    var monsterKeys = Object.keys(monsterConfigs);
    var allNeedItems = []; // 汇总所有需要的材料 [{id, qty, tip}]
    var lackItems = [];    // 缺失的材料提示列表

    // 收集各怪物的needItems
    for (var i = 0; i < monsterKeys.length; i++) {
        var config = monsterConfigs[monsterKeys[i]];
        var count = config.count || 1;
        var needItems = config.needItems;

        if (needItems) {
            // 每种怪物需要 * count 份材料
            for (var n = 0; n < needItems.length; n++) {
                var need = needItems[n];
                allNeedItems.push({id: need.id, qty: need.qty * count, tip: need.tip});
            }
        }
    }

    // 加上全局通用消耗材料
    if (globalNeedItems) {
        for (var g = 0; g < globalNeedItems.length; g++) {
            var gNeed = globalNeedItems[g];
            allNeedItems.push({id: gNeed.id, qty: gNeed.qty, tip: gNeed.tip});
        }
    }

    // 检查所有材料
    for (var j = 0; j < allNeedItems.length; j++) {
        var need = allNeedItems[j];
        var itemName = cm.getPlayer().getItemName(need.id);
        var hasQty = cm.getItemQuantity(need.id);
        if (hasQty < need.qty) {

            lackItems.push("#v" + need.id + "##z" + need.id + "# 需要 #r" + need.qty + "#k 个，当前拥有 #r" + hasQty + "#k 个" + (need.tip ? " " + need.tip : ""));
        }
    }

    // 如果有缺失材料，弹窗提示并返回
    if (lackItems.length > 0) {
        var lackText = "#r材料不足，无法召唤！#k\r\n\r\n#b缺少以下道具：#k\r\n";
        for (var k = 0; k < lackItems.length; k++) {
            lackText += "\r\n" + lackItems[k];
        }
        cm.sendOk(lackText);
        cm.dispose();
        return;
    }

    // ========== 第二步：扣除所有材料 ==========
    for (var j = 0; j < allNeedItems.length; j++) {
        var need = allNeedItems[j];
        cm.gainItem(need.id, -need.qty);
    }

    // ========== 第三步：召唤怪物 ==========
    var summonedCount = 0;
    var usedPositions = []; // 记录已使用的位置

    for (var i = 0; i < monsterKeys.length; i++) {
        var key = monsterKeys[i];
        var config = monsterConfigs[key];

        // 获取召唤数量，默认1只
        var count = config.count || 1;
        // 获取间距，默认50像素
        var spacing = config.spacing || 50;

        // 获取坐标：优先使用配置的point，否则使用随机位置（确保不重复）
        var spawnX, spawnY;
        if (config.point) {
            spawnX = config.point[0];
            spawnY = config.point[1];
        } else {
            // 生成不重复的随机位置
            var attempts = 0;
            do {
                // 随机选择一个地块
                var selectedArea = groundAreas[Math.floor(Math.random() * groundAreas.length)];
                // 在该地块的x轴范围内随机生成坐标，y轴固定
                spawnX = Math.floor(Math.random() * (selectedArea.maxX - selectedArea.minX + 1)) + selectedArea.minX;
                spawnY = selectedArea.y;
                attempts++;
            } while (isPositionUsed(spawnX, spawnY, usedPositions, spacing) && attempts < 100);

            // 记录已使用的位置（带上间距信息）
            usedPositions.push({x: spawnX, y: spawnY, spacing: spacing});
        }

        // 循环召唤
        for (var c = 0; c < count; c++) {
            // 多只时生成不重复的随机位置
            if (c > 0) {
                var posAttempts = 0;
                do {
                    var posArea = groundAreas[Math.floor(Math.random() * groundAreas.length)];
                    spawnX = Math.floor(Math.random() * (posArea.maxX - posArea.minX + 1)) + posArea.minX;
                    spawnY = posArea.y;
                    posAttempts++;
                } while (isPositionUsed(spawnX, spawnY, usedPositions, spacing) && posAttempts < 100);
                usedPositions.push({x: spawnX, y: spawnY, spacing: spacing});
            }

            // 召唤怪物
            if (key === "zakum") {
                // 扎昆：参考ZakumCommand
                var LifeFactory = Java.type('org.gms.server.life.LifeFactory');
                var zakumBody = LifeFactory.getMonster(8800000);
                map.spawnFakeMonsterOnGroundBelow(zakumBody, new java.awt.Point(spawnX, spawnY));
                summonedMonsters.push({id: 8800000, x: spawnX, y: spawnY});

                for (var armId = 8800003; armId <= 8800010; armId++) {
                    var arm = LifeFactory.getMonster(armId);
                    map.spawnMonsterOnGroundBelow(arm, new java.awt.Point(spawnX, spawnY));
                    summonedMonsters.push({id: armId, x: spawnX, y: spawnY});
                }
                summonedCount++;
            } else if (key === "blackDragon") {
                // 黑龙：参考HorntailCommand
                map.spawnHorntailOnGroundBelow(new java.awt.Point(spawnX, spawnY));
                summonedMonsters.push({id: 8810018, x: spawnX, y: spawnY});
                summonedCount++;
            } else if (config.isMultiPart) {
                // 其他多部件怪物
                for (var j = 0; j < config.parts.length; j++) {
                    var part = config.parts[j];
                    var offsetX = (j - Math.floor(config.parts.length / 2)) * 60;
                    spawnMonster(part.id, spawnX + offsetX, spawnY);
                }
                summonedCount++;
            } else {
                // 单部件怪物
                spawnMonster(config.parts[0].id, spawnX, spawnY);
                summonedCount++;
            }
        }
    }

    cm.sendOk("已成功召唤全部 " + summonedCount + " 种怪物！");
}

// 检查位置是否已被使用（检查附近指定像素范围内是否有其他怪物）
function isPositionUsed(x, y, usedPositions, spacing) {
    for (var i = 0; i < usedPositions.length; i++) {
        var pos = usedPositions[i];
        var distance = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2));
        // 取两者中较大的间距值，确保两个怪物之间不会靠太近
        var minDist = Math.max(spacing, pos.spacing);
        if (distance < minDist) {
            return true;
        }
    }
    return false;
}

function spawnMonster(mobId, x, y) {
    try {
        // 先验证怪物ID是否有效
        var monster = LifeFactory.getMonster(mobId);
        if (monster == null) {
            cm.dropMessage(1, "怪物ID " + mobId + " 无效");
            return;
        }
        cm.spawnMonster(mobId, x, y);
        summonedMonsters.push({id: mobId, x: x, y: y});
    } catch (e) {
        cm.dropMessage(1, "召唤怪物失败 " + mobId + ": " + e);
    }
}

function clearAllMonsters() {
    var map = cm.getPlayer().getMap();
    var currentMapId = map.getId();

    // 检查是否在射手村
    if (currentMapId != SHOOTING_STAR_VILLAGE) {
        cm.sendOk("请先前往射手村！当前地图ID: " + currentMapId);
        return;
    }

    // 清除地图上所有怪物
    var mobs = map.getMonsters();
    var count = 0;
    var mobArray = [];

    // 使用Java迭代器遍历
    var iterator = mobs.iterator();
    while (iterator.hasNext()) {
        mobArray.push(iterator.next());
    }

    // 遍历怪物数组并清除 - 使用map.killMonster方法
    for (var i = 0; i < mobArray.length; i++) {
        var mob = mobArray[i];
        try {
            // 使用MapleMap的killMonster方法移除怪物
            map.killMonster(mob, null, false);
            count++;
        } catch (e) {
            cm.dropMessage(1, "移除怪物失败: " + e);
        }
    }

    summonedMonsters = [];
    cm.sendOk("已清除 " + count + " 只怪物！当前地图怪物总数: " + map.getMonsters().size());
}