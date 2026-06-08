var a = 0;
var selection = 0;
var currentPlate = 0;
var currentStockId = 0;
var operateSlot = 0;
var operateType = "";

// 交易配置常量
var MAX_BUY = 50000; // 单次交易上限：10万点券
var STAMP_TAX_RATE = 0.01; // 印花税税率（例如 0.00025 = 万分之2.5）

// 导入点券相关的Java类
var CashShop = Java.type('org.gms.server.CashShop');

// 基础配置
var STOCK_PROFIT = "stock_profit";
var STOCK_DAY = "stock_day";
var LAST_DAY_KEY = "stock_lastday";
var YESTERDAY_PROFIT = "yesterday_profit"; // 昨日盈亏

var MAX_SLOTS = 3;
var MAX_MONEY = 2000000000;

function clampMoney(v) {
    if (v > MAX_MONEY) return MAX_MONEY;
    if (v < -MAX_MONEY) return -MAX_MONEY;
    return v;
}

// 安全发放点券方法（防止溢出和负数）
function doGainCash(chr, type, quantity) {
    var cash = chr.getCashShop().getCash(type);
    var sum = cash + quantity;
    if (sum < 0) {
        quantity = -cash;
    }
    if (sum > 2147483647) {
        quantity = 2147483647 - cash;
    }
    chr.getCashShop().gainCash(type, quantity);
}
var KEY_PLATE = "plate";
var KEY_ID = "id";
var KEY_MONEY = "money";
var KEY_TIME = "time";
var KEY_DAYCHANGE = "daychange";
var KEY_YESTERDAY = "yesterday";
var SLOT_FIELDS = [
    KEY_PLATE,
    KEY_ID,
    KEY_MONEY,
    KEY_TIME,
    KEY_DAYCHANGE,
    KEY_YESTERDAY,
];

function slotKey(slot, field) {
    return "s" + slot + "_" + field;
}

function calcTax(amount) {
    return Math.max(1, Math.floor(amount * STAMP_TAX_RATE));
}

function formatMoney(amount) {
    if (amount >= 100000000) {
        return (amount / 100000000).toFixed(1) + "E";
    } else if (amount >= 10000) {
        return (amount / 10000).toFixed(1) + "万";
    }
    return amount.toString();
}

function formatTaxRate(rate) {
    if (rate >= 0.01) {
        // >= 1%，显示百分比
        var value = (rate * 100).toFixed(2);
        if (value.indexOf('.00') !== -1) {
            value = value.replace('.00', '');
        } else if (value.indexOf('.0') !== -1) {
            value = value.replace('.0', '');
        }
        return "百分之" + value;
    } else if (rate >= 0.001) {
        // >= 1‰，显示千分比
        var value = (rate * 1000).toFixed(2);
        if (value.indexOf('.00') !== -1) {
            value = value.replace('.00', '');
        } else if (value.indexOf('.0') !== -1) {
            value = value.replace('.0', '');
        }
        return "千分之" + value;
    } else {
        // < 1‰，显示万分比
        var value = (rate * 10000).toFixed(2);
        if (value.indexOf('.00') !== -1) {
            value = value.replace('.00', '');
        } else if (value.indexOf('.0') !== -1) {
            value = value.replace('.0', '');
        }
        return "万分之" + value;
    }
}

// 金银岛：-10 ~ +10，
var RATES_GOLD = [
    -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
];

// 冰封雪域：-20 ~ +20，
var RATES_ICE = [
    -20, -19, -18, -17, -16, -15, -14, -13, -12, -11, -10, -9, -8, -7, -6, -5, -4,
    -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
    19, 20,
];

// 水下世界：-30 ~ +30，
var RATES_WATER = [
    -30, -29, -28, -27, -26, -25, -24, -23, -22, -21, -20, -19, -18, -17, -16,
    -15, -14, -13, -12, -11, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3,
    4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
    25, 26, 27, 28, 29, 30,
];

