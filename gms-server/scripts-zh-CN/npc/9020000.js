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

/**
 * @author: Ronan
 * @npc: Lakelis
 * @map: 103000000 - Kerning City
 * @func: Kerning PQ
 */

var status = 0;
var state;
var em = null;

function start() {
    status = -1;
    state = (cm.getMapId() >= 103000800 && cm.getMapId() <= 103000805) ? 1 : 0;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        if (mode == 0 && status == 0) {
            cm.dispose();
            return;
        }
        if (mode == 1) {
            status++;
        } else {
            status--;
        }

        if (status == 0) {
            if (state == 1) {
                cm.sendYesNo("你希望放弃这个区域吗？");
            } else {
                em = cm.getEventManager("KerningPQ");
                if (em == null) {
                    cm.sendOk("废弃都市组队任务遇到了一个错误。");
                    cm.dispose();
                } else if (cm.isUsingOldPqNpcStyle()) {
                    action(1, 0, 0);
                    return;
                }

                cm.sendSimple("#e#b<组队任务：废都下水道>\r\n#k#n" + em.getProperty("party") + "\r\n\r\n你和你的队伍成员一起完成任务怎么样？在这里，你会遇到障碍和问题，如果没有出色的团队合作，你是无法完成的。如果你想尝试，请告诉你的#b队伍领袖#k来找我谈谈。#b\r\n#L0#我想参加组队任务。\r\n#L1#我想" + (cm.getPlayer().isRecvPartySearchInviteEnabled() ? "关闭" : "开启") + "组队搜索。\r\n#L2#我想了解更多细节。");
            }
        } else if (status == 1) {
            if (state == 1) {
                cm.warp(103000000);
                cm.dispose();
            } else {
                if (selection == 0) {
                    if (cm.getParty() == null) {
                        cm.sendOk("只有当你加入一个队伍时，你才能参加组队任务。");
                        cm.dispose();
                    } else if (!cm.isLeader()) {
                        cm.sendOk("必须由你的队长与我交谈才能开始这个组队任务。");
                        cm.dispose();
                    } else {
                        //判断ip是否超过2个
                        if (checkDuplicateIpExceedTwo()) {
                            let tip = "#b同一个玩家最多只能有2个角色能同时进入该副本\r\n";
                            tip += "#r（该副本是为增强互动而设计，因此一个玩家最多只能有2个角色可同时进入，不必找GM，找了也不会理你）\r\n";
                            cm.sendOk(tip);
                        } else {
                            var eli = em.getEligibleParty(cm.getParty());
                            if (eli.size() > 0) {
                                if (!em.startInstance(cm.getParty(), cm.getPlayer().getMap(), 1)) {
                                    cm.sendOk("另一个队伍已经进入了该频道的#r组队任务#k。请尝试其他频道，或者等待当前队伍完成。");
                                }
                            } else {
                                cm.sendOk("你目前无法开始这个组队任务，因为你的队伍可能不符合人数要求，有些队员可能不符合参与条件，或者他们不在这张地图上。如果你找不到队员，可以尝试使用组队搜索功能。");
                            }
                        }
                        cm.dispose();
                    }
                } else if (selection == 1) {
                    var psState = cm.getPlayer().toggleRecvPartySearchInvite();
                    cm.sendOk("你的组队搜索状态现在是：#b" + (psState ? "启用" : "禁用") + "#k。想要改变状态时随时找我谈谈。");
                    cm.dispose();
                } else {
                    cm.sendOk("#e#b<组队任务：废都下水道>#k#n\r\n在完成这个组队任务的子目标时，你的队伍必须通过许多障碍和谜题。与你的团队协调合作，以便进一步前进，击败最终BOSS，并收集掉落物品以获得奖励和额外阶段的机会。");
                    cm.dispose();
                }
            }
        }
    }
}

/**
 * 检查队伍中IP地址重复数量是否超过2个
 * @returns {boolean} 若存在超过2个相同IP则返回true，否则返回false
 */
function checkDuplicateIpExceedTwo() {
    let maxIpCount = 2;
    let curMapId = cm.getMapId();
    var party = cm.getParty();
    if (party == null) {
        return false; // 无队伍时默认不超标
    }

    var ipCountMap = {}; // 存储IP出现次数的映射表
    var onlineMembers = party.getPartyMembersOnline(); // 获取在线队员列表

    for (var i = 0; i < onlineMembers.size(); i++) {
        var partyMember = onlineMembers.get(i);
        var memberChar = partyMember.getPlayer(); // 获取队员的Character对象

        if (memberChar == null || memberChar.isGM() || curMapId !== memberChar.getMapId()) {
            continue; // 跳过获取失败的队员
        }

        var client = memberChar.getClient();
        if (client == null) {
            continue; // 跳过无客户端连接的队员
        }

        var remoteAddress = client.getRemoteAddress();
        if (remoteAddress) {
            // 统计IP出现次数
            ipCountMap[remoteAddress] = (ipCountMap[remoteAddress] || 0) + 1;

            // 提前判断：若当前IP已超过2个，直接返回true
            if (ipCountMap[remoteAddress] > maxIpCount) {
                return true;
            }
        }
    }

    // 遍历所有IP检查是否有超标
    for (var ip in ipCountMap) {
        if (ipCountMap[ip] > maxIpCount) {
            return true;
        }
    }

    return false; // 所有IP均未超过2个
}