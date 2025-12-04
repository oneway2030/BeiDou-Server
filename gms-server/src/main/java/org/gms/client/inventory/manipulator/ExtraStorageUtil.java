package org.gms.client.inventory.manipulator;

import org.gms.client.Client;
import org.gms.client.Character;
import org.gms.client.inventory.Inventory;
import org.gms.client.inventory.InventoryType;
import org.gms.client.inventory.Item;
import org.gms.client.inventory.ModifyInventory;
import org.gms.constants.inventory.ItemConstants;
import org.gms.server.ItemInformationProvider;
import org.gms.server.ExtraStorage;
import org.gms.util.PacketCreator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Collections;
import java.util.Iterator;
import java.util.List;

/**
 * 矿石仓库工具类，处理矿石的存入、取出等操作
 * 适配项目中InventoryManipulator的调用风格，确保addById最后一个参数为long类型
 */
public class ExtraStorageUtil {
    private static final Logger log = LoggerFactory.getLogger(ExtraStorageUtil.class);
    private static final ItemInformationProvider ii = ItemInformationProvider.getInstance();

    /**
     * 从背包向矿石仓库存入矿石
     *
     * @param c        客户端对象
     * @param itemId   矿石物品ID
     * @param quantity 数量
     * @param type    物品类型
     * @return 是否存入成功
     */
    public static boolean storeItem(Client c, int itemId, int quantity, int type) {
        Character chr = c.getPlayer();
        int itemQuantity = chr.getItemQuantity(itemId, false);
        // 检查背包中是否有足物品
        if (itemQuantity < quantity) {
            chr.dropMessage("背包中矿石数量不足");
            return false;
        }
        // 存入矿石仓库
        if(chr.getExtraStorage().addItem(itemId, quantity,type)){
            // 持久化数据
            chr.getExtraStorage().saveToDB();
            // 从背包移除矿石
            InventoryManipulator.removeById(
                    c,
                    ItemConstants.getInventoryType(itemId),
                    itemId,
                    quantity,
                    false,
                    true
            );
            return true;
        }
        return false;
    }

    /**
     * 从矿石仓库取出矿石到背包
     *
     * @param c        客户端对象
     * @param itemId   矿石物品ID
     * @param quantity 数量
     * @param type    物品类型
     * @return 是否取出成功
     */
    public static boolean takeOutItem(Client c, int itemId, int quantity, int type) {
        Character chr = c.getPlayer();
        ExtraStorage extraStorage = chr.getExtraStorage();

        // 检查仓库中是否有足够矿石
        if (extraStorage.getItemQuantity(itemId, type) < quantity) {
            chr.dropMessage("矿石仓库中数量不足");
            return false;
        }

        // 从仓库移除矿石
        if (extraStorage.removeItem(itemId, quantity, type)) {
            // 添加到背包（使用最后一个参数为long的addById重载）
            boolean added = addItemToInventory(c, itemId, (short) quantity, null, -1, (short) 0, -1L);
            if (added) {
                extraStorage.saveToDB();
                return true;
            } else {
                // 背包满了，回滚仓库操作
                extraStorage.addItem(itemId, quantity, type);
                chr.dropMessage("背包空间不足");
            }
        }
        return false;
    }

    /**
     * 向背包添加矿石（适配long类型expiration参数）
     * 完全遵循项目中InventoryManipulator的内部实现风格
     */
    private static boolean addItemToInventory(Client c, int itemId, short quantity, String owner, int petid, short flag, long expiration) {
        Character chr = c.getPlayer();
        InventoryType type = ItemConstants.getInventoryType(itemId);
        Inventory inv = chr.getInventory(type);

        inv.lockInventory();
        try {
            return addItemInternal(c, chr, type, inv, itemId, quantity, owner, petid, flag, expiration);
        } finally {
            inv.unlockInventory();
        }
    }

    /**
     * 内部实现矿石添加逻辑，确保最后一个参数为long类型
     * 参考InventoryManipulator.addByIdInternal的实现
     */
    private static boolean addItemInternal(Client c, Character chr, InventoryType type, Inventory inv,
                                           int itemId, short quantity, String owner, int petid,
                                           short flag, long expiration) {
        if (!type.equals(InventoryType.EQUIP)) {
            short slotMax = ii.getSlotMax(c, itemId);
            List<Item> existing = inv.linkedListById(itemId);

            if (!ItemConstants.isRechargeable(itemId) && petid == -1) {
                // 合并现有堆叠
                if (!existing.isEmpty()) {
                    Iterator<Item> iterator = existing.iterator();
                    while (quantity > 0 && iterator.hasNext()) {
                        Item eItem = iterator.next();
                        short oldQ = eItem.getQuantity();
                        if (oldQ < slotMax && (eItem.getOwner().equals(owner) || owner == null) && eItem.getFlag() == flag) {
                            short newQ = (short) Math.min(oldQ + quantity, slotMax);
                            quantity -= (newQ - oldQ);
                            eItem.setQuantity(newQ);
                            eItem.setExpiration(expiration); // 传入long类型的expiration
                            c.sendPacket(PacketCreator.modifyInventory(true,
                                    Collections.singletonList(new ModifyInventory(1, eItem))));
                        }
                    }
                }

                // 处理剩余数量
                boolean sandboxItem = (flag & ItemConstants.SANDBOX) == ItemConstants.SANDBOX;
                while (quantity > 0) {
                    short newQ = (short) Math.min(quantity, slotMax);
                    if (newQ <= 0) {
                        c.sendPacket(PacketCreator.enableActions());
                        return false;
                    }

                    quantity -= newQ;
                    Item nItem = new Item(itemId, (short) 0, newQ, petid);
                    nItem.setFlag(flag);
                    nItem.setExpiration(expiration); // 传入long类型的expiration

                    short newSlot = inv.addItem(nItem);
                    if (newSlot == -1) {
                        c.sendPacket(PacketCreator.getInventoryFull());
                        c.sendPacket(PacketCreator.getShowInventoryFull());
                        return false;
                    }

                    if (owner != null) {
                        nItem.setOwner(owner);
                    }
                    c.sendPacket(PacketCreator.modifyInventory(true,
                            Collections.singletonList(new ModifyInventory(0, nItem))));

                    if (sandboxItem) {
                        chr.setHasSandboxItem();
                    }
                }
            } else {
                Item nItem = new Item(itemId, (short) 0, quantity, petid);
                nItem.setFlag(flag);
                nItem.setExpiration(expiration); // 传入long类型的expiration

                short newSlot = inv.addItem(nItem);
                if (newSlot == -1) {
                    c.sendPacket(PacketCreator.getInventoryFull());
                    c.sendPacket(PacketCreator.getShowInventoryFull());
                    return false;
                }
                c.sendPacket(PacketCreator.modifyInventory(true,
                        Collections.singletonList(new ModifyInventory(0, nItem))));

                if ((flag & ItemConstants.SANDBOX) == ItemConstants.SANDBOX) {
                    chr.setHasSandboxItem();
                }
            }
            return true;
        } else {
            // 矿石通常不是装备，这里做异常处理
            log.error("尝试将装备作为矿石添加: itemId={}", itemId);
            return false;
        }
    }
}