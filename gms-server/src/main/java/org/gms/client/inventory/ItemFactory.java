/*
 This file is part of the OdinMS Maple Story Server
 Copyright (C) 2008 Patrick Huy <patrick.huy@frz.cc>
 Matthias Butz <matze@odinms.de>
 Jan Christian Meyer <vimes@odinms.de>

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License version 3
 as published by the Free Software Foundation. You may not use, modify
 or distribute this program under any other version of the
 GNU Affero General Public License.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Affero General Public License for more details.

 You should have received a copy of the GNU Affero General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package org.gms.client.inventory;

import org.gms.util.DatabaseConnection;
import org.gms.util.Pair;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

/**
 * @author Flav
 */
public enum ItemFactory {

    INVENTORY(1, false),
    STORAGE(2, true),
    CASH_EXPLORER(3, true),
    CASH_CYGNUS(4, true),
    CASH_ARAN(5, true),
    MERCHANT(6, false),
    CASH_OVERALL(7, true),
    MARRIAGE_GIFTS(8, false),
    DUEY(9, false);
    private final int value;
    private final boolean account;

    private static final int lockCount = 400;
    private static final Lock[] locks = new Lock[lockCount];  // thanks Masterrulax for pointing out a bottleneck issue here

    static {
        for (int i = 0; i < lockCount; i++) {
            locks[i] = new ReentrantLock(true);
        }
    }

    ItemFactory(int value, boolean account) {
        this.value = value;
        this.account = account;
    }

    public int getValue() {
        return value;
    }

    /**
     * 按账号id or 角色id加载物品
     *
     * @param id    账号id or 角色id。注意：如果是仓库，这个id是storageId，而非账号id
     * @param login 是否是已装备
     * @return 物品信息
     * @throws SQLException 查询异常
     */
    public List<Pair<Item, InventoryType>> loadItems(int id, boolean login) throws SQLException {
        if (value != 6) {
            return loadItemsCommon(id, login);
        } else {
            return loadItemsMerchant(id, login);
        }
    }

    public void saveItems(List<Pair<Item, InventoryType>> items, int id, Connection con) throws SQLException {
        saveItems(items, null, id, con);
    }

    public void saveItems(List<Pair<Item, InventoryType>> items, List<Short> bundlesList, int id, Connection con) throws SQLException {
        // thanks Arufonsu, MedicOP, BHB for pointing a "synchronized" bottleneck here

        if (value != 6) {
            saveItemsCommon(items, id, con);
        } else {
            saveItemsMerchant(items, bundlesList, id, con);
        }
    }

    private static Equip loadEquipFromResultSet(ResultSet rs) throws SQLException {
        Equip equip = new Equip(rs.getInt("itemid"), (short) rs.getInt("position"));
        equip.loadEquipFromDb(equip, rs);
        return equip;
    }

    public static List<Pair<Item, Integer>> loadEquippedItems(int id, boolean isAccount, boolean login) throws SQLException {
        List<Pair<Item, Integer>> items = new ArrayList<>();

        StringBuilder query = new StringBuilder();
        query.append("SELECT * FROM ");
        query.append("(SELECT id, accountid FROM characters) AS accountterm ");
        query.append("RIGHT JOIN ");
        query.append("(SELECT * FROM (`inventoryitems` LEFT JOIN `inventoryequipment` USING(`inventoryitemid`))) AS equipterm");
        query.append(" ON accountterm.id=equipterm.characterid ");
        query.append("WHERE accountterm.`");
        query.append(isAccount ? "accountid" : "characterid");
        query.append("` = ?");
        query.append(login ? " AND `inventorytype` = " + InventoryType.EQUIPPED.getType() : "");

        try (Connection con = DatabaseConnection.getConnection()) {
            try (PreparedStatement ps = con.prepareStatement(query.toString())) {
                ps.setInt(1, id);

                try (ResultSet rs = ps.executeQuery()) {
                    while (rs.next()) {
                        Integer cid = rs.getInt("characterid");
                        items.add(new Pair<>(loadEquipFromResultSet(rs), cid));
                    }
                }
            }
        }

        return items;
    }

