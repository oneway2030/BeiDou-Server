/*
    枫城甲胄武士（盔甲武士）BOSS 刷怪
*/

const BOSS_ID = 9400405;
const SPAWN_X = 200;
const SPAWN_Y = 117;

function start(ms) {
    const map = ms.getPlayer().getMap();

    if (map.getMonsterById(BOSS_ID) != null) {
        return;
    }

    const LifeFactory = Java.type("org.gms.server.life.LifeFactory");
    const Point = Java.type("java.awt.Point");
    const mob = LifeFactory.getMonster(BOSS_ID);

    map.spawnMonsterOnGroundBelow(mob, new Point(SPAWN_X, SPAWN_Y));
    ms.getPlayer().dropMessage(6, "盔甲武士出现了！");
}
