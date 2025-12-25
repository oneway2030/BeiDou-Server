/**
 * @description 副本相关制作
 */
var OldTitle = "\t\t\t\t\t#e#k欢迎来到#r[装备制作]#k系统#n\t\t\t\t\r\n";
var status = -1;
var i = 0;
var meso_id = 9999999;//金币
var cash_id = 9999998;//点卷
var 金币_icon = "#fUI/UIWindow.img/QuestIcon/7/0#";
var 选择的制作列表;
var 制作目标;

var 耳环 = [
    //耳环奖励
    {
        id: 1032060,
        tipType: 6,
        needItems: [
            {id: 4001198, qty: 2, tip: "（毒物森林副本获取）"},//阿尔泰碎片
            {id: meso_id, qty: 1000},
            {id: cash_id, qty: 10000},
        ]
    },
    {
        id: 1032061,
        tipType: 6,
        needItems: [
            {id: 4001198, qty: 3, tip: "（毒物森林副本获取）"},
            {id: 1032060, qty: 1},
            {id: meso_id, qty: 2000},
            {id: cash_id, qty: 20000},
        ]
    },
    //闪耀的阿尔泰
    {
        id: 1032101,
        tipType: 3,
        needItems: [
            {id: 4001198, qty: 4, tip: "（毒物森林副本获取）"},
            {id: 1032061, qty: 1},
            {id: meso_id, qty: 3000},
            {id: cash_id, qty: 30000},
        ]
    },
];

var 眼睛 = [
    //眼睛奖励
    {
        id: 1022118,
        tipType: 6,
        needItems: [
            {id: 4001246, qty: 2, tip: "（玩具副本获取）"},//温暖的阳光
            {id: meso_id, qty: 1000},
            {id: cash_id, qty: 10000},
        ]
    },
    {
        id: 1022123,
        tipType: 6,
        needItems: [
            {id: 4001246, qty: 3, tip: "（玩具副本获取）"},
            {id: 1022118, qty: 1},
            {id: meso_id, qty: 2000},
            {id: cash_id, qty: 20000},
        ]
    },
    //精灵眼睛
    {
        id: 1022129,
        tipType: 3,
        needItems: [
            {id: 4001246, qty: 4, tip: "（玩具副本获取）"},
            {id: 1022123, qty: 1},
            {id: meso_id, qty: 3000},
            {id: cash_id, qty: 50000},
        ]
    },
];

var 鞋子 = [
    //黄丁鞋
    {
        id: 1072239,
        tipType: 6,
        needItems: [
            {id: 4032266, qty: 2, tip: "（海盗副本获取）"},
            {id: meso_id, qty: 2000},
            {id: cash_id, qty: 10000},
        ]
    },
    {
        id: 1072344,
        tipType: 3,
        needItems: [
            {id: 4032266, qty: 5, tip: "（海盗副本获取）"},
            {id: 1072239, qty: 1},
            {id: meso_id, qty: 5000},
            {id: cash_id, qty: 50000},
        ]
    },
];

var 帽子 = [
    //愤怒扎昆头盔
    {
        id: 1004637,
        tipType: 3,
        needItems: [
            {id: 1002357, qty: 1, tip: "（扎昆副本产出）"},
            {id: 1002390, qty: 1, tip: "（扎昆副本产出）"},
            {id: 1002430, qty: 1, tip: "（扎昆副本产出）"},
            {id: 1003112, qty: 1, tip: "（扎昆副本产出）"},
            {id: 1003439, qty: 1, tip: "（扎昆副本产出）"},
            {id: 1003854, qty: 1, tip: "（扎昆副本产出）"},
            {id: 1004119, qty: 1, tip: "（扎昆副本产出）"},
            {id: meso_id, qty: 10000},
            {id: cash_id, qty: 50000},
        ]
    }
];

function start() {
    action(1, 0, 0)
}

