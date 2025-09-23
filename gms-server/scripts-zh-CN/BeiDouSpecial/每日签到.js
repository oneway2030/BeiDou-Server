/**北斗脚本

 签到脚本

 ---By hanmburger*/
var status = -1;
var DAILY_CHECK_IN = "是否每日已签到"
var DAILY_CHECK_IN_TOTAL = "累计签到次数"
var DAILY_CHECK_IN_TOTAL_CLAIM = "是否已领取累计签到奖励"
var column = ["3", "5", "7", "15", "30", "60", "90", "120"];
var itemId = 2430033;

function start() {
    status = -1;
    levelStart();
}


function levelStart() {
    let text = "#d您已累计签到 #r" + getCurCheckInCount() + " #d天\r\n\r\n";
    text += "#L0##b每日签到  " + getCheckInState() + "#l\r\n";
    text += "\r\n";
    text += "#L1##b领取累计签到奖励#l\n";
    cm.sendSelectLevel(text);
}

//每日签到
function level0() {
    // 第一层对话
    text = cm.getCharacterExtendValue(DAILY_CHECK_IN, true);
    if (text === "1") {
        cm.sendOk("您已经签到过了，请明天再来");
        cm.dispose();
    } else {
        if (isCanHold(2)) {
            saveCheckInCount();
            cm.saveOrUpdateCharacterExtendValue(DAILY_CHECK_IN, "1", true);
            cm.sendOk("签到成功！");
            cm.gainItem(itemId, 5);
            cm.dispose();
        }
    }
}


function getCheckInState() {
    text = cm.getCharacterExtendValue(DAILY_CHECK_IN, true);
    return text === "1" ? " #r(已签到)" : "(未签到)";
}

function getAccumulateCheckInState(type) {
    text = cm.getCharacterExtendValue(type, true);
    return text === "1" ? " #r(已领取)" : "(未领取)";
}

//领取累计奖励
function level1() {
    let text = "#e请确保您的背包空间大于5格，再领取奖励#n\r\n\r\n";
    for (let i = 1; i <= column.length; i++) {
        let index = column[i - 1]
        text += "#L" + i + "##b领取" + index + "天奖励  " + getAccumulateCheckInState(DAILY_CHECK_IN_TOTAL_CLAIM + index) + "#l\r\n";
        text += "\r\n";
    }
    cm.sendNextSelectLevel("ChooseInventory", text);
}

// 发放累计奖励
function levelChooseInventory(choose) {
    let tip = "";
    let index = Number(column[choose - 1])
    let curCheckInCount = getCurCheckInCount();
    let tag = DAILY_CHECK_IN_TOTAL_CLAIM + index
    let isClaim = cm.getCharacterExtendValue(tag, true);
    if (curCheckInCount < index || isClaim === "1") {
        if (curCheckInCount < index) {
            tip = "#r未达到领取天数";
        } else {
            tip = "#r您已领取过签到累计奖励";
        }
        cm.sendOk(tip);
    } else {
        if (isCanHold(2)) {
            tip = "#b恭喜您，领取成功!!";
            cm.saveOrUpdateCharacterExtendValue(tag, "1", true);
            cm.gainItem(2430033, 5 * column[choose - 1]);
            cm.sendOk(tip);
        }
    }
    cm.dispose();
}

/**
 * 背包是否满了
 * type 背包类型:1 装备 2 消耗 3 设置 4 其他 5 特殊
 * count 查询的格子数量,最少1格
 */
function isCanHold(type) {
    if (cm.getPlayer().isFull(type, 3)) {
        cm.sendOk("#r背包空间不足，请确保空间大于等于3格子！");
        cm.dispose();
        return false
    }
    return true
}


//当前签到次数
function getCurCheckInCount() {
    let dayCount = cm.getCharacterExtendValue(DAILY_CHECK_IN_TOTAL);
    return Number(dayCount);
}

//当前签到次数+1并保存
function saveCheckInCount() {
    cm.saveOrUpdateCharacterExtendValue(DAILY_CHECK_IN_TOTAL, String(getCurCheckInCount() + 1));
}

