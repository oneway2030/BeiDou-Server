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

import org.gms.client.Character;
import org.gms.client.Client;
import org.gms.client.inventory.Equip;
import org.gms.client.inventory.EquipUtils;
import org.gms.client.inventory.InventoryType;
import org.gms.client.inventory.Item;
import org.gms.client.inventory.manipulator.InventoryManipulator;
import org.gms.constants.inventory.ItemConstants;
import org.gms.net.AbstractPacketHandler;
import org.gms.net.packet.InPacket;
import org.gms.net.packet.Packet;
import org.gms.net.server.Server;
import org.gms.net.server.world.World;
import org.gms.server.CashShop;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.gms.server.ItemInformationProvider;
import org.gms.server.MTSItemInfo;
import org.gms.util.DatabaseConnection;
import org.gms.util.PacketCreator;
import org.gms.util.Pair;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

public final class MTSHandler extends AbstractPacketHandler {
    private static final Logger log = LoggerFactory.getLogger(MTSHandler.class);
    private static final int SELL_MAX_COUNT = 30;
    private static final boolean IS_USE_MESO = true; //true 金币 false 点卷
    public static final int MESO_PROPORTION = 10000; //金币比例
    public static final float TAX_RATE = 0.1f; //税率，百分之10的税
    public static final int MAX_PRICE = 180000; //出售的最高金额


