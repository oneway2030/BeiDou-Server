/**
 * @description 公婆戒指兑换
 * 1-10
 * 11-20
 * 21-30
 * 31-40
 * 40-50
 */

// 配置常量（集中管理，便于维护）
const CONFIG = {
    isDebug: false,          // 调试模式开关
    titlePrefix: "\t\t\t\t\t#e#k欢迎来到#r[戒指兑换]#k系统#n\t\t\t\t\r\n",
    mesoId: 9999999,         // 金币ID
    cashId: 9999998,         // 点券ID
    mesoIcon: "#fUI/UIWindow.img/QuestIcon/7/0#", // 金币图标
    goldScale: 10000,        // 金币换算比例（1单位=1W）
    broadcastDefaultType: 1  // 默认广播类型
};


// 戒指制作配置（结构化，注释清晰）
const itemSet = [
    // 1级戒指 (ID:1112446) - 1-10级段：1级鱼各300条
    {
        id: 1112446,        // 公婆戒指1级
        tipType: 1,         // 广播类型
        needItems: [
            {id: 4031627, qty: 100, tip: ""},
            {id: 4031628, qty: 100, tip: ""},
            {id: 4031630, qty: 100, tip: ""},
            {id: 4031631, qty: 100, tip: ""},

            {id: 4031633, qty: 50, tip: ""},
            {id: 4031641, qty: 50, tip: ""},
            {id: 4031637, qty: 50, tip: ""},
            {id: 4031645, qty: 50, tip: ""},

            {id: 4031633, qty: 5, tip: ""},
            {id: 4031641, qty: 5, tip: ""},
            {id: 4031637, qty: 5, tip: ""},
            {id: 4031645, qty: 5, tip: ""},

            {id: 4031635, qty: 1, tip: ""},
            {id: 4031643, qty: 1, tip: ""},
            {id: 4031639, qty: 1, tip: ""},
            {id: 4031647, qty: 1, tip: ""},


            {id: 4031636, qty: 1, tip: ""},
            {id: 4031644, qty: 1, tip: ""},
            {id: 4031640, qty: 1, tip: ""},
            {id: 4031648, qty: 1, tip: ""},
            {id: CONFIG.mesoId, qty: 10000},
            {id: CONFIG.cashId, qty: 50000},
        ]
    },
    // 2级戒指 (ID:1112447) - 1-10级段：1级鱼各300条
    {
        id: 1112447,        // 公婆戒指2级
        tipType: 1,
        needItems: [
            {id: 1112446, qty: 1, tip: ""},
            {id: 4031627, qty: 300, tip: ""},
            {id: 4031628, qty: 300, tip: ""},
            {id: 4031630, qty: 300, tip: ""},
            {id: 4031631, qty: 300, tip: ""},
            {id: CONFIG.mesoId, qty: 1000},
            {id: CONFIG.cashId, qty: 1000},
        ]
    },
    // 3级戒指 (ID:1112448) - 1-10级段：1级鱼各300条
    {
        id: 1112448,        // 公婆戒指3级
        tipType: 1,
        needItems: [
            {id: 1112447, qty: 1, tip: ""},
            {id: 4031627, qty: 300, tip: ""},
            {id: 4031628, qty: 300, tip: ""},
            {id: 4031630, qty: 300, tip: ""},
            {id: 4031631, qty: 300, tip: ""},
            {id: CONFIG.mesoId, qty: 1000},
            {id: CONFIG.cashId, qty: 1000},
        ]
    },
    // 4级戒指 (ID:1112449) - 1-10级段：1级鱼各300条
    {
        id: 1112449,        // 公婆戒指4级
        tipType: 1,
        needItems: [
            {id: 1112448, qty: 1, tip: ""},
            {id: 4031627, qty: 300, tip: ""},
            {id: 4031628, qty: 300, tip: ""},
            {id: 4031630, qty: 300, tip: ""},
            {id: 4031631, qty: 300, tip: ""},
            {id: CONFIG.mesoId, qty: 1000},
            {id: CONFIG.cashId, qty: 1000},
        ]
    },
    // 5级戒指 (ID:1112450) - 1-10级段：1级鱼各300条
    {
        id: 1112450,        // 公婆戒指5级
        tipType: 1,
        needItems: [
            {id: 1112449, qty: 1, tip: ""},
            {id: 4031627, qty: 300, tip: ""},
            {id: 4031628, qty: 300, tip: ""},
            {id: 4031630, qty: 300, tip: ""},
            {id: 4031631, qty: 300, tip: ""},
            {id: CONFIG.mesoId, qty: 1000},
            {id: CONFIG.cashId, qty: 1000},
        ]
    },
    // 6级戒指 (ID:1112451) - 1-10级段：1级鱼各300条
    {
        id: 1112451,        // 公婆戒指6级
        tipType: 1,
        needItems: [
            {id: 1112450, qty: 1, tip: ""},
            {id: 4031627, qty: 300, tip: ""},
            {id: 4031628, qty: 300, tip: ""},
            {id: 4031630, qty: 300, tip: ""},
            {id: 4031631, qty: 300, tip: ""},
            {id: CONFIG.mesoId, qty: 1000},
            {id: CONFIG.cashId, qty: 1000},
        ]
    },
    // 7级戒指 (ID:1112452) - 1-10级段：1级鱼各300条
    {
        id: 1112452,        // 公婆戒指7级
        tipType: 1,
        needItems: [
            {id: 1112451, qty: 1, tip: ""},
            {id: 4031627, qty: 300, tip: ""},
            {id: 4031628, qty: 300, tip: ""},
            {id: 4031630, qty: 300, tip: ""},
            {id: 4031631, qty: 300, tip: ""},
            {id: CONFIG.mesoId, qty: 1000},
            {id: CONFIG.cashId, qty: 1000},
        ]
    },
    // 8级戒指 (ID:1112453) - 1-10级段：1级鱼各300条
    {
        id: 1112453,        // 公婆戒指8级
        tipType: 1,
        needItems: [
            {id: 1112452, qty: 1, tip: ""},
            {id: 4031627, qty: 300, tip: ""},
            {id: 4031628, qty: 300, tip: ""},
            {id: 4031630, qty: 300, tip: ""},
            {id: 4031631, qty: 300, tip: ""},
            {id: CONFIG.mesoId, qty: 1000},
            {id: CONFIG.cashId, qty: 1000},
        ]
    },
    // 9级戒指 (ID:1112454) - 1-10级段：1级鱼各300条
    {
        id: 1112454,        // 公婆戒指9级
        tipType: 1,
        needItems: [
            {id: 1112453, qty: 1, tip: ""},
            {id: 4031627, qty: 300, tip: ""},
            {id: 4031628, qty: 300, tip: ""},
            {id: 4031630, qty: 300, tip: ""},
            {id: 4031631, qty: 300, tip: ""},
            {id: CONFIG.mesoId, qty: 1000},
            {id: CONFIG.cashId, qty: 1000},
        ]
    },
    // 10级戒指 (ID:1112455) - 1-10级段：1级鱼各300条
    {
        id: 1112455,        // 公婆戒指10级
        tipType: 1,
        needItems: [
            {id: 1112454, qty: 1, tip: ""},
            {id: 4031627, qty: 300, tip: ""},
            {id: 4031628, qty: 300, tip: ""},
            {id: 4031630, qty: 300, tip: ""},
            {id: 4031631, qty: 300, tip: ""},
            {id: CONFIG.mesoId, qty: 1000},
            {id: CONFIG.cashId, qty: 1000},
        ]
    },
    // 11级戒指 (ID:1112456) - 11-20级段：2级鱼各200条
    {
        id: 1112456,        // 公婆戒指11级
        tipType: 1,
        needItems: [
            {id: 1112455, qty: 1, tip: ""},
            {id: 4031633, qty: 200, tip: ""},
            {id: 4031641, qty: 200, tip: ""},
            {id: 4031637, qty: 200, tip: ""},
            {id: 4031645, qty: 200, tip: ""},
            {id: CONFIG.mesoId, qty: 1000},
            {id: CONFIG.cashId, qty: 1000},
        ]
    },
    // 12级戒指 (ID:1112457) - 11-20级段：2级鱼各200条
    {
        id: 1112457,        // 公婆戒指12级
        tipType: 1,
        needItems: [
            {id: 1112456, qty: 1, tip: ""},
            {id: 4031633, qty: 200, tip: ""},
            {id: 4031641, qty: 200, tip: ""},
            {id: 4031637, qty: 200, tip: ""},
            {id: 4031645, qty: 200, tip: ""},
            {id: CONFIG.mesoId, qty: 1000},
            {id: CONFIG.cashId, qty: 1000},
        ]
    },
    // 13级戒指 (ID:1112458) - 11-20级段：2级鱼各200条
    {
        id: 1112458,        // 公婆戒指13级
        tipType: 1,
        needItems: [
            {id: 1112457, qty: 1, tip: ""},
            {id: 4031633, qty: 200, tip: ""},
            {id: 4031641, qty: 200, tip: ""},
            {id: 4031637, qty: 200, tip: ""},
            {id: 4031645, qty: 200, tip: ""},
            {id: CONFIG.mesoId, qty: 1000},
            {id: CONFIG.cashId, qty: 1000},
        ]
    },
    // 14级戒指 (ID:1112459) - 11-20级段：2级鱼各200条
    {
        id: 1112459,        // 公婆戒指14级
        tipType: 1,
        needItems: [
            {id: 1112458, qty: 1, tip: ""},
            {id: 4031633, qty: 200, tip: ""},
            {id: 4031641, qty: 200, tip: ""},
            {id: 4031637, qty: 200, tip: ""},
            {id: 4031645, qty: 200, tip: ""},
            {id: CONFIG.mesoId, qty: 1000},
            {id: CONFIG.cashId, qty: 1000},
        ]
    },
    // 15级戒指 (ID:1112460) - 11-20级段：2级鱼各200条
    {
        id: 1112460,        // 公婆戒指15级
        tipType: 1,
        needItems: [
            {id: 1112459, qty: 1, tip: ""},
            {id: 4031633, qty: 200, tip: ""},
            {id: 4031641, qty: 200, tip: ""},
            {id: 4031637, qty: 200, tip: ""},
            {id: 4031645, qty: 200, tip: ""},
            {id: CONFIG.mesoId, qty: 1000},
            {id: CONFIG.cashId, qty: 1000},
        ]
    },
    // 16级戒指 (ID:1112461) - 11-20级段：2级鱼各200条
    {
        id: 1112461,        // 公婆戒指16级
        tipType: 1,
        needItems: [
            {id: 1112460, qty: 1, tip: ""},
            {id: 4031633, qty: 200, tip: ""},
            {id: 4031641, qty: 200, tip: ""},
            {id: 4031637, qty: 200, tip: ""},
            {id: 4031645, qty: 200, tip: ""},
            {id: CONFIG.mesoId, qty: 1000},
            {id: CONFIG.cashId, qty: 1000},
        ]
    },
    // 17级戒指 (ID:1112462) - 11-20级段：2级鱼各200条
    {
        id: 1112462,        // 公婆戒指17级
        tipType: 1,
        needItems: [
            {id: 1112461, qty: 1, tip: ""},
            {id: 4031633, qty: 200, tip: ""},
            {id: 4031641, qty: 200, tip: ""},
            {id: 4031637, qty: 200, tip: ""},
            {id: 4031645, qty: 200, tip: ""},
            {id: CONFIG.mesoId, qty: 1000},
            {id: CONFIG.cashId, qty: 1000},
        ]
    },
    // 18级戒指 (ID:1112463) - 11-20级段：2级鱼各200条
    {
        id: 1112463,        // 公婆戒指18级
        tipType: 1,
        needItems: [
            {id: 1112462, qty: 1, tip: ""},
            {id: 4031633, qty: 200, tip: ""},
            {id: 4031641, qty: 200, tip: ""},
            {id: 4031637, qty: 200, tip: ""},
            {id: 4031645, qty: 200, tip: ""},
            {id: CONFIG.mesoId, qty: 1000},
            {id: CONFIG.cashId, qty: 1000},
        ]
    },
    // 19级戒指 (ID:1112464) - 11-20级段：2级鱼各200条
    {
        id: 1112464,        // 公婆戒指19级
        tipType: 1,
        needItems: [
            {id: 1112463, qty: 1, tip: ""},
            {id: 4031633, qty: 200, tip: ""},
            {id: 4031641, qty: 200, tip: ""},
            {id: 4031637, qty: 200, tip: ""},
            {id: 4031645, qty: 200, tip: ""},
            {id: CONFIG.mesoId, qty: 1000},
            {id: CONFIG.cashId, qty: 1000},
        ]
    },
    // 20级戒指 (ID:1112465) - 11-20级段：2级鱼各200条
    {
        id: 1112465,        // 公婆戒指20级
        tipType: 1,
        needItems: [
            {id: 1112464, qty: 1, tip: ""},
            {id: 4031633, qty: 200, tip: ""},
            {id: 4031641, qty: 200, tip: ""},
            {id: 4031637, qty: 200, tip: ""},
            {id: 4031645, qty: 200, tip: ""},
            {id: CONFIG.mesoId, qty: 1000},
            {id: CONFIG.cashId, qty: 1000},
        ]
    },
    // 21级戒指 (ID:1112466) - 21-30级段：3级鱼各20条
    {
        id: 1112466,        // 公婆戒指21级
        tipType: 1,
        needItems: [
            {id: 1112465, qty: 1, tip: ""},
            {id: 4031633, qty: 20, tip: ""},
            {id: 4031641, qty: 20, tip: ""},
            {id: 4031637, qty: 20, tip: ""},
            {id: 4031645, qty: 20, tip: ""},
            {id: CONFIG.mesoId, qty: 1000},
            {id: CONFIG.cashId, qty: 1000},
        ]
    },
    // 22级戒指 (ID:1112467) - 21-30级段：3级鱼各20条
    {
        id: 1112467,        // 公婆戒指22级
        tipType: 1,
        needItems: [
            {id: 1112466, qty: 1, tip: ""},
            {id: 4031633, qty: 20, tip: ""},
            {id: 4031641, qty: 20, tip: ""},
            {id: 4031637, qty: 20, tip: ""},
            {id: 4031645, qty: 20, tip: ""},
            {id: CONFIG.mesoId, qty: 1000},
            {id: CONFIG.cashId, qty: 1000},
        ]
    },
    // 23级戒指 (ID:1112468) - 21-30级段：3级鱼各20条
    {
        id: 1112468,        // 公婆戒指23级
        tipType: 1,
        needItems: [
            {id: 1112467, qty: 1, tip: ""},
            {id: 4031633, qty: 20, tip: ""},
            {id: 4031641, qty: 20, tip: ""},
            {id: 4031637, qty: 20, tip: ""},
            {id: 4031645, qty: 20, tip: ""},
            {id: CONFIG.mesoId, qty: 1000},
            {id: CONFIG.cashId, qty: 1000},
        ]
    },
    // 24级戒指 (ID:1112469) - 21-30级段：3级鱼各20条
    {
        id: 1112469,        // 公婆戒指24级
        tipType: 1,
        needItems: [
            {id: 1112468, qty: 1, tip: ""},
            {id: 4031633, qty: 20, tip: ""},
            {id: 4031641, qty: 20, tip: ""},
            {id: 4031637, qty: 20, tip: ""},
            {id: 4031645, qty: 20, tip: ""},
            {id: CONFIG.mesoId, qty: 1000},
            {id: CONFIG.cashId, qty: 1000},
        ]
    },
    // 25级戒指 (ID:1112470) - 21-30级段：3级鱼各20条
    {
        id: 1112470,        // 公婆戒指25级
        tipType: 1,
        needItems: [
            {id: 1112469, qty: 1, tip: ""},
            {id: 4031633, qty: 20, tip: ""},
            {id: 4031641, qty: 20, tip: ""},
            {id: 4031637, qty: 20, tip: ""},
            {id: 4031645, qty: 20, tip: ""},
            {id: CONFIG.mesoId, qty: 1000},
            {id: CONFIG.cashId, qty: 1000},
        ]
    },
    // 26级戒指 (ID:1112471) - 21-30级段：3级鱼各20条
    {
        id: 1112471,        // 公婆戒指26级
        tipType: 1,
        needItems: [
            {id: 1112470, qty: 1, tip: ""},
            {id: 4031633, qty: 20, tip: ""},
            {id: 4031641, qty: 20, tip: ""},
            {id: 4031637, qty: 20, tip: ""},
            {id: 4031645, qty: 20, tip: ""},
            {id: CONFIG.mesoId, qty: 1000},
            {id: CONFIG.cashId, qty: 1000},
        ]
    },
    // 27级戒指 (ID:1112472) - 21-30级段：3级鱼各20条
    {
        id: 1112472,        // 公婆戒指27级
        tipType: 1,
        needItems: [
            {id: 1112471, qty: 1, tip: ""},
            {id: 4031633, qty: 20, tip: ""},
            {id: 4031641, qty: 20, tip: ""},
            {id: 4031637, qty: 20, tip: ""},
            {id: 4031645, qty: 20, tip: ""},
            {id: CONFIG.mesoId, qty: 1000},
            {id: CONFIG.cashId, qty: 1000},
        ]
    },
    // 28级戒指 (ID:1112473) - 21-30级段：3级鱼各20条
    {
        id: 1112473,        // 公婆戒指28级
        tipType: 1,
        needItems: [
            {id: 1112472, qty: 1, tip: ""},
            {id: 4031633, qty: 20, tip: ""},
            {id: 4031641, qty: 20, tip: ""},
            {id: 4031637, qty: 20, tip: ""},
            {id: 4031645, qty: 20, tip: ""},
            {id: CONFIG.mesoId, qty: 1000},
            {id: CONFIG.cashId, qty: 1000},
        ]
    },
    // 29级戒指 (ID:1112474) - 21-30级段：3级鱼各20条
    {
        id: 1112474,        // 公婆戒指29级
        tipType: 1,
        needItems: [
            {id: 1112473, qty: 1, tip: ""},
            {id: 4031633, qty: 20, tip: ""},
            {id: 4031641, qty: 20, tip: ""},
            {id: 4031637, qty: 20, tip: ""},
            {id: 4031645, qty: 20, tip: ""},
            {id: CONFIG.mesoId, qty: 1000},
            {id: CONFIG.cashId, qty: 1000},
        ]
    },
    // 30级戒指 (ID:1112475) - 21-30级段：3级鱼各20条
    {
        id: 1112475,        // 公婆戒指30级
        tipType: 1,
        needItems: [
            {id: 1112474, qty: 1, tip: ""},
            {id: 4031633, qty: 20, tip: ""},
            {id: 4031641, qty: 20, tip: ""},
            {id: 4031637, qty: 20, tip: ""},
            {id: 4031645, qty: 20, tip: ""},
            {id: CONFIG.mesoId, qty: 1000},
            {id: CONFIG.cashId, qty: 1000},
        ]
    },
    // 31级戒指 (ID:1112476) - 31-40级段：4级鱼各5条
    {
        id: 1112476,        // 公婆戒指31级
        tipType: 1,
        needItems: [
            {id: 1112475, qty: 1, tip: ""},
            {id: 4031635, qty: 5, tip: ""},
            {id: 4031643, qty: 5, tip: ""},
            {id: 4031639, qty: 5, tip: ""},
            {id: 4031647, qty: 5, tip: ""},
            {id: CONFIG.mesoId, qty: 1000},
            {id: CONFIG.cashId, qty: 1000},
        ]
    },
    // 32级戒指 (ID:1112477) - 31-40级段：4级鱼各5条
    {
        id: 1112477,        // 公婆戒指32级
        tipType: 1,
        needItems: [
            {id: 1112476, qty: 1, tip: ""},
            {id: 4031635, qty: 5, tip: ""},
            {id: 4031643, qty: 5, tip: ""},
            {id: 4031639, qty: 5, tip: ""},
            {id: 4031647, qty: 5, tip: ""},
            {id: CONFIG.mesoId, qty: 1000},
            {id: CONFIG.cashId, qty: 1000},
        ]
    },
    // 33级戒指 (ID:1112478) - 31-40级段：4级鱼各5条
    {
        id: 1112478,        // 公婆戒指33级
        tipType: 1,
        needItems: [
            {id: 1112477, qty: 1, tip: ""},
            {id: 4031635, qty: 5, tip: ""},
            {id: 4031643, qty: 5, tip: ""},
            {id: 4031639, qty: 5, tip: ""},
            {id: 4031647, qty: 5, tip: ""},
            {id: CONFIG.mesoId, qty: 1000},
            {id: CONFIG.cashId, qty: 1000},
        ]
    },
    // 34级戒指 (ID:1112479) - 31-40级段：4级鱼各5条
    {
        id: 1112479,        // 公婆戒指34级
        tipType: 1,
        needItems: [
            {id: 1112478, qty: 1, tip: ""},
            {id: 4031635, qty: 5, tip: ""},
            {id: 4031643, qty: 5, tip: ""},
            {id: 4031639, qty: 5, tip: ""},
            {id: 4031647, qty: 5, tip: ""},
            {id: CONFIG.mesoId, qty: 1000},
            {id: CONFIG.cashId, qty: 1000},
        ]
    },
    // 35级戒指 (ID:1112480) - 31-40级段：4级鱼各5条
    {
        id: 1112480,        // 公婆戒指35级
        tipType: 1,
        needItems: [
            {id: 1112479, qty: 1, tip: ""},
            {id: 4031635, qty: 5, tip: ""},
            {id: 4031643, qty: 5, tip: ""},
            {id: 4031639, qty: 5, tip: ""},
            {id: 4031647, qty: 5, tip: ""},
            {id: CONFIG.mesoId, qty: 1000},
            {id: CONFIG.cashId, qty: 1000},
        ]
    },
    // 36级戒指 (ID:1112481) - 31-40级段：4级鱼各5条
    {
        id: 1112481,        // 公婆戒指36级
        tipType: 1,
        needItems: [
            {id: 1112480, qty: 1, tip: ""},
            {id: 4031635, qty: 5, tip: ""},
            {id: 4031643, qty: 5, tip: ""},
            {id: 4031639, qty: 5, tip: ""},
            {id: 4031647, qty: 5, tip: ""},
            {id: CONFIG.mesoId, qty: 1000},
            {id: CONFIG.cashId, qty: 1000},
        ]
    },
    // 37级戒指 (ID:1112482) - 31-40级段：4级鱼各5条
    {
        id: 1112482,        // 公婆戒指37级
        tipType: 1,
        needItems: [
            {id: 1112481, qty: 1, tip: ""},
            {id: 4031635, qty: 5, tip: ""},
            {id: 4031643, qty: 5, tip: ""},
            {id: 4031639, qty: 5, tip: ""},
            {id: 4031647, qty: 5, tip: ""},
            {id: CONFIG.mesoId, qty: 1000},
            {id: CONFIG.cashId, qty: 1000},
        ]
    },
    // 38级戒指 (ID:1112483) - 31-40级段：4级鱼各5条
    {
        id: 1112483,        // 公婆戒指38级
        tipType: 1,
        needItems: [
            {id: 1112482, qty: 1, tip: ""},
            {id: 4031635, qty: 5, tip: ""},
            {id: 4031643, qty: 5, tip: ""},
            {id: 4031639, qty: 5, tip: ""},
            {id: 4031647, qty: 5, tip: ""},
            {id: CONFIG.mesoId, qty: 1000},
            {id: CONFIG.cashId, qty: 1000},
        ]
    },
    // 39级戒指 (ID:1112484) - 31-40级段：4级鱼各5条
    {
        id: 1112484,        // 公婆戒指39级
        tipType: 1,
        needItems: [
            {id: 1112483, qty: 1, tip: ""},
            {id: 4031635, qty: 5, tip: ""},
            {id: 4031643, qty: 5, tip: ""},
            {id: 4031639, qty: 5, tip: ""},
            {id: 4031647, qty: 5, tip: ""},
            {id: CONFIG.mesoId, qty: 1000},
            {id: CONFIG.cashId, qty: 1000},
        ]
    },
    // 40级戒指 (ID:1112485) - 31-40级段：4级鱼各5条
    {
        id: 1112485,        // 公婆戒指40级
        tipType: 1,
        needItems: [
            {id: 1112484, qty: 1, tip: ""},
            {id: 4031635, qty: 5, tip: ""},
            {id: 4031643, qty: 5, tip: ""},
            {id: 4031639, qty: 5, tip: ""},
            {id: 4031647, qty: 5, tip: ""},
            {id: CONFIG.mesoId, qty: 1000},
            {id: CONFIG.cashId, qty: 1000},
        ]
    },
    // 41级戒指 (ID:1112486) - 41-50级段：5级鱼各3条
    {
        id: 1112486,        // 公婆戒指41级
        tipType: 1,
        needItems: [
            {id: 1112485, qty: 1, tip: ""},
            {id: 4031636, qty: 3, tip: ""},
            {id: 4031644, qty: 3, tip: ""},
            {id: 4031640, qty: 3, tip: ""},
            {id: 4031648, qty: 3, tip: ""},
            {id: CONFIG.mesoId, qty: 1000},
            {id: CONFIG.cashId, qty: 1000},
        ]
    },
    // 42级戒指 (ID:1112487) - 41-50级段：5级鱼各3条
    {
        id: 1112487,        // 公婆戒指42级
        tipType: 1,
        needItems: [
            {id: 1112486, qty: 1, tip: ""},
            {id: 4031636, qty: 3, tip: ""},
            {id: 4031644, qty: 3, tip: ""},
            {id: 4031640, qty: 3, tip: ""},
            {id: 4031648, qty: 3, tip: ""},
            {id: CONFIG.mesoId, qty: 1000},
            {id: CONFIG.cashId, qty: 1000},
        ]
    },
    // 43级戒指 (ID:1112488) - 41-50级段：5级鱼各3条
    {
        id: 1112488,        // 公婆戒指43级
        tipType: 1,
        needItems: [
            {id: 1112487, qty: 1, tip: ""},
            {id: 4031636, qty: 3, tip: ""},
            {id: 4031644, qty: 3, tip: ""},
            {id: 4031640, qty: 3, tip: ""},
            {id: 4031648, qty: 3, tip: ""},
            {id: CONFIG.mesoId, qty: 1000},
            {id: CONFIG.cashId, qty: 1000},
        ]
    },
    // 44级戒指 (ID:1112489) - 41-50级段：5级鱼各3条
    {
        id: 1112489,        // 公婆戒指44级
        tipType: 1,
        needItems: [
            {id: 1112488, qty: 1, tip: ""},
            {id: 4031636, qty: 3, tip: ""},
            {id: 4031644, qty: 3, tip: ""},
            {id: 4031640, qty: 3, tip: ""},
            {id: 4031648, qty: 3, tip: ""},
            {id: CONFIG.mesoId, qty: 1000},
            {id: CONFIG.cashId, qty: 1000},
        ]
    },
    // 45级戒指 (ID:1112490) - 41-50级段：5级鱼各3条
    {
        id: 1112490,        // 公婆戒指45级
        tipType: 1,
        needItems: [
            {id: 1112489, qty: 1, tip: ""},
            {id: 4031636, qty: 3, tip: ""},
            {id: 4031644, qty: 3, tip: ""},
            {id: 4031640, qty: 3, tip: ""},
            {id: 4031648, qty: 3, tip: ""},
            {id: CONFIG.mesoId, qty: 1000},
            {id: CONFIG.cashId, qty: 1000},
        ]
    },
    // 46级戒指 (ID:1112491) - 41-50级段：5级鱼各3条
    {
        id: 1112491,        // 公婆戒指46级
        tipType: 1,
        needItems: [
            {id: 1112490, qty: 1, tip: ""},
            {id: 4031636, qty: 3, tip: ""},
            {id: 4031644, qty: 3, tip: ""},
            {id: 4031640, qty: 3, tip: ""},
            {id: 4031648, qty: 3, tip: ""},
            {id: CONFIG.mesoId, qty: 1000},
            {id: CONFIG.cashId, qty: 1000},
        ]
    },
    // 47级戒指 (ID:1112492) - 41-50级段：5级鱼各3条
    {
        id: 1112492,        // 公婆戒指47级
        tipType: 1,
        needItems: [
            {id: 1112491, qty: 1, tip: ""},
            {id: 4031636, qty: 3, tip: ""},
            {id: 4031644, qty: 3, tip: ""},
            {id: 4031640, qty: 3, tip: ""},
            {id: 4031648, qty: 3, tip: ""},
            {id: CONFIG.mesoId, qty: 1000},
            {id: CONFIG.cashId, qty: 1000},
        ]
    },
    // 48级戒指 (ID:1112493) - 41-50级段：5级鱼各3条
    {
        id: 1112493,        // 公婆戒指48级
        tipType: 1,
        needItems: [
            {id: 1112492, qty: 1, tip: ""},
            {id: 4031636, qty: 3, tip: ""},
            {id: 4031644, qty: 3, tip: ""},
            {id: 4031640, qty: 3, tip: ""},
            {id: 4031648, qty: 3, tip: ""},
            {id: CONFIG.mesoId, qty: 1000},
            {id: CONFIG.cashId, qty: 1000},
        ]
    },
    // 49级戒指 (ID:1112494) - 41-50级段：5级鱼各3条
    {
        id: 1112494,        // 公婆戒指49级
        tipType: 1,
        needItems: [
            {id: 1112493, qty: 1, tip: ""},
            {id: 4031636, qty: 3, tip: ""},
            {id: 4031644, qty: 3, tip: ""},
            {id: 4031640, qty: 3, tip: ""},
            {id: 4031648, qty: 3, tip: ""},
            {id: CONFIG.mesoId, qty: 1000},
            {id: CONFIG.cashId, qty: 1000},
        ]
    },
    // 50级戒指 (ID:1112495) - 41-50级段：5级鱼各3条
    {
        id: 1112495,        // 公婆戒指50级
        tipType: 1,
        needItems: [
            {id: 1112494, qty: 1, tip: ""},
            {id: 4031636, qty: 3, tip: ""},
            {id: 4031644, qty: 3, tip: ""},
            {id: 4031640, qty: 3, tip: ""},
            {id: 4031648, qty: 3, tip: ""},
            {id: CONFIG.mesoId, qty: 1000},
            {id: CONFIG.cashId, qty: 1000},
        ]
    }
];