    private List<Pair<Item, InventoryType>> loadItemsCommon(int id, boolean login) throws SQLException {
        List<Pair<Item, InventoryType>> items = new ArrayList<>();

        try (Connection con = DatabaseConnection.getConnection()) {
            StringBuilder query = new StringBuilder();
            query.append("SELECT * FROM `inventoryitems` LEFT JOIN `inventoryequipment` USING(`inventoryitemid`) WHERE `type` = ? AND `");
            query.append(account ? "accountid" : "characterid").append("` = ?");

            if (login) {
                query.append(" AND `inventorytype` = ").append(InventoryType.EQUIPPED.getType());
            }

            try (PreparedStatement ps = con.prepareStatement(query.toString())) {
                ps.setInt(1, value);
                ps.setInt(2, id);

                try (ResultSet rs = ps.executeQuery()) {
                    while (rs.next()) {
                        InventoryType mit = InventoryType.getByType(rs.getByte("inventorytype"));

                        if (mit.equals(InventoryType.EQUIP) || mit.equals(InventoryType.EQUIPPED)) {
                            items.add(new Pair<>(loadEquipFromResultSet(rs), mit));
                        } else {
                            int petid = rs.getInt("petid");
                            if (rs.wasNull()) {
                                petid = -1;
                            }

                            Item item = new Item(rs.getInt("itemid"), (byte) rs.getInt("position"), (short) rs.getInt("quantity"), petid);
                            item.setOwner(rs.getString("owner"));
                            item.setExpiration(rs.getLong("expiration"));
                            item.setGiftFrom(rs.getString("giftFrom"));
                            item.setFlag((short) rs.getInt("flag"));
                            items.add(new Pair<>(item, mit));
                        }
                    }
                }
            }
        }
        return items;
    }

    private void saveItemsCommon(List<Pair<Item, InventoryType>> items, int id, Connection con) throws SQLException {
        Lock lock = locks[id % lockCount];
        lock.lock();
        try {
            StringBuilder query = new StringBuilder();
            query.append("DELETE `inventoryitems`, `inventoryequipment` FROM `inventoryitems` LEFT JOIN `inventoryequipment` USING(`inventoryitemid`) WHERE `type` = ? AND `");
            query.append(account ? "accountid" : "characterid").append("` = ?");

            try (PreparedStatement ps = con.prepareStatement(query.toString())) {
                ps.setInt(1, value);
                ps.setInt(2, id);
                ps.executeUpdate();
            }

            try (PreparedStatement psItem = con.prepareStatement("INSERT INTO `inventoryitems` VALUES (DEFAULT, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", Statement.RETURN_GENERATED_KEYS)) {
                if (!items.isEmpty()) {
                    for (Pair<Item, InventoryType> pair : items) {
                        Item item = pair.getLeft();
                        InventoryType mit = pair.getRight();
                        psItem.setInt(1, value);
                        psItem.setString(2, account ? null : String.valueOf(id));
                        psItem.setString(3, account ? String.valueOf(id) : null);
                        psItem.setInt(4, item.getItemId());
                        psItem.setInt(5, mit.getType());
                        psItem.setInt(6, item.getPosition());
                        psItem.setInt(7, item.getQuantity());
                        psItem.setString(8, item.getOwner());
                        psItem.setInt(9, item.getPetId());      // thanks Daddy Egg for alerting a case of unique petid constraint breach getting raised
                        psItem.setInt(10, item.getFlag());
                        psItem.setLong(11, item.getExpiration());
                        psItem.setString(12, item.getGiftFrom());
                        psItem.executeUpdate();
                        int genKey = 0;
                        if (mit.equals(InventoryType.EQUIP) || mit.equals(InventoryType.EQUIPPED)) {
                            try (ResultSet rs = psItem.getGeneratedKeys()) {
                                if (!rs.next()) {
                                    throw new RuntimeException("Inserting item failed.");
                                }
                                genKey = rs.getInt(1);
                            }
                            EquipUtils.insertEquipTable((Equip) item, genKey, con);
                        }
                    }
                }
            }
        } finally {
            lock.unlock();
        }
    }

