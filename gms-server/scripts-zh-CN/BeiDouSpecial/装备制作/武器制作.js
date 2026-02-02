/**
 * @description 副本相关制作
 */
// 法弗纳       埃苏          漩涡  		  神秘之影
// 拳套
// 1472214     1472261		1472235		1472265
// 短刀
// 1332225    	1332274		1332247		1332279
// 长杖
// 1382272   	1382259		1382231		1382265
// 弓
// 1452205     1452252		1452226		1452257
// 弩
// 1462193     1462239		1462213		1462243
// 爪子
// 1482168     1482216		1482189		1482221
// 短枪
// 1492179     1492231		1492199		1492235
// 双手剑
// 1402196     1402251  	1402220		1402259
// 单手剑
// 1302275    	1302333 	1302297		1302343
// 双手斧
// 1412135  	1412177		1412152		1412181
// 单手斧
// 1312153    	1312199		1312173		1312203
// 单手锤子
// 1322203    	1322250		1322223		1322255
// 双手锤子
// 1422140     1422182		1422158		1422189
// 长枪
// 1432167     1432214		1432187		1432218
// 矛
// 1442223  	1442268		1442242		1442274
// 1.重生+永恒+枫叶定天+10个龙蛋=法弗纳之险手
// 2.法弗纳之险手+1个高级+1个高级黑水晶+10个星石月石+低级五彩=埃苏莱布斯
// 3.埃苏莱布斯+2个高级+2个高级黑水晶+10个正向+20个星石月石+=漩涡
// 4.漩涡+10个高级+10个正向=神秘
//
//
// 高 中 低  钻石    普通钻石
// 1  10  100  100  1000
//
// 1 低= 10钻石=100普通
//
// 4251200
//
//
// 力量 智慧 敏捷 幸运 黑暗
// 青铜 钢铁 锂    朱矿   银  紫    黄金
// 石榴 紫水 海蓝  祖母绿 蛋白 蓝宝石 黄晶  钻石   暗黑
//
//
// 战士 力量 石榴 黄晶
// 法师 智慧 蓝宝石 祖母绿
// 弓   敏捷 海蓝  钻石
// 标   幸运 紫水  蛋白
// 船长 敏捷
// 冲锋 力量
//50星 10 20 30 40 50   150攻击
//
const InventoryType = Java.type('org.gms.client.inventory.InventoryType');
const InventoryManipulator = Java.type('org.gms.client.inventory.manipulator.InventoryManipulator');
var isDebug = false;
var OldTitle = "\t\t\t\t\t#e#k欢迎来到#r[武器制作]#k系统#n\t\t\t\t\r\n";
var status = -1;
var i = 0;
var meso_id = 9999999;//金币
var cash_id = 9999998;//点卷
var 金币_icon = "#fUI/UIWindow.img/QuestIcon/7/0#";
var 选择的制作列表;
var 制作目标;
var 最高星级数组 = [20, 30, 40, 50];
var 额外升级次数 = [2, 4, 6, 10];
var index;//选择的位置
var 材料item;

// 1. 拳套（原示例，保留对照）
var 拳套 = [
    {
        id: 1472214,//法弗纳   枫叶定天 1472055
        tipType: 1,//广播类型
        needItems: [
            {id: 1472071, qty: 1, tip: ""},
            {id: 1472068, qty: 1, tip: ""},
            {id: 1472244, qty: 1, tip: ""},
            {id: 4001094, qty: 10, tip: ""},
            {id: meso_id, qty: 5000},
            {id: cash_id, qty: 50000},
        ]
    },
    {
        id: 1472261,//埃苏
        tipType: 1,
        needItems: [
            {id: 1472214, qty: 1, tip: ""},//法弗纳
            {id: 4021009, qty: 10, tip: ""},//星石
            {id: 4011007, qty: 10, tip: ""},//月石
            {id: 4251001, qty: 5, tip: ""},//中等幸运水晶
            {id: 4250301, qty: 5, tip: ""},//蛋白
            {id: 4250401, qty: 5, tip: ""},//紫水
            {id: 4251200, qty: 1, tip: ""},//下等五彩石
            {id: meso_id, qty: 10000},
            {id: cash_id, qty: 100000},
        ]
    },
    {
        id: 1472235,//漩涡
        tipType: 2,
        needItems: [
            {id: 1472261, qty: 1, tip: ""},//埃苏
            {id: 4021009, qty: 20, tip: ""},//星石
            {id: 4011007, qty: 20, tip: ""},//月石
            {id: 4251002, qty: 1, tip: ""},//高等幸运水晶
            {id: 4250302, qty: 1, tip: ""},//蛋白
            {id: 4250402, qty: 1, tip: ""},//紫水
            {id: 4251201, qty: 1, tip: ""},//中等等五彩石
            {id: meso_id, qty: 30000},
            {id: cash_id, qty: 150000},
        ]
    },
    {
        id: 1472265,//神秘之影
        tipType: 0,
        needItems: [
            {id: 1472235, qty: 1, tip: ""},//漩涡
            {id: 4250802, qty: 1, tip: ""},
            {id: 4251102, qty: 1, tip: ""},
            {id: 4250902, qty: 1, tip: ""},
            {id: 4251402, qty: 1, tip: ""},
            {id: 4251002, qty: 1, tip: ""},
            {id: 4250302, qty: 1, tip: ""},
            {id: 4250402, qty: 1, tip: ""},
            {id: 4250202, qty: 1, tip: ""},
            {id: 4250502, qty: 1, tip: ""},
            {id: 4250702, qty: 1, tip: ""},
            {id: 4250102, qty: 1, tip: ""},
            {id: 4250602, qty: 1, tip: ""},
            {id: 4250002, qty: 1, tip: ""},
            {id: 4251302, qty: 1, tip: ""},
            {id: 4251202, qty: 1, tip: ""},
            {id: meso_id, qty: 50000},
            {id: cash_id, qty: 200000},
        ]
    },
];