function action(mode, type, selection) {
    if (mode === 1) {
        status++;
    } else {
        cm.dispose();
        return;
    }
    // console.error("打印调试===== mode=" + mode + " type=" + type + " selection=" + selection + " status=" + status);
    if (status === 0) {
        let text = OldTitle;
        text += " \r\n";
        text += "#b#L1#耳环#l\t\r\n\r\n";
        text += "#L2#眼睛#l\t\r\n\r\n";
        text += "#L3#鞋子#l\t\r\n\r\n";
        text += "#L4#帽子#l\t\r\n\r\n";
        text += "\r\n\r\n\t#r以下还未实现#k\t\r\n\r\n";
        text += "#L5#武器#l\t\r\n\r\n";
        text += "#L6#衣服#l\t\r\n\r\n";
        text += "#L7#披风#l\t\r\n\r\n";
        text += "#L8#戒指#l\t\r\n\r\n";
        text += "#L9#手套#l\t\r\n\r\n";
        text += "#L10#勋章#l\t\r\n\r\n";
        text += "#L11#腰带#l\t\r\n\r\n";
        text += "#L12#项链#l\t\r\n\r\n";
        cm.sendSimple(text);
    } else if (status === 1) {
        doSelect(selection);
    } else if (status === 2) {
        确认制作(selection);
    } else if (status === 3) {
        制作物品();
    } else {
        cm.dispose();
    }
}

function doSelect(selection) {
    switch (selection) {
        case 1:
            选择的制作列表 = 耳环;
            展示物品制作列表();
            break;
        case 2:
            选择的制作列表 = 眼睛;
            展示物品制作列表();
            break;
        case 3:
            选择的制作列表 = 鞋子;
            展示物品制作列表();
            break;
        case 4:
            选择的制作列表 = 帽子;
            展示物品制作列表();
            break;
        default:
            cm.sendOk("#b瞎么？没看到上面上写的还未实现，你就等吧！");
            cm.dispose();
    }
}


function 展示物品制作列表() {
    //展示物品
    let text = OldTitle + "\r\n请选择要制作的物品：\r\n\r\n";
    选择的制作列表.forEach((item, index) => {
        // 拼接目标物品信息
        text += `#L${index}##b制作#v${item.id}#  #r#z${item.id}##k\r\n`;
        text += "\r\n";
    });
    cm.sendSimple(text);
}


function 确认制作(selectedIndex) {
    const targetItem = 选择的制作列表[selectedIndex];
    制作目标 = targetItem;
    if (!targetItem) {
        cm.sendOk("无效的选择");
        cm.dispose();
        return;
    }
    // 构建确认信息
    let confirmText = `确定要制作 #i${targetItem.id}# #r#t${targetItem.id}# #k吗？\r\n#b所需材料：#k\r\n`;
    targetItem.needItems.forEach(need => {
        if (need.id === meso_id) {
            confirmText += `\r\n${金币_icon} x ${获取金币显示(need.qty)}\r\n`; // 使用金币图标
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


function 制作物品() {
    const targetItem = 制作目标;
    if (!targetItem) {
        cm.sendOk("制作信息已过期，请重新选择");
        cm.dispose();
        return;
    }

    // 检查背包是否能容纳目标物品
    if (!cm.canHold(targetItem.id, 1)) {
        cm.sendOk("背包空间不足，无法制作");
        cm.dispose();
        return;
    }

    // 检查所需材料
    const lackItems = [];
    let canExchange = true;

    targetItem.needItems.forEach(need => {
        if (need.id === meso_id) {
            // 检查金币
            if (cm.getMeso() < 获取金币(need.qty)) {
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
    cm.sendOk(`恭喜您,制作 #i${targetItem.id}# #t${targetItem.id}# 成功！`);
    const tipType = targetItem.tipType || 6;
    cm.getPlayer().sendAllWordNoticeNew(tipType, "装备制作", `恭喜玩家${cm.getPlayer().getName()}成功制作出【${cm.getPlayer().getItemName(targetItem.id)}】!`);
    cm.dispose();
}

function 获取金币(meso) {
    return meso * 10000;
}

function 获取金币显示(meso) {
    if (meso >= 10000) {
        return `${meso / 10000}E\r\n`;
    } else {
        return `${meso}W\r\n`;
    }
}