function getPlateRates(plateId) {
    if (plateId === 1) return RATES_GOLD;
    if (plateId === 2) return RATES_ICE;
    if (plateId === 3) return RATES_WATER;
    return RATES_GOLD;
}

// 股票名称
var stockNameArr = [
    [
        "勇士部落矿业",
        "废弃都市影城",
        "射手村旅游团",
        "魔法密林医药",
        "明珠港海运队",
    ],
    [
        "雪域冰原能源",
        "扎昆狩猎公司",
        "雪域温泉文旅",
        "冰封锻造工厂",
        "野狼快运物流",
    ],
    [
        "海底珊瑚养殖",
        "海豚快运集团",
        "深海水晶矿业",
        "鱼王海鲜餐饮",
        "海底隧道基建",
    ],
];
var plateNameArr = ["", "金银岛屿板块", "冰封雪域板块", "水下世界板块"];

function start() {
    calcDayFresh();
    calcAllStockFloat();

    var profit = clampMoney(parseInt(cm.getCharacterExtendValue(STOCK_PROFIT)) || 0);
    var yesterdayProfit =
        clampMoney(parseInt(cm.getCharacterExtendValue(YESTERDAY_PROFIT)) || 0);
    var day = parseInt(cm.getCharacterExtendValue(STOCK_DAY)) || 0;
    var allMoney = getTotalStockMoney();

    cm.sendSimple(
        "\r\n                       #i03994060# #i03994063# #i03994067# #i03994062# #i03994073# #i03994079#\r\n\r\n#n" +
        "欢迎#d" +
        cm.getName() +
        "#k来到#r#e【冒险炒股】#k#n\r\n\r\n" +
        "#r#e炒股有风险！投资需谨慎！#k#n\r\n" +
        "#d印花税：买入/卖出各扣" + formatTaxRate(STAMP_TAX_RATE) + "#k\r\n\r\n" +
        "#k持仓点券：#k" +
        allMoney +
        "#k\r\n" +
        (yesterdayProfit >= 0
            ? "#r昨日盈亏：+" + yesterdayProfit + "#k\r\n"
            : "#b昨日盈亏：" + yesterdayProfit + "#k\r\n") +
        (profit >= 0
            ? "#r累计盈亏：+" + profit + "#k\r\n\r\n"
            : "#b累计盈亏：" + profit + "#k\r\n\r\n") +
        "#k股龄：#k" +
        day +
        " 天\r\n\r\n" +
        "#L1##k 【金银岛屿板块】#k\r\n" +
        "#L2##k 【冰封雪域板块】#k\r\n" +
        "#L3##k 【水下世界板块】#k\r\n" +
        "#L5##k 【板块介绍】#k\r\n\r\n" +
        "#L4##b 【交易所】\r\n" +
        "#L6##r 【股神排行榜】",
    );
}