    private List<Pair<Item, InventoryType>> loadItemsMerchant(int id, boolean login) throws SQLException {
        List<Pair<Item, InventoryType>> items = new ArrayList<>();

        try (Connection con = DatabaseConnection.getConnection()) {
            StringBuilder query = new StringBuilder();
            query.append("SELECT * FROM `inventoryitems` LEFT JOIN `inventoryequipment` USING(`inventoryitemid`) WHERE `type` = ? AND `");
            query.append(account ? "accountid" : "characterid").append("` = ?");

            if (login) {
                query.append(" AND `inventorytype` = ").append(InventoryType.EQUIPPED.getType());
            }

            try (PreparedStatement ps = con.prepareStatement(query.toString())) {
                ps.setInt(1, value);
                ps.setInt(2, id);

                try (ResultSet rs = ps.executeQuery()) {
                    while (rs.next()) {
                        short bundles = 0;
                        try (PreparedStatement psBundle = con.prepareStatement("SELECT `bundles` FROM `inventorymerchant` WHERE `inventoryitemid` = ?")) {
                            psBundle.setInt(1, rs.getInt("inventoryitemid"));

                            try (ResultSet rs2 = psBundle.executeQuery()) {
                                if (rs2.next()) {
                                    bundles = rs2.getShort("bundles");
                                }
                            }
                        }

                        InventoryType mit = InventoryType.getByType(rs.getByte("inventorytype"));

                        if (mit.equals(InventoryType.EQUIP) || mit.equals(InventoryType.EQUIPPED)) {
                            items.add(new Pair<>(loadEquipFromResultSet(rs), mit));
                        } else {
                            if (bundles > 0) {
                                int petid = rs.getInt("petid");
                                if (rs.wasNull()) {
                                    petid = -1;
                                }

                                Item item = new Item(rs.getInt("itemid"), (byte) rs.getInt("position"), (short) (bundles * rs.getInt("quantity")), petid);
                                item.setOwner(rs.getString("owner"));
                                item.setExpiration(rs.getLong("expiration"));
                                item.setGiftFrom(rs.getString("giftFrom"));
                                item.setFlag((short) rs.getInt("flag"));
                                items.add(new Pair<>(item, mit));
                            }
                        }
                    }
                }
            }
        }
        return items;
    }

    private void saveItemsMerchant(List<Pair<Item, InventoryType>> items, List<Short> bundlesList, int id, Connection con) throws SQLException {
        Lock lock = locks[id % lockCount];
        lock.lock();
        try {
            try (PreparedStatement ps = con.prepareStatement("DELETE FROM `inventorymerchant` WHERE `characterid` = ?")) {
                ps.setInt(1, id);
                ps.executeUpdate();
            }

            StringBuilder query = new StringBuilder();
            query.append("DELETE `inventoryitems`, `inventoryequipment` FROM `inventoryitems` LEFT JOIN `inventoryequipment` USING(`inventoryitemid`) WHERE `type` = ? AND `");
            query.append(account ? "accountid" : "characterid").append("` = ?");

            try (PreparedStatement ps = con.prepareStatement(query.toString())) {
                ps.setInt(1, value);
                ps.setInt(2, id);
                ps.executeUpdate();
            }

            int i = 0;
            for (Pair<Item, InventoryType> pair : items) {
                final Item item = pair.getLeft();
                final Short bundles = bundlesList.get(i);
                final InventoryType mit = pair.getRight();
                i++;

                final int genKey;
                // Item
                try (PreparedStatement ps = con.prepareStatement("INSERT INTO `inventoryitems` VALUES (DEFAULT, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", Statement.RETURN_GENERATED_KEYS)) {
                    ps.setInt(1, value);
                    ps.setString(2, account ? null : String.valueOf(id));
                    ps.setString(3, account ? String.valueOf(id) : null);
                    ps.setInt(4, item.getItemId());
                    ps.setInt(5, mit.getType());
                    ps.setInt(6, item.getPosition());
                    ps.setInt(7, item.getQuantity());
                    ps.setString(8, item.getOwner());
                    ps.setInt(9, item.getPetId());
                    ps.setInt(10, item.getFlag());
                    ps.setLong(11, item.getExpiration());
                    ps.setString(12, item.getGiftFrom());
                    ps.executeUpdate();

                    try (ResultSet rs = ps.getGeneratedKeys()) {
                        if (!rs.next()) {
                            throw new RuntimeException("Inserting item failed.");
                        }

                        genKey = rs.getInt(1);
                    }
                }

                // Merchant
                try (PreparedStatement ps = con.prepareStatement("INSERT INTO `inventorymerchant` VALUES (DEFAULT, ?, ?, ?)", Statement.RETURN_GENERATED_KEYS)) {
                    ps.setInt(1, genKey);
                    ps.setInt(2, id);
                    ps.setInt(3, bundles);
                    ps.executeUpdate();
                }

                // Equipment
                if (mit.equals(InventoryType.EQUIP) || mit.equals(InventoryType.EQUIPPED)) {
                    EquipUtils.insertEquipTable((Equip) item, genKey, con);
                }
            }
        } finally {
            lock.unlock();
        }
    }
}
