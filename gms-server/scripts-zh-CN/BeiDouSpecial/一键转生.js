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
/* NPC Base
	Map Name (Map ID)
	Extra NPC info.
 */

var cost;
var ptcost = 1;  //普通职业转生消耗枫叶
var qscost = 1; //骑士团转生消耗枫叶
//消耗的金币，单位W
var meso = 1;

var relevel;
var relevela = 250;  //普通职业转生等级
var relevelb = 250; //骑士团转生等级
var text
//重生后的等级，由服务器字段控制 rebirth_level
var rebirthLevel = 1;
//重生后是否可以选择职业
var is_change_job = false;
//重生次数
var reborns;
//转生后的职业id, -1代表职业不变
var jobId = 0;

var 职业 = Array(Array("战士", 100, 10, 0), //	Array("战士", 100, 30, 100),
//	Array("战士", 100, 70, 110),
//	Array("战士", 100, 120, 111),
//	Array("战士", 100, 200, 112),
//	Array("战士", 100, 70, 120),
//	Array("战士", 100, 120, 121),
//	Array("战士", 100, 200, 122),
//	Array("战士", 100, 70, 130),
//	Array("战士", 100, 120, 131),
//	Array("战士", 100, 200, 132),
    Array("魔法师", 200, 8, 0), //	Array("魔法师", 200, 30, 200),
//	Array("魔法师", 200, 70, 210),
//	Array("魔法师", 200, 120, 211),
//	Array("魔法师", 200, 200, 212),
//	Array("魔法师", 200, 70, 220),
//	Array("魔法师", 200, 120, 221),
//	Array("魔法师", 200, 200, 222),
//	Array("魔法师", 200, 70, 230),
//	Array("魔法师", 200, 120, 231),
//	Array("魔法师", 200, 200, 232),
    Array("弓箭手", 300, 10, 0), //	Array("弓箭手", 300, 30, 300),
//	Array("弓箭手", 300, 70, 310),
//	Array("弓箭手", 300, 120, 311),
//	Array("弓箭手", 300, 200, 312),
//	Array("弓箭手", 300, 70, 320),
//	Array("弓箭手", 300, 120, 321),
//	Array("弓箭手", 300, 200, 322),
    Array("飞侠", 400, 10, 0), //	Array("飞侠", 400, 30, 400),
//	Array("飞侠", 400, 70, 410),
//	Array("飞侠", 400, 120, 411),
//	Array("飞侠", 400, 200, 412),
//	Array("飞侠", 400, 70, 420),
//	Array("飞侠", 400, 120, 421),
//	Array("飞侠", 400, 200, 422),
    Array("海盗", 500, 10, 0), //	Array("海盗", 500, 30, 500),
//	Array("海盗", 500, 70, 510),
//	Array("海盗", 500, 120, 511),
//	Array("海盗", 500, 200, 512),12
//	Array("海盗", 500, 70, 520),
//	Array("海盗", 500, 120, 521),
//	Array("海盗", 500, 200, 522),
    Array("魂骑士", 1100, 10, 1000), //	Array("魂骑士", 1100, 30, 1100),
//	Array("魂骑士", 1100, 70, 1110),
//	Array("魂骑士", 1100, 120, 1111),
    Array("炎术士", 1200, 10, 1000), //	Array("炎术士", 1200, 30, 1200),
//	Array("炎术士", 1200, 70, 1210),
//	Array("炎术士", 1200, 120, 1211),
    Array("风灵使者", 1300, 10, 1000), //	Array("风灵使者", 1300, 30, 1300),
//	Array("风灵使者", 1300, 70, 1310),
//	Array("风灵使者", 1300, 120, 1311),
    Array("夜行者", 1400, 10, 1000), //	Array("夜行者", 1400, 30, 1400),
//	Array("夜行者", 1400, 70, 1410),
//	Array("夜行者", 1400, 120, 1411),
    Array("奇袭者", 1500, 10, 1000), //	Array("奇袭者", 1500, 30, 1500),
//	Array("奇袭者", 1500, 70, 1510),
//	Array("奇袭者", 1500, 120, 1511),
//	Array("战神", 2100, 10, 2000),
//	Array("战神", 2100, 30, 2100),
//	Array("战神", 2100, 70, 2110),
//	Array("战神", 2100, 120, 2111));
    Array("战神", 2100, 10, 2000));


function start() {
    cost = ptcost;    //默认是普通职业
    relevel = relevela;
    if (Math.floor(cm.getJobId() / 1000) == 1) {  //判断为骑士团职业
        cost = qscost;
        relevel = relevelb;
    }

    const GameConfig = Java.type('org.gms.config.GameConfig');
    let baseRebirthLevel = GameConfig.getServerInt("rebirth_level");
    rebirthLevel = Math.max(1, baseRebirthLevel); // 确保最低为1级
    rebirthLevel = Math.min(rebirthLevel, cm.getPlayer().getMaxClassLevel()); // 限制不超过职业最大等级
    reborns = cm.getChar().getReborns();

    var level = cm.getLevel();
    var isCan = level >= relevel && cm.haveItem(4000313, cost) && cm.getMeso() >= meso * 10000;
    text = "#e#k当前已转生#e#r" + reborns + "#k次\r\n";
    text += "#e#k当您达到#e#r" + relevel + "#k级， #v4000313##e#r " + cost + " 个和" + meso + "W金币#k进行转生\r\n";
    if (!is_change_job) {
        text += "#b注意：转生后等级会变为" + rebirthLevel + "级,职业不会改变,\r\n #k如需改变职业请使用#e#r[更换职业]#k功能。\r\n"
    }
    if (isCan) {
        if (is_change_job) {
            text += "\r\n\r\n"
            text += "请从下面选择你要转生的职业，转生后将会从之前的职业变为您现在选择的职业\r\n";
            for (var i = 0; i < 职业.length; i++) {
                if (level >= relevel && cm.haveItem(4000313, cost)) {
                    text += "#L" + 职业[i][1] + "##r" + 职业[i][0] + "#k#l\r\n";
                }
            }
        }
        if (is_change_job) {
            cm.sendNextSelectLevel("SelectEnquire", text);
        } else {
            cm.sendNextLevel("Enquire", text);
        }

    } else {
        text += "\r\n\r\n"
        text += "#e#r您不满足以上转生条件,无法转生"
        // cm.sendOk("我可以让你转生为任意职业，#e#d#r等级变为200级（能力点重置，技能保留）#k#n。\r\n如果你想要转生，需要#r等级" + relevela + "#k级，#r黄金枫叶" + ptcost + "个#k。\r\n注意：如果你是骑士团则需要#r等级" + relevelb + "#k级，#r黄金枫叶" + qscost + "个#k。\r\n");
        cm.sendOk(text);
        cm.dispose();
    }
}

function levelSelectEnquire(id) {
    jobId = parseInt(id);
    cm.sendNextLevel("Rebirth", "#r#e当前已转生" + reborns + "次,转生后将变成" + rebirthLevel + "级确定转生吗？");
}

function levelEnquire() {
    cm.sendNextLevel("Rebirth", "#r#e当前已转生" + reborns + "次,转生后将变成" + rebirthLevel + "级确定转生吗？");
}

function levelRebirth() {
    //重生
    let isClear = jobId ===0
    cm.getPlayer().rebirth(false, false, jobId);
    //重置状态
    cm.resetStats();
    //装备变更广播
    cm.getPlayer().equipChanged();
    cm.gainMeso(-meso * 10000);
    cm.gainItem(4000313, -cost);
    cm.sendOk("#r恭喜你，转生成功！");
    cm.dispose();
}