// 2. 短刀
var 短刀 = [
    {
        id: 1332225,//法弗纳
        tipType: 1,
        needItems: [
            {id: 1332076, qty: 1, tip: ""},
            {id: 1332074, qty: 1, tip: ""},
            {id: 1332257, qty: 1, tip: ""},
            {id: 4001094, qty: 10, tip: ""},
            {id: meso_id, qty: 5000},
            {id: cash_id, qty: 50000},
        ]
    },
    {
        id: 1332274,//埃苏
        tipType: 1,
        needItems: [
            {id: 1332225, qty: 1, tip: ""},//法弗纳
            {id: 4021009, qty: 10, tip: ""},
            {id: 4011007, qty: 10, tip: ""},
            {id: 4251001, qty: 5, tip: ""},
            {id: 4250301, qty: 5, tip: ""},
            {id: 4250401, qty: 5, tip: ""},
            {id: 4251200, qty: 1, tip: ""},
            {id: meso_id, qty: 10000},
            {id: cash_id, qty: 100000},
        ]
    },
    {
        id: 1332247,//漩涡
        tipType: 2,
        needItems: [
            {id: 1332274, qty: 1, tip: ""},//埃苏
            {id: 4021009, qty: 20, tip: ""},
            {id: 4011007, qty: 20, tip: ""},
            {id: 4251002, qty: 1, tip: ""},
            {id: 4250302, qty: 1, tip: ""},
            {id: 4250402, qty: 1, tip: ""},
            {id: 4251201, qty: 1, tip: ""},
            {id: meso_id, qty: 30000},
            {id: cash_id, qty: 150000},
        ]
    },
    {
        id: 1332279,//神秘之影
        tipType: 0,
        needItems: [
            {id: 1332247, qty: 1, tip: ""},//漩涡
            {id: 4250802, qty: 1, tip: ""},
            {id: 4251102, qty: 1, tip: ""},
            {id: 4250902, qty: 1, tip: ""},
            {id: 4251402, qty: 1, tip: ""},
            {id: 4251002, qty: 1, tip: ""},
            {id: 4250302, qty: 1, tip: ""},
            {id: 4250402, qty: 1, tip: ""},
            {id: 4250202, qty: 1, tip: ""},
            {id: 4250502, qty: 1, tip: ""},
            {id: 4250702, qty: 1, tip: ""},
            {id: 4250102, qty: 1, tip: ""},
            {id: 4250602, qty: 1, tip: ""},
            {id: 4250002, qty: 1, tip: ""},
            {id: 4251302, qty: 1, tip: ""},
            {id: 4251202, qty: 1, tip: ""},
            {id: meso_id, qty: 50000},
            {id: cash_id, qty: 200000},
        ]
    },
];

// 3. 长杖
var 长杖 = [
    {
        id: 1382272,//法弗纳
        tipType: 1,
        needItems: [
            {id: 1382059, qty: 1, tip: ""},
            {id: 1382057, qty: 1, tip: ""},
            {id: 1382242, qty: 1, tip: ""},
            {id: 4001094, qty: 10, tip: ""},
            {id: meso_id, qty: 5000},
            {id: cash_id, qty: 50000},
        ]
    },
    {
        id: 1382259,//埃苏
        tipType: 1,
        needItems: [
            {id: 1382272, qty: 1, tip: ""},//法弗纳
            {id: 4021009, qty: 10, tip: ""},
            {id: 4011007, qty: 10, tip: ""},
            {id: 4250901, qty: 5, tip: ""},
            {id: 4250101, qty: 5, tip: ""},
            {id: 4250701, qty: 5, tip: ""},
            {id: 4251200, qty: 1, tip: ""},
            {id: meso_id, qty: 10000},
            {id: cash_id, qty: 100000},
        ]
    },
    {
        id: 1382231,//漩涡
        tipType: 2,
        needItems: [
            {id: 1382259, qty: 1, tip: ""},//埃苏
            {id: 4021009, qty: 20, tip: ""},
            {id: 4011007, qty: 20, tip: ""},
            {id: 4250902, qty: 1, tip: ""},
            {id: 4250102, qty: 1, tip: ""},
            {id: 4250702, qty: 1, tip: ""},
            {id: 4251201, qty: 1, tip: ""},
            {id: meso_id, qty: 30000},
            {id: cash_id, qty: 150000},
        ]
    },
    {
        id: 1382265,//神秘之影
        tipType: 0,
        needItems: [
            {id: 1382231, qty: 1, tip: ""},//漩涡
            {id: 4250802, qty: 1, tip: ""},
            {id: 4251102, qty: 1, tip: ""},
            {id: 4250902, qty: 1, tip: ""},
            {id: 4251402, qty: 1, tip: ""},
            {id: 4251002, qty: 1, tip: ""},
            {id: 4250302, qty: 1, tip: ""},
            {id: 4250402, qty: 1, tip: ""},
            {id: 4250202, qty: 1, tip: ""},
            {id: 4250502, qty: 1, tip: ""},
            {id: 4250702, qty: 1, tip: ""},
            {id: 4250102, qty: 1, tip: ""},
            {id: 4250602, qty: 1, tip: ""},
            {id: 4250002, qty: 1, tip: ""},
            {id: 4251302, qty: 1, tip: ""},
            {id: 4251202, qty: 1, tip: ""},
            {id: meso_id, qty: 50000},
            {id: cash_id, qty: 200000},
        ]
    },
];

