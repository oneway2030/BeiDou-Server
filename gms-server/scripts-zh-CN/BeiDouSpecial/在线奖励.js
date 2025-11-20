/*
脚本：在线奖励
作者：SpicyBurgerKing
日期：2024-10-31
备注：北斗开发组
 */


var status = 0;
var Eventid = "站街奖励";
var OnlineLevel = [10, 30, 60, 120, 240, 360, 480];//, 600, 720
var textMsg = [
	"恭喜领取成功！",
	"您未达到领取条件",
	"您已经领取过了。",
	"没有可领取的奖励",
	"一键领取完成，共领取了{count}个奖励"
];
var getStatus = 0;//"0000000"
var msg;
var giftContent = [1, 1, 1, 2, 2, 3, 5];
var index = [0x01,0x10,0x100,0x1000,0x10000,0x100000,0x1000000];
var kye="每日在线奖励领取状态";
//Start
function start()
{
	var limitDt = new Date();
	limitDt.setHours(0, 0, 5, 0);
	if (new Date() <= limitDt) {
		cm.sendOk("在线奖励正在初始化中，请稍后再试...");
		cm.dispose();
		return;
	}
	status = -1;
	action(1, 0, 0);
}

function action(mode, type, selection)
{
	if (CheckStatus(mode))
	{
		if (status == 0)
		{
			//第一层对话
			if (cm.getOnlineTime() < 3600)
			{
				time = "今日在线时间：#e#r"+ Math.floor(cm.getOnlineTime() / 60) +"#k#n 分钟\r\n\r\n";
			}
			else
			{
				let hour = Math.floor(cm.getOnlineTime() / 3600);
				let min = Math.floor((cm.getOnlineTime() - hour * 3600) / 60);
				time = "今日在线时间：#e#r"+ hour +"#k#n 小时 #e#r"+ min +"#k#n 分钟\r\n\r\n";
			}
			var getTmpStatus = cm.getAccountExtendValue(kye,true);

			if (getTmpStatus == null)
			{
				cm.saveOrUpdateAccountExtendValue(kye, "0", true);
				getStatus = 0;
			}
			else
			{
				getStatus = parseInt(getTmpStatus, 10);
			}

			// 添加一键领取选项
			time += "#b#L7#一键领取所有可领奖励#l\r\n#k";

			// 生成奖励选项列表，添加领取状态标识
			for (var i = 0; i < OnlineLevel.length; i++) {
				var isClaimed = (getStatus & index[i]) !== 0;
				var timeStr = OnlineLevel[i];
				// 已领取显示红色，未领取显示蓝色
				var colorTag = isClaimed ? "#r" : "#b";
				var statusText = isClaimed ? "【已领取】" : "【未领取】";
				time += `${colorTag}#L${i}#领取【${timeStr}】分钟在线奖励 ${statusText}#l\r\n#k`;
			}

			cm.sendSimple(time);
		}
		else if (status == 1 )
		{
			// 处理一键领取逻辑
			if (selection == 7) {
				claimAllRewards();
				cm.sendOk(msg);
				cm.dispose();
			} else {
				// 处理单个领取
				var currentOnlineTime = Math.floor(cm.getOnlineTime() / 60);
				AwardItem(selection, getStatus, currentOnlineTime, OnlineLevel[selection], giftContent[selection]);
				cm.sendOk(msg);
				cm.dispose();
			}
		}
		else
		{
			//最后一层对话完继续循环至此，推出结束
			cm.dispose();
		}
	}

}

// 一键领取所有可领取的奖励
function claimAllRewards() {
	var currentOnlineTime = Math.floor(cm.getOnlineTime() / 60);
	var claimCount = 0;
	var newAcquireStatus = getStatus;

	// 遍历所有奖励等级
	for (var i = 0; i < OnlineLevel.length; i++) {
		// 检查是否已领取
		var rewardBit = getStatus & index[i];
		var isRewardClaimed = (rewardBit !== 0);

		// 检查是否满足领取条件
		if (!isRewardClaimed && currentOnlineTime >= OnlineLevel[i]) {
			// 发放奖励
			cm.gainItem(2430033, giftContent[i]);
			newAcquireStatus |= index[i];
			claimCount++;
		}
	}

	// 更新领取状态
	if (claimCount > 0) {
		cm.saveOrUpdateAccountExtendValue(kye, String(newAcquireStatus), true);
		msg = textMsg[4].replace("{count}", claimCount);
	} else {
		msg = textMsg[3];
	}
}

function CheckStatus(mode)
{
	if (mode == -1)
	{
		cm.dispose();
		return false;
	}

	if (mode == 1)
	{
		status++;
	}
	else
	{
		status--;
	}

	if (status == -1)
	{
		cm.dispose();
		return false;
	}
	return true;
}

/**
 * 获取奖励
 *
 * @param {number} selection - 玩家选择的奖励索引
 * @param {number} acquire - 当前奖励领取状态
 * @param {number} currentOnlineTime - 当前在线时间（分钟）
 * @param {number} scalar - 在线奖励的时间梯度（分钟）
 * @param {number} gaincount - 获取物品的数量
 */
function AwardItem(selection, acquire, currentOnlineTime, scalar, gaincount) {
	if (currentOnlineTime >= scalar)
	{
		// 检查是否已经领取过该奖励
		var rewardBit = acquire & index[selection];
		var isRewardClaimed = (rewardBit !== 0);
		if (!isRewardClaimed)
		{
			// 颁发奖励
			cm.gainItem(2430033, gaincount);
			var newAcquireStatus = acquire | index[selection];
			cm.saveOrUpdateAccountExtendValue(kye, String(newAcquireStatus), true);
			msg = textMsg[0];
		}
		else
		{
			// 设置已领取消息
			msg = textMsg[2];
		}
	}
	else
	{
		msg = textMsg[1];
	}
}