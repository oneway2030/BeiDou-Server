/**
 * @description 升星脚本
 */
var OldTitle = "\t\t\t\t\t#e#k欢迎来到#r[星级强化]#k系统#n\t\t\t\t\r\n";
var status = -1;
const InventoryType = Java.type('org.gms.client.inventory.InventoryType');
var 金币_icon = "#fUI/UIWindow.img/QuestIcon/7/0#";
var maxStarLevel = 10;//默认最高10星
var meso_id = 9999999;//金币
var cash_id = 9999998;//点卷
var exp_id = 9999997;//经验
var targetItem;
var targetConfig;

var 升星配置 = [
    {
        starLevel: 10, //星级区间
        failCount: 5, //必定失败次数
        successProb: 20,//基础成功率
        addSuccessProb: 1,//失败后增加的成功率
        levelIntervalForProbIncrease: 1,//间隔多少次增加成功率
        maxSuccessProb: 50,//最大成功率
        certainSuccess: 20,//多少次失败后必定成功
        //需要的物品
        needItems: [
            {id: 4260010, qty: 1, tip: ""},
            {id: meso_id, qty: 1000},
            {id: cash_id, qty: 2000},
            {id: exp_id, qty: 1000},
        ]
    },
    {
        starLevel: 20,
        failCount: 8,
        successProb: 10,
        levelIntervalForProbIncrease: 2,
        addSuccessProb: 1,
        maxSuccessProb: 40,
        certainSuccess: 30,
        needItems: [
            {id: 4260010, qty: 10, tip: ""},
            {id: meso_id, qty: 1500},
            {id: cash_id, qty: 3000},
            {id: exp_id, qty: 3000},
        ]
    },
    {
        starLevel: 30,
        failCount: 10,
        successProb: 5,
        levelIntervalForProbIncrease: 3,
        addSuccessProb: 1,
        maxSuccessProb: 30,
        certainSuccess: 40,
        needItems: [
            {id: 4260009, qty: 1, tip: ""},
            {id: meso_id, qty: 2000},
            {id: cash_id, qty: 4000},
            {id: exp_id, qty: 5000},
        ]
    },
    {
        starLevel: 40,
        failCount: 15,
        successProb: 2,
        addSuccessProb: 1,
        levelIntervalForProbIncrease: 3,
        maxSuccessProb: 20,
        certainSuccess: 50,
        needItems: [
            {id: 4260009, qty: 2, tip: ""},
            {id: meso_id, qty: 2500},
            {id: cash_id, qty: 5000},
            {id: exp_id, qty: 7000},
        ]
    },
    {
        starLevel: 50,
        failCount: 25,
        successProb: 1,
        addSuccessProb: 1,
        levelIntervalForProbIncrease: 3,
        maxSuccessProb: 10,
        certainSuccess: 50,
        needItems: [
            {id: 4260009, qty: 3, tip: ""},
            {id: meso_id, qty: 3000},
            {id: cash_id, qty: 6000},
            {id: exp_id, qty: 10000},
        ]
    },
];

var 升级装备白名单 = [
    {
        id: 1113075, //装备id
        maxStarLevel: 10, //最高星际
    },
    {
        id: 1112889, //装备id
        maxStarLevel: 10, //最高星际
    },
    {
        id: 1004637, //装备id
        maxStarLevel: 20, //最高星际
    }
];

function start() {
    action(1, 0, 0)
}

function action(mode, type, selection) {
    console.error("主菜单脚本错误===selection=:" + selection + " status=" + status);
    if (mode === 1) {
        status++;
    } else if (mode === -1) {
        status--;
    } else {
        cm.dispose();
        return;
    }
    if (status === 0) {

        升星确认界面();
    } else if (status === 1) {
        执行升星();
    } else {
        cm.dispose();
    }
}

