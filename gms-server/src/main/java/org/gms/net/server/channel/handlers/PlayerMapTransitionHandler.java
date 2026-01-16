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

package org.gms.net.server.channel.handlers;

import org.gms.client.BuffStat;
import org.gms.client.Character;
import org.gms.client.Client;
import org.gms.net.AbstractPacketHandler;
import org.gms.net.packet.InPacket;
import org.gms.net.server.channel.ChannelListenerManager;
import org.gms.server.life.Monster;
import org.gms.server.maps.MapObject;
import org.gms.server.maps.MapleMap;
import org.gms.util.PacketCreator;
import org.gms.util.Pair;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * @author Ronan
 * 玩家完成切换地图触发
 */
public final class PlayerMapTransitionHandler extends AbstractPacketHandler {
    private static final Logger log = LoggerFactory.getLogger(PlayerMapTransitionHandler.class);

    @Override
    public final void handlePacket(InPacket p, Client c) {
        Character chr = c.getPlayer();
        int oldMapId = chr.getMapId(); // 记录切换前的地图ID
        chr.setMapTransitionComplete(); // 标记地图切换完成
        String accountName = c.getAccountName() == null ? "未知账号" : c.getAccountName();
        String playerName = chr.getName() == null ? "未知玩家" : chr.getName();
        try {
            MapleMap currentMap = chr.getMap();
            if (currentMap == null) {
                log.warn("[PlayerMapTransitionHandler] 玩家地图未加载 | 账号: {} | 玩家: {}", accountName, playerName);
                c.enableActions();
                return;
            }
            int beaconid = chr.getBuffSource(BuffStat.HOMING_BEACON);
            if (beaconid != -1) {
                chr.cancelBuffStats(BuffStat.HOMING_BEACON);
                final List<Pair<BuffStat, Integer>> stat = Collections.singletonList(new Pair<>(BuffStat.HOMING_BEACON, 0));
                chr.sendPacket(PacketCreator.giveBuff(1, beaconid, stat));
            }

            if (!chr.isHidden()) {  // thanks Lame (Conrad) for noticing hidden characters controlling mobs
                List<MapObject> monsterList = new ArrayList<>(chr.getMap().getMonsters());
                for (MapObject mo : monsterList) {    // thanks BHB, IxianMace, Jefe for noticing several issues regarding mob statuses (such as freeze)
                    if (mo instanceof Monster) {
                        Monster m = (Monster) mo;
                        if (m.getSpawnEffect() == 0 || m.getHp() < m.getMaxHp()) {     // avoid effect-spawning mobs
                            if (m.getController() == chr) {
                                c.sendPacket(PacketCreator.stopControllingMonster(m.getObjectId()));
                                m.sendDestroyData(c);
                                m.aggroRemoveController();
                            } else {
                                m.sendDestroyData(c);
                            }
                            m.sendSpawnData(c);
                            m.aggroSwitchController(chr, false);
                        }
                    } else {
                        // 非Monster类型对象记录日志，不中断流程
                        log.warn("[PlayerMapTransitionHandler] 怪物列表混入非Monster类型对象 | 玩家: {} | 地图: {}({}) | 对象ID: {} | 类型: {}",
                                playerName, currentMap.getMapName(), currentMap.getId(), mo.getObjectId(), mo.getClass().getName());
                    }
                }
            }
            // 触发地图切换完成回调（核心扩展点）
            int newMapId = chr.getMapId(); // 切换后的地图ID
            try {
                ChannelListenerManager.onMapTransitionComplete(chr, oldMapId, newMapId);
            } catch (Exception e) {
                log.error("[PlayerMapTransitionHandler] 地图切换回调执行失败 | 玩家: {} | 旧地图: {} | 新地图: {}",
                        playerName, oldMapId, newMapId, e);
            }
        } catch (Exception e) {
            // 捕获所有业务异常，打印完整上下文
            String mapInfo = chr.getMap() != null ?
                    String.format("%s(%d)", chr.getMap().getMapName(), chr.getMapId()) : "未知地图";
            log.error("[PlayerMapTransitionHandler] 处理封包出错 | 账号: {} | 玩家: {} | 地图: {} | 封包长度: {}字节",
                    accountName, playerName, mapInfo, p.available(), e);
            // 兜底：解除客户端假死，避免玩家卡屏
            c.enableActions();
        }
    }
}