// 全局状态变量（统一声明，避免污染）
let status = -1;
let craftTarget = null;       // 制作目标
let selectedIndex = -1;       // 选中的索引
let materialItem = null;      // 材料装备

/**
 * 脚本入口
 */
function start() {
    action(1, 0, 0);
}

/**
 * 核心交互逻辑
 * @param {number} mode - 交互模式（1=确认，0/-1=取消/关闭）
 * @param {number} type - 交互类型
 * @param {number} selection - 玩家选择的索引
 */
function action(mode, type, selection) {
    // 处理关闭对话框/取消操作
    if (mode === -1 || mode === 0) {
        cm.dispose();
        return;
    }
    // 状态推进
    if (mode === 1) {
        status++;
    }
    // 状态分发
    switch (status) {
        case 0:
            showCraftList(); // 显示制作列表
            break;
        case 1:
            selectCraftItem(selection); // 选择制作项
            break;
        case 2:
            doCraftItem(); // 执行制作
            break;
        default:
            cm.dispose();
            break;
    }
}

/**
 * 显示可制作的戒指列表
 */
function showCraftList() {
    let text = CONFIG.titlePrefix;
    text += "\r\n\r\n";
    text += "#r#e注意该戒指只能配带一个#n#d\r\n";
    // 遍历制作列表
    itemSet.forEach((item, idx) => {
        const operateText = idx === 0 ? "制作" : "升级";
        text += `#L${idx}##b${operateText}#v${item.id}#  #r#z${item.id}##b#k\r\n`;
    });
    cm.sendSimple(text);
}

