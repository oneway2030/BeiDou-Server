/*
	This file is part of the OdinMS Maple Story Server
    Copyright (C) 2008 Patrick Huy <patrick.huy@frz.cc>
		       Matthias Butz <matze@odinms.de>
		       Jan Christian Meyer <vimes@odinms.de>

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

import org.gms.client.Client;
import org.gms.client.Character;
import org.gms.client.inventory.Item;
import org.gms.client.inventory.manipulator.InventoryManipulator;
import org.gms.constants.inventory.ItemConstants;
import org.gms.net.AbstractPacketHandler;
import org.gms.net.packet.InPacket;
import org.gms.net.server.Server;
import org.gms.scripting.AbstractPlayerInteraction;
import org.gms.scripting.item.ItemScriptManager;
import org.gms.server.ItemInformationProvider;
import org.gms.server.ItemInformationProvider.ScriptedItem;
import org.gms.util.PacketCreator;
import org.gms.util.Randomizer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.concurrent.ConcurrentHashMap;


/**
 * @author Jay Estrella
 */
public final class ScriptedItemHandler extends AbstractPacketHandler {
    // 道具使用冷却时间（毫秒），防止并发点击
    private static final long ITEM_COOLDOWN = 1000;
    // 记录玩家最后使用此道具的时间
    private static final ConcurrentHashMap<Integer, Long> lastUsedTime = new ConcurrentHashMap<>();
    private static final Logger log = LoggerFactory.getLogger(Server.class);

    @Override
    public final void handlePacket(InPacket p, Client c) {
        p.readInt(); // trash stamp, thanks RMZero213
        short itemSlot = p.readShort(); // item slot, thanks RMZero213
        int itemId = p.readInt();


        // 处理物品ID为2430680的特殊逻辑：随机获取任务品
        if (itemId == 2430680) {
            handleWorldQuest(c, itemId, itemSlot);
            return;
        }

        ItemInformationProvider ii = ItemInformationProvider.getInstance();
        ScriptedItem info = ii.getScriptedItemInfo(itemId);
        if (info == null) {
            return;
        }

        Item item = c.getPlayer().getInventory(ItemConstants.getInventoryType(itemId)).getItem(itemSlot);
        if (item == null || item.getItemId() != itemId || item.getQuantity() < 1) {
            return;
        }

        ItemScriptManager ism = ItemScriptManager.getInstance();
        ism.runItemScript(c, info, itemId);
    }

    private void handleWorldQuest(Client c, int itemId, short itemSlot) {
        // 0. 冷却检查：防止并发点击
        Character player = c.getPlayer();
        int charId = player.getId();
        long currentTime = System.currentTimeMillis();
        Long lastTime = lastUsedTime.get(charId);
        if (lastTime != null && (currentTime - lastTime) < ITEM_COOLDOWN) {
            // 冷却中，忽略此次请求
            c.sendPacket(PacketCreator.enableActions());
            return;
        }
        // 1. 验证物品是否存在且可使用
        Item item = player.getInventory(ItemConstants.getInventoryType(itemId)).getItem(itemSlot);
        if (item == null || item.getItemId() != itemId || item.getQuantity() < 1) {
            return;
        }

        // 2. 定义物品ID范围
        int[] group1 = new int[20]; // 2430681-2430700（共20个）
        for (int i = 0; i < group1.length; i++) {
            group1[i] = 2430681 + i;
        }

        int[] group2 = {2430701, 2430702, 2430703, 2430704, 2430705}; // 共5个

        // 3. 概率分配：group1每个物品概率相同，group2每个物品概率为group1的1/5
        // 总权重 = 20*5 + 5*1 = 105（确保概率比例）
        int totalWeight = 20 * 5 + 5 * 1;
        int random = Randomizer.nextInt(totalWeight);

        int rewardItemId = -1;

        // 4. 计算随机结果
        if (random < 20 * 5) {
            // 命中group1：每个物品分配5个权重
            int index = random / 5;
            rewardItemId = group1[index];
        } else {
            // 命中group2：每个物品分配1个权重
            int offset = random - 20 * 5;
            rewardItemId = group2[offset];
        }

        // 5. 发放奖励并消耗道具
        if (rewardItemId != -1) {
            lastUsedTime.put(charId, currentTime);
            // 检查背包空间
            if (InventoryManipulator.checkSpace(c, rewardItemId, (short) 1, "")) {
                // 添加奖励物品
                AbstractPlayerInteraction absPlayer = c.getAbstractPlayerInteraction();
                absPlayer.gainItem(rewardItemId, (short) 1);
                // 消耗使用的道具
                removeItem(c, itemId, itemSlot);
                // 更新冷却时间（成功使用后）
                // 发送提示消息
                player.dropMessage(5, "获得了任务物品：" + ItemInformationProvider.getInstance().getName(rewardItemId));
            } else {
                player.dropMessage(1, "背包空间不足，无法获得物品！");
                c.sendPacket(PacketCreator.enableActions());
            }
        }
    }

    /**
     * 统一处理物品移除和动作启用
     */
    private void removeItem(Client c, int itemId, short slot) {
        InventoryManipulator.removeFromSlot(c, ItemConstants.getInventoryType(itemId), slot, (short) 1, false);
        c.sendPacket(PacketCreator.enableActions());
    }
}
