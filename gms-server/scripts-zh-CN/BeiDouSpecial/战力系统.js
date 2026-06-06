var status = 0;
var rankingData = [];
var equipData = [];

// 装备位置数组（只统计这些位置，武器放第一个）
var equipPositions = [-11, -1, -2, -3, -4, -5, -6, -7, -8, -9, -10, -12, -13, -15, -16, -17, -18, -19, -26, -27, -28, -29, -101, -102, -103, -104, -105, -106, -107, -108, -109, -110, -111, -112, -113, -114, -115, -116, -118, -119, -121, -127, -128];

// 装备位置对应的名称（武器放第一个）
var equipNames = ["武器", "帽子", "脸饰", "眼饰", "耳环", "衣服", "裤子", "鞋子", "手套", "披风", "盾牌", "戒指1", "戒指2", "戒指3", "戒指4", "项链", "骑宠", "鞍子", "勋章", "戒指5", "戒指6", "腰带", "时帽", "时脸", "时眼", "时耳", "时衣", "时裤", "时鞋", "时手", "时披", "时盾", "时武", "时戒1", "时戒2", "宠装", "时戒3", "时戒4", "时骑", "时鞍", "时项", "时戒5", "时戒6"];

// 职业ID到中文名称的映射
var jobNames = {
    0: "初心者",
    100: "战士", 110: "剑客", 111: "勇士", 112: "英雄",
    120: "准骑士", 121: "骑士", 122: "圣骑士",
    130: "枪战士", 131: "狂战士", 132: "黑骑士",
    200: "魔法师", 210: "火毒法师", 211: "火毒巫师",
    220: "冰雷法师", 221: "冰雷巫师",
    230: "牧师", 231: "祭祀", 232: "主教",
    300: "弓箭手", 310: "猎人", 311: "射手", 312: "神射手",
    320: "弩弓手", 321: "游侠", 322: "箭神",
    400: "飞侠", 410: "刺客", 411: "无影人", 412: "隐士",
    420: "侠客", 421: "独行客", 422: "侠盗",
    500: "海盗", 510: "拳手", 511: "斗士", 512: "冲锋队长",
    520: "火枪手", 521: "大副", 522: "船长",
    1000: "战神", 1001: "战神", 1002: "战神",
    1100: "龙神", 1101: "龙神", 1102: "龙神",
    1200: "幻影", 1201: "幻影", 1202: "幻影",
    2000: "夜光", 2001: "夜光", 2002: "夜光",
    2100: "双弩", 2101: "双弩", 2102: "双弩",
    2200: "恶魔猎手", 2201: "恶魔猎手", 2202: "恶魔猎手",
    3000: "尖兵", 3001: "尖兵", 3002: "尖兵",
    3100: "复仇者", 3101: "复仇者", 3102: "复仇者",
    4000: "萌骑士", 4001: "萌骑士", 4002: "萌骑士",
    4100: "炎术师", 4101: "炎术师", 4102: "炎术师",
    4200: "风灵使者", 4201: "风灵使者", 4202: "风灵使者",
    4300: "幻影神偷", 4301: "幻影神偷", 4302: "幻影神偷",
    4500: "隐月", 4501: "隐月", 4502: "隐月"
};