/**
 * 选择要制作的戒指
 * @param {number} selection - 玩家选择的索引
 */
function selectCraftItem(selection) {
    // 边界校验：防止选择超出列表范围
    if (selection < 0 || selection >= itemSet.length) {
        cm.sendOk("无效的选择，请重新操作！");
        cm.dispose();
        return;
    }

    craftTarget = itemSet[selection];
    selectedIndex = selection; // 记录选中索引
    let confirmText = `确定要制作 #i${craftTarget.id}# #r#t${craftTarget.id}# #k吗？\r\n`;
    confirmText += "#b所需材料：#k\r\n";
    // 拼接材料列表
    craftTarget.needItems.forEach(need => {
        if (need.id === CONFIG.mesoId) {
            confirmText += `${CONFIG.mesoIcon} x ${getMesoDisplay(need.qty)}\r\n`;
        } else if (need.id === CONFIG.cashId) {
            confirmText += `#b点券 x #k ${need.qty}\r\n`;
        } else {
            const tipText = need.tip ? `\t#b${need.tip}#k` : '';
            confirmText += `#i${need.id}# #t${need.id}# x ${need.qty}${tipText}\r\n`;
        }
    });

    cm.sendYesNo(confirmText);
}

/**
 * 执行物品制作逻辑
 */
