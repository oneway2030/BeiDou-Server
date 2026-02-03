var timeLimit = 1;
// 集中配置挑战所需道具信息，后续修改ID/数量/产出地直接改这里
var needItemId = 4001254;    // 所需道具ID
var needItemNum = 1;         // 所需道具数量
var itemSource = "贝尔加莫特";// 道具产出地

function start() {
    var playerMap = cm.getPlayer().getMapId();
    if (playerMap == 802000801) {
        cm.sendYesNo("你想#r离开#k这个地方？但是出去后无法返回战场...");
    } else if (playerMap == 802000800) {
        cm.sendYesNo(`  想挑战BOSS#b布雷兹首脑#k和欧碧池...哦不，#b欧碧拉#k吗？\r\n需要${needItemNum}个#v${needItemId}##t${needItemId}##k方可进入（该道具可在${itemSource}产出）`);
    } else if (playerMap == 802000802) {
        cm.sendYesNo("这里的脉冲阵列很难突破...\r\n但是...支付100W金币，便能直接通过。");
    } else if (playerMap == 802000803 && cm.getMap(802000803).countMonster(9400296) > 0) {
        cm.sendYesNo("你还没有击败布雷兹首脑，现在就要#r离开#k吗？");
    } else if (playerMap == 802000803) {
        cm.sendYesNo("你已经击败了布雷兹首脑，要前往下一阶段吗？");
    } else if (playerMap == 802000804) {
        cm.sendYesNo("（缺少脚本，直接跳过此阶段）");
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
        // 802000801地图：离开战场，保留原逻辑
        if (playerMap == 802000801) {
            cm.warp(802000800, 0);
            cm.dispose();
        }
        // 802000802地图：100W金币通行，保留原逻辑
        else if (playerMap == 802000802) {
            cm.gainMeso(-1000000);//扣除金币
            cm.warp(802000803, 1);
            cm.dispose();
        }
        // 802000803地图：未击败BOSS离开，保留原逻辑
        else if (playerMap == 802000803 && cm.getMap(802000803).countMonster(9400296) > 0) {
            cm.warp(802000800, 0);
            cm.dispose();
        }
        // 802000803地图：击败BOSS进下一阶段，保留原逻辑
        else if (playerMap == 802000803) {
            cm.warp(802000804, 0);
            cm.dispose();
        }
        // 802000804地图：跳过阶段，保留原逻辑
        else if (playerMap == 802000804) {
            cm.warp(802000805, 0);
            cm.dispose();
        }
        // 802000800地图：挑战BOSS核心逻辑，添加道具验证
        else if (playerMap == 802000800) {
            // 要求2：道具前置验证，无道具直接提示终止
            if (!cm.haveItem(needItemId, needItemNum)) {
                cm.sendOk(`#r缺少挑战所需道具！#k\r\n挑战布雷兹首脑&欧碧拉需要${needItemNum}个#v${needItemId}##t${needItemId}##k，该道具可在${itemSource}产出，请准备好后再尝试！`);
                cm.dispose();
                return;
            }

            // 有道具，继续原有地图人数判断规则
            if (cm.getPlayerCount(802000801) <= 1 && cm.getPlayerCount(802000802) <= 1 && cm.getPlayerCount(802000803) <= 1 && cm.getPlayerCount(802000804) <= 1 && cm.getPlayerCount(802000805) <= 1 && cm.getPlayerCount(802000806) <= 1) {
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
                    // 所有组队规则验证通过，消耗道具
                    cm.gainItem(needItemId, -needItemNum);
                    // 判断是否需要重置6个副本地图
                    var isAllMapEmpty = cm.getPlayerCount(802000801) <= 0 && cm.getPlayerCount(802000802) <= 0 && cm.getPlayerCount(802000803) <= 0 && cm.getPlayerCount(802000804) <= 0 && cm.getPlayerCount(802000805) <= 0 && cm.getPlayerCount(802000806) <= 0;
                    if (isAllMapEmpty) {
                        // 所有地图无人，重置全部6个地图
                        var Map1 = cm.getMap(802000801);
                        var Map2 = cm.getMap(802000802);
                        var Map3 = cm.getMap(802000803);
                        var Map4 = cm.getMap(802000804);
                        var Map5 = cm.getMap(802000805);
                        var Map6 = cm.getMap(802000806);
                        Map1.resetFully();
                        Map2.resetFully();
                        Map3.resetFully();
                        Map4.resetFully();
                        Map5.resetFully();
                        Map6.resetFully();
                    }
                    // 传送队伍进入初始地图
                    cm.warpParty(802000801, 0);
                    return true;
                }
            } else {
                cm.sendOk("与BOSS的战斗已经开始了，所以你不能进入这个地方。");
                cm.dispose();
            }
        }
    } else {
        cm.dispose(); // 其他情况（如超时）
    }
}