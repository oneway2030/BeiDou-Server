/*
    This file is part of the HeavenMS MapleStory Server
    Copyleft (L) 2016 - 2019 RonanLana

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
/* Jack - Refining NPC
	@author ronancpl (Ronan)
 */

var status = 0;
var selectedType = -1;
var selectedItem = -1;
var item;
var mats;
var matQty;
var cost;
var qty;
var equip;
var last_use; //last item is a use item

function start() {
    cm.getPlayer().setCS(true);
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == 1) {
        status++;
    } else {
        cm.sendOk("好的，再见。");
        cm.dispose();
        return;
    }

    if (status == 0) {
        var selStr = "嘿，你知道绯红要塞现在正在进行的远征活动吗？这可是个提升自己的绝佳机会，你可以在那里快速积累经验和战利品。";
        cm.sendNext(selStr);
    } else if (status == 1) {
        var selStr = "话虽如此，我认为使用一些强力的实用药水可能会在前线产生一些优势，我的意思是开始制作#b#t2022284##k来帮助这一努力。那么，言归正传，我目前正在追求#r大量#k的这些物品：#r#t4032010##k、#r#t4032011##k、#r#t4032012##k，以及一些资金来支持这一事业。你想要一些这些增强剂吗";
        cm.sendYesNo(selStr);
    } else if (status == 2) {
        //selectedItem = selection;
        selectedItem = 0;

        var itemSet = [2022284, 7777777];
        var matSet = new Array([4032010, 4032011, 4032012]);
        var matQtySet = new Array([60, 60, 45]);
        var costSet = [75000, 7777777];
        item = itemSet[selectedItem];
        mats = matSet[selectedItem];
        matQty = matQtySet[selectedItem];
        cost = costSet[selectedItem];

        var prompt = "好的，我会制作一些#t" + item + "#，那么，你想要我制作多少个呢？";
        cm.sendGetNumber(prompt, 1, 1, 100)
    } else if (status == 3) {
        qty = (selection > 0) ? selection : (selection < 0 ? -selection : 1);
        last_use = false;

        var prompt = "你想我为你制作";
        if (qty == 1) {
            prompt += "一个#t" + item + "#?";
        } else {
            prompt += qty + "个#t" + item + "#?";
        }

        prompt += "这样的话，我需要你提供一些特定物品才能制作。另外请确保你的背包有足够的空间！#b";

        if (mats instanceof Array) {
            for (var i = 0; i < mats.length; i++) {
                prompt += "\r\n#i" + mats[i] + "# " + matQty[i] * qty + " #t" + mats[i] + "#";
            }
        } else {
            prompt += "\r\n#i" + mats + "# " + matQty * qty + " #t" + mats + "#";
        }

        if (cost > 0) {
            prompt += "\r\n#i4031138# " + cost * qty + " meso";
        }
        cm.sendYesNo(prompt);
    } else if (status == 4) {
        var complete = true;

        if (cm.getMeso() < cost * qty) {
            cm.sendOk("嗯，我确实说过我需要一些资金来制作它，不是吗？");
        } else if (!cm.canHold(item, qty)) {
            cm.sendOk("你在制作之前没有检查你的背包是否有空余的栏位，对吗？");
        } else {
            if (mats instanceof Array) {
                for (var i = 0; complete && i < mats.length; i++) {
                    if (matQty[i] * qty == 1) {
                        complete = cm.haveItem(mats[i]);
                    } else {
                        complete = cm.haveItem(mats[i], matQty[i] * qty);
                    }
                }
            } else {
                complete = cm.haveItem(mats, matQty * qty);
            }

            if (!complete) {
                cm.sendOk("您的背包中资源不足。请再次检查。");
            } else {
                if (mats instanceof Array) {
                    for (var i = 0; i < mats.length; i++) {
                        cm.gainItem(mats[i], -matQty[i] * qty);
                    }
                } else {
                    cm.gainItem(mats, -matQty * qty);
                }
                cm.gainMeso(-cost * qty);
                cm.gainItem(item, qty);
                cm.sendOk("就是这样！谢谢你的合作。");
            }
        }
        cm.dispose();
    }
}