function doCraftItem() {
    if (!craftTarget) {
        cm.sendOk("制作信息已过期，请重新选择！");
        cm.dispose();
        return;
    }

    const player = cm.getPlayer();
    // 检查背包是否能容纳目标物品
    if (!cm.canHold(craftTarget.id, 1)) {
        cm.sendOk("背包空间不足或者您已有同类物品，无法制作！");
        cm.dispose();
        return;
    }

    // 调试模式跳过材料检查
    if (!CONFIG.isDebug) {
        // 第一步：全量检查材料是否满足（不扣除）
        const lackItems = [];
        const canCraft = checkAllMaterials(player, lackItems);

        // 材料不足则提示并终止
        if (!canCraft) {
            cm.sendOk(`材料不足：\r\n${lackItems.join("\r\n")}`);
            cm.dispose();
            return;
        }

        // 第二步：所有材料满足，统一扣除
        deductAllMaterials(player);
    } else {
        // 调试模式：仅获取武器材料，不扣除
        craftTarget.needItems.forEach(need => {
            if (selectedIndex > 0 && isRing(need.id)) {
                materialItem = player.getInventory(InventoryType.EQUIP).getItem(1);
            }
        });
    }
    获取新装备并继承属性(craftTarget.id, materialItem)
    // 制作成功提示+广播
    cm.sendOk(`恭喜您，制作 #i${craftTarget.id}# #t${craftTarget.id}# 成功！`);
    const tipType = craftTarget.tipType || CONFIG.broadcastDefaultType;
    const itemName = player.getItemName(craftTarget.id);
    player.sendBroadcast(
        tipType,
        "装备制作",
        `恭喜玩家${player.getName()}成功制作出【${itemName}】!`,
        true
    );

    cm.dispose();
}