function start() {
    status = 0;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
        return;
    }
    
    if (mode == 0) {
        status--;
        if (status < 0) {
            cm.dispose();
            return;
        }
    }
    
    if (mode == 1) {
        status++;
    }
    
    // 第一层：战力排行榜
    if (status == 1) {
        var txt = "\t\t\t\t\t#e#k欢迎来到#r[r战力排行榜]#k系统#n\t\t\t\t\r\n\r\n";
        txt += "#d排名\t\t角色名\t\t战力评分\r\n";
        txt += "------------------------------------\r\n";
        
        var data = cm.getCombatPowerRanking(50);
        rankingData = parseRankingData(data);
        
        if (rankingData.length == 0) {
            txt += "\r\n\t\t暂无玩家数据\r\n";
            cm.sendOk(txt);
            cm.dispose();
            return;
        }

        for (var i = 0; i < rankingData.length; i++) {
            var rank = i + 1;

            txt += "#L" + i + "#";
            txt += "#d" + rank;  // 排名紫色
            // 前9名多一个空格对齐
            if (rank < 10) {
                txt += "\t";
            }
            txt += "\t";  // 排名后2个制表符
            txt += "#d" + rankingData[i].name + "#k" + "\t\t";  // 角色名紫色
            txt += "#r" + rankingData[i].max + "#k";  // 战力值红色
            txt += "#l\r\n";
        }
        
        cm.sendSimple(txt);
        
    } else if (status == 2) {
        // 第二层：玩家详情
        var player = rankingData[selection];
        if (!player) {
            cm.sendOk("数据错误");
            cm.dispose();
            return;
        }
        
        var txt = "#r" + player.name + "#k 的战力详情\r\n\r\n";
        txt += "#d总战力评分 : #r" + player.max + "\r\n";
        
        // 获取职业名称（中文）
        var jobName = "未知";
        try {
            if (player.job && !isNaN(player.job)) {
                var jobId = parseInt(player.job);
                jobName = jobNames[jobId] || "未知";
            }
        } catch (e) {
            jobName = "未知";
        }
        txt += "#d职业 : #b" + jobName + "\r\n\r\n";
        txt += "----------------------------\r\n\r\n";
        
        // 获取装备详情
        var equipPowerMap = {};
        var totalPower = 0;
        equipData = [];
        
        var hasEquipList = [];      // 有评分可点击的装备
        var noEquipList = [];       // 无评分不可点击的装备
        
        try {
            var equipStr = cm.getCharacterEquipDetails(player.id);
            var allEquip = parseEquipData(equipStr);
            
            // 按指定位置顺序填充
            for (var posIndex = 0; posIndex < equipPositions.length; posIndex++) {
                var pos = equipPositions[posIndex];
                var foundEquip = null;
                for (var j = 0; j < allEquip.length; j++) {
                    if (allEquip[j].position == pos) {
                        foundEquip = allEquip[j];
                        break;
                    }
                }
                equipData.push(foundEquip);
                equipPowerMap[pos] = foundEquip ? (foundEquip.max || 0) : 0;
                totalPower += equipPowerMap[pos];
                
                // 分类装备
                var equipName = equipNames[posIndex];
                var power = foundEquip ? (foundEquip.max || 0) : 0;
                if (power > 0) {
                    hasEquipList.push({name: equipName, power: power, dataIndex: posIndex});
                } else {
                    noEquipList.push({name: equipName, power: power});
                }
            }
        } catch (e) {
            // 忽略错误
        }
        
        // 显示有评分的装备（可点击）
        txt += "#d【已装备】\r\n";
        txt += showEquipItems(hasEquipList, true);
        
        // 显示无评分的装备（不可点击）
        txt += "\r\n#d【未装备】\r\n";
        txt += showEquipItems(noEquipList, false);
        
        txt += "\r\n----------------------------\r\n\r\n";
        txt += "#d装备战力总和 : #r" + totalPower + "\r\n";
        txt += "#d角色基础战力 : #r" + (player.max - totalPower) + "\r\n";
        txt += "\r\n#L0#返回排行榜#l";
        
        cm.sendSimple(txt);
        
    } else if (status == 3) {
        if (selection == 0) {
            status = 0;
            action(1, 0, 0);
        } else {
            // 第三层：装备详细属性
            var equip = equipData[selection - 1];
            if (!equip) {
                cm.sendOk("该位置没有装备");
                cm.dispose();
                return;
            }
            
            var posIndex = equipPositions.indexOf(equip.position);
            var equipName = posIndex >= 0 ? equipNames[posIndex] : "未知装备";
            
            var txt = equipName + " 属性详情\r\n\r\n";
            txt += "#i" + equip.itemid + "#\r\n\r\n";
            
            txt += "#d力量 : #r" + (equip.str || 0) + "\r\n";
            txt += "#d敏捷 : #r" + (equip.dex || 0) + "\r\n";
            txt += "#d智力 : #r" + (equip.int_attr || 0) + "\r\n";
            txt += "#d运气 : #r" + (equip.luk || 0) + "\r\n\r\n";
            
            txt += "#d物攻 : #r" + (equip.watk || 0) + "\r\n";
            txt += "#d魔攻 : #r" + (equip.matk || 0) + "\r\n";
            txt += "#d物防 : #r" + (equip.wdef || 0) + "\r\n";
            txt += "#d魔防 : #r" + (equip.mdef || 0) + "\r\n\r\n";
            
            txt += "#d装备战力 : #r" + (equip.max || 0) + "\r\n";
            
            cm.sendOk(txt);
            cm.dispose();
        }
    }
}

