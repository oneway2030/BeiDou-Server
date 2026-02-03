var timeLimit = 1;
// 集中配置挑战所需道具信息，后续修改直接改这里
var needItemId = 4001254;    // 所需道具ID
var needItemNum = 1;         // 所需道具数量
var itemSource = "贝尔加莫特";// 道具产出地

function start() {
	// 弹窗换行添加道具要求+产出地提示（按要求1实现）
	cm.sendYesNo(`你想挑战BOSS再生都纳斯吗？\r\n需要${needItemNum}个#v${needItemId}##t${needItemId}##k方可进入（该道具可在${itemSource}产出）`);
}

function action(mode, type, selection) {
	if (mode == 0) { // 用户点击 No
		cm.dispose();
	} else if (mode == 1) { // 用户点击 Yes
		var player = cm.getPlayer();
		// 道具验证（按要求2实现）：无道具直接提示，终止后续逻辑
		if (!cm.haveItem(needItemId, needItemNum)) {
			cm.sendOk(`#r缺少挑战所需道具！#k\r\n挑战再生都纳斯需要${needItemNum}个#v${needItemId}##t${needItemId}##k，该道具可在${itemSource}产出，请准备好后再尝试！`);
			cm.dispose();
			return;
		}

		if (cm.getPlayerCount(802000701) <= 1) { // BOSS地图无人，允许掉线重连
			var party = player.getParty();
			if (party == null) {
				cm.sendOk("你不在一个队伍中,请创建组队再进入挑战");
				cm.dispose();
			} else if (party.getLeaderId() != player.getId()) {
				cm.sendOk("队长才可以进入");
				cm.dispose();
			} else if (party.getPartyMembers().size() != player.getPartyMembersOnSameMap().size()) {
				cm.sendOk("队伍里有人不在,无法进入");
				cm.dispose();
			} else {
				// 所有规则验证通过，消耗道具
				cm.gainItem(needItemId, -needItemNum);
				var Map1 = cm.getMap(802000701);
				if (cm.getPlayerCount(802000701) <= 0) { // 地图没人则重置
					Map1.resetFully();
				}
				// 传送队伍进入BOSS地图
				cm.warpParty(802000701, 0);
				return true;
			}
		} else {
			cm.sendOk("与BOSS的战斗已经开始了，所以你不能进入这个地方。");
			cm.dispose();
		}
	} else {
		cm.dispose(); // 其他情况（如超时）
	}
}