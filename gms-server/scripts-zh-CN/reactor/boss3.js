/*
    枫城天守阁反应堆：铠甲武士头盔碎片消失后天皇出现
*/

const BOSS_ID = 9400408;

function act() {
    const map = rm.getMap();
    if (map.getMonsterById(BOSS_ID) != null || map.getMonsterById(9400409) != null) {
        return;
    }

    rm.mapMessage(6, "天皇出现了！");
    rm.spawnMonster(BOSS_ID, 239, 169);
}