const InventoryType = Java.type('org.gms.client.inventory.InventoryType');
const InventoryManipulator = Java.type('org.gms.client.inventory.manipulator.InventoryManipulator');

function 获取新装备并继承属性(targetId, needItem) {
    const player = cm.getPlayer();
    const newItem = cm.gainItem(targetId, 1);
    if (!newItem) {
        cm.sendOk("制作失败：无法生成目标物品！");
        cm.dispose();
        return;
    }
    newItem.setFlag(1); // 上锁
    // 武器属性继承逻辑
    if (needItem) {
        newItem.replaceData(needItem);
        // 移除原材料装备
        InventoryManipulator.removeFromSlot(
            player.getClient(),
            InventoryType.EQUIP,
            needItem.getPosition(),
            1,
            false
        );
    }
    player.forceUpdateItem(newItem); // 强制更新装备状态
}

/**
 * 全量检查所有材料是否满足（仅检查，不扣除）
 * @param {object} player - 玩家对象
 * @param {array} lackItems - 缺失材料列表（输出参数）
 * @returns {boolean} 是否所有材料都满足
 */
function checkAllMaterials(player, lackItems) {
    let allSatisfied = true;

    craftTarget.needItems.forEach(need => {
        if (need.id === CONFIG.mesoId) {
            // 检查金币
            const needMeso = getMesoValue(need.qty);
            if (cm.getMeso() < needMeso) {
                lackItems.push(`金币（缺少：${needMeso - cm.getMeso()}）`);
                allSatisfied = false;
            }
        } else if (need.id === CONFIG.cashId) {
            // 检查点券
            const cash = player.getCashShop().getCash(1);
            if (cash < need.qty) {
                lackItems.push(`点券（缺少：${need.qty - cash}）`);
                allSatisfied = false;
            }
        } else {
            // 检查普通物品/武器材料
            if (selectedIndex > 0 && isRing(need.id)) {
                materialItem = player.getInventory(InventoryType.EQUIP).getItem(1);
                if (!materialItem || materialItem.getItemId() !== need.id) {
                    lackItems.push(`戒指必须放在装备栏第一格（需#t${need.id}#）`);
                    allSatisfied = false;
                }
            } else {
                const haveQty = cm.getItemQuantity(need.id);
                if (haveQty < need.qty) {
                    lackItems.push(`#t${need.id}#（缺少：${need.qty - haveQty}）`);
                    allSatisfied = false;
                }
            }
        }
    });

    return allSatisfied;
}