// 4. 弓
var 弓 = [
    {
        id: 1452205,//法弗纳
        tipType: 1,
        needItems: [
            {id: 1452059, qty: 1, tip: ""},
            {id: 1452057, qty: 1, tip: ""},
            {id: 1452235, qty: 1, tip: ""},
            {id: 4001094, qty: 10, tip: ""},
            {id: meso_id, qty: 5000},
            {id: cash_id, qty: 50000},
        ]
    },
    {
        id: 1452252,//埃苏
        tipType: 1,
        needItems: [
            {id: 1452205, qty: 1, tip: ""},//法弗纳
            {id: 4021009, qty: 10, tip: ""},
            {id: 4011007, qty: 10, tip: ""},
            {id: 4251101, qty: 5, tip: ""},
            {id: 4250501, qty: 5, tip: ""},
            {id: 4250001, qty: 5, tip: ""},
            {id: 4251200, qty: 1, tip: ""},
            {id: meso_id, qty: 10000},
            {id: cash_id, qty: 100000},
        ]
    },
    {
        id: 1452226,//漩涡
        tipType: 2,
        needItems: [
            {id: 1452252, qty: 1, tip: ""},//埃苏
            {id: 4021009, qty: 20, tip: ""},
            {id: 4011007, qty: 20, tip: ""},
            {id: 4251102, qty: 1, tip: ""},
            {id: 4250502, qty: 1, tip: ""},
            {id: 4250002, qty: 1, tip: ""},
            {id: 4251201, qty: 1, tip: ""},
            {id: meso_id, qty: 30000},
            {id: cash_id, qty: 150000},
        ]
    },
    {
        id: 1452257,//神秘之影
        tipType: 0,
        needItems: [
            {id: 1452226, qty: 1, tip: ""},//漩涡
            {id: 4250802, qty: 1, tip: ""},
            {id: 4251102, qty: 1, tip: ""},
            {id: 4250902, qty: 1, tip: ""},
            {id: 4251402, qty: 1, tip: ""},
            {id: 4251002, qty: 1, tip: ""},
            {id: 4250302, qty: 1, tip: ""},
            {id: 4250402, qty: 1, tip: ""},
            {id: 4250202, qty: 1, tip: ""},
            {id: 4250502, qty: 1, tip: ""},
            {id: 4250702, qty: 1, tip: ""},
            {id: 4250102, qty: 1, tip: ""},
            {id: 4250602, qty: 1, tip: ""},
            {id: 4250002, qty: 1, tip: ""},
            {id: 4251302, qty: 1, tip: ""},
            {id: 4251202, qty: 1, tip: ""},
            {id: meso_id, qty: 50000},
            {id: cash_id, qty: 200000},
        ]
    },
];

// 5. 弩
var 弩 = [
    {
        id: 1462193,//法弗纳
        tipType: 1,
        needItems: [
            {id: 1462051, qty: 1, tip: ""},
            {id: 1462050, qty: 1, tip: ""},
            {id: 1462222, qty: 1, tip: ""},
            {id: 4001094, qty: 10, tip: ""},
            {id: meso_id, qty: 5000},
            {id: cash_id, qty: 50000},
        ]
    },
    {
        id: 1462239,//埃苏
        tipType: 1,
        needItems: [
            {id: 1462193, qty: 1, tip: ""},//法弗纳
            {id: 4021009, qty: 10, tip: ""},
            {id: 4011007, qty: 10, tip: ""},
            {id: 4251101, qty: 5, tip: ""},
            {id: 4250501, qty: 5, tip: ""},
            {id: 4250001, qty: 5, tip: ""},
            {id: 4251200, qty: 1, tip: ""},
            {id: meso_id, qty: 10000},
            {id: cash_id, qty: 100000},
        ]
    },
    {
        id: 1462213,//漩涡
        tipType: 2,
        needItems: [
            {id: 1462239, qty: 1, tip: ""},//埃苏
            {id: 4021009, qty: 20, tip: ""},
            {id: 4011007, qty: 20, tip: ""},
            {id: 4251102, qty: 1, tip: ""},
            {id: 4250502, qty: 1, tip: ""},
            {id: 4250002, qty: 1, tip: ""},
            {id: 4251201, qty: 1, tip: ""},
            {id: meso_id, qty: 30000},
            {id: cash_id, qty: 150000},
        ]
    },
    {
        id: 1462243,//神秘之影
        tipType: 0,
        needItems: [
            {id: 1462213, qty: 1, tip: ""},//漩涡
            {id: 4250802, qty: 1, tip: ""},
            {id: 4251102, qty: 1, tip: ""},
            {id: 4250902, qty: 1, tip: ""},
            {id: 4251402, qty: 1, tip: ""},
            {id: 4251002, qty: 1, tip: ""},
            {id: 4250302, qty: 1, tip: ""},
            {id: 4250402, qty: 1, tip: ""},
            {id: 4250202, qty: 1, tip: ""},
            {id: 4250502, qty: 1, tip: ""},
            {id: 4250702, qty: 1, tip: ""},
            {id: 4250102, qty: 1, tip: ""},
            {id: 4250602, qty: 1, tip: ""},
            {id: 4250002, qty: 1, tip: ""},
            {id: 4251302, qty: 1, tip: ""},
            {id: 4251202, qty: 1, tip: ""},
            {id: meso_id, qty: 50000},
            {id: cash_id, qty: 200000},
        ]
    },
];

// 6. 爪子
var 爪子 = [
    {
        id: 1482168,//法弗纳
        tipType: 1,
        needItems: [
            {id: 1482024, qty: 1, tip: ""},
            {id: 1482023, qty: 1, tip: ""},
            {id: 1482199, qty: 1, tip: ""},
            {id: 4001094, qty: 10, tip: ""},
            {id: meso_id, qty: 5000},
            {id: cash_id, qty: 50000},
        ]
    },
    {
        id: 1482216,//埃苏
        tipType: 1,
        needItems: [
            {id: 1482168, qty: 1, tip: ""},//法弗纳
            {id: 4021009, qty: 10, tip: ""},
            {id: 4011007, qty: 10, tip: ""},
            {id: 4250801, qty: 5, tip: ""},
            {id: 4250201, qty: 5, tip: ""},
            {id: 4250601, qty: 5, tip: ""},
            {id: 4251200, qty: 1, tip: ""},
            {id: meso_id, qty: 10000},
            {id: cash_id, qty: 100000},
        ]
    },
    {
        id: 1482189,//漩涡
        tipType: 2,
        needItems: [
            {id: 1482216, qty: 1, tip: ""},//埃苏
            {id: 4021009, qty: 20, tip: ""},
            {id: 4011007, qty: 20, tip: ""},
            {id: 4250802, qty: 1, tip: ""},
            {id: 4250202, qty: 1, tip: ""},
            {id: 4250602, qty: 1, tip: ""},
            {id: 4251201, qty: 1, tip: ""},
            {id: meso_id, qty: 30000},
            {id: cash_id, qty: 150000},
        ]
    },
    {
        id: 1482221,//神秘之影
        tipType: 0,
        needItems: [
            {id: 1482189, qty: 1, tip: ""},//漩涡
            {id: 4250802, qty: 1, tip: ""},
            {id: 4251102, qty: 1, tip: ""},
            {id: 4250902, qty: 1, tip: ""},
            {id: 4251402, qty: 1, tip: ""},
            {id: 4251002, qty: 1, tip: ""},
            {id: 4250302, qty: 1, tip: ""},
            {id: 4250402, qty: 1, tip: ""},
            {id: 4250202, qty: 1, tip: ""},
            {id: 4250502, qty: 1, tip: ""},
            {id: 4250702, qty: 1, tip: ""},
            {id: 4250102, qty: 1, tip: ""},
            {id: 4250602, qty: 1, tip: ""},
            {id: 4250002, qty: 1, tip: ""},
            {id: 4251302, qty: 1, tip: ""},
            {id: 4251202, qty: 1, tip: ""},
            {id: meso_id, qty: 50000},
            {id: cash_id, qty: 200000},
        ]
    },
];

