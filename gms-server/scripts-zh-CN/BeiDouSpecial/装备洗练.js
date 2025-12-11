/*
 * @description 装备洗练中心脚本
 */
var OldTitle = "\t\t\t\t\t#e#k欢迎来到#r[装备洗练中心]#k系统#n\t\t\t\t\r\n\r\n";
var status = -1;
var str = "点击后洗练";
let firstEquip;
let selectedUpgradeIndex; // 存储选中的升级记录索引
var 需要道具 = [{id: 4032133, qty: 1}]; // 洗练所需道具
var newStats;
var newStatsDes;

function start() {
    status = -1;
    selectedUpgradeIndex = -1; // 初始化选中索引
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode === 1) {
        status++; // 正向操作（点击确定/选择项）
    } else if (mode === -1) {
        status--; // 反向操作（点击取消）
    } else {
        cm.dispose(); // 关闭对话
        return;
    }

    // 根据状态流转处理
    switch (status) {
        case 0:
            main(); // 显示主菜单（装备属性+升级历史）
            break;
        case 1:
            if (selection === 999) {
                洗练范围说明();
                return;
            }
            // 选中升级记录后，先检查道具是否充足
            selectedUpgradeIndex = selection;
            if (checkRequiredItems()) {
                // 消耗道具
                consumeRequiredItems();
                // 道具充足，进入属性预览确认页
                showAttrConfirmPage();
            } else {
                cm.sendOk("洗练所需材料不足,无法洗练");
                cm.dispose();
            }
            break;
        case 2:
            // 处理用户确认结果（接受/拒绝/重新洗练）
            handleConfirmResult(selection);
            break;
        default:
            // 异常状态返回首页或关闭
            cm.dispose();
            break;
    }
}

function main() {
    firstEquip = cm.getInventory(1).getItem(1);
    // 构建属性信息字符串
    let propStr = OldTitle;
    propStr += "#b功能说明：#k\r\n";
    propStr += "1.消耗道具，可以重置装备升级后的属性\r\n";
    propStr += "2.需要把重新洗练的装备放在装备栏第一格\r\n";
    propStr += "#L999##r(点击后查看洗练属性范围说明)#d#l\r\n\r\n";
    propStr += `\r\n`;
    propStr += "#b每次洗练需要消耗：#k\r\n";
    需要道具.forEach(item => {
        propStr += `#v${item.id}##t${item.id}# x ${item.qty}\r\n`;
    });
    propStr += `\r\n`;
    if (firstEquip) {
        propStr += "#b装备属性：#k\r\n";
        propStr += `装备名字: #b#t${firstEquip.getItemId()}##k\r\n`;
        propStr += `需求等级: ${firstEquip.getLevel()}\t\t`;
        propStr += `道具等级: ${firstEquip.getItemLevel()}\t\t\t`;
        propStr += `升级次数: ${firstEquip.getUpgradeSlots()}\t\r\n`;
        // 基础属性
        if (firstEquip.getStr() > 0) propStr += `力量: +${firstEquip.getStr()}\r\n`;
        if (firstEquip.getDex() > 0) propStr += `敏捷: +${firstEquip.getDex()}\r\n`;
        if (firstEquip.getInt() > 0) propStr += `智力: +${firstEquip.getInt()}\r\n`;
        if (firstEquip.getLuk() > 0) propStr += `运气: +${firstEquip.getLuk()}\r\n`;

        // 战斗属性
        if (firstEquip.getWatk() > 0) propStr += `物理攻击: +${firstEquip.getWatk()}\r\n`;
        if (firstEquip.getMatk() > 0) propStr += `魔法攻击: +${firstEquip.getMatk()}\r\n`;
        if (firstEquip.getWdef() > 0) propStr += `物理防御: +${firstEquip.getWdef()}\r\n`;
        if (firstEquip.getMdef() > 0) propStr += `魔法防御: +${firstEquip.getMdef()}\r\n`;

        // 其他属性
        if (firstEquip.getSpeed() > 0) propStr += `速度: +${firstEquip.getSpeed()}\r\n`;
        if (firstEquip.getJump() > 0) propStr += `跳跃: +${firstEquip.getJump()}\r\n`;
        if (firstEquip.getAcc() > 0) propStr += `命中: +${firstEquip.getAcc()}\r\n`;
        if (firstEquip.getAvoid() > 0) propStr += `回避: +${firstEquip.getAvoid()}\r\n`;

        propStr += "\r\n\r\n";

        // 升级历史
        var upgradeHistoryDesList = firstEquip.getUpgradeHistoryDes();
        if (upgradeHistoryDesList && upgradeHistoryDesList.size() > 0) {
            propStr += `#b#e升级属性历史:#d#n\r\n`;
            for (var i = 0; i < upgradeHistoryDesList.size(); i++) {
                var history = upgradeHistoryDesList.get(i);
                history = formatStatsWithColors(history)
                let index = i + 1;
                propStr += `#L${i}#第${index}次升级：${history}  #b(${str})#k\r\n\r\n`;
            }
            cm.sendSimple(propStr); // 发送选择菜单
        } else {
            propStr += "#r该装备暂无升级历史记录,无法洗练！#d\r\n";
            cm.sendOk(propStr);
            cm.dispose();
        }
    } else {
        propStr += "#r装备栏第一格道具不存在,无法洗练#d\r\n";
        cm.sendOk(propStr);
        cm.dispose();
    }
}