function action(mode, type, sel) {
    if (mode == 0) {
        cm.dispose();
        return;
    }
    selection = sel;
    calcDayFresh();
    calcAllStockFloat();

    if (a == 0) {
        if (selection == 1) {
            currentPlate = 1;
            openPlateGold();
        } else if (selection == 2) {
            currentPlate = 2;
            openPlateIce();
        } else if (selection == 3) {
            currentPlate = 3;
            openPlateWater();
        } else if (selection == 4) {
            a = 5;
            showExchangeMain();
        } else if (selection == 5) {
            cm.sendOk(
                "\r\n                       #i03994060# #i03994063# #i03994067# #i03994062# #i03994073# #i03994079#\r\n\r\n\r\n#n#b【金银岛屿板块】  浮动率：±10%（整数档）\r\n【冰封雪域板块】  浮动率：±20%（整数档）\r\n【水下世界板块】  浮动率：±30%（整数档）\r\n\r\n#r0点更新！每日涨跌随机！\r\n#k盈利#r+红色#k、#k亏损#g-绿色#k",
            );
            cm.dispose();
        } else if (selection == 6) {
            showRankList();
        }
    } else if (a == 5) {
        if (selection == 1) {
            operateType = "add";
            showStockSelect();
        } else if (selection == 2) {
            operateType = "sell";
            showStockSelect();
        }
    } else if (a == 1) {
        currentStockId = sel;
        a = 2;
        var name = stockNameArr[currentPlate - 1][currentStockId - 1];
        if (hasPlateStock(currentPlate)) {
            cm.sendOk("#r已持有该板块股票！");
            cm.dispose();
            return;
        }
        var playerCash = cm.getPlayer().getCashShop().getCash(CashShop.NX_CREDIT);
        cm.sendGetNumber(
            "买入：" + name + "\r\n点券（上限" + formatMoney(MAX_BUY) + "）：",
            0,
            1,
            Math.min(MAX_BUY, playerCash),
        );
    } else if (a == 2) {
        var cost = selection;
        var p = cm.getPlayer();
        var playerCash = p.getCashShop().getCash(CashShop.NX_CREDIT);
        if (cost <= 0 || playerCash < cost) {
            cm.sendOk("点券不足！");
            cm.dispose();
            return;
        }
        if (cost > MAX_BUY) {
            cm.sendOk("单仓上限" + formatMoney(MAX_BUY) + "点券！");
            cm.dispose();
            return;
        }
        var tax = calcTax(cost);
        var actualVal = cost - tax;
        doGainCash(p, CashShop.NX_CREDIT, -cost);
        var slot = findEmptySlot();
        saveStockSlot(slot, currentPlate, currentStockId, actualVal);
        cm.sendOk(
            "#r买入成功！#k\r\n\r\n支付：" +
            cost +
            " 点券\r\n#d印花税：" +
            tax +
            "#k\r\n#b入仓金额：" +
            actualVal,
        );
        a = 0;
        cm.dispose();
    } else if (a == 10) {
        var list = getStockSlotList();
        if (sel < 1 || sel > list.length) {
            cm.dispose();
            return;
        }
        operateSlot = list[sel - 1];
        a = 11;
        var mon = getSlotMoney(operateSlot);
        if (operateType == "add") {
            cm.sendGetNumber(
                "#r加仓金额：#k\r\n\r\n持仓：" + mon,
                0,
                1,
                cm.getPlayer().getMeso(),
            );
        } else {
            cm.sendGetNumber("#b减仓金额：#k\r\n\r\n持仓：" + mon, 0, 1, mon);
        }
    } else if (a == 11) {
        var val = selection;
        if (operateType == "add") doAdd(operateSlot, val);
        if (operateType == "sell") doSell(operateSlot, val);
        a = 0;
        cm.dispose();
    }
}

// 交易所主界面：持仓 + 当日浮动金额 + 当日浮动率（全整数）
function showExchangeMain() {
    var msg =
        "\r\n                       #i03994060# #i03994063# #i03994067# #i03994062# #i03994073# #i03994079#\r\n\r\n#n";
    msg += "================== 【交易所】 ==================\r\n\r\n";
    var list = getStockSlotList();
    if (list.length == 0) {
        msg += "暂无持仓\r\n\r\n";
    } else {
        for (var i = 0; i < list.length; i++) {
            var s = list[i];
            var plate = getSlotPlate(s);
            var sid = getSlotId(s);
            var mon = getSlotMoney(s);
            var dayChange = getSlotDayChange(s);
            var yesterday = getSlotYesterday(s);

            msg += i + 1 + ".【" + plateNameArr[plate] + "】\r\n";
            msg += "股票：<" + stockNameArr[plate - 1][sid - 1] + ">\r\n";
            msg += "持仓市值：" + mon + "\r\n";
            var rates = getPlateRates(plate);
            msg += "浮动率：±" + rates[rates.length - 1] + "%\r\n";

            // 当日浮动金额
            if (dayChange >= 0) {
                msg += "#r当日浮动：+" + dayChange + "#k\r\n";
            } else {
                msg += "#b当日浮动：" + dayChange + "#k\r\n";
            }

            // 当日浮动率 取整数
            if (yesterday > 0) {
                var rate = Math.round((dayChange * 100) / yesterday);
                if (rate >= 0) {
                    msg += "#r当日浮动率：+" + rate + "%#k\r\n\r\n";
                } else {
                    msg += "#b当日浮动率：" + rate + "%#k\r\n\r\n";
                }
            } else {
                msg += "#b当日浮动率：0%#k\r\n\r\n";
            }
        }
    }

    msg += "-------------------------\r\n";
    msg += "#L1# #r加仓\r\n";
    msg += "#L2# #b减仓";

    cm.sendSimple(msg);
}