// 7. 短枪
var 短枪 = [
    {
        id: 1492179,//法弗纳
        tipType: 1,
        needItems: [
            {id: 1492025, qty: 1, tip: ""},
            {id: 1492023, qty: 1, tip: ""},
            {id: 1492209, qty: 1, tip: ""},
            {id: 4001094, qty: 10, tip: ""},
            {id: meso_id, qty: 5000},
            {id: cash_id, qty: 50000},
        ]
    },
    {
        id: 1492231,//埃苏
        tipType: 1,
        needItems: [
            {id: 1492179, qty: 1, tip: ""},//法弗纳
            {id: 4021009, qty: 10, tip: ""},
            {id: 4011007, qty: 10, tip: ""},
            {id: 4251101, qty: 5, tip: ""},
            {id: 4250501, qty: 5, tip: ""},
            {id: 4250001, qty: 5, tip: ""},
            {id: 4251200, qty: 1, tip: ""},
            {id: meso_id, qty: 10000},
            {id: cash_id, qty: 100000},
        ]
    },
    {
        id: 1492199,//漩涡
        tipType: 2,
        needItems: [
            {id: 1492231, qty: 1, tip: ""},//埃苏
            {id: 4021009, qty: 20, tip: ""},
            {id: 4011007, qty: 20, tip: ""},
            {id: 4251102, qty: 1, tip: ""},
            {id: 4250502, qty: 1, tip: ""},
            {id: 4250002, qty: 1, tip: ""},
            {id: 4251201, qty: 1, tip: ""},
            {id: meso_id, qty: 30000},
            {id: cash_id, qty: 150000},
        ]
    },
    {
        id: 1492235,//神秘之影
        tipType: 0,
        needItems: [
            {id: 1492199, qty: 1, tip: ""},//漩涡
            {id: 4250802, qty: 1, tip: ""},
            {id: 4251102, qty: 1, tip: ""},
            {id: 4250902, qty: 1, tip: ""},
            {id: 4251402, qty: 1, tip: ""},
            {id: 4251002, qty: 1, tip: ""},
            {id: 4250302, qty: 1, tip: ""},
            {id: 4250402, qty: 1, tip: ""},
            {id: 4250202, qty: 1, tip: ""},
            {id: 4250502, qty: 1, tip: ""},
            {id: 4250702, qty: 1, tip: ""},
            {id: 4250102, qty: 1, tip: ""},
            {id: 4250602, qty: 1, tip: ""},
            {id: 4250002, qty: 1, tip: ""},
            {id: 4251302, qty: 1, tip: ""},
            {id: 4251202, qty: 1, tip: ""},
            {id: meso_id, qty: 50000},
            {id: cash_id, qty: 200000},
        ]
    },
];

// 8. 双手剑
var 双手剑 = [
    {
        id: 1402196,//法弗纳
        tipType: 1,
        needItems: [
            {id: 1402047, qty: 1, tip: ""},
            {id: 1402046, qty: 1, tip: ""},
            {id: 1402233, qty: 1, tip: ""},
            {id: 4001094, qty: 10, tip: ""},
            {id: meso_id, qty: 5000},
            {id: cash_id, qty: 50000},
        ]
    },
    {
        id: 1402251,//埃苏
        tipType: 1,
        needItems: [
            {id: 1402196, qty: 1, tip: ""},//法弗纳
            {id: 4021009, qty: 10, tip: ""},
            {id: 4011007, qty: 10, tip: ""},
            {id: 4250801, qty: 5, tip: ""},
            {id: 4250201, qty: 5, tip: ""},
            {id: 4250601, qty: 5, tip: ""},
            {id: 4251200, qty: 1, tip: ""},
            {id: meso_id, qty: 10000},
            {id: cash_id, qty: 100000},
        ]
    },
    {
        id: 1402220,//漩涡
        tipType: 2,
        needItems: [
            {id: 1402251, qty: 1, tip: ""},//埃苏
            {id: 4021009, qty: 20, tip: ""},
            {id: 4011007, qty: 20, tip: ""},
            {id: 4250802, qty: 1, tip: ""},
            {id: 4250202, qty: 1, tip: ""},
            {id: 4250602, qty: 1, tip: ""},
            {id: 4251201, qty: 1, tip: ""},
            {id: meso_id, qty: 30000},
            {id: cash_id, qty: 150000},
        ]
    },
    {
        id: 1402259,//神秘之影
        tipType: 0,
        needItems: [
            {id: 1402220, qty: 1, tip: ""},//漩涡
            {id: 4250802, qty: 1, tip: ""},
            {id: 4251102, qty: 1, tip: ""},
            {id: 4250902, qty: 1, tip: ""},
            {id: 4251402, qty: 1, tip: ""},
            {id: 4251002, qty: 1, tip: ""},
            {id: 4250302, qty: 1, tip: ""},
            {id: 4250402, qty: 1, tip: ""},
            {id: 4250202, qty: 1, tip: ""},
            {id: 4250502, qty: 1, tip: ""},
            {id: 4250702, qty: 1, tip: ""},
            {id: 4250102, qty: 1, tip: ""},
            {id: 4250602, qty: 1, tip: ""},
            {id: 4250002, qty: 1, tip: ""},
            {id: 4251302, qty: 1, tip: ""},
            {id: 4251202, qty: 1, tip: ""},
            {id: meso_id, qty: 50000},
            {id: cash_id, qty: 200000},
        ]
    },
];