function 升星确认界面() {
    const player = cm.getPlayer();
    targetItem = player.getInventory(InventoryType.EQUIP).getItem(1);
    let tip;
    if (targetItem == null) {
        tip = "请把装备放在第一格.";
    } else {
        var tempMaxStarLevel = targetItem.getMaxStar();
        var curStarLevel = targetItem.getStarLevel();
        if (tempMaxStarLevel > 0) {
            maxStarLevel = tempMaxStarLevel;
        }
        if (!判断装备是否能升星()) {
            tip = "第一个格装备不符合要求，无法进行星级强化.";
        }
        if (curStarLevel >= maxStarLevel) {
            tip = "该装备已达到最大星级,无法进行星级强化";
        }
    }
    // 构建确认信息
    let confirmText = OldTitle;
    confirmText += "\r\n\r\n";
    if (tip != null) {
        confirmText += "#b#e无法强化提示:#n#r\r\n" + tip;
        confirmText += "\r\n\r\n";
        confirmText += `#b#e星级强化说明：#k#n\r\n`;
        confirmText += `#b1.请将装备放在第一格\r\n`;
        confirmText += `#b2.放心大胆的强化，强化可以转移（暂未上线）\r\n`;
        confirmText += `#b3.武器都可以升星，普通武器最高10星\r\n`;
        confirmText += `#b4.手套都可以升星，普通手套最高10星\r\n`;
        confirmText += `#b5.其他可以强化升星装备列表如下：\r\n`;
        升级装备白名单.forEach((item, index) => {
            // 拼接目标物品信息
            confirmText += `#v${item.id}#  #r#z${item.id}##b（最高${item.maxStarLevel}星）#k\r\n`;
            confirmText += "\r\n";
        });
        cm.sendOk(confirmText);
        cm.dispose();
    } else {
        confirmText += `确定要给 #i${targetItem.getItemId()}# #b#t${targetItem.getItemId()}# 从#r${targetItem.getStarLevel()}星#b升级到#r${targetItem.getStarLevel() + 1}星#b吗？#k\r\n`;
        targetConfig = 获取装备升星对应的配置(targetItem);
        confirmText += `#r1.当前成功率:#b${获取成功率(targetConfig, targetItem)}% \r\n`;
        confirmText += `#r2.失败次数:#b${targetItem.getStarCount()}/${targetConfig.certainSuccess}#r（${targetConfig.certainSuccess}次后必定成功)\r\n`;
        confirmText += `#r3.每#b${targetConfig.levelIntervalForProbIncrease}#r次失败增加${targetConfig.addSuccessProb}%成功率，当前星级最高成功率 ${targetConfig.maxSuccessProb}%\r\n`;
        confirmText += `#r4.升星后可以转移到同类型装备上\r\n`;
        confirmText += `#r5.强化后装备会上锁，无法进行交易\r\n`;
        confirmText += `#r6.10星以内全是属性+1，20星以内全属性+2，30星以内全属性+3，40星以内全属性+4，50星以内全属性+5\r\n`;
        confirmText += `\r\n`;
        confirmText += `#b所需材料：#k\r\n\r\n`;
        targetConfig.needItems.forEach(need => {
            if (need.id === meso_id) {
                confirmText += `\r\n${金币_icon} x ${获取金币显示(need.qty)}\r\n`; // 使用金币图标
            } else if (need.id === cash_id) {
                confirmText += `#b点券 x #k ${need.qty}\r\n`; // 使用点券相关图标
            } else if (need.id === exp_id) {
                confirmText += `#b经验 x #k ${need.qty}W\r\n`; // 经验
            } else {
                // 仅当need.tip存在且不为空时才拼接提示部分
                const tipText = need.tip ? `\t#b${need.tip}#k` : '';
                confirmText += `#i${need.id}# #t${need.id}# x ${need.qty}${tipText}\r\n`;
            }
        });
        cm.sendYesNo(confirmText);
    }
}

function 判断装备是否能升星() {
    // 1. 获取目标装备的ID
    let id = targetItem.getItemId();
    //武器都可以强化
    if (id >= 1300000 && id < 1800000) {
        return true;
    }
    //手套都可以强化
    if (id >= 1080000 && id < 1090000) {
        return true;
    }
    //装备是否在「升级装备白名单」中
    return 升级装备白名单.find(equip => equip.id === id);
}

