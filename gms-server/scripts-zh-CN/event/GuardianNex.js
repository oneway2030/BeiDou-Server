var minPlayers = 1;
var timeLimit = 15; //15 minutes
var eventTimer = 1000 * 60 * timeLimit;
var exitMap = 240070000;
var eventMap = 240070010;
var eventBossIds = [7120100, 7120101, 7120102, 8120100, 8120101, 8140510];
// 新增：BOSS生成的默认坐标（可根据地图实际配置调整，(0,0)为地图中心）
var bossSpawnPos = {x: 0, y: 0};

function init() {
}

function setup(difficulty, lobbyId) {
    var eim = em.newInstance("Nex_" + lobbyId);
    eim.setIntProperty("nex", lobbyId);
    let mapId = eventMap + 10 * lobbyId;
    eim.setIntProperty("currentMapId", mapId);
    // 获取战斗地图实例并重置（清空残留怪物）
    var battleMap = eim.getInstanceMap(mapId);
    battleMap.resetFully();
    battleMap.allowSummonState(false);
    return eim;
}

function afterSetup(eim) {
}

// 新增：核心BOSS生成函数（替代空的respawn）
function spawnBoss(eim, mapId) {
    // 1. 获取当前房间对应的BOSS ID
    var lobbyId = eim.getIntProperty("nex");
    var targetBossId = eventBossIds[lobbyId];

    // 安全校验：防止lobbyId超出BOSS列表范围
    if (!targetBossId) {
        console.error("BOSS ID不存在：lobbyId=" + lobbyId);
        return;
    }

    // 2. 获取战斗地图实例
    var battleMap = eim.getInstanceMap(mapId);

    // 3. 清空地图残留的同ID BOSS（防止重复生成）
    var allMonsters = battleMap.getMonsters();
    for (var i = 0; i < allMonsters.size(); i++) {
        var mob = allMonsters.get(i);
        if (mob.getId() === targetBossId) {
            battleMap.removeMapObject(mob)
            return;
        }
    }

    // 4. 在地图指定坐标生成BOSS（核心：实际触发BOSS刷新）
    battleMap.spawnMonsterOnGroundBelow(targetBossId, bossSpawnPos.x, bossSpawnPos.y);
    console.log("BOSS生成成功：ID=" + targetBossId + " 地图=" + mapId + " 坐标=(" + bossSpawnPos.x + "," + bossSpawnPos.y + ")");
}

// 保留原respawn函数（兼容服务器钩子调用），内部调用实际生成逻辑
function respawn(eim) {
    var mapId = eim.getIntProperty("currentMapId");
    spawnBoss(eim, mapId);
}

function playerEntry(eim, player) {
    var mapId = eventMap + 10 * eim.getIntProperty("nex");
    var cave = eim.getMapInstance(mapId);
    player.changeMap(cave, 1);
    respawn(eim);
    eim.startEventTimer(eventTimer);
    // 提示玩家BOSS已生成
    player.dropMessage(6, "任务已开始，请击败区域内的BOSS完成挑战！");
}

function scheduledTimeout(eim) {
    var party = eim.getPlayers();
    for (var i = 0; i < party.size(); i++) {
        var player = party.get(i);
        player.dropMessage(6, "任务时间结束，挑战失败！");
        playerExit(eim, player);
    }
    eim.dispose();
}

function playerRevive(eim, player) {
    player.respawn(eim, exitMap);
    player.dropMessage(6, "你已被传送至安全区域，任务失败！");
    return false;
}

function playerDead(eim, player) {
}

function playerDisconnected(eim, player) {
    if (eim.isEventTeamLackingNow(true, minPlayers, player)) {
        eim.unregisterPlayer(player);
        end(eim);
    } else {
        eim.unregisterPlayer(player);
    }
}

function monsterValue(eim, mobId) {
    return -1;
}

function end(eim) {
    var party = eim.getPlayers();
    for (var i = 0; i < party.size(); i++) {
        playerExit(eim, party.get(i));
    }
    eim.dispose();
}

function leftParty(eim, player) {
}

function disbandParty(eim) {
}

function playerUnregistered(eim, player) {
}

function playerExit(eim, player) {
    eim.unregisterPlayer(player);
    player.changeMap(exitMap);
}

function changedMap(eim, player, mapid) {
    if (mapid != eim.getIntProperty("currentMapId")) {
        if (eim.isEventTeamLackingNow(true, minPlayers, player)) {
            eim.unregisterPlayer(player);
            end(eim);
        } else {
            eim.unregisterPlayer(player);
        }
    }
}

function cancelSchedule() {
}

function dispose() {
}

function clearPQ(eim) {
    eim.stopEventTimer();
    eim.setEventCleared();
}

function monsterKilled(mob, eim) {
    var targetBossId = eventBossIds[eim.getIntProperty("nex")];
    if (mob.getId() === targetBossId) {
        eim.showClearEffect();
        eim.clearPQ();
        // 可选：BOSS击杀后提示
        var players = eim.getPlayers();
        for (var i = 0; i < players.size(); i++) {
            players.get(i).dropMessage(6, "恭喜！你成功击败BOSS，挑战完成！");
        }
    }
}

function allMonstersDead(eim) {
}

function changedLeader(eim, leader) {
}