// 9. 单手剑
var 单手剑 = [
    {
        id: 1302275,//法弗纳
        tipType: 1,
        needItems: [
            {id: 1302086, qty: 1, tip: ""},
            {id: 1302081, qty: 1, tip: ""},
            {id: 1302312, qty: 1, tip: ""},
            {id: 4001094, qty: 10, tip: ""},
            {id: meso_id, qty: 5000},
            {id: cash_id, qty: 50000},
        ]
    },
    {
        id: 1302333,//埃苏
        tipType: 1,
        needItems: [
            {id: 1302275, qty: 1, tip: ""},//法弗纳
            {id: 4021009, qty: 10, tip: ""},
            {id: 4011007, qty: 10, tip: ""},
            {id: 4250801, qty: 5, tip: ""},
            {id: 4250201, qty: 5, tip: ""},
            {id: 4250601, qty: 5, tip: ""},
            {id: 4251200, qty: 1, tip: ""},
            {id: meso_id, qty: 10000},
            {id: cash_id, qty: 100000},
        ]
    },
    {
        id: 1302297,//漩涡
        tipType: 2,
        needItems: [
            {id: 1302333, qty: 1, tip: ""},//埃苏
            {id: 4021009, qty: 20, tip: ""},
            {id: 4011007, qty: 20, tip: ""},
            {id: 4250802, qty: 1, tip: ""},
            {id: 4250202, qty: 1, tip: ""},
            {id: 4250602, qty: 1, tip: ""},
            {id: 4251201, qty: 1, tip: ""},
            {id: meso_id, qty: 30000},
            {id: cash_id, qty: 150000},
        ]
    },
    {
        id: 1302343,//神秘之影
        tipType: 0,
        needItems: [
            {id: 1302297, qty: 1, tip: ""},//漩涡
            {id: 4250802, qty: 1, tip: ""},
            {id: 4251102, qty: 1, tip: ""},
            {id: 4250902, qty: 1, tip: ""},
            {id: 4251402, qty: 1, tip: ""},
            {id: 4251002, qty: 1, tip: ""},
            {id: 4250302, qty: 1, tip: ""},
            {id: 4250402, qty: 1, tip: ""},
            {id: 4250202, qty: 1, tip: ""},
            {id: 4250502, qty: 1, tip: ""},
            {id: 4250702, qty: 1, tip: ""},
            {id: 4250102, qty: 1, tip: ""},
            {id: 4250602, qty: 1, tip: ""},
            {id: 4250002, qty: 1, tip: ""},
            {id: 4251302, qty: 1, tip: ""},
            {id: 4251202, qty: 1, tip: ""},
            {id: meso_id, qty: 50000},
            {id: cash_id, qty: 200000},
        ]
    },
];

// 10. 双手斧
var 双手斧 = [
    {
        id: 1412135,//法弗纳
        tipType: 1,
        needItems: [
            {id: 1412034, qty: 1, tip: ""},
            {id: 1412033, qty: 1, tip: ""},
            {id: 1412161, qty: 1, tip: ""},
            {id: 4001094, qty: 10, tip: ""},
            {id: meso_id, qty: 5000},
            {id: cash_id, qty: 50000},
        ]
    },
    {
        id: 1412177,//埃苏
        tipType: 1,
        needItems: [
            {id: 1412135, qty: 1, tip: ""},//法弗纳
            {id: 4021009, qty: 10, tip: ""},
            {id: 4011007, qty: 10, tip: ""},
            {id: 4250801, qty: 5, tip: ""},
            {id: 4250201, qty: 5, tip: ""},
            {id: 4250601, qty: 5, tip: ""},
            {id: 4251200, qty: 1, tip: ""},
            {id: meso_id, qty: 10000},
            {id: cash_id, qty: 100000},
        ]
    },
    {
        id: 1412152,//漩涡
        tipType: 2,
        needItems: [
            {id: 1412177, qty: 1, tip: ""},//埃苏
            {id: 4021009, qty: 20, tip: ""},
            {id: 4011007, qty: 20, tip: ""},
            {id: 4250802, qty: 1, tip: ""},
            {id: 4250202, qty: 1, tip: ""},
            {id: 4250602, qty: 1, tip: ""},
            {id: 4251201, qty: 1, tip: ""},
            {id: meso_id, qty: 30000},
            {id: cash_id, qty: 150000},
        ]
    },
    {
        id: 1412181,//神秘之影
        tipType: 6,
        needItems: [
            {id: 1412152, qty: 1, tip: ""},//漩涡
            {id: 4250802, qty: 1, tip: ""},
            {id: 4251102, qty: 1, tip: ""},
            {id: 4250902, qty: 1, tip: ""},
            {id: 4251402, qty: 1, tip: ""},
            {id: 4251002, qty: 1, tip: ""},
            {id: 4250302, qty: 1, tip: ""},
            {id: 4250402, qty: 1, tip: ""},
            {id: 4250202, qty: 1, tip: ""},
            {id: 4250502, qty: 1, tip: ""},
            {id: 4250702, qty: 1, tip: ""},
            {id: 4250102, qty: 1, tip: ""},
            {id: 4250602, qty: 1, tip: ""},
            {id: 4250002, qty: 1, tip: ""},
            {id: 4251302, qty: 1, tip: ""},
            {id: 4251202, qty: 1, tip: ""},
            {id: meso_id, qty: 50000},
            {id: cash_id, qty: 200000},
        ]
    },
];