function 判断是否有需要物品() {
    // 检查所需材料
    const lackItems = [];
    let canExchange = true;
    targetConfig.needItems.forEach(need => {
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
        } else if (need.id === exp_id) {
            // 补充：检查经验是否满足
            const player = cm.getPlayer();
            const currentExp = player.getExp(); // 获取玩家当前经验值
            const needExp = 获取经验(need.qty); // 需要扣除的经验值

            if (currentExp < needExp) {
                lackItems.push(`经验值（缺少：${needExp - currentExp}）`);
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
        return false;
    }
    return true;
}

function 扣除物品() {
    // 扣除所需材料（补充经验扣除逻辑）
    targetConfig.needItems.forEach(need => {
        if (need.id === meso_id) {
            cm.gainMeso(-获取金币(need.qty));
        } else if (need.id === cash_id) {
            cm.getPlayer().getCashShop().gainCash(1, -need.qty);
        } else if (need.id === exp_id) {
            // 补充：扣除经验（确保扣除后经验不小于0）
            const player = cm.getPlayer();
            const currentExp = player.getExp();
            const deductExp = Math.min(获取经验(need.qty), currentExp); // 避免扣除后经验为负
            player.message(`经验减少 (-${deductExp})`)
            player.reduceExp(-deductExp); // 扣除经验
        } else {
            cm.gainItem(need.id, -need.qty);
        }
    });
}

function 执行升星() {
    if (!判断是否有需要物品()) {
        return;
    }
    扣除物品();
    if (升星是否成功(targetItem)) {
        装备加星();
    } else {
        targetItem.setStarCount(targetItem.getStarCount() + 1);//失败次数+1
        targetItem.setFlag(1);//上锁
        cm.getPlayer().forceUpdateItem(targetItem); // 强制更新装备状态
        cm.sendOk("#r失败乃是成功之母，请继续加油！.");
        cm.getPlayer().sendBroadcast(4, "星级强化", `恭喜玩家${cm.getPlayer().getName()}对装备【${cm.getPlayer().getItemName(targetItem.getItemId())}】强化${targetItem.getStarLevel() + 1}★失败，目前已失败${targetItem.getStarCount()}次，大家快来嘲笑他！！`, true);
        cm.dispose();
    }
}

function 获取装备升星对应的配置(item) {
    // 1. 获取当前物品的星级和累计失败次数
    var starLevel = item.getStarLevel();
    // 2. 匹配对应的升星配置项（核心逻辑：找到当前星级所属的档位）
    // 规则：5→10档、15→20档、21→30档... 即找≥当前星级的最小配置档，无则用最高档
    var targetConfig = null;
    for (var config of 升星配置) {
        if (config.starLevel > starLevel) {
            targetConfig = config;
            break;
        }
    }
    // 若当前星级超过所有配置档（如60级），使用最后一个配置
    if (!targetConfig) {
        targetConfig = 升星配置[升星配置.length - 1];
    }
    return targetConfig;
}

function 升星是否成功(item) {
    // 1. 获取当前物品的星级和累计失败次数
    var starCount = item.getStarCount();
    // 若当前星级超过所有配置档（如60级），使用最后一个配置
    if (!targetConfig) {
        targetConfig = 升星配置[升星配置.length - 1];
    }
    if (starCount >= targetConfig.certainSuccess) {
        return true;
    }
    // 3. 校验失败次数：≤failCount 直接失败
    if (starCount <= targetConfig.failCount) {
        return false;
    }
    var realPercent = 获取成功率(targetConfig, item);
    // 5. 随机判定是否成功（生成1~100的随机数，小于成功率则成功）
    return randomByPercent(realPercent)
}

function 获取成功率(targetConfig, item) {
    let failCount = item.getStarCount();
    if (failCount !== 0) {
        failCount = Math.floor(failCount / targetConfig.levelIntervalForProbIncrease);
    }
    let realPercent = targetConfig.successProb + (failCount * targetConfig.addSuccessProb);
    return Math.min(realPercent, targetConfig.maxSuccessProb);
}

function 获取每次增加的成功率(targetConfig, item) {
    var failCount = item.getStarCount();
    return targetConfig.starLevel >= 40 && failCount % 2 === 0 ? (targetConfig.addSuccessProb || 0) : 0;
}

/**
 *
 * 传入1-99%成功率
 */
function randomByPercent(successPercent) {
    if (successPercent === 0) return false;
    if (successPercent === 100) return true;
    const randomNum = Math.floor(Math.random() * 100);
    return randomNum < successPercent;
}

function 获取装备的最大星级() {
    //  获取临时最大星级和装备ID
    var maxStarLevel = targetItem.getMaxStar();
    let id = targetItem.getItemId();
    if (maxStarLevel > 0) {
        return maxStarLevel;
    }
    // 查找白名单中ID匹配的装备项
    var 匹配的装备 = 升级装备白名单.find(equip => equip.id === id);
    // 有匹配项则返回白名单中的maxStarLevel，无则返回默认值10
    return 匹配的装备 ? 匹配的装备.maxStarLevel : 10;
}

function 装备加星() {
    const player = cm.getPlayer();
    var targetItem = player.getInventory(InventoryType.EQUIP).getItem(1);
    if (targetItem == null) {
        cm.sendOk("第一格没有装备.");
        cm.dispose();
        return;
    }
    var tempMaxStarLevel = 获取装备的最大星级();
    var curStarCount = targetItem.getStarLevel();
    if (tempMaxStarLevel > 0) {
        maxStarLevel = tempMaxStarLevel;
    }
    if (curStarCount >= maxStarLevel) {
        cm.sendOk("无法继续强化，已达到该装备最大星级.");
        cm.dispose();
        return;
    }
    var sx0 = targetItem.getStr();//获取装备当前力量0
    var sx1 = targetItem.getDex();//获取装备当前敏捷1
    var sx2 = targetItem.getInt();//获取装备当前智力2
    var sx3 = targetItem.getLuk();//获取装备当前运气3
    var sx4 = targetItem.getHp();//获取装备当前HP4
    var sx5 = targetItem.getMp();//获取装备当前MP5
    var sx6 = targetItem.getWatk();//获取装备当前物攻6
    var sx7 = targetItem.getMatk();//获取装备当前魔攻7
    var sx8 = targetItem.getWdef();//获取装备当前物防8
    var sx9 = targetItem.getMdef();//获取装备当前魔防9
    var sx10 = targetItem.getAcc();//获取装备当前命中10
    var sx11 = targetItem.getAvoid();//获取装备当前回避11
    var sx12 = targetItem.getHands();//获取装备当前手技120
    var sx13 = targetItem.getSpeed();//获取装备当前移动速度13
    var sx14 = targetItem.getJump();//获取装备当前跳跃力14
    let newLevel = curStarCount + 1;
    var oldStarCount = targetItem.getStarCount();
    let 新增属性 = 获取新增属性(newLevel);
    targetItem.setFlag(1);//上锁
    //新增属性
    targetItem.addStarAttributeToAllValidStats(新增属性)
    targetItem.setStarLevel(newLevel);//星级
    targetItem.setStarCount(0);//失败次数
    // targetItem.setOwner(`${newLevel}星`);
    targetItem.setOwner(`${newLevel}★`);
    player.forceUpdateItem(targetItem); // 强制更新装备状态
    cm.sendOk(`#b恭喜你走了狗屎运，居然升星成功了，装备强化到${newLevel}★！`);
    let tip = `恭喜玩家${cm.getPlayer().getName()}走了狗屎运，${oldStarCount}次强化就对装备【${cm.getPlayer().getItemName(targetItem.getItemId())}】升星到了${newLevel}★!`;
    cm.getPlayer().sendBroadcast(2, "星级强化", tip, true);
    cm.getPlayer().sendBroadcast(0, "星级强化", tip, true);
    cm.dispose();
}

function 获取新增属性(curCount) {
    let 新增属性 = 1;
    if (curCount > 10 && curCount <= 20) {
        新增属性 = 2
    } else if (curCount > 20 && curCount <= 30) {
        新增属性 = 3
    } else if (curCount > 30 && curCount <= 40) {
        新增属性 = 4
    } else if (curCount > 40 && curCount <= 50) {
        新增属性 = 5
    }
    return 新增属性;
}

function 获取金币(meso) {
    return meso * 10000;
}

function 获取经验(exp) {
    return exp * 10000;
}

function 获取金币显示(meso) {
    if (meso >= 10000) {
        return `${meso / 10000}E\r\n`;
    } else {
        return `${meso}W\r\n`;
    }
}