function calcAllStockFloat() {
    var now = Math.floor(new Date().getTime() / 1000);
    var dayTotalChange = 0;

    for (var s = 1; s <= MAX_SLOTS; s++) {
        var mon = getSlotMoney(s);
        var plateId = getSlotPlate(s);
        var t = getSlotTime(s);
        if (mon > 0 && t > 0 && now >= t + 21600) {
            var rates = getPlateRates(plateId);
            var per = rates[Math.floor(Math.random() * rates.length)];
            var change = Math.round((mon * per) / 100);
            var newMoney = clampMoney(mon + change);

            setSlotYesterday(s, mon);
            setSlotDayChange(s, change);
            setSlotMoney(s, newMoney);
            dayTotalChange += change;
            setSlotTime(s, now);
        }
    }

    // 每日更新后，把当日总盈亏存入昨日盈亏
    if (dayTotalChange != 0) {
        cm.saveOrUpdateCharacterExtendValue(YESTERDAY_PROFIT, "" + dayTotalChange);
        cm.saveOrUpdateCharacterExtendValue(
            STOCK_PROFIT,
            "" +
            clampMoney(
                (parseInt(cm.getCharacterExtendValue(STOCK_PROFIT)) || 0) +
                dayTotalChange,
            ),
        );
    }
}

// 股龄
function calcDayFresh() {
    var today = Math.floor(new Date().getTime() / 86400000);
    var lastDay = parseInt(cm.getCharacterExtendValue(LAST_DAY_KEY)) || 0;

    if (today > lastDay) {
        cm.saveOrUpdateCharacterExtendValue(
            STOCK_DAY,
            "" + ((parseInt(cm.getCharacterExtendValue(STOCK_DAY)) || 0) + 1),
        );
        cm.saveOrUpdateCharacterExtendValue(LAST_DAY_KEY, "" + today);
    }
}

// 加仓
function doAdd(slot, addVal) {
    var p = cm.getPlayer();
    var playerCash = p.getCashShop().getCash(CashShop.NX_CREDIT);
    if (addVal <= 0 || playerCash < addVal) {
        cm.sendOk("点券不足！");
        return;
    }
    var tax = calcTax(addVal);
    var actualVal = addVal - tax;
    var nowVal = getSlotMoney(slot);
    var newTotal = clampMoney(nowVal + actualVal);
    setSlotMoney(slot, newTotal);
    doGainCash(p, CashShop.NX_CREDIT, -addVal);
    cm.sendOk(
        "#r加仓成功！#k\r\n\r\n支付：" +
        addVal +
        " 点券\r\n#d印花税：" +
        tax +
        "#k\r\n#b入仓金额：" +
        actualVal +
        "#k\r\n最新持仓：" +
        (nowVal + actualVal),
    );
}

// 减仓
function doSell(slot, sellVal) {
    var p = cm.getPlayer();
    var nowVal = getSlotMoney(slot);
    if (sellVal <= 0 || sellVal > nowVal) {
        cm.sendOk("金额错误！");
        return;
    }
    var tax = calcTax(sellVal);
    var actualGain = sellVal - tax;
    var left = nowVal - sellVal;
    if (left <= 0) {
        clearSlot(slot);
    } else {
        setSlotMoney(slot, left);
    }
    doGainCash(p, CashShop.NX_CREDIT, actualGain);
    cm.sendOk(
        "#b减持成功！#k\r\n\r\n减持：" +
        sellVal +
        " 点券\r\n#d印花税：" +
        tax +
        "#k\r\n#b实际到账：" +
        actualGain +
        " 点券\r\n最新仓位：" +
        left,
    );
}

