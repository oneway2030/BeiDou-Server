/*
    枫城天皇蟾蜍 BOSS 刷怪（地图进入时）
    9400408 天皇 → 击败后 WZ revive 变为 9400409 天皇蟾蜍
    使用 addMonsterSpawn 实现固定 2 小时刷新，重复进图不会立即刷新
*/

const BOSS_PHASE1 = 9400408;
const BOSS_PHASE2 = 9400409;
const RESPAWN_TIME_SEC = 3600 * 6;  // 6小时

const SPAWN_BY_MAP = {
    800040401: {x: 50, y: 47},
    800040410: {x: 239, y: 169}
};

// ScriptEngine 会被缓存，此变量跨调用持久化，防止重复注册 SpawnPoint
var _spawnRegistered = {};

function start(ms) {
    const map = ms.getPlayer().getMap();
    const mapId = map.getId();
    const spawn = SPAWN_BY_MAP[mapId];

    if (spawn == null) {
        return;
    }

    // 已注册 SpawnPoint，由服务器内置刷新机制接管（每 2 小时自动刷新）
    if (_spawnRegistered[mapId]) {
        return;
    }

    // BOSS 已存活（含二阶段 9400409），不再重复注册
    if (map.getMonsterById(BOSS_PHASE1) != null || map.getMonsterById(BOSS_PHASE2) != null) {
        return;
    }

    const LifeFactory = Java.type("org.gms.server.life.LifeFactory");
    const Point = Java.type("java.awt.Point");
    const mob = LifeFactory.getMonster(BOSS_PHASE1);

    // 使用 addMonsterSpawn 注册 SpawnPoint，mobTime=7200秒
    // SpawnPoint 内置 MonsterListener，死亡后自动计时 2 小时后刷新
    // map.respawn() 周期性检查 shouldSpawn()，到期自动重新生成
    mob.setPosition(new Point(spawn.x, spawn.y));
    map.addMonsterSpawn(mob, RESPAWN_TIME_SEC, -1);

    _spawnRegistered[mapId] = true;
    ms.getPlayer().dropMessage(6, "天皇出现了！击败他后，真正的天皇蟾蜍将会现身。（每6小时刷新一次）");
}
