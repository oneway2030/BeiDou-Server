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
var ptcost = 1;  //普通职业消耗枫叶
var qscost = 1; //骑士团消耗枫叶

var relevel;
var relevela = 10;  //普通职业更换职业所需等级
var relevelb = 10; //骑士团更换职业所需等级
var status;
var selecta;
var returnLevel = 1;
var 职业 = Array(
    Array("冒险家", 0, 1, 0),
    Array("初心者", 1000, 1, 0),
    Array("战童", 2000, 1, 0),
)
var 职业2 = Array(
    Array("战士", 100, 10, 0),
//	Array("战士", 100, 30, 100),
//	Array("战士", 100, 70, 110),
//	Array("战士", 100, 120, 111),
//	Array("战士", 100, 200, 112),
//	Array("战士", 100, 70, 120),
//	Array("战士", 100, 120, 121),
//	Array("战士", 100, 200, 122),
//	Array("战士", 100, 70, 130),
//	Array("战士", 100, 120, 131),
//	Array("战士", 100, 200, 132),
    Array("魔法师", 200, 8, 0),
//	Array("魔法师", 200, 30, 200),
//	Array("魔法师", 200, 70, 210),
//	Array("魔法师", 200, 120, 211),
//	Array("魔法师", 200, 200, 212),
//	Array("魔法师", 200, 70, 220),
//	Array("魔法师", 200, 120, 221),
//	Array("魔法师", 200, 200, 222),
//	Array("魔法师", 200, 70, 230),
//	Array("魔法师", 200, 120, 231),
//	Array("魔法师", 200, 200, 232),
    Array("弓箭手", 300, 10, 0),
//	Array("弓箭手", 300, 30, 300),
//	Array("弓箭手", 300, 70, 310),
//	Array("弓箭手", 300, 120, 311),
//	Array("弓箭手", 300, 200, 312),
//	Array("弓箭手", 300, 70, 320),
//	Array("弓箭手", 300, 120, 321),
//	Array("弓箭手", 300, 200, 322),
    Array("飞侠", 400, 10, 0),
//	Array("飞侠", 400, 30, 400),
//	Array("飞侠", 400, 70, 410),
//	Array("飞侠", 400, 120, 411),
//	Array("飞侠", 400, 200, 412),
//	Array("飞侠", 400, 70, 420),
//	Array("飞侠", 400, 120, 421),
//	Array("飞侠", 400, 200, 422),
    Array("海盗", 500, 10, 0),
//	Array("海盗", 500, 30, 500),
//	Array("海盗", 500, 70, 510),
//	Array("海盗", 500, 120, 511),
//	Array("海盗", 500, 200, 512),
//	Array("海盗", 500, 70, 520),
//	Array("海盗", 500, 120, 521),
//	Array("海盗", 500, 200, 522),
    Array("魂骑士", 1100, 10, 1000),
//	Array("魂骑士", 1100, 30, 1100),
//	Array("魂骑士", 1100, 70, 1110),
//	Array("魂骑士", 1100, 120, 1111),
    Array("炎术士", 1200, 10, 1000),
//	Array("炎术士", 1200, 30, 1200),
//	Array("炎术士", 1200, 70, 1210),
//	Array("炎术士", 1200, 120, 1211),
    Array("风灵使者", 1300, 10, 1000),
//	Array("风灵使者", 1300, 30, 1300),
//	Array("风灵使者", 1300, 70, 1310),
//	Array("风灵使者", 1300, 120, 1311),
    Array("夜行者", 1400, 10, 1000),
//	Array("夜行者", 1400, 30, 1400),
//	Array("夜行者", 1400, 70, 1410),
//	Array("夜行者", 1400, 120, 1411),
    Array("奇袭者", 1500, 10, 1000),
//	Array("奇袭者", 1500, 30, 1500),
//	Array("奇袭者", 1500, 70, 1510),
//	Array("奇袭者", 1500, 120, 1511),
//	Array("战神", 2100, 10, 2000),
//	Array("战神", 2100, 30, 2100),
//	Array("战神", 2100, 70, 2110),
//	Array("战神", 2100, 120, 2111));
    Array("战神", 2100, 10, 2000));
var title = "\t\t\t\t\t#e#k欢迎来到#r[更换职业]#k系统#n\t\t\t\t\r\n";
var itemId = 4000313;


