var 偷学技能点key = "偷学技能点";


function start(){
    try {
        // 执行偷学技能点增加操作
        saveStealKillCount(1);
        // 移除偷学技能书（ID:2430674）
        const skillBookId = 2430674;
        im.gainItem(skillBookId, -1);
        // 提示用户操作结果
        im.getPlayer().dropMessage(5, "恭喜你！成功获取一点偷学技能点！当前偷学技能点：" + getStealKillCount());
    } catch (e) {
        // 捕获并处理异常
        im.getPlayer().dropMessage(5, "操作失败：" + e.message);
        // 打印错误日志便于调试
        console.error("偷学技能点操作异常:", e);
    } finally {
        // 确保无论是否发生异常都关闭对话
        im.dispose();
    }
}


/**
 * 获取当前偷学技能点
 * @returns {number} 技能点数量
 */
function getStealKillCount() {
    const num = im.getCharacterExtendValue(偷学技能点key);
    return Number(num || 0); // 默认为0
}

/**
 * 保存偷学技能点（可增减）
 * @param {number} count - 变动数量（正数增加，负数减少）
 */
function saveStealKillCount(count) {
    const currentCount = getStealKillCount();
    let newCount = currentCount + count;
    newCount = Math.max(newCount, 0); // 确保不小于0
    im.saveOrUpdateCharacterExtendValue(偷学技能点key, String(newCount));
}