// 工具函数
function showStockSelect() {
    var list = getStockSlotList();
    if (list.length == 0) {
        cm.sendOk("暂无持仓");
        cm.dispose();
        return;
    }
    var txt =
        "\r\n                       #i03994060# #i03994063# #i03994067# #i03994062# #i03994073# #i03994079#\r\n\r\n#n";
    txt += "选择股票：\r\n";
    for (var i = 0; i < list.length; i++) {
        var slot = list[i];
        var plate = getSlotPlate(slot);
        var id = getSlotId(slot);
        var m = getSlotMoney(slot);
        txt +=
            "#L" +
            (i + 1) +
            "# 【" +
            plateNameArr[plate] +
            "】 | <" +
            stockNameArr[plate - 1][id - 1] +
            "> #b仓位：" +
            m +
            "#k\r\n\r\n";
    }
    a = 10;
    cm.sendSimple(txt);
}

function getStockSlotList() {
    var list = [];
    for (var s = 1; s <= MAX_SLOTS; s++) {
        if (getSlotMoney(s) > 0) list.push(s);
    }
    return list;
}

function getSlotDayChange(slot) {
    return (
        parseInt(cm.getCharacterExtendValue(slotKey(slot, KEY_DAYCHANGE))) || 0
    );
}
function setSlotDayChange(slot, v) {
    cm.saveOrUpdateCharacterExtendValue(slotKey(slot, KEY_DAYCHANGE), "" + v);
}

function getSlotYesterday(slot) {
    return (
        parseInt(cm.getCharacterExtendValue(slotKey(slot, KEY_YESTERDAY))) || 0
    );
}
function setSlotYesterday(slot, v) {
    cm.saveOrUpdateCharacterExtendValue(slotKey(slot, KEY_YESTERDAY), "" + v);
}

function getSlotTime(slot) {
    return parseInt(cm.getCharacterExtendValue(slotKey(slot, KEY_TIME))) || 0;
}
function setSlotTime(slot, v) {
    cm.saveOrUpdateCharacterExtendValue(slotKey(slot, KEY_TIME), "" + v);
}
function getSlotPlate(slot) {
    return parseInt(cm.getCharacterExtendValue(slotKey(slot, KEY_PLATE))) || 0;
}
function getSlotId(slot) {
    return parseInt(cm.getCharacterExtendValue(slotKey(slot, KEY_ID))) || 0;
}
function getSlotMoney(slot) {
    var v = parseInt(cm.getCharacterExtendValue(slotKey(slot, KEY_MONEY))) || 0;
    return clampMoney(v);
}
function setSlotMoney(slot, v) {
    cm.saveOrUpdateCharacterExtendValue(slotKey(slot, KEY_MONEY), "" + clampMoney(v));
}
function clearSlot(slot) {
    for (var i = 0; i < SLOT_FIELDS.length; i++) {
        cm.saveOrUpdateCharacterExtendValue(slotKey(slot, SLOT_FIELDS[i]), "0");
    }
}