/**
 * 检查玩家是否拥有足够的洗练道具
 * @returns {boolean} 是否满足道具需求
 */
function checkRequiredItems() {
    // 遍历检查每个所需道具
    let 是否满足条件 = true;
    for (var i = 0; i < 需要道具.length; i++) {
        let item = 需要道具[i];
        var 持有数量 = cm.getPlayer().getItemQuantity(item.id, false);
        if (持有数量 < item.qty) {
            是否满足条件 = false;
        }
    }
    if (!是否满足条件) {
        return false;
    }
    return true;
}

/**
 * 消耗洗练所需道具
 */
function consumeRequiredItems() {
    需要道具.forEach(item => {
        cm.gainItem(item.id, -item.qty); // 负数表示消耗
    });
}

/**
 * 显示属性预览确认页面
 * 展示新旧属性对比，让用户选择是否覆盖
 */
function showAttrConfirmPage() {
    // 校验装备和选中索引合法性
    if (!firstEquip || selectedUpgradeIndex < 0) {
        cm.sendOk("参数异常，返回首页！");
        status = 0;
        main();
        return;
    }

    // 获取新旧属性描述
    newStats = firstEquip.getNewStats();
    newStatsDes = newStats && newStats.size() > 0 ? firstEquip.gainStatsDes(newStats) : "无新增属性";
    var oldStatsDes = firstEquip.getUpgradeHistoryDes(selectedUpgradeIndex) || "无原始属性";

    // 构建确认页面文本（增加道具消耗提示）
    let confirmText = OldTitle + "#e#r属性洗练预览#n\r\n\r\n";
    confirmText += "#d本次洗练将消耗：#n\r\n";
    需要道具.forEach(item => {
        confirmText += `#v${item.id}##t${item.id}# x ${item.qty}\r\n`;
    });
    confirmText += "\r\n";
    confirmText += "#b【当前属性】（第" + (selectedUpgradeIndex + 1) + "次升级）#k\r\n";
    confirmText += formatStatsWithColors(oldStatsDes) + "\r\n\r\n";
    confirmText += "#r【新洗练属性】#k\r\n";
    confirmText += formatStatsWithColors(newStatsDes) + "\r\n\r\n";
    confirmText += "#L0##b确认覆盖（使用新的洗练属性）#l\r\n\r\n";
    if (checkRequiredItems()) {
        confirmText += "#L2##r重新洗练（当前属性不覆盖，会重新消耗道具）#l\r\n\r\n"; // 新增：重新洗练选项
    }
    confirmText += "#L1##r取消（保留原来的属性）#l\r\n\r\n";
    cm.sendSimple(confirmText);
}

/**
 * 处理用户确认结果
 * @param selection 0=确认覆盖，1=取消，2=重新洗练
 */
function handleConfirmResult(selection) {
    if (selection === 0) {
        if (newStats && newStats.size() > 0) {
            var client = cm.getPlayer().getClient();
            // 执行洗练逻辑
            var isSuccess = firstEquip.replaceUpgradeHistory(client, selectedUpgradeIndex, newStats);
            if (isSuccess) {
                cm.sendOk("#b属性洗练成功！#n\r\n" +
                    "已消耗所需道具，新属性已覆盖原第" + (selectedUpgradeIndex + 1) + "次升级属性~");
                全服通告();
                cm.dispose();
            } else {
                cm.sendOk("#r数据异常，请联系管理员~");
                cm.dispose();
            }
        } else {
            cm.sendOk("#b数据异常，未生成新属性，请联系管理员。");
            cm.dispose();
        }
    } else if (selection === 1) {
        // 用户取消，直接返回首页
        status = 0;
        main();
    } else if (selection === 2) {
        // 重新洗练：消耗道具，重新生成属性并刷新页面
        if (checkRequiredItems()) {
            // 消耗道具
            consumeRequiredItems();
            // 将状态重置为1，以便再次调用 showAttrConfirmPage 生成新属性
            status = 1;
            showAttrConfirmPage();
        } else {
            cm.getPlayer().message("洗练道具不足，无法洗练");
        }
    }
}

