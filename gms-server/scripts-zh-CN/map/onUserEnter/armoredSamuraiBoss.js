/*
    枫城甲胄武士（盔甲武士）BOSS 刷怪
    使用 addMonsterSpawn 实现固定 1 小时刷新，重复进图不会立即刷新
*/

const BOSS_ID = 9400405;
const RESPAWN_TIME_SEC = 3600 * 2;  // 2小时 = 3600秒

const SPAWN_X = 200;
const SPAWN_Y = 117;

// ScriptEngine 会被缓存，此变量跨调用持久化，防止重复注册 SpawnPoint
var _spawnRegistered = false;

function start(ms) {
    const map = ms.getPlayer().getMap();

    // 已注册 SpawnPoint，由服务器内置刷新机制接管（每 1 小时自动刷新）
    if (_spawnRegistered) {
        return;
    }

    // BOSS 已存活，不再重复注册
    if (map.getMonsterById(BOSS_ID) != null) {
        return;
    }

    const LifeFactory = Java.type("org.gms.server.life.LifeFactory");
    const Point = Java.type("java.awt.Point");
    const mob = LifeFactory.getMonster(BOSS_ID);

    // 使用 addMonsterSpawn 注册 SpawnPoint，mobTime=3600秒
    // SpawnPoint 内置 MonsterListener，死亡后自动计时 1 小时后刷新
    // map.respawn() 周期性检查 shouldSpawn()，到期自动重新生成
    mob.setPosition(new Point(SPAWN_X, SPAWN_Y));
    map.addMonsterSpawn(mob, RESPAWN_TIME_SEC, -1);

    _spawnRegistered = true;
    ms.getPlayer().dropMessage(6, "盔甲武士出现了！（每2小时刷新一次）");
}
