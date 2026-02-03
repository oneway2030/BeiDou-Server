var timeLimit = 1;
// 【集中配置】挑战所需道具信息（后续修改ID/数量/产出地直接改这里）
var needItemId = 4001254;    // 所需道具ID
var needItemNum = 1;         // 所需道具数量
var itemSource = "莫尔加莫特";// 道具产出地

function start() {
    var playerMap = cm.getPlayer().getMapId();
    if (playerMap == 802000611) {
        cm.sendYesNo("你想离开这个地方？但是出去后无法返回战场...");
    } else if (playerMap == 802000602) {
        cm.sendYesNo(`你想挑战BOSS尼贝隆吗？\r\n #r挑战尼贝隆需要${needItemNum}个#v${needItemId}##t${needItemId}##k#r！\r\n该道具可在${itemSource}产！`);
    } else {
        cm.dispose(); // 其他地图直接关闭对话
    }
}

function action(mode, type, selection) {
    if (mode == 0) { // 用户点击 No
        cm.dispose();
    } else if (mode == 1) { // 用户点击 Yes
        var playerMap = cm.getPlayer().getMapId();
        var player = cm.getPlayer();
        // 离开地图（802000611）：完全保留原有逻辑，无需道具
        if (playerMap == 802000611) {
            cm.warp(802000602, 1);
            cm.dispose();
        }
        // 挑战BOSS（802000602）：新增道具前置验证逻辑
        else if (playerMap == 802000602) {
            // 【核心前置】第一步先验证道具，无道具直接提示终止
            if (!cm.haveItem(needItemId, needItemNum)) {
                cm.sendOk(`#r挑战尼贝隆需要${needItemNum}个#v${needItemId}##t${needItemId}##k#r！\r\n该道具可在${itemSource}产出，请先准备好道具再尝试挑战！`);
                cm.dispose();
                return;
            }

            // 有道具：继续原有副本地图人数判断规则
            if (cm.getPlayerCount(802000611) <= 1) {
                var party = player.getParty();
                if (party == null) {
                    cm.sendOk("你不在一个队伍中,请创建组队再进入挑战");
                    cm.dispose();
                } else {
                    if (party.getLeaderId() != player.getId()) {
                        cm.sendOk("队长才可以进入");
                        cm.dispose();
                    } else {
                        var members = party.getPartyMembers();
                        if (members.size() != player.getPartyMembersOnSameMap().size()) {
                            cm.sendOk("队伍里有人不在,无法进入");
                            cm.dispose();
                        }
                        // 【安全消耗】所有组队规则验证通过后，再消耗道具（避免误扣）
                        cm.gainItem(needItemId, -needItemNum);

                        var canGoIn = true;
                        var cause;
                        if (canGoIn && cm.getPlayerCount(802000611) <= 0) { // 地图没人重置
                            var Map1 = cm.getMap(802000611);
                            Map1.resetFully();
                            cm.warpParty(802000611, 0);
                            return true;
                        } else if (canGoIn && cm.getPlayerCount(802000611) > 0) { // 地图有人不重置
                            cm.warpParty(802000611, 0);
                            return true;
                        } else {
                            cm.sendOk(cause);
                            cm.dispose();
                        }
                    }
                }
            } else {
                cm.sendOk("与BOSS的战斗已经开始了，所以你不能进入这个地方。");
                cm.dispose();
            }
        }
    } else {
        cm.dispose(); // 其他情况（如对话超时）
    }
}