/*
    枫城天守阁反应堆：铠甲武士头盔碎片消失后天皇出现
    统一使用 SpawnPoint 机制管理刷新，避免与 onUserEnter 脚本产生重复 BOSS
*/

const BOSS_ID = 9400408;
const PHASE2_ID = 9400409;
const RESPAWN_TIME_SEC = 3600 * 6;  // 6小时，与 emperorToadBoss.js 保持一致

const LifeFactory = Java.type("org.gms.server.life.LifeFactory");
const Point = Java.type("java.awt.Point");

function act() {
    const map = rm.getMap();

    // BOSS 或其二阶段已存活，不重复生成
    if (map.getMonsterById(BOSS_ID) != null || map.getMonsterById(PHASE2_ID) != null) {
        return;
    }

    const mob = LifeFactory.getMonster(BOSS_ID);
    mob.setPosition(new Point(239, 169));

    // 使用 addMonsterSpawn 统一管理，确保 SpawnPoint 机制接管刷新
    map.addMonsterSpawn(mob, RESPAWN_TIME_SEC, -1);

    rm.mapMessage(6, "天皇出现了！（每6小时刷新一次）");
}
