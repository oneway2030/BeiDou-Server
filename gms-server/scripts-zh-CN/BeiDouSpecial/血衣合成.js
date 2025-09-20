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
	VIP Cab - Victoria Road : Lith Harbor (104000000)
-- By ---------------------------------------------------------------------------------------------
	Xterminator
-- Version Info -----------------------------------------------------------------------------------
	1.0 - First Version by Xterminator
---------------------------------------------------------------------------------------------------
**/


var itemSet = new Array
(1012187,                                                               //（血衣代码）
1012188,  
1012189,  
1012190,  
1012191
);


var matSet = new Array
(new Array(4021000,4021006,4021002,4021004), //（材料代码）
new Array(4000313,4021000,4021006,4021002,4021004,1012187),
new Array(4000313,4021008,4021001,4021003,4021005,4021007,1012188),
new Array(4000313,4011007,4005000,4005001,4005002,4005003,1012189),
new Array(4000313,4000152,4000151,4005004,4011007,4021009,1012190)
);

var matQtySet = new Array
(new Array(1,1,1,1),                                            //（材料个数）
new Array(50,4,4,4,4,1),
new Array(100,5,5,5,5,5,1),
new Array(200,5,5,5,5,5,1),
new Array(300,50,50,20,5,5,1)
);

var costSet = new Array
(500000,                                                            //（需要金币）
5000000,
10000000,
20000000,
30000000
);

var status = 0;
var selectedItem;
var item;
var req;
var cost;


function start() {
    action(1, 0, 0);
}

function action(mode, type, selection) {
    status++;
    if (mode == -1){
        cm.dispose();
        return;
    } else if (mode == 0) {
        // cm.sendOk("欢迎下次再来!.");
    	cm.dispose();
    	return;
    }
    if (status == 1) {
            var add ="选择你要的装备\r\n";
                for (var i = 0; i < itemSet.length; i++) {	
                    add += "\r\n#L" + i + "##v " + itemSet[i] + "##z";
                    add += itemSet[i]+"#\r\n";
                };

            cm.sendSimple(add,2);
    } else if (status == 2) {

            selectedItem = selection;

            item = itemSet[selectedItem];
            mats = matSet[selectedItem];
            matQty = matQtySet[selectedItem];
            cost = costSet[selectedItem];

            var bdd ="你想要     ";
            bdd += "#i" +item+"# "+ " #z" + item + "#";
            bdd += "\r\n 你需要 :\r\n";

        if (mats instanceof Array){
            for(var i = 0; i < mats.length; i++){
                bdd += "\r\n#i"+mats[i]+"# " + matQty[i] + "个 #t" + mats[i] + "#";
            }
        } else {
            bdd += "\r\n#i"+mats+"# " + matQty + "个 #t" + mats + "#";
        }
        if (cost > 0)
            bdd += "\r\n#i4031138# " + cost + " 金币";

            cm.sendYesNo(bdd);
    } else if (status == 3) {
            var complete = true;

        if(!cm.canHold(item, 1)) {
            cm.sendOk("检查背包.");
            cm.dispose();
            return;
        }
        else if (cm.getMeso() < cost) {
                        complete = false;
                        cm.sendOk("#b 金币不足.");
	        cm.dispose();
                        return;
        } else {
	if (mats instanceof Array) {
                        for(var i = 0; complete && i < mats.length; i++)
                              if (!cm.haveItem(mats[i], matQty[i]))
                              complete = false;
	}
                else if (!cm.haveItem(mats, matQty))
                complete = false;
        }

        if (!complete) {
                cm.sendOk("物品不对.");
        } else {
                if (mats instanceof Array) {
                       for (var i = 0; i < mats.length; i++){
                             cm.gainItem(mats[i], -matQty[i]);
	       }
                } else {
                        cm.gainItem(mats, -matQty);
	}
                cm.gainMeso(-cost);
            	cm.gainItem(item);
                cm.sendOk("#b 制作完成，祝贺你");
	cm.dispose();
           }
            cm.dispose();
    }
}