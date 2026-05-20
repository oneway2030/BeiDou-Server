/*
    枫城天皇蟾蜍 BOSS 刷怪（地图进入时）
    9400408 天皇 → 击败后 WZ revive 变为 9400409 天皇蟾蜍
*/

const BOSS_PHASE1 = 9400408;
const BOSS_PHASE2 = 9400409;

const SPAWN_BY_MAP = {
    800040401: { x: 50, y: 47 },
    800040410: { x: 239, y: 169 }
};

function start(ms) {
    const map = ms.getPlayer().getMap();
    const mapId = map.getId();
    const spawn = SPAWN_BY_MAP[mapId];

    if (spawn == null) {
        return;
    }
    if (map.getMonsterById(BOSS_PHASE1) != null || map.getMonsterById(BOSS_PHASE2) != null) {
        return;
    }

    const LifeFactory = Java.type("org.gms.server.life.LifeFactory");
    const Point = Java.type("java.awt.Point");
    const mob = LifeFactory.getMonster(BOSS_PHASE1);

    map.spawnMonsterOnGroundBelow(mob, new Point(spawn.x, spawn.y));
    ms.getPlayer().dropMessage(6, "天皇出现了！击败他后，真正的天皇蟾蜍将会现身。");
}