function hasPlateStock(plate) {
    for (var s = 1; s <= MAX_SLOTS; s++) {
        if (getSlotPlate(s) == plate && getSlotMoney(s) > 0) return true;
    }
    return false;
}
function findEmptySlot() {
    for (var s = 1; s <= MAX_SLOTS; s++) {
        if (getSlotMoney(s) == 0) return s;
    }
    return 0;
}
function saveStockSlot(slot, plate, sid, money) {
    var now = Math.floor(new Date().getTime() / 1000);
    cm.saveOrUpdateCharacterExtendValue(slotKey(slot, KEY_PLATE), "" + plate);
    cm.saveOrUpdateCharacterExtendValue(slotKey(slot, KEY_ID), "" + sid);
    cm.saveOrUpdateCharacterExtendValue(slotKey(slot, KEY_MONEY), "" + clampMoney(money));
    cm.saveOrUpdateCharacterExtendValue(slotKey(slot, KEY_TIME), "" + now);
    cm.saveOrUpdateCharacterExtendValue(slotKey(slot, KEY_DAYCHANGE), "0");
    cm.saveOrUpdateCharacterExtendValue(slotKey(slot, KEY_YESTERDAY), "0");
}
function getTotalStockMoney() {
    var total = 0;
    for (var s = 1; s <= MAX_SLOTS; s++) {
        total += getSlotMoney(s);
    }
    return total;
}

function openPlateGold() {
    a = 1;
    cm.sendSimple(
        "\r\n                       #i03994060# #i03994063# #i03994067# #i03994062# #i03994073# #i03994079#\r\n\r\n#n===============【金银岛屿板块】=================\r\n\r\n#r                                     (浮动率：±10%)#k\r\n#L1#<勇士部落矿业>\r\n\r\n#L2#<废弃都市影城>\r\n\r\n#L3#<射手村文旅局>\r\n\r\n#L4#<魔法密林医药>\r\n\r\n#L5#<明珠港海运队>",
    );
}
function openPlateIce() {
    a = 1;
    cm.sendSimple(
        "\r\n                       #i03994060# #i03994063# #i03994067# #i03994062# #i03994073# #i03994079#\r\n\r\n#n================【冰封雪域板块】================\r\n\r\n#r                                      (浮动率：±20%)#k\r\n#L1#<雪域冰原能源>\r\n\r\n#L2#<扎昆狩猎公司>\r\n\r\n#L3#<雪域温泉文旅>\r\n\r\n#L4#<冰封锻造工厂>\r\n\r\n#L5#<野狼快运物流>",
    );
}
function openPlateWater() {
    a = 1;
    cm.sendSimple(
        "\r\n                       #i03994060# #i03994063# #i03994067# #i03994062# #i03994073# #i03994079#\r\n\r\n#n================【水下世界板块】================\r\n\r\n#r                                      (浮动率：±30%)#k\r\n#L1#<海底珊瑚养殖>\r\n\r\n#L2#<海豚快运集团>\r\n\r\n#L3#<深海水晶矿业>\r\n\r\n#L4#<鱼王海鲜餐饮>\r\n\r\n#L5#<海底隧道基建>",
    );
}

function showRankList() {
    var DatabaseConnection = Java.type("org.gms.util.DatabaseConnection");
    var conn = DatabaseConnection.getConnection();
    var ps = conn.prepareStatement(
        "SELECT c.name, ev.extend_value AS profit " +
        "FROM extend_value ev " +
        "JOIN characters c ON c.id = ev.extend_id " +
        "WHERE ev.extend_type = 21 AND ev.extend_name = 'stock_profit' " +
        "ORDER BY profit + 0 DESC LIMIT 100",
    );
    var rs = ps.executeQuery();
    var msg =
        "\r\n                       #i03994060# #i03994063# #i03994067# #i03994062# #i03994073# #i03994079#\r\n\r\n#n";
    msg += "================ 【股神排行榜】 ================\r\n\r\n";
    var i = 0;
    while (rs.next()) {
        var profit = clampMoney(parseInt(rs.getString("profit")) || 0);
        var profitStr = profit >= 0 ? "#r+" + profit : "#b" + profit;
        msg +=
            "#r【" +
            ++i +
            "】#k#b" +
            rs.getString("name") +
            "#k 累计盈亏：" +
            profitStr +
            "#k\r\n";
    }
    cm.sendOk(msg);
    cm.dispose();
    rs.close();
    ps.close();
    conn.close();
}
