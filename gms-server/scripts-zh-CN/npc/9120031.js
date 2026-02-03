var timeLimit = 1;
// 配置道具信息（集中管理，后续修改更方便）
var needItemId = 4001254; // 所需道具ID
var needItemNum = 1;      // 所需道具数量
var itemSource = "贝尔加莫特"; // 道具产出地

function start() {
    cm.sendYesNo(`你想挑战BOSS都纳斯吗？\r\n#r挑战都纳斯需要${needItemNum}个#v${needItemId}##t${needItemId}##k#r！\r\n该道具可在${itemSource}产出！`);
}

function action(mode, type, selection) {
    if (mode == 0) { // 用户点击 No 取消挑战
        cm.dispose();
    } else if (mode == 1) { // 用户点击 Yes 确认挑战
        // 【核心前置】获取玩家对象，执行道具首要验证（所有判断前先检查道具）
        var player = cm.getPlayer();
        // 检查是否持有足够道具
        if (!cm.haveItem(needItemId, needItemNum)) {
            // 无道具：提示缺少+道具信息+产出地，直接终止
            cm.sendOk(`#r缺少道具，挑战都纳斯需要${needItemNum}个#v${needItemId}##t${needItemId}##k#r！\r\n该道具可在${itemSource}产出，请先准备好道具再尝试挑战！`);
            cm.dispose();
            return;
        }

        // 有道具：继续原有副本进入规则（地图人数判断）
        if (cm.getPlayerCount(802000410) <= 1) {//BOSS地图无人，逆奥BOSS暂不能重连，因此允许玩家掉线后点NPC进入，改为0则不允许
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
                    // 【道具消耗】所有组队规则验证通过，消耗道具（最后一步验证后消耗，避免误扣）
                    cm.gainItem(needItemId, -needItemNum);
                    var canGoIn = true;
                    var cause;
                    if (canGoIn && cm.getPlayerCount(802000410) <= 0) { //地图中没人的话就重置地图
                        var Map1 = cm.getMap(802000410);
                        Map1.resetFully();
                        cm.warpParty(802000410, 0);
                        return true;
                    } else if (canGoIn && cm.getPlayerCount(802000410) > 0) { //地图中有人的话就不重置
                        cm.warpParty(802000410, 0);
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
    } else {
        cm.dispose(); // 其他情况（如对话超时）
    }
}