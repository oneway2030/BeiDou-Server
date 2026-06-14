var timeLimit = 1;
var dailyLimit = 20000;
var bossKey = "贝尔加莫特_";

function start() {
    var used = cm.getAccountExtendValue(bossKey + cm.getPlayer().getId(), true);
    used = (used == null || used === "") ? 0 : parseInt(used);
    cm.sendYesNo("你想挑战BOSS贝尔加莫特吗？\r\n #r（疑似易闪退，此战建议多开，图里有人时可重连）#k");
    // cm.sendYesNo("你想挑战BOSS贝尔加莫特吗？\r\n#r（疑似易闪退，此战建议多开，图里有人时可重连）\r\n#b（当日最多挑战" + dailyLimit + "次，当前已经挑战" + used + "次）#k");
}

function action(mode, type, selection) {
    if (mode == 0) {
        cm.dispose();
    } else if (mode == 1) {
        if (cm.getPlayerCount(802000211) <= 1) {
            var player = cm.getPlayer();
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
                    for (var i = 0; i < members.size(); i++) {
                        var chr = members.get(i).getPlayer();
                        var used = cm.getAccountExtendValue(bossKey + chr.getId(), true);
                        used = (used == null || used === "") ? 0 : parseInt(used);
                        if (used >= dailyLimit) {
                            // cm.sendOk(chr.getName() + "今日挑战次数已用尽！(每日" + dailyLimit + "次)");
                            cm.dispose();
                            return;
                        }
                    }
                    var canGoIn = true;
                    var cause;
                    if (canGoIn && cm.getPlayerCount(802000211) <= 0) {
                        var Map1 = cm.getMap(802000211);
                        Map1.resetFully();
                        cm.warpParty(802000211, 0);
                        members = player.getPartyMembersOnSameMap();
                        for (var i = 0; i < members.size(); i++) {
                            var mid = members.get(i).getId();
                            var used = cm.getAccountExtendValue(bossKey + mid, true);
                            used = (used == null || used === "") ? 0 : parseInt(used);
                            cm.saveOrUpdateAccountExtendValue(bossKey + mid, String(used + 1), true);
                        }
                        return true;
                    } else if (canGoIn && cm.getPlayerCount(802000211) > 0) {
                        var Map1 = cm.getMap(802000211);
                        cm.warpParty(802000211, 0);
                        members = player.getPartyMembersOnSameMap();
                        for (var i = 0; i < members.size(); i++) {
                            var mid = members.get(i).getId();
                            var used = cm.getAccountExtendValue(bossKey + mid, true);
                            used = (used == null || used === "") ? 0 : parseInt(used);
                            cm.saveOrUpdateAccountExtendValue(bossKey + mid, String(used + 1), true);
                        }
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
        cm.dispose();
    }
}