// 显示装备列表（一行3个，空格对齐）
function showEquipItems(items, clickable) {
    var txt = "";
    var itemsPerRow = 3;
    var maxNameLen = 0;
    
    // 找出最长的装备名
    for (var i = 0; i < items.length; i++) {
        maxNameLen = Math.max(maxNameLen, items[i].name.length);
    }
    // 至少保留5个字符宽度
    maxNameLen = Math.max(maxNameLen, 5);
    
    for (var i = 0; i < items.length; i += itemsPerRow) {
        var rowTxt = "";
        for (var j = 0; j < itemsPerRow && (i + j) < items.length; j++) {
            var item = items[i + j];
            var name = item.name;
            var power = item.power;
            
            // 装备名右填充空格
            while (name.length < maxNameLen) {
                name += " ";
            }
            
            // 战力值左填充空格（固定6位）
            var powerStr = String(power);
            while (powerStr.length < 6) {
                powerStr = " " + powerStr;
            }
            
            if (clickable) {
                rowTxt += "#L" + (item.dataIndex + 1) + "#";
                rowTxt += "#r" + name + ":" + powerStr + "#k";
                rowTxt += "#l";
            } else {
                rowTxt += "#d" + name + ":" + powerStr + "#k";
            }
            
            if (j < itemsPerRow - 1 && (i + j + 1) < items.length) {
                rowTxt += "  ";
            }
        }
        txt += rowTxt + "\r\n";
    }
    
    if (items.length == 0) {
        txt += "    暂无\r\n";
    }
    
    return txt;
}

function parseRankingData(data) {
    var container = [];
    if (!data || data.length == 0) return container;
    
    var records = data.split(";");
    for (var i = 0; i < records.length; i++) {
        if (!records[i] || records[i].length == 0) continue;
        var fields = records[i].split(",");
        if (fields.length < 4) continue;
        
        try {
            var entry = {};
            entry['id'] = parseInt(fields[0]);
            entry['name'] = fields[1] || "未知";
            entry['job'] = parseInt(fields[2]);
            entry['max'] = parseInt(fields[3]);
            container.push(entry);
        } catch (e) {
            continue;
        }
    }
    return container;
}

function parseEquipData(data) {
    var container = [];
    if (!data || data.length == 0) return container;
    
    var records = data.split(";");
    for (var i = 0; i < records.length; i++) {
        if (!records[i] || records[i].length == 0) continue;
        var fields = records[i].split(",");
        if (fields.length < 13) continue;
        
        try {
            var equip = {};
            equip['itemid'] = parseInt(fields[0]);
            equip['position'] = parseInt(fields[1]);
            equip['str'] = parseInt(fields[2]);
            equip['dex'] = parseInt(fields[3]);
            equip['int_attr'] = parseInt(fields[4]);
            equip['luk'] = parseInt(fields[5]);
            equip['watk'] = parseInt(fields[6]);
            equip['matk'] = parseInt(fields[7]);
            equip['wdef'] = parseInt(fields[8]);
            equip['mdef'] = parseInt(fields[9]);
            equip['upgradeslots'] = parseInt(fields[10]);
            equip['level'] = parseInt(fields[11]);
            equip['max'] = parseInt(fields[12]);
            container.push(equip);
        } catch (e) {
            continue;
        }
    }
    return container;
}
