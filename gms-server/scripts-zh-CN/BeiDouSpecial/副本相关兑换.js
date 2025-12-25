/**
 * @description 副本相关兑换
 */
var OldTitle = "\t\t\t\t\t#e#k欢迎来到#r[副本相关兑换]#k系统#n\t\t\t\t\r\n";
var status = -1;
var i = 0;
var meso_id = 9999999;//金币
var cash_id = 9999998;//点卷
var 金币_icon = "#fUI/UIWindow.img/QuestIcon/7/0#";
var exchangeList = [
    //耳环奖励
    {
        id: 1032060,
        needItems: [
            {id: 4001198, qty: 1, tip: "（毒物森林副本获取）"},//阿尔泰碎片
            {id: meso_id, qty: 1000},
            {id: cash_id, qty: 10000},
        ]
    },
    {
        id: 1032061,
        needItems: [
            {id: 4001198, qty: 1, tip: "（毒物森林副本获取）"},
            {id: 1032060, qty: 1},
            {id: meso_id, qty: 2000},
            {id: cash_id, qty: 10000},
        ]
    },
    {
        id: 1032101,
        needItems: [
            {id: 4001198, qty: 1, tip: "（毒物森林副本获取）"},
            {id: 1032061, qty: 1},
            {id: meso_id, qty: 3000},
            {id: cash_id, qty: 10000},
        ]
    },
    //眼睛奖励
    {
        id: 1022118,
        needItems: [
            {id: 4001246, qty: 1, tip: "（玩具副本获取）"},//温暖的阳光
            {id: meso_id, qty: 1000},
            {id: cash_id, qty: 10000},
        ]
    },
    {
        id: 1022123,
        needItems: [
            {id: 4001246, qty: 1, tip: "（玩具副本获取）"},
            {id: 1022118, qty: 1},
            {id: meso_id, qty: 2000},
            {id: cash_id, qty: 10000},
        ]
    },
    {
        id: 1022129,
        needItems: [
            {id: 4001246, qty: 1, tip: "（玩具副本获取）"},
            {id: 1022123, qty: 1},
            {id: meso_id, qty: 3000},
            {id: cash_id, qty: 10000},
        ]
    },
    //鞋子奖励
    {
        id: 1072239,
        needItems: [
            {id: 4032266, qty: 1, tip: "（海盗副本获取）"},
            {id: meso_id, qty: 2000},
            {id: cash_id, qty: 10000},
        ]
    },
    {
        id: 1072344,
        needItems: [
            {id: 4032266, qty: 1, tip: "（海盗副本获取）"},
            {id: 1072239, qty: 1},
            {id: meso_id, qty: 3000},
            {id: cash_id, qty: 10000},
        ]
    },
];

function start() {
    action(1, 0, 0)
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
    // console.error("打印调试===== mode="+mode+" type="+type+" selection="+selection+" status="+status);
    if (status === 0) {
        let text = OldTitle;
        text += " \r\n";
        text += "#L1#副本装备兑换#l\t\r\n\r\n";
        text += "#L2#积分兑换物品#l\t\r\n\r\n";
        text += "#L3#勋章兑换#l\t\r\n\r\n";
        cm.sendSimple(text);
    } else if (status === 1) {
        doSelect(selection);
    } else if (status === 2) {
        确认兑换(selection);
    } else if (status === 3) {
        兑换物品();
    } else {
        cm.dispose();
    }
}

function doSelect(selection) {
    switch (selection) {
        case 1:
            副本兑换();
            break;
        case 2:
            break;
        case 3:
            break;
        case 4:
            break;
        default:
            cm.dispose();
    }
}


function 副本兑换() {
    //展示物品
    let text = OldTitle + "\r\n请选择要兑换的物品：\r\n\r\n";
    exchangeList.forEach((item, index) => {
        // 拼接目标物品信息
        text += `#L${index}##b兑换#v${item.id}#  #r#z${item.id}##k\r\n`;
        // text += `所需材料\r\n`;
        // // 拼接所需材料信息
        // item.needItems.forEach(need => {
        //     if (need.id === meso_id) {
        //         text += `  - 金币: ${need.qty}\r\n`;
        //     } else if (need.id === cash_id) {
        //         text += `  - 点券: ${need.qty}\r\n`;
        //     } else {
        //         text += `  - #i${need.id}# x ${need.qty}\r\n`;
        //     }
        // });
        text += "\r\n";
    });
    cm.sendSimple(text);
}

var 兑换目标;

function 确认兑换(selectedIndex) {
    const targetItem = exchangeList[selectedIndex];
    兑换目标 = targetItem;
    if (!targetItem) {
        cm.sendOk("无效的选择");
        cm.dispose();
        return;
    }
    // 构建确认信息
    let confirmText = `确定要兑换 #i${targetItem.id}# #r#t${targetItem.id}# #k吗？\r\n#b所需材料：#k\r\n`;
    targetItem.needItems.forEach(need => {
        if (need.id === meso_id) {
            confirmText += `${金币_icon} x ${need.qty}W\r\n`; // 使用金币图标
        } else if (need.id === cash_id) {
            confirmText += `#b点券 x #k ${need.qty}\r\n`; // 使用点券相关图标
        } else {
            // 仅当need.tip存在且不为空时才拼接提示部分
            const tipText = need.tip ? `\t#b${need.tip}#k` : '';
            confirmText += `#i${need.id}# #t${need.id}# x ${need.qty}${tipText}\r\n`;
        }
    });
    cm.sendYesNo(confirmText);
}

function 兑换物品() {
    const targetItem = 兑换目标;
    if (!targetItem) {
        cm.sendOk("兑换信息已过期，请重新选择");
        cm.dispose();
        return;
    }

    // 检查背包是否能容纳目标物品
    if (!cm.canHold(targetItem.id, 1)) {
        cm.sendOk("背包空间不足，无法兑换");
        cm.dispose();
        return;
    }

    // 检查所需材料
    const lackItems = [];
    let canExchange = true;

    targetItem.needItems.forEach(need => {
        if (need.id === meso_id) {
            // 检查金币
            if (cm.getMeso() < need.qty) {
                lackItems.push(`金币（缺少：${获取金币(need.qty) - cm.getMeso()}）`);
                canExchange = false;
            }
        } else if (need.id === cash_id) {
            // 检查点券（参考Cash.txt中点券相关处理）
            if (cm.getPlayer().getCashShop().getCash(1) < need.qty) {
                lackItems.push(`点券（缺少：${need.qty - cm.getPlayer().getCashShop().getCash(1)}）`);
                canExchange = false;
            }
        } else {
            // 检查普通物品
            if (cm.getItemQuantity(need.id) < need.qty) {
                lackItems.push(`#t${need.id}#（缺少：${need.qty - cm.getItemQuantity(need.id)}）`);
                canExchange = false;
            }
        }
    });

    if (!canExchange) {
        cm.sendOk(`材料不足：\r\n${lackItems.join("\r\n")}`);
        cm.dispose();
        return;
    }

    // 扣除所需材料
    targetItem.needItems.forEach(need => {
        if (need.id === meso_id) {
            cm.gainMeso(-获取金币(need.qty));
        } else if (need.id === cash_id) {
            cm.getPlayer().getCashShop().gainCash(1, -need.qty);
        } else {
            cm.gainItem(need.id, -need.qty);
        }
    });

    // 给予目标物品
    cm.gainItem(targetItem.id, 1);
    cm.sendOk(`成功兑换 #i${targetItem.id}# #t${targetItem.id}#！`);
    cm.dispose();
}

function 获取金币(meso) {
    return meso * 10000;
}