/**
 * 统一扣除所有材料（仅在全量检查通过后调用）
 * @param {object} player - 玩家对象
 */
function deductAllMaterials(player) {
    craftTarget.needItems.forEach(need => {
        if (need.id === CONFIG.mesoId) {
            // 扣除金币
            const needMeso = getMesoValue(need.qty);
            cm.gainMeso(-needMeso);
        } else if (need.id === CONFIG.cashId) {
            // 扣除点券
            player.getCashShop().gainCash(1, -need.qty);
        } else {
            // 扣除普通物品（武器材料在属性继承时移除，此处无需处理）
            if (!(selectedIndex > 0 && isRing(need.id))) {
                cm.gainItem(need.id, -need.qty);
            }
        }
    });
}

/**
 * 计算金币实际值（换算成游戏内单位）
 * @param {number} meso - 配置中的金币数量
 * @returns {number} 实际金币值
 */
function getMesoValue(meso) {
    return meso * CONFIG.goldScale;
}

function isRing(id) {
    return id >= 1112446 && id <= 1112494;
}

/**
 * 格式化金币显示（W/E单位）
 * @param {number} meso - 配置中的金币数量
 * @returns {string} 格式化后的显示文本（无小数）
 */
function getMesoDisplay(meso) {
    const realMeso = getMesoValue(meso); // 假设该函数已存在，返回正确的金币数值
    if (realMeso >= 100000000) {
        // 除以1亿后取整（推荐用Math.floor向下取整，也可换Math.round四舍五入）
        return `${Math.floor(realMeso / 100000000)}E`;
    } else if (realMeso >= 10000) {
        // 除以1万后取整
        return `${Math.floor(realMeso / 10000)}W`;
    } else {
        return `${realMeso}`;
    }
}