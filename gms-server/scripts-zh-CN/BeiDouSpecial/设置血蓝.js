/**
 * @description 血量蓝量设置系统
 */
var OldTitle = "\t\t\t\t\t#e#k欢迎来到#r[血量设置]#k系统#n\t\t\t\t\r\n";
var status = -1;
var actionType = null; // 记录当前操作类型："hp" 或 "mp"

function start() {
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode === 1) {
        status++;
    } else if (mode === -1) {
        status--;
    } else {
        cm.dispose();
        return;
    }

    // 初始菜单：选择设置类型
    if (status === 0) {
        let text = OldTitle;
        text += "请选择需要设置的选项：\r\n";
        text += "#L1#设置血量#l\r\n";
        text += "#L2#设置蓝量#l\r\n";
        cm.sendSimple(text);
    }
    // 处理选择：弹出数字输入框
    else if (status === 1) {
        if (selection === 1) {
            actionType = "hp";
            // 发送血量输入框（最小1，最大可根据需求调整，这里用9999999）
            cm.sendGetNumber("请输入需要设置的血量值：", 5000, 1, 9999999);
        } else if (selection === 2) {
            actionType = "mp";
            // 发送蓝量输入框
            cm.sendGetNumber("请输入需要设置的蓝量值：", 5000, 1, 9999999);
        } else {
            cm.sendOk("该功能暂不支持，敬请期待！");
            cm.dispose();
        }
    }
    // 处理输入的数值：执行设置
    else if (status === 2) {
        // selection为用户输入的数字
        const inputValue = selection;
        if (inputValue < 1) {
            cm.sendOk("输入值不能小于1，请重新操作！");
            cm.dispose();
            return;
        }

        if (actionType === "hp") {
            设置血量(inputValue);
        } else if (actionType === "mp") {
            设置蓝量(inputValue);
        }
        cm.dispose();
    } else {
        cm.dispose();
    }
}

/**
 * 设置角色最大血量
 * @param {number} statUpdate - 目标血量值
 */
function 设置血量(statUpdate) {
    const player = cm.getPlayer(); // 获取当前玩家对象
    const extraHp = player.getCurrentMaxHp() - player.getClientMaxHp();
    // 确保设置值覆盖超出客户端显示的部分
    statUpdate = Math.max(1 + extraHp, statUpdate);
    const maxhpUpdate = statUpdate - extraHp;
    // 蓝量不做修改（增量为0）
    player.updateMaxHpMaxMp(maxhpUpdate, player.getClientMaxMp());
    cm.sendOk(`成功设置最大血量为：${statUpdate}`);
}

/**
 * 设置角色最大蓝量
 * @param {number} statUpdate - 目标蓝量值
 */
function 设置蓝量(statUpdate) {
    const player = cm.getPlayer(); // 获取当前玩家对象
    const extraMp = player.getCurrentMaxMp() - player.getClientMaxMp();
    // 确保设置值覆盖超出客户端显示的部分
    statUpdate = Math.max(1 + extraMp, statUpdate);
    const maxmpUpdate = statUpdate - extraMp;
    // 血量不做修改（增量为0）
    player.updateMaxHpMaxMp(player.getClientMaxHp(), maxmpUpdate);
    cm.sendOk(`成功设置最大蓝量为：${statUpdate}`);
}