function 全服通告() {
    const PacketCreator = Java.type('org.gms.util.PacketCreator');
    var player = cm.getPlayer();
    let tip = `恭喜玩家[${player.getName()}]对[${firstEquip.getName()}]洗练出属性:${newStatsDes}`;
    player.getWorldServer().broadcastPacket(PacketCreator.serverNotice(6, tip));
}

/**
 * 根据属性值的大小，为属性字符串添加颜色标签
 * @param {string} statsDes - 原始的属性描述字符串，如 "智力+5; 力量+3"
 * @returns {string} 带有颜色标签的属性描述字符串
 */
function formatStatsWithColors(statsDes) {
    if (!statsDes || statsDes === "无新增属性") {
        return statsDes;
    }

    // 1. 按分号分割成单个属性
    const statsArray = statsDes.split(';');
    const formattedStats = [];

    // 2. 遍历每个属性
    for (const stat of statsArray) {
        const trimmedStat = stat.trim();
        // 跳过空字符串（如果有的话）
        if (!trimmedStat) continue;

        // 3. 使用修正后的正则表达式匹配属性名和数值
        //    [\u4e00-\u9fa5]+  匹配一个或多个中文汉字
        //    \s*               匹配零个或多个空白字符（处理可能的空格）
        //    (\+?\d+)          匹配一个可选的正号后面跟一个或多个数字
        const match = trimmedStat.match(/^([\u4e00-\u9fa5]+)\s*(\+?\d+)$/);

        if (match && match.length === 3) {
            const statName = match[1];
            const statValueStr = match[2];
            const statValue = parseInt(statValueStr, 10);
            let colorCode = "#k"; // 默认颜色（白色）

            // 4. 根据属性名和数值应用颜色规则
            switch (statName) {
                case '智力':
                    if (statValue >= 10) {
                        colorCode = "#g"; // 大于15，紫色
                    } else if (statValue > 5) {
                        colorCode = "#r"; // 大于10，红色
                    } else if (statValue >= 3) {
                        colorCode = "#b"; // 大于5，蓝色
                    }
                    break;
                case '力量':
                case '运气':
                case '敏捷':
                    if (statValue >= 5) {
                        colorCode = "#g"; // 大于5，紫色
                    } else if (statValue >= 3) {
                        colorCode = "#r"; // 4-5，红色
                    } else if (statValue >= 1) {
                        colorCode = "#b"; // 2-3，蓝色
                    }
                    break;
                case '魔法力':
                    if (statValue >= 15) {
                        colorCode = "#g"; // 大于15，紫色
                    } else if (statValue >= 10) {
                        colorCode = "#r"; // 10-15，红色
                    } else if (statValue >= 5) {
                        colorCode = "#b"; // 5-9，蓝色
                    }
                    break;
                case '攻击力':
                    if (statValue >= 8) {
                        colorCode = "#g"; // 大于8，紫色
                    } else if (statValue >= 6) {
                        colorCode = "#r"; // 6-8，红色
                    } else if (statValue >= 3) {
                        colorCode = "#b"; // 3-5，蓝色
                    }
                    break;
                // 可以为其他属性（如防御、HP）添加规则
                default:
                    // 其他未定义的属性保持默认颜色
                    break;
            }

            // 5. 组合带有颜色的属性字符串
            formattedStats.push(`${colorCode}${statName}${statValueStr}#k`);
        } else {
            // 如果格式不匹配，则添加原始字符串
            formattedStats.push(stat);
        }
    }

    // 6. 将所有属性重新组合成一个字符串，并用分号分隔
    return formattedStats.join('; ');
}

function 洗练范围说明() {
    var propStr = "\t\t\t\t\t#e#k欢迎来到#r[装备洗练中心]#k系统#n\t\t\t\t\r\n\r\n";
    propStr += "#b洗练范围说明#k\r\n";
    propStr += "1.武器攻击力0-8,魔法力0-15\r\n";
    propStr += "2.非武器攻击力0-5,魔法力0-10\r\n";
    propStr += "3.智力0-10\r\n";
    propStr += "4.敏捷、力量、运气、命中、闪避、跳跃、移速0-5\r\n";
    propStr += "5.血量蓝量双防0-10\r\n\r\n";
    propStr += "#b(如与实际不符请反馈GM修改)\r\n";
    cm.sendOk(propStr);
    cm.dispose();
}