function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        if (mode == 0 && type > 0) {
            cm.dispose();
            return;
        }
        if (mode == 1)
            status++;
        else
            status--;

        if (status == 0) {
            cost = ptcost;    //默认是普通职业
            relevel = relevela;
            if (Math.floor(cm.getJobId() / 1000) == 1) {  //判断为骑士团职业
                cost = qscost;
                relevel = relevelb;
            }
            var level = cm.getLevel();
            var job = cm.getJobId();
            var text = title;
            text += "\r\n";
            text += "#r变更职业要求：#k\r\n";
            text += "1.等级大于等于" + relevel + "级\r\n"
            text += `2.消耗#v${itemId}##t${itemId}# × ${cost}\r\n\r\n`;

            text += "#r变更职业后：#k\r\n";
            text += "#k1.等级回到#r#e " + returnLevel + " #n级\r\n";
            text += "#b2.技能将清空#n#k\r\n"
            text += "#k3.返还已使用的#b红色魔石#k和#b蓝色魔石#n#k\r\n"
            text += "#k2.回到1级菜单将不可用.需要一转后才可以使用全部功能\r\n"
            text += "#k3.骑士团和战童最好自己先去一转地图后在变更职业\r\n"
            text += "#k4.温馨提示最好再准备一把0级武器#k\r\n";
            text += "#r(请谨慎变更职业)\r\n\r\n";
            text += "#r请选择您要变更的职业：\r\n";
            for (var i = 0; i < 职业.length; i++) {
                text += "#L" + i + "##b" + 职业[i][0] + "#k#l\r\n";
            }
            cm.sendSimple(text)
        } else if (status == 1) {
            var level = cm.getLevel();
            if (level < relevel || !cm.haveItem(4000313, cost)) {
                cm.sendOk("不满足变更职业条件，无法变更\r\n");
                cm.dispose();
                return;
            }
            selecta = selection;
            hpCount = getWashValue(0);
            mpCount = getWashValue(1);
            let text = "#r确认提示：\r\n"
            text += "#b#e请确认是否变更职业为#r#e[" + 职业[selecta][0] + "]？#k#n\r\n";
            text += "#b#e请确认是否变更职业为#r#e[" + 职业[selecta][0] + "]？#k#n\r\n";
            text += "#b#e请确认是否变更职业为#r#e[" + 职业[selecta][0] + "]？#k#n\r\n";

            text += "#r#e变更职业后等级回到#r" + returnLevel + "级#d，#r#e请谨慎操作#k#n。";
            text += "\r\n\r\n";
            text += "#k#n变更职业后将返还已使用洗血道具：\r\n";
            text += "#b红色魔石：" + hpCount + "个\r\n";
            text += "蓝色魔石：" + mpCount + "个\r\n";
            text += "\r\n\r\n";
            cm.sendYesNo(text);
        } else if (status == 2) { //再次检查物品是否足够，避免玩家中途将物品丢出去从而不消耗物品
            if (cm.haveItem(4000313, cost)) {
                var hpFlag = hpCount > 0 ? cm.canHold(HP_ITEM_ID, hpCount) : true;
                var mpFlag = mpCount > 0 ? cm.canHold(MP_ITEM_ID, mpCount) : true;

                if (hpFlag && mpFlag) {
                    //cm.gainMeso(-cost);
                    cm.gainItem(4000313, -cost);
                    换职业(职业[selecta][1]);
                } else {
                    cm.sendOk("背包空间不足，需要的材料不足");
                    cm.dispose();
                }
            } else {
                cm.sendOk("更换职业失败，需要的材料不足");
                cm.dispose();
            }
        } else {
            if (status == 2) {
                cm.sendOk("更换职业失败。");
                cm.dispose();
            } else {
                cm.dispose();
            }
        }
    }
}

function 换职业(jobId) {
    var player = cm.getChar();
    // 重置技能
    try {
        var skillList = player.getSkills();
        for (var skill in skillList) {
            player.changeSkillLevel(skill, 0, 0, 0);
        }

        for (var i = 0; i < 10; ++i) {
            player.gainSp(-99999999, i, false);
        }
    } catch (e) {
        cm.sendOk("重置技能失败: " + e.message);
        cm.dispose();
        return;
    }
    // 重置属性点
    try {
        player.setStr(4); // 初始力量
        player.setDex(4); // 初始敏捷
        player.setInt(4); // 初始智力
        player.setLuk(4); // 初始运气
        player.setRemainingAp((cm.getChar().getReborns() * 255) + 5); // 每重生一次返还255属性点
    } catch (e) {
        cm.sendOk("重置属性点失败: " + e.message);
        cm.dispose();
        return;
    }

    // 设置HP和MP
    try {
        player.updateHpMaxHp(50, 50);
        player.updateMpMaxMp(50, 50);
        if (hpCount > 0) {
            cm.gainItem(HP_ITEM_ID, hpCount);
            setWashValue(0, 0);
        }
        if (mpCount > 0) {
            cm.gainItem(MP_ITEM_ID, mpCount);
            setWashValue(0, 1);
        }
    } catch (e) {
        cm.sendOk("重置HP/MP失败: " + e.message);
        cm.dispose();
        return;
    }

    // 执行转生
    try {
        var Job = Java.type('org.gms.client.Job');
        player.changeJob(Job.getById(jobId));
        player.setLevel(0);
        player.levelUp(true);
        player.equipChanged();
        cm.sendOk("恭喜你更换职业成功！");
        cm.dispose()
    } catch (e) {
        cm.sendOk("更换职业过程中出现错误，请重试。" + e.message);
    }
}

const KEY_WASH_HP = "key_wash_hp";
const KEY_WASH_MP = "key_wash_mp";
const HP_ITEM_ID = 4032170;
const MP_ITEM_ID = 4032171;
var hpCount = 0;
var mpCount = 0;

// 新增type参数，明确获取哪种类型的洗血次数
function getWashValue(type) {
    const key = type === 0 ? KEY_WASH_HP : KEY_WASH_MP;
    return Number(cm.getCharacterExtendValue(key) || 0); // 处理未记录时的默认值
}

// 新增count参数，支持一次累加多个次数
function setWashValue(curCount, type) {
    const key = type === 0 ? KEY_WASH_HP : KEY_WASH_MP;
    cm.saveOrUpdateCharacterExtendValue(key, curCount + "");
}