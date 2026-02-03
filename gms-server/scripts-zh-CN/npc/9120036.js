var timeLimit = 1;
// 【集中配置】挑战所需道具信息（后续改ID/数量/产出地直接改这里）
var needItemId = 4001254;    // 所需道具ID
var needItemNum = 1;         // 所需道具数量
var itemSource = "贝尔加莫特";// 道具产出地（按你要求修改为贝尔加莫特）

function start() {
    var playerMap = cm.getPlayer().getMapId();
    if (playerMap == 802000111) {
        cm.sendYesNo("你想离开这个地方？但是出去后无法返回战场...");
    } else if (playerMap == 802000110) {
        // 【修改1】在挑战弹窗后换行添加道具要求+产出地提示
        cm.sendYesNo(`你想挑战BOSS努克斯吗？\r\n需要${needItemNum}个#v${needItemId}##t${needItemId}##k方可进入（该道具可在${itemSource}产出）`);
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
        // 离开战场地图（802000111）：完全保留原逻辑，无需道具
        if (playerMap == 802000111) {
            cm.warp(802000110, 0);
            cm.dispose();
        }
        // 挑战BOSS（802000110）：新增道具验证+消耗逻辑
        else if (playerMap == 802000110) {
            // 【核心验证】先检查道具，无道具直接提示终止
            if (!cm.haveItem(needItemId, needItemNum)) {
                cm.sendOk(`#r缺少挑战所需道具！#k\r\n挑战努克斯需要${needItemNum}个#v${needItemId}##t${needItemId}##k，该道具可在${itemSource}产出，请准备好后再尝试！`);
                cm.dispose();
                return;
            }

            // 有道具：继续原有副本地图人数判断规则
            if (cm.getPlayerCount(802000111) <= 1) {
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
                        // 【安全消耗】所有组队规则验证通过后，消耗道具（避免误扣）
                        cm.gainItem(needItemId, -needItemNum);

                        var canGoIn = true;
                        var cause;
                        if (canGoIn && cm.getPlayerCount(802000111) <= 0) { // 地图没人重置
                            var Map1 = cm.getMap(802000111);
                            Map1.resetFully();
                            cm.warpParty(802000111, 0);
                            return true;
                        } else if (canGoIn && cm.getPlayerCount(802000111) > 0) { // 地图有人不重置
                            cm.warpParty(802000111, 0);
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