// 11. 单手斧
var 单手斧 = [
    {
        id: 1312153,//法弗纳
        tipType: 1,
        needItems: [
            {id: 1312038, qty: 1, tip: ""},
            {id: 1312037, qty: 1, tip: ""},
            {id: 1312182, qty: 1, tip: ""},
            {id: 4001094, qty: 10, tip: ""},
            {id: meso_id, qty: 5000},
            {id: cash_id, qty: 50000},
        ]
    },
    {
        id: 1312199,//埃苏
        tipType: 1,
        needItems: [
            {id: 1312153, qty: 1, tip: ""},//法弗纳
            {id: 4021009, qty: 10, tip: ""},
            {id: 4011007, qty: 10, tip: ""},
            {id: 4250801, qty: 5, tip: ""},
            {id: 4250201, qty: 5, tip: ""},
            {id: 4250601, qty: 5, tip: ""},
            {id: 4251200, qty: 1, tip: ""},
            {id: meso_id, qty: 10000},
            {id: cash_id, qty: 100000},
        ]
    },
    {
        id: 1312173,//漩涡
        tipType: 2,
        needItems: [
            {id: 1312199, qty: 1, tip: ""},//埃苏
            {id: 4021009, qty: 20, tip: ""},
            {id: 4011007, qty: 20, tip: ""},
            {id: 4250802, qty: 1, tip: ""},
            {id: 4250202, qty: 1, tip: ""},
            {id: 4250602, qty: 1, tip: ""},
            {id: 4251201, qty: 1, tip: ""},
            {id: meso_id, qty: 30000},
            {id: cash_id, qty: 150000},
        ]
    },
    {
        id: 1312203,//神秘之影
        tipType: 0,
        needItems: [
            {id: 1312173, qty: 1, tip: ""},//漩涡
            {id: 4250802, qty: 1, tip: ""},
            {id: 4251102, qty: 1, tip: ""},
            {id: 4250902, qty: 1, tip: ""},
            {id: 4251402, qty: 1, tip: ""},
            {id: 4251002, qty: 1, tip: ""},
            {id: 4250302, qty: 1, tip: ""},
            {id: 4250402, qty: 1, tip: ""},
            {id: 4250202, qty: 1, tip: ""},
            {id: 4250502, qty: 1, tip: ""},
            {id: 4250702, qty: 1, tip: ""},
            {id: 4250102, qty: 1, tip: ""},
            {id: 4250602, qty: 1, tip: ""},
            {id: 4250002, qty: 1, tip: ""},
            {id: 4251302, qty: 1, tip: ""},
            {id: 4251202, qty: 1, tip: ""},
            {id: meso_id, qty: 50000},
            {id: cash_id, qty: 200000},
        ]
    },
];

// 12. 单手锤子
var 单手锤子 = [
    {
        id: 1322203,//法弗纳
        tipType: 1,
        needItems: [
            {id: 1322061, qty: 1, tip: ""},
            {id: 1322060, qty: 1, tip: ""},
            {id: 1322233, qty: 1, tip: ""},
            {id: 4001094, qty: 10, tip: ""},
            {id: meso_id, qty: 5000},
            {id: cash_id, qty: 50000},
        ]
    },
    {
        id: 1322250,//埃苏
        tipType: 1,
        needItems: [
            {id: 1322203, qty: 1, tip: ""},//法弗纳
            {id: 4021009, qty: 10, tip: ""},
            {id: 4011007, qty: 10, tip: ""},
            {id: 4250801, qty: 5, tip: ""},
            {id: 4250201, qty: 5, tip: ""},
            {id: 4250601, qty: 5, tip: ""},
            {id: 4251200, qty: 1, tip: ""},
            {id: meso_id, qty: 10000},
            {id: cash_id, qty: 100000},
        ]
    },
    {
        id: 1322223,//漩涡
        tipType: 2,
        needItems: [
            {id: 1322250, qty: 1, tip: ""},//埃苏
            {id: 4021009, qty: 20, tip: ""},
            {id: 4011007, qty: 20, tip: ""},
            {id: 4250802, qty: 1, tip: ""},
            {id: 4250202, qty: 1, tip: ""},
            {id: 4250602, qty: 1, tip: ""},
            {id: 4251201, qty: 1, tip: ""},
            {id: meso_id, qty: 30000},
            {id: cash_id, qty: 150000},
        ]
    },
    {
        id: 1322255,//神秘之影
        tipType: 0,
        needItems: [
            {id: 1322223, qty: 1, tip: ""},//漩涡
            {id: 4250802, qty: 1, tip: ""},
            {id: 4251102, qty: 1, tip: ""},
            {id: 4250902, qty: 1, tip: ""},
            {id: 4251402, qty: 1, tip: ""},
            {id: 4251002, qty: 1, tip: ""},
            {id: 4250302, qty: 1, tip: ""},
            {id: 4250402, qty: 1, tip: ""},
            {id: 4250202, qty: 1, tip: ""},
            {id: 4250502, qty: 1, tip: ""},
            {id: 4250702, qty: 1, tip: ""},
            {id: 4250102, qty: 1, tip: ""},
            {id: 4250602, qty: 1, tip: ""},
            {id: 4250002, qty: 1, tip: ""},
            {id: 4251302, qty: 1, tip: ""},
            {id: 4251202, qty: 1, tip: ""},
            {id: meso_id, qty: 50000},
            {id: cash_id, qty: 200000},
        ]
    },
];


