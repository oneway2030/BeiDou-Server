/**
 * @description 拍卖行中心脚本
 */
var DAILY_CHECK_IN_TOTAL = "累计签到次数"
var status = -1;
var i = 0;
// var icon="#fMap/MapHelper/minimap/arrowright#";
var icon = "#fUI/UIWindow.img/Quest/icon8/0#";

function start() {
    try {
        action(1, 0, 0)
    } catch (e) {
        cm.dispose();
    }
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
    if (status === 0) {
        var OldTitle = "\t\t\t\t\t#e#k欢迎大佬 #r[" + cm.getPlayer().getName() + "] #k您的到来#n\t\t\t\t\r\n";
        // var OldTitle = "\t\t\t\t\t#e欢迎来到#rBeiDou#k脚本中心#n\t\t\t\t\r\n";
        let text = OldTitle;
        text += " \r\n";
        text += "#k当前点券：#r" + cm.getPlayer().getCashShop().getCash(1) + "        #k签到天数:#r" + Number(cm.getCharacterExtendValue(DAILY_CHECK_IN_TOTAL));
        const GameConfig = Java.type('org.gms.config.GameConfig');
        if (GameConfig.getServerBoolean("use_rebirth_system")) {
            text += "        #k转生次数:#r" + cm.getChar().getReborns() + " \r\n";
        }
        text += "\r\n";
        text += "\t\t\t\t\t#L0 ##b自由市场#n#l\t\t #L17#新人福利#n#l\r\n";
        text += " \r\n";
        text += "#L1#" + icon + "#r万能传送#l\t#L2#随身仓库#l\t#L3#便利商店#l\t#L4#一键出售#l\r\n";
        text += " \r\n";
        text += "#b#L5#" + icon + "每日签到#l\t#L6#在线奖励#l\t#L7#任务大厅#l\t #L8#各种兑换#l\r\n";
        text += " \r\n";
        text += "#L9#" + icon + "职业中心#l\t#L10#技能中心#l\t#L11#装备中心#l\t#L12#时装暖暖#l\r\n";
        text += " \r\n";
        text += "#L13#" + icon + "额外仓库#l\t#L14#删除道具#l\t#L15#查询掉落#l\t#L16#其他功能#l\r\n";
        text += " \r\n";
        if (cm.getPlayer().isGM()) {
            text += "\r\n";
            text += "\t\t\t\t#r=====以下内容仅GM可见=====\r\n";
            text += "#L100#巡逻#l\t\r\n\r\n";
            text += "#L101#UI查询#l\t#L102#GM商店集合#l\r\n";
            text += "#L103#一键删除道具#l\t#L104#一键刷道具#l\r\n";
            text += "#L105#有状态脚本示例#l\t #L106#NextLevel脚本示例#l";
        }
        cm.sendSimple(text);
    } else if (status === 1) {
        doSelect(selection);
    } else {
        cm.dispose();
    }
}


function doSelect(selection) {
    switch (selection) {
        // 脚本移植注意编码改为UTF-8
        case 0://去自由
            cm.getPlayer().saveLocationOnWarp();
            cm.warp(910000000);
            cm.dispose();
            break;
        case 1://万能传送
            openNpc("万能传送");
            break;
        case 2://随身仓库
            openNpc("随身仓库");
            break;
        case 3://便利商店
            cm.openShopNPC(9201099); //便利商店
            cm.dispose();
            break;
        case 4://一键出售
            openNpc("一键出售");
            break;
        case 5://每日签到
            openNpc("每日签到");
            break;
        case 6://在线奖励
            openNpc("在线奖励");
            break;
        case 7://任务大厅
            openNpc("任务大厅");
            break;
        case 8://各种兑换
            openNpc("各种兑换");
            break;
        case 9://职业中心
            openNpc("职业相关");
            break;
        case 10://技能中心
            openNpc("技能中心");
            break;
        case 11://装备中心
            openNpc("装备中心");
            break;
        case 12://时装暖暖#
            openNpc("时装暖暖");
            break;
        case 13://额外仓库
            openNpc("物品仓库系统");
            break;
        case 14://删除道具
            openNpc("删除道具");
            break;
        case 15://查询掉落
            openNpc("查询掉落");
            break;
        case 16://其他功能
            openNpc("其他功能");
            break;
        case 17://新人福利
            openNpc("新人福利");
            break;
        // GM功能
        case 100://巡逻
            openNpc("巡逻");
            break;
        case 101:
            openNpc("UI查询");
            break;
        case 102:
            openNpc("GM商店");
            break;
        case 103:
            openNpc("一键删除道具");
            break;
        case 104:
            openNpc("一键刷道具");
            break;
        case 105:
            openNpc("Example1")
            break;
        case 106:
            openNpc("Example2")
            break;
        case 1000:
            // openNpc("砸卷次数");
            // openNpc("音乐点播");
            // openNpc("战力系统");
            break;
        default:
            cm.sendOk("该功能暂不支持，敬请期待！");
            cm.dispose();
    }
}

function openNpc(scriptName) {
    cm.dispose();
    cm.openNpc(9900001, scriptName);
}