    @Override
    public void handlePacket(InPacket p, Client c) {
        // TODO add karma-to-untradeable flag on sold items here

        if (!c.getPlayer().getCashShop().isOpened()) {
            return;
        }
        if (p.available() > 0) {
            byte op = p.readByte();
            switch (op) {
                case 2: { //put item up for sale
                    byte itemtype = p.readByte();
                    int itemid = p.readInt();
                    p.readShort();
                    p.skip(7);
                    short stars = 1;
                    if (itemtype == 1) {
                        p.skip(32);
                    } else {
                        stars = p.readShort();
                    }
                    p.readString(); // another useless thing (owner)
                    if (itemtype == 1) {
                        p.skip(32);
                    } else {
                        p.readShort();
                    }
                    short slot;
                    short quantity;
                    if (itemtype != 1) {
                        if (itemid / 10000 == 207 || itemid / 10000 == 233) {
                            p.skip(8);
                        }
                        slot = (short) p.readInt();
                    } else {
                        slot = (short) p.readInt();
                    }
                    if (itemtype != 1) {
                        if (itemid / 10000 == 207 || itemid / 10000 == 233) {
                            quantity = stars;
                            p.skip(4);
                        } else {
                            quantity = (short) p.readInt();
                        }
                    } else {
                        quantity = (byte) p.readInt();
                    }
                    int price = p.readInt();
                    if (IS_USE_MESO && price > MAX_PRICE) {
                        c.getPlayer().dropMessage(1, "最大金额只能" + MAX_PRICE + " （相当于" + MAX_PRICE / 10000 + "e）");
                        c.sendPacket(getMTS(1, 0, 0));
                        c.sendPacket(PacketCreator.transferInventory(getTransfer(c.getPlayer().getId())));
                        c.sendPacket(PacketCreator.notYetSoldInv(getNotYetSold(c.getPlayer().getId())));
                        return;
                    }
                    if (itemtype == 1) {
                        quantity = 1;
                    }
                    if (quantity < 0 || price < 110 || c.getPlayer().getItemQuantity(itemid, false) < quantity) {
                        return;
                    }
                    InventoryType invType = ItemConstants.getInventoryType(itemid);
                    Item i = c.getPlayer().getInventory(invType).getItem(slot).copy();
                    if (i != null && c.getPlayer().getMeso() >= 5000) {
                        try (Connection con = DatabaseConnection.getConnection();
                             PreparedStatement ps = con.prepareStatement("SELECT COUNT(*) FROM mts_items WHERE seller = ?");) {
                            ps.setInt(1, c.getPlayer().getId());
                            ResultSet rs = ps.executeQuery();
                            if (rs.next()) {
                                if (rs.getInt(1) > SELL_MAX_COUNT) { // They have more than 10 items up for sale already!
                                    c.getPlayer().dropMessage(1, "最多只能上架" + SELL_MAX_COUNT + "件商品!");
                                    c.sendPacket(getMTS(1, 0, 0));
                                    c.sendPacket(PacketCreator.transferInventory(getTransfer(c.getPlayer().getId())));
                                    c.sendPacket(PacketCreator.notYetSoldInv(getNotYetSold(c.getPlayer().getId())));
                                    return;
                                }
                            }

                            LocalDate now = LocalDate.now();
                            LocalDate sellEnd = now.plusDays(7);
                            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
                            String date = sellEnd.format(formatter);

                            if (!i.getInventoryType().equals(InventoryType.EQUIP)) {
                                Item item = i;
                                try (PreparedStatement pse = con.prepareStatement("INSERT INTO mts_items (tab, type, itemid, quantity, expiration, giftFrom, seller, price, owner, sellername, sell_ends) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")) {
                                    pse.setInt(1, 1);
                                    pse.setInt(2, invType.getType());
                                    pse.setInt(3, item.getItemId());
                                    pse.setInt(4, quantity);
                                    pse.setLong(5, item.getExpiration());
                                    pse.setString(6, item.getGiftFrom());
                                    pse.setInt(7, c.getPlayer().getId());
                                    pse.setInt(8, price);
                                    pse.setString(9, item.getOwner());
                                    pse.setString(10, c.getPlayer().getName());
                                    pse.setString(11, date);
                                    pse.executeUpdate();
                                }
                            } else {
                                // 若不可交易，提示并终止流程
                                Equip equip = (Equip) i;
                                boolean isUntradeable = (equip.getFlag() & ItemConstants.LOCK) != 0
                                        || (equip.getFlag() & ItemConstants.UNTRADEABLE) != 0
                                        || (equip.getFlag() & ItemConstants.MERGE_UNTRADEABLE) != 0
                                        || (equip.getExpiration() > 0);
                                if (isUntradeable) {
                                    c.getPlayer().dropMessage(1, "该装备不能交易");
                                    c.sendPacket(getMTS(1, 0, 0));
                                    c.sendPacket(PacketCreator.transferInventory(getTransfer(c.getPlayer().getId())));
                                    c.sendPacket(PacketCreator.notYetSoldInv(getNotYetSold(c.getPlayer().getId())));
                                    return;
                                }
                                EquipUtils.insertMtsTable(c, con, invType, equip, quantity, price, date);
                            }
                            InventoryManipulator.removeFromSlot(c, invType, slot, quantity, false);

                        } catch (SQLException e) {
                            e.printStackTrace();
                        }
                        c.getPlayer().gainMeso(-5000, false);
                        c.sendPacket(PacketCreator.MTSConfirmSell());
                        c.sendPacket(getMTS(1, 0, 0));
                        c.enableCSActions();
                        c.sendPacket(PacketCreator.transferInventory(getTransfer(c.getPlayer().getId())));
                        c.sendPacket(PacketCreator.notYetSoldInv(getNotYetSold(c.getPlayer().getId())));
                    }
                    break;
                }
                case 3: //send offer for wanted item
                    break;
                case 4: //list wanted item
                    p.readInt();
                    p.readInt();
                    p.readInt();
                    p.readShort();
                    p.readString();
                    break;
                case 5: { //change page
                    int tab = p.readInt();
                    int type = p.readInt();
                    int page = p.readInt();
                    c.getPlayer().changePage(page);
                    if (tab == 4 && type == 0) {
                        c.sendPacket(getCart(c.getPlayer().getId()));
                    } else if (tab == c.getPlayer().getCurrentTab() && type == c.getPlayer().getCurrentType() && c.getPlayer().getSearch() != null) {
                        c.sendPacket(getMTSSearch(tab, type, c.getPlayer().getCi(), c.getPlayer().getSearch(), page));
                    } else {
                        c.getPlayer().setSearch(null);
                        c.sendPacket(getMTS(tab, type, page));
                    }
                    c.getPlayer().changeTab(tab);
                    c.getPlayer().changeType(type);
                    c.enableCSActions();
                    c.sendPacket(PacketCreator.transferInventory(getTransfer(c.getPlayer().getId())));
                    c.sendPacket(PacketCreator.notYetSoldInv(getNotYetSold(c.getPlayer().getId())));
                    break;
                }
                case 6: { //search
                    int tab = p.readInt();
                    int type = p.readInt();
                    p.readInt();
                    int ci = p.readInt();
                    String search = p.readString();
                    c.getPlayer().setSearch(search);
                    c.getPlayer().changeTab(tab);
                    c.getPlayer().changeType(type);
                    c.getPlayer().changeCI(ci);
                    c.enableCSActions();
                    c.sendPacket(PacketCreator.enableActions());
                    c.sendPacket(getMTSSearch(tab, type, ci, search, c.getPlayer().getCurrentPage()));
                    c.sendPacket(PacketCreator.showMTSCash(c.getPlayer()));
                    c.sendPacket(PacketCreator.transferInventory(getTransfer(c.getPlayer().getId())));
                    c.sendPacket(PacketCreator.notYetSoldInv(getNotYetSold(c.getPlayer().getId())));
                    break;
                }
                case 7: { //cancel sale
                    int id = p.readInt(); // id of the item
                    try (Connection con = DatabaseConnection.getConnection()) {
                        try (PreparedStatement ps = con.prepareStatement("UPDATE mts_items SET transfer = 1 WHERE id = ? AND seller = ?")) {
                            ps.setInt(1, id);
                            ps.setInt(2, c.getPlayer().getId());
                            ps.executeUpdate();
                        }

                        try (PreparedStatement ps = con.prepareStatement("DELETE FROM mts_cart WHERE itemid = ?")) {
                            ps.setInt(1, id);
                            ps.executeUpdate();
                        }
                    } catch (SQLException e) {
                        e.printStackTrace();
                    }
                    c.enableCSActions();
                    c.sendPacket(getMTS(c.getPlayer().getCurrentTab(), c.getPlayer().getCurrentType(),
                            c.getPlayer().getCurrentPage()));
                    c.sendPacket(PacketCreator.notYetSoldInv(getNotYetSold(c.getPlayer().getId())));
                    c.sendPacket(PacketCreator.transferInventory(getTransfer(c.getPlayer().getId())));
                    break;
                }
                case 8: { // transfer item from transfer inv.
                    int id = p.readInt(); // id of the item
                    try (Connection con = DatabaseConnection.getConnection()) {
                        try (PreparedStatement ps = con.prepareStatement("SELECT * FROM mts_items WHERE seller = ? AND transfer = 1  AND id= ? ORDER BY id DESC")) {
                            ps.setInt(1, c.getPlayer().getId());
                            ps.setInt(2, id);
                            ResultSet rs = ps.executeQuery();
                            if (rs.next()) {
                                Item i;
                                if (rs.getInt("type") != 1) {
                                    Item ii = new Item(rs.getInt("itemid"), (short) 0, (short) rs.getInt("quantity"));
                                    ii.setOwner(rs.getString("owner"));
                                    ii.setPosition(
                                            c.getPlayer().getInventory(ItemConstants.getInventoryType(rs.getInt("itemid")))
                                                    .getNextFreeSlot());
                                    i = ii.copy();
                                } else {
                                    Equip equip = new Equip(rs.getInt("itemid"), (byte) rs.getInt("position"), -1);
                                    equip.loadEquipFromDb(equip, rs);
                                    equip.setPosition(
                                            c.getPlayer().getInventory(ItemConstants.getInventoryType(rs.getInt("itemid")))
                                                    .getNextFreeSlot());
                                    i = equip.copy();
                                }
                                try (PreparedStatement pse = con.prepareStatement(
                                        "DELETE FROM mts_items WHERE id = ? AND seller = ? AND transfer = 1")) {
                                    pse.setInt(1, id);
                                    pse.setInt(2, c.getPlayer().getId());
                                    pse.executeUpdate();
                                }
                                //TODO wanwei 拍卖就是这里添加装备物品
                                InventoryManipulator.addFromDrop(c, i, false);
                                c.enableCSActions();
                                c.sendPacket(getCart(c.getPlayer().getId()));
                                c.sendPacket(getMTS(c.getPlayer().getCurrentTab(), c.getPlayer().getCurrentType(),
                                        c.getPlayer().getCurrentPage()));
                                c.sendPacket(PacketCreator.MTSConfirmTransfer(i.getQuantity(), i.getPosition()));
                                c.sendPacket(PacketCreator.transferInventory(getTransfer(c.getPlayer().getId())));
                            }
                        }
                    } catch (SQLException e) {
                        log.error("MTS Transfer error", e);
                    }
                    break;
                }
                case 9: { //add to cart
                    int id = p.readInt(); // id of the item
                    try (Connection con = DatabaseConnection.getConnection()) {
                        try (PreparedStatement ps1 = con.prepareStatement("SELECT id FROM mts_items WHERE id = ? AND seller <> ?")) {
                            ps1.setInt(1, id); // Dummy query, prevents adding to cart self owned items
                            ps1.setInt(2, c.getPlayer().getId());
                            try (ResultSet rs1 = ps1.executeQuery()) {
                                if (rs1.next()) {
                                    PreparedStatement ps = con.prepareStatement("SELECT cid FROM mts_cart WHERE cid = ? AND itemid = ?");
                                    ps.setInt(1, c.getPlayer().getId());
                                    ps.setInt(2, id);
                                    try (ResultSet rs = ps.executeQuery()) {
                                        if (!rs.next()) {
                                            try (PreparedStatement pse = con.prepareStatement("INSERT INTO mts_cart (cid, itemid) VALUES (?, ?)")) {
                                                pse.setInt(1, c.getPlayer().getId());
                                                pse.setInt(2, id);
                                                pse.executeUpdate();
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    } catch (SQLException e) {
                        e.printStackTrace();
                    }
                    c.sendPacket(getMTS(c.getPlayer().getCurrentTab(), c.getPlayer().getCurrentType(), c.getPlayer().getCurrentPage()));
                    c.enableCSActions();
                    c.sendPacket(PacketCreator.enableActions());
                    c.sendPacket(PacketCreator.transferInventory(getTransfer(c.getPlayer().getId())));
                    c.sendPacket(PacketCreator.notYetSoldInv(getNotYetSold(c.getPlayer().getId())));
                    break;
                }
                case 10: { //delete from cart
                    int id = p.readInt(); // id of the item
                    try (Connection con = DatabaseConnection.getConnection()) {
                        try (PreparedStatement ps = con.prepareStatement("DELETE FROM mts_cart WHERE itemid = ? AND cid = ?")) {
                            ps.setInt(1, id);
                            ps.setInt(2, c.getPlayer().getId());
                            ps.executeUpdate();
                        }
                    } catch (SQLException e) {
                        e.printStackTrace();
                    }
                    c.sendPacket(getCart(c.getPlayer().getId()));
                    c.enableCSActions();
                    c.sendPacket(PacketCreator.transferInventory(getTransfer(c.getPlayer().getId())));
                    c.sendPacket(PacketCreator.notYetSoldInv(getNotYetSold(c.getPlayer().getId())));
                    break;
                }
                case 12: //put item up for auction
                    break;
                case 13: //cancel wanted cart thing
                    break;
                case 14: //buy auction item now
                    break;
                case 16://buy
                case 17://buy from cart
                    buyItem(p, c, op, IS_USE_MESO);
                    break;
                default:
                    log.warn("Unhandled OP (MTS): {}, packet: {}", op, p);
                    break;
            }
        } else {
            c.sendPacket(PacketCreator.showMTSCash(c.getPlayer()));
        }
    }

    private void gainCash(Character character, int price, boolean isMeso) {
        if (isMeso) {
            character.gainMeso(getRealPrice(price));
        } else {
            character.getCashShop().gainCash(CashShop.NX_CREDIT, price);
        }
    }

    private boolean isCanBuy(Client c, int price, boolean isMeso) {
        boolean isCanBuy;
        if (isMeso) {
            isCanBuy = c.getPlayer().getMeso() >= price * MESO_PROPORTION;
        } else {
            isCanBuy = c.getPlayer().getCashShop().getCash(CashShop.NX_CREDIT) >= price;
        }
        return isCanBuy;
    }

    public int getRealPrice(int price) {
        return price * MESO_PROPORTION;
    }

    private void buyItem(InPacket p, Client c, byte op, boolean isUseMeso) {
        int id = p.readInt(); // id of the item
        try (Connection con = DatabaseConnection.getConnection();
             PreparedStatement ps = con.prepareStatement("SELECT * FROM mts_items WHERE id = ? ORDER BY id DESC")) {
            ps.setInt(1, id);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                int orgPrice = rs.getInt("price");
                int paymentPrice = orgPrice + (int) (orgPrice * TAX_RATE); // taxes
                int sellerId = rs.getInt("seller");
                if (isCanBuy(c, paymentPrice, isUseMeso)) { // FIX
                    boolean alwaysnull = true;
                    List<World> worlds = Server.getInstance().getWorlds();
                    for (World world : worlds) {
                        Character victim = world.getPlayerStorage().getCharacterById(sellerId);
                        if (victim != null) {
                            //如果在线则直接增加
                            gainCash(victim, orgPrice, isUseMeso);
                            alwaysnull = false;
                            break;
                        }
                    }
                    //如果用户不在线则直接数据库添加
                    if (alwaysnull) {
                        if (isUseMeso) {
                            //替换原有更新accounts表的代码，改为直接更新characters表的meso字段
                            try (PreparedStatement pse = con.prepareStatement("UPDATE characters SET meso = meso + ? WHERE id = ?")) {
                                pse.setInt(1, getRealPrice(orgPrice)); // 要增加的meso数量（原有的orgPrice，即卖家应得金额）
                                pse.setInt(2, sellerId); // 角色ID（原有的sellerId，无需再查询accountid）
                                pse.executeUpdate(); // 执行更新操作
                            }
                        } else {
                            try (PreparedStatement pse = con.prepareStatement("SELECT accountid FROM characters WHERE id = ?")) {
                                pse.setInt(1, sellerId);
                                ResultSet rse = pse.executeQuery();
                                if (rse.next()) {
                                    int sellerAccountId = rse.getInt("accountid");
                                    try (PreparedStatement psee = con.prepareStatement("UPDATE accounts SET nxCredit = nxCredit + ? WHERE id = ?")) {
                                        psee.setInt(1, orgPrice);
                                        psee.setInt(2, sellerAccountId);
                                        psee.executeUpdate();
                                    }
                                }
                            }
                        }
                    }
                    try (PreparedStatement pse = con.prepareStatement("UPDATE mts_items SET seller = ?, transfer = 1 WHERE id = ?")) {
                        pse.setInt(1, c.getPlayer().getId());
                        pse.setInt(2, id);
                        pse.executeUpdate();
                    }
                    try (PreparedStatement pse = con.prepareStatement("DELETE FROM mts_cart WHERE itemid = ?")) {
                        pse.setInt(1, id);
                        pse.executeUpdate();
                    }
                    gainCash(c.getPlayer(), -paymentPrice, isUseMeso);
                    if (op == 17) {
                        c.sendPacket(getCart(c.getPlayer().getId()));
                    }
                    c.enableCSActions();
                    if (op == 16) {
                        c.sendPacket(getMTS(c.getPlayer().getCurrentTab(), c.getPlayer().getCurrentType(), c.getPlayer().getCurrentPage()));
                    }
                    c.sendPacket(PacketCreator.MTSConfirmBuy());
                    c.sendPacket(PacketCreator.showMTSCash(c.getPlayer()));
                    c.sendPacket(PacketCreator.transferInventory(getTransfer(c.getPlayer().getId())));
                    c.sendPacket(PacketCreator.notYetSoldInv(getNotYetSold(c.getPlayer().getId())));
                    if (op == 16) {
                        c.sendPacket(PacketCreator.enableActions());
                    }
                } else {
                    c.getPlayer().dropMessage(1, "金币不足");
                    c.sendPacket(PacketCreator.enableActions());
//                    c.sendPacket(PacketCreator.MTSFailBuy());
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
            c.getPlayer().dropMessage(1, "购买失败，可能原因：卖方金币太多（背包+出售所得可能超过21E）");
            c.sendPacket(PacketCreator.enableActions());
//            c.sendPacket(PacketCreator.MTSFailBuy());
        }
    }

    public List<MTSItemInfo> getNotYetSold(int cid) {
        List<MTSItemInfo> items = new ArrayList<>();
        try (Connection con = DatabaseConnection.getConnection();
             PreparedStatement ps = con.prepareStatement("SELECT * FROM mts_items WHERE seller = ? AND transfer = 0 ORDER BY id DESC")) {
            ps.setInt(1, cid);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                if (rs.getInt("type") != 1) {
                    Item i = new Item(rs.getInt("itemid"), (byte) 0, (short) rs.getInt("quantity"));
                    i.setOwner(rs.getString("owner"));
                    items.add(new MTSItemInfo(i, rs.getInt("price"), rs.getInt("id"), rs.getInt("seller"), rs.getString("sellername"), rs.getString("sell_ends")));
                } else {
                    Equip equip = new Equip(rs.getInt("itemid"), (byte) rs.getInt("position"), -1);
                    equip.loadEquipFromDb(equip, rs);
                    items.add(new MTSItemInfo(equip, rs.getInt("price"), rs.getInt("id"), rs.getInt("seller"), rs.getString("sellername"), rs.getString("sell_ends")));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return items;
    }

    public Packet getCart(int cid) {
        List<MTSItemInfo> items = new ArrayList<>();
        int pages = 0;
        try (Connection con = DatabaseConnection.getConnection()) {
            try (PreparedStatement ps = con.prepareStatement("SELECT * FROM mts_cart WHERE cid = ? ORDER BY id DESC")) {
                ps.setInt(1, cid);
                ResultSet rs = ps.executeQuery();
                while (rs.next()) {
                    try (PreparedStatement pse = con.prepareStatement("SELECT * FROM mts_items WHERE id = ?")) {
                        pse.setInt(1, rs.getInt("itemid"));
                        ResultSet rse = pse.executeQuery();
                        if (rse.next()) {
                            if (rse.getInt("type") != 1) {
                                Item i = new Item(rse.getInt("itemid"), (short) 0, (short) rse.getInt("quantity"));
                                i.setOwner(rse.getString("owner"));
                                items.add(new MTSItemInfo(i, rse.getInt("price"), rse.getInt("id"),
                                        rse.getInt("seller"), rse.getString("sellername"), rse.getString("sell_ends")));
                            } else {
                                Equip equip = new Equip(rse.getInt("itemid"), (byte) rse.getInt("position"), -1);
                                equip.loadEquipFromDb(equip, rse);
                                items.add(new MTSItemInfo(equip, rse.getInt("price"), rse.getInt("id"),
                                        rse.getInt("seller"), rse.getString("sellername"), rse.getString("sell_ends")));
                            }
                        }
                    }
                }
            }
            try (PreparedStatement ps = con.prepareStatement("SELECT COUNT(*) FROM mts_cart WHERE cid = ?")) {
                ps.setInt(1, cid);
                ResultSet rs = ps.executeQuery();
                if (rs.next()) {
                    pages = rs.getInt(1) / 16;
                    if (rs.getInt(1) % 16 > 0) {
                        pages += 1;
                    }
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return PacketCreator.sendMTS(items, 4, 0, 0, pages);
    }

    public List<MTSItemInfo> getTransfer(int cid) {
        List<MTSItemInfo> items = new ArrayList<>();
        try (Connection con = DatabaseConnection.getConnection();
             PreparedStatement ps = con.prepareStatement("SELECT * FROM mts_items WHERE transfer = 1 AND seller = ? ORDER BY id DESC")) {
            ps.setInt(1, cid);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                if (rs.getInt("type") != 1) {
                    Item i = new Item(rs.getInt("itemid"), (short) 0, (short) rs.getInt("quantity"));
                    i.setOwner(rs.getString("owner"));
                    items.add(new MTSItemInfo(i, rs.getInt("price"), rs.getInt("id"), rs.getInt("seller"), rs.getString("sellername"), rs.getString("sell_ends")));
                } else {
                    Equip equip = new Equip(rs.getInt("itemid"), (byte) rs.getInt("position"), -1);
                    equip.loadEquipFromDb(equip, rs);
                    items.add(new MTSItemInfo(equip, rs.getInt("price"), rs.getInt("id"), rs.getInt("seller"), rs.getString("sellername"), rs.getString("sell_ends")));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return items;
    }

    private static Packet getMTS(int tab, int type, int page) {
        List<MTSItemInfo> items = new ArrayList<>();
        int pages = 0;
        try (Connection con = DatabaseConnection.getConnection()) {
            String sql;
            if (type != 0) {
                sql = "SELECT * FROM mts_items WHERE tab = ? AND type = ? AND transfer = 0 ORDER BY id DESC LIMIT ?, 16";
            } else {
                sql = "SELECT * FROM mts_items WHERE tab = ? AND transfer = 0 ORDER BY id DESC LIMIT ?, 16";
            }
            try (PreparedStatement ps = con.prepareStatement(sql)) {
                ps.setInt(1, tab);
                if (type != 0) {
                    ps.setInt(2, type);
                    ps.setInt(3, page * 16);
                } else {
                    ps.setInt(2, page * 16);
                }
                ResultSet rs = ps.executeQuery();
                while (rs.next()) {
                    if (rs.getInt("type") != 1) {
                        Item i = new Item(rs.getInt("itemid"), (short) 0, (short) rs.getInt("quantity"));
                        i.setOwner(rs.getString("owner"));
                        items.add(new MTSItemInfo(i, rs.getInt("price"), rs.getInt("id"), rs.getInt("seller"),
                                rs.getString("sellername"), rs.getString("sell_ends")));
                    } else {
                        Equip equip = new Equip(rs.getInt("itemid"), (byte) rs.getInt("position"), -1);
                        equip.loadEquipFromDb(equip, rs);
                        items.add(new MTSItemInfo(equip, rs.getInt("price"), rs.getInt("id"), rs.getInt("seller"), rs.getString("sellername"), rs.getString("sell_ends")));
                    }
                }
            }
            try (PreparedStatement ps = con.prepareStatement("SELECT COUNT(*) FROM mts_items WHERE tab = ? " + (type != 0 ? "AND type = ?" : "") + " AND transfer = 0")) {
                ps.setInt(1, tab);
                if (type != 0) {
                    ps.setInt(2, type);
                }
                ResultSet rs = ps.executeQuery();
                if (rs.next()) {
                    pages = rs.getInt(1) / 16;
                    if (rs.getInt(1) % 16 > 0) {
                        pages++;
                    }
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return PacketCreator.sendMTS(items, tab, type, page, pages); // resniff
    }

    public Packet getMTSSearch(int tab, int type, int cOi, String search, int page) {
        List<MTSItemInfo> items = new ArrayList<>();
        ItemInformationProvider ii = ItemInformationProvider.getInstance();
        String listaitems = "";
        if (cOi != 0) {
            List<String> retItems = new ArrayList<>();
            for (Pair<Integer, String> itemPair : ii.getAllItems()) {
                if (itemPair.getRight().toLowerCase().contains(search.toLowerCase())) {
                    retItems.add(" itemid=" + itemPair.getLeft() + " OR ");
                }
            }
            listaitems += " AND (";
            if (retItems != null && retItems.size() > 0) {
                for (String singleRetItem : retItems) {
                    listaitems += singleRetItem;
                }
                listaitems += " itemid=0 )";
            }
        } else {
            listaitems = " AND sellername LIKE CONCAT('%','" + search + "', '%')";
        }
        int pages = 0;
        try (Connection con = DatabaseConnection.getConnection()) {
            String sql;
            if (type != 0) {
                sql = "SELECT * FROM mts_items WHERE tab = ? " + listaitems + " AND type = ? AND transfer = 0 ORDER BY id DESC LIMIT ?, 16";
            } else {
                sql = "SELECT * FROM mts_items WHERE tab = ? " + listaitems + " AND transfer = 0 ORDER BY id DESC LIMIT ?, 16";
            }
            try (PreparedStatement ps = con.prepareStatement(sql)) {
                ps.setInt(1, tab);
                if (type != 0) {
                    ps.setInt(2, type);
                    ps.setInt(3, page * 16);
                } else {
                    ps.setInt(2, page * 16);
                }
                ResultSet rs = ps.executeQuery();
                while (rs.next()) {
                    if (rs.getInt("type") != 1) {
                        Item i = new Item(rs.getInt("itemid"), (short) 0, (short) rs.getInt("quantity"));
                        i.setOwner(rs.getString("owner"));
                        items.add(new MTSItemInfo(i, rs.getInt("price"), rs.getInt("id"), rs.getInt("seller"), rs.getString("sellername"), rs.getString("sell_ends")));
                    } else {
                        Equip equip = new Equip(rs.getInt("itemid"), (byte) rs.getInt("position"), -1);
                        equip.loadEquipFromDb(equip, rs);
                        items.add(new MTSItemInfo(equip, rs.getInt("price"), rs.getInt("id"), rs.getInt("seller"), rs.getString("sellername"), rs.getString("sell_ends")));
                    }
                }
            }
            if (type == 0) {
                try (PreparedStatement ps = con.prepareStatement("SELECT COUNT(*) FROM mts_items WHERE tab = ? " + listaitems + " AND transfer = 0")) {
                    ps.setInt(1, tab);
                    if (type != 0) {
                        ps.setInt(2, type);
                    }
                    ResultSet rs = ps.executeQuery();
                    if (rs.next()) {
                        pages = rs.getInt(1) / 16;
                        if (rs.getInt(1) % 16 > 0) {
                            pages++;
                        }
                    }
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return PacketCreator.sendMTS(items, tab, type, page, pages);
    }
}