// 13. 双手锤子
var 双手锤子 = [
    {
        id: 1422140,//法弗纳
        tipType: 1,
        needItems: [
            {id: 1422038, qty: 1, tip: ""},
            {id: 1422037, qty: 1, tip: ""},
            {id: 1422168, qty: 1, tip: ""},
            {id: 4001094, qty: 10, tip: ""},
            {id: meso_id, qty: 5000},
            {id: cash_id, qty: 50000},
        ]
    },
    {
        id: 1422184,//埃苏
        tipType: 1,
        needItems: [
            {id: 1422140, qty: 1, tip: ""},//法弗纳
            {id: 4021009, qty: 10, tip: ""},
            {id: 4011007, qty: 10, tip: ""},
            {id: 4250801, qty: 5, tip: ""},
            {id: 4250201, qty: 5, tip: ""},
            {id: 4250601, qty: 5, tip: ""},
            {id: 4251200, qty: 1, tip: ""},
            {id: meso_id, qty: 10000},
            {id: cash_id, qty: 100000},
        ]
    },
    {
        id: 1422158,//漩涡
        tipType: 2,
        needItems: [
            {id: 1422184, qty: 1, tip: ""},//埃苏
            {id: 4021009, qty: 20, tip: ""},
            {id: 4011007, qty: 20, tip: ""},
            {id: 4250802, qty: 1, tip: ""},
            {id: 4250202, qty: 1, tip: ""},
            {id: 4250602, qty: 1, tip: ""},
            {id: 4251201, qty: 1, tip: ""},
            {id: meso_id, qty: 30000},
            {id: cash_id, qty: 150000},
        ]
    },
    {
        id: 1422189,//神秘之影
        tipType: 0,
        needItems: [
            {id: 1422158, qty: 1, tip: ""},//漩涡
            {id: 4250802, qty: 1, tip: ""},
            {id: 4251102, qty: 1, tip: ""},
            {id: 4250902, qty: 1, tip: ""},
            {id: 4251402, qty: 1, tip: ""},
            {id: 4251002, qty: 1, tip: ""},
            {id: 4250302, qty: 1, tip: ""},
            {id: 4250402, qty: 1, tip: ""},
            {id: 4250202, qty: 1, tip: ""},
            {id: 4250502, qty: 1, tip: ""},
            {id: 4250702, qty: 1, tip: ""},
            {id: 4250102, qty: 1, tip: ""},
            {id: 4250602, qty: 1, tip: ""},
            {id: 4250002, qty: 1, tip: ""},
            {id: 4251302, qty: 1, tip: ""},
            {id: 4251202, qty: 1, tip: ""},
            {id: meso_id, qty: 50000},
            {id: cash_id, qty: 200000},
        ]
    },
];

// 14. 长枪
var 长枪 = [
    {
        id: 1432167,//法弗纳
        tipType: 1,
        needItems: [
            {id: 1432049, qty: 1, tip: ""},
            {id: 1432047, qty: 1, tip: ""},
            {id: 1432197, qty: 1, tip: ""},
            {id: 4001094, qty: 10, tip: ""},
            {id: meso_id, qty: 5000},
            {id: cash_id, qty: 50000},
        ]
    },
    {
        id: 1432214,//埃苏
        tipType: 1,
        needItems: [
            {id: 1432167, qty: 1, tip: ""},//法弗纳
            {id: 4021009, qty: 10, tip: ""},
            {id: 4011007, qty: 10, tip: ""},
            {id: 4250801, qty: 5, tip: ""},
            {id: 4250201, qty: 5, tip: ""},
            {id: 4250601, qty: 5, tip: ""},
            {id: 4251200, qty: 1, tip: ""},
            {id: meso_id, qty: 10000},
            {id: cash_id, qty: 100000},
        ]
    },
    {
        id: 1432187,//漩涡
        tipType: 2,
        needItems: [
            {id: 1432214, qty: 1, tip: ""},//埃苏
            {id: 4021009, qty: 20, tip: ""},
            {id: 4011007, qty: 20, tip: ""},
            {id: 4250802, qty: 1, tip: ""},
            {id: 4250202, qty: 1, tip: ""},
            {id: 4250602, qty: 1, tip: ""},
            {id: 4251201, qty: 1, tip: ""},
            {id: meso_id, qty: 30000},
            {id: cash_id, qty: 150000},
        ]
    },
    {
        id: 1432218,//神秘之影
        tipType: 0,
        needItems: [
            {id: 1432187, qty: 1, tip: ""},//漩涡
            {id: 4250802, qty: 1, tip: ""},
            {id: 4251102, qty: 1, tip: ""},
            {id: 4250902, qty: 1, tip: ""},
            {id: 4251402, qty: 1, tip: ""},
            {id: 4251002, qty: 1, tip: ""},
            {id: 4250302, qty: 1, tip: ""},
            {id: 4250402, qty: 1, tip: ""},
            {id: 4250202, qty: 1, tip: ""},
            {id: 4250502, qty: 1, tip: ""},
            {id: 4250702, qty: 1, tip: ""},
            {id: 4250102, qty: 1, tip: ""},
            {id: 4250602, qty: 1, tip: ""},
            {id: 4250002, qty: 1, tip: ""},
            {id: 4251302, qty: 1, tip: ""},
            {id: 4251202, qty: 1, tip: ""},
            {id: meso_id, qty: 50000},
            {id: cash_id, qty: 200000},
        ]
    },
];

