/*
	This file is part of the OdinMS Maple Story Server
    Copyright (C) 2008 Patrick Huy <patrick.huy@frz.cc>
		       Matthias Butz <matze@odinms.de>
		       Jan Christian Meyer <vimes@odinms.de>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation version 3 as published by
    the Free Software Foundation. You may not use, modify or distribute
    this program under any other version of the GNU Affero General Public
    License.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
/**
 -- Odin JavaScript --------------------------------------------------------------------------------
 Alcaster - El Nath Market (211000100)
 -- By ---------------------------------------------------------------------------------------------
 Unknown & Information & xQuasar
 -- Version Info -----------------------------------------------------------------------------------
 1.3 - Fixed up completely [xQuasar]
 1.2 - Add a missing text part [Information]
 1.1 - Recoded to official [Information]
 1.0 - First Version by Unknown
 ---------------------------------------------------------------------------------------------------
 **/

var selected;
var amount;
var totalcost;
var item = [2050003, 2050004, 4006000, 4006001];
var cost = [300, 400, 5000, 5000];
var msg = ["治愈被封印和诅咒的状态","解除全部异常状态","高级魔法","高级技能所需"];
var status;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (!cm.isQuestCompleted(3035)) {
        cm.sendNext("如果你决定帮助我，那么作为回报，我会让这件物品可以出售。");
        cm.dispose();
        return;
    }
    if (mode == 0 && status == 2) {
        cm.sendNext("我明白了。知道我这里有很多不同的物品。随便看看吧。我只卖这些物品给你，所以不会以任何方式欺骗你。");
        cm.dispose();
        return;
    }
    if (mode < 1) {
        cm.dispose();
        return;
    }

    status++;
    if (status == 0) {
        var selStr = "";
        for (var i = 0; i < item.length; i++) {
            selStr += "\r\n#L" + i + "# #b#t" + item[i] + "# (Price: " + cost[i] + " mesos)#k#l";
        }
        cm.sendSimple("多亏了你，#b#t4031056##k 已经安全封印了。当然，作为结果，我用掉了我在过去大约800年中积累的一半能量...但现在我可以安心地死去了。哦，顺便问一下... 你是不是在寻找稀有物品？作为对你辛勤工作的感激，我会向你出售一些我拥有的物品，而且只有你可以购买。挑选出你想要的吧！" + selStr);
    } else if (status == 1) {
        selected = selection;
        cm.sendGetNumber("#b#t" + item[selected] + "##k就是你需要的东西吗?这是"+msg[selected]+". 这可能不是最容易得到的东西，但我会给你.每个将会花费你 #b"+cost[selected]+"金币#k.你想要多少?", 0, 1, 100);
    } else if (status == 2) {
        amount = selection;
        totalcost = cost[selected] * amount;
        if (amount == 0) {
            cm.sendOk("如果你不打算买任何东西，那我也没有东西可以卖给你。");
            cm.dispose();
        }
        cm.sendYesNo("想买#r"+amount+"个#t"+item[selected]+"##k? 费用是"+cost[selected]+"金币#t"+item[selected]+"#/个,总共是#r"+totalcost+"金币#k。");
    } else if (status == 3) {
        if (cm.getMeso() < totalcost || !cm.canHold(item[selected])) {
            cm.sendNext("你确定你有足够的金币吗？请检查一下你的杂项或使用的物品栏是否已满，或者你至少有 #r" + totalcost + "#k 金币。");
            cm.dispose();
        }
        cm.sendNext("谢谢你。如果你将来需要物品的话，记得来这里找我。虽然我年纪大了，但我仍然可以轻松制作魔法物品。");
        cm.gainMeso(-totalcost);
        cm.gainItem(item[selected], amount);
        cm.dispose();
    }
}