// 15. 矛
var 矛 = [
    {
        id: 1442223,//法弗纳
        tipType: 1,
        needItems: [
            {id: 1442067, qty: 1, tip: ""},
            {id: 1442063, qty: 1, tip: ""},
            {id: 1442251, qty: 1, tip: ""},
            {id: 4001094, qty: 10, tip: ""},
            {id: meso_id, qty: 5000},
            {id: cash_id, qty: 50000},
        ]
    },
    {
        id: 1442268,//埃苏
        tipType: 1,
        needItems: [
            {id: 1442223, qty: 1, tip: ""},//法弗纳
            {id: 4021009, qty: 10, tip: ""},
            {id: 4011007, qty: 10, tip: ""},
            {id: 4250801, qty: 5, tip: ""},
            {id: 4250201, qty: 5, tip: ""},
            {id: 4250601, qty: 5, tip: ""},
            {id: 4251200, qty: 1, tip: ""},
            {id: meso_id, qty: 10000},
            {id: cash_id, qty: 100000},
        ]
    },
    {
        id: 1442242,//漩涡
        tipType: 2,
        needItems: [
            {id: 1442268, qty: 1, tip: ""},//埃苏
            {id: 4021009, qty: 20, tip: ""},
            {id: 4011007, qty: 20, tip: ""},
            {id: 4250802, qty: 1, tip: ""},
            {id: 4250202, qty: 1, tip: ""},
            {id: 4250602, qty: 1, tip: ""},
            {id: 4251201, qty: 1, tip: ""},
            {id: meso_id, qty: 30000},
            {id: cash_id, qty: 150000},
        ]
    },
    {
        id: 1442274,//神秘之影
        tipType: 0,
        needItems: [
            {id: 1442242, qty: 1, tip: ""},//漩涡
            {id: 4250802, qty: 1, tip: ""},
            {id: 4251102, qty: 1, tip: ""},
            {id: 4250902, qty: 1, tip: ""},
            {id: 4251402, qty: 1, tip: ""},
            {id: 4251002, qty: 1, tip: ""},
            {id: 4250302, qty: 1, tip: ""},
            {id: 4250402, qty: 1, tip: ""},
            {id: 4250202, qty: 1, tip: ""},
            {id: 4250502, qty: 1, tip: ""},
            {id: 4250702, qty: 1, tip: ""},
            {id: 4250102, qty: 1, tip: ""},
            {id: 4250602, qty: 1, tip: ""},
            {id: 4250002, qty: 1, tip: ""},
            {id: 4251302, qty: 1, tip: ""},
            {id: 4251202, qty: 1, tip: ""},
            {id: meso_id, qty: 50000},
            {id: cash_id, qty: 200000},
        ]
    },
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
        text += "#b#L1#拳套#l\t\r\n\r\n";
        text += "#b#L2#短刀#l\t\r\n\r\n";
        text += "#b#L3#长杖#l\t\r\n\r\n";
        text += "#b#L4#弓#l\t\r\n\r\n";
        text += "#b#L5#弩#l\t\r\n\r\n";
        text += "#b#L6#爪子#l\t\r\n\r\n";
        text += "#b#L7#短枪#l\t\r\n\r\n";
        text += "#b#L8#双手剑#l\t\r\n\r\n";
        text += "#b#L9#单手剑#l\t\r\n\r\n";
        text += "#b#L10#双手斧#l\t\r\n\r\n";
        text += "#b#L11#单手斧#l\t\r\n\r\n";
        text += "#b#L12#单手锤子#l\t\r\n\r\n";
        text += "#b#L13#双手锤子#l\t\r\n\r\n";
        text += "#b#L14#长枪#l\t\r\n\r\n";
        text += "#b#L15#矛#l\t\r\n\r\n";
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
            展示物品制作列表(拳套);
            break;
        case 2:
            展示物品制作列表(短刀);
            break;
        case 3:
            展示物品制作列表(长杖);
            break;
        case 4:
            展示物品制作列表(弓);
            break;
        case 5:
            展示物品制作列表(弩);
            break;
        case 6:
            展示物品制作列表(爪子);
            break;
        case 7:
            展示物品制作列表(短枪);
            break;
        case 8:
            展示物品制作列表(双手剑);
            break;
        case 9:
            展示物品制作列表(单手剑);
            break;
        case 10:
            展示物品制作列表(双手斧);
            break;
        case 11:
            展示物品制作列表(单手斧);
            break;
        case 12:
            展示物品制作列表(单手锤子);
            break;
        case 13:
            展示物品制作列表(双手锤子);
            break;
        case 14:
            展示物品制作列表(长枪);
            break;
        case 15:
            展示物品制作列表(矛);
            break;
        default:
            cm.sendOk("#b瞎么？没看到上面上写的还未实现，你就等吧！");
            cm.dispose();
    }
}


function 展示物品制作列表(武器) {
    选择的制作列表 = 武器;
    //展示物品
    let text = OldTitle + "\r\n请选择要制作的物品：\r\n\r\n";
    text += "#r只有法弗纳之后的装备才自动继承材料中的武器星级和洗练属性，武器必须放在第一格#k\r\n";
    选择的制作列表.forEach((item, index) => {
        // 拼接目标物品信息
        text += `#L${index}##b${index === 0 ? "制作" : "升级"}#v${item.id}#  #r#z${item.id}##b（+${额外升级次数[index]}次升级,最高${最高星级数组[index]}星,）#k\r\n`;
        text += "\r\n";
    });
    cm.sendSimple(text);
}


function 确认制作(selectedIndex) {
    const targetItem = 选择的制作列表[selectedIndex];
    制作目标 = targetItem;
    index = selectedIndex;
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
    var player = cm.getPlayer();
    // 检查所需材料
    const lackItems = [];
    let canExchange = true;
    if (!isDebug) {
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
                if (index > 0 && (need.id >= 1300000 && need.id < 1800000)) {
                    材料item = player.getInventory(InventoryType.EQUIP).getItem(1);
                    if (材料item.getItemId() !== need.id) {
                        lackItems.push(`武器材料必须放在第一格`);
                        canExchange = false;
                    }
                } else if (cm.getItemQuantity(need.id) < need.qty) {
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
                player.getCashShop().gainCash(1, -need.qty);
            } else {
                //如果材料是武器，并且是法弗纳之后的材料则，直接获取第一格的装备
                if (index > 0 && (need.id >= 1300000 && need.id < 1800000)) {
                    材料item = player.getInventory(InventoryType.EQUIP).getItem(1);
                } else {
                    cm.gainItem(need.id, -need.qty);
                }
            }
        });
    } else {
        targetItem.needItems.forEach(need => {
            if (index > 0 && (need.id >= 1300000 && need.id < 1800000)) {
                材料item = player.getInventory(InventoryType.EQUIP).getItem(1);
                return;
            }
        });

    }
    // 给予目标物品
    var newItem = cm.gainItem(targetItem.id, 1);
    newItem.setLevelExpand(额外升级次数[index]);
    newItem.setMaxStar(最高星级数组[index]);
    if (材料item) {
        console.info("武器制作，属性替换");
        newItem.replaceData(材料item);
        newItem.setFlag(1);//上锁
        InventoryManipulator.removeFromSlot(player.getClient(), InventoryType.EQUIP, 材料item.getPosition(), 1, false);
        player.forceUpdateItem(newItem); // 强制更新装备状态
    }
    cm.sendOk(`恭喜您,制作 #i${targetItem.id}# #t${targetItem.id}# 成功！`);
    const tipType = targetItem.tipType || 1;
    player.sendBroadcast(tipType, "装备制作", `恭喜玩家${cm.getPlayer().getName()}成功制作出【${cm.getPlayer().getItemName(targetItem.id)}】!`, true);
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

