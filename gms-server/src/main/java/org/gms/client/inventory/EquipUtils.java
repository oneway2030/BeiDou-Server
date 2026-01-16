package org.gms.client.inventory;

import com.mybatisflex.core.query.QueryWrapper;
import com.mybatisflex.core.row.Row;
import org.gms.client.Client;
import org.gms.dao.entity.InventoryequipmentDO;
import org.gms.dao.entity.InventoryitemsDO;
import org.gms.dao.mapper.InventoryequipmentMapper;
import org.gms.model.dto.InventoryEquipRtnDTO;
import org.gms.model.dto.InventorySearchRtnDTO;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.Optional;

import static org.gms.dao.entity.table.InventoryequipmentDOTableDef.INVENTORYEQUIPMENT_D_O;

public class EquipUtils {

    public static void insertEquipTable(Equip item, int genKey, Connection con) throws SQLException {
        try (PreparedStatement psEquip = con.prepareStatement("INSERT INTO `inventoryequipment` VALUES (DEFAULT, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")) {
            psEquip.setInt(1, genKey);
            Equip equip = item;
            psEquip.setInt(2, equip.getUpgradeSlots());
            psEquip.setInt(3, equip.getLevel());
            psEquip.setInt(4, equip.getStr());
            psEquip.setInt(5, equip.getDex());
            psEquip.setInt(6, equip.getInt());
            psEquip.setInt(7, equip.getLuk());
            psEquip.setInt(8, equip.getHp());
            psEquip.setInt(9, equip.getMp());
            psEquip.setInt(10, equip.getWatk());
            psEquip.setInt(11, equip.getMatk());
            psEquip.setInt(12, equip.getWdef());
            psEquip.setInt(13, equip.getMdef());
            psEquip.setInt(14, equip.getAcc());
            psEquip.setInt(15, equip.getAvoid());
            psEquip.setInt(16, equip.getHands());
            psEquip.setInt(17, equip.getSpeed());
            psEquip.setInt(18, equip.getJump());
            psEquip.setInt(19, 0);
            psEquip.setInt(20, equip.getVicious());
            psEquip.setInt(21, equip.getItemLevel());
            psEquip.setInt(22, equip.getItemExp());
            psEquip.setInt(23, equip.getRingId());
            psEquip.setString(24, equip.getUpgradeHistory());
            //TODO equip 新增属性
            psEquip.setInt(25, equip.getLevelExpand());
            psEquip.setInt(26, equip.getCombinationType());
            psEquip.setInt(27, equip.getMaxStar());
            psEquip.setInt(28, equip.getStarLevel());
            psEquip.setInt(29, equip.getStarCount());
            psEquip.setInt(30, equip.getUpgradeResetCount());
            psEquip.setInt(31, equip.getUpgradeReturn());
            psEquip.setString(32, equip.getChaosHistory());
            psEquip.setString(33, equip.getAbsorbHistory());
            psEquip.setInt(34, equip.getExpandAttribute1());
            psEquip.setInt(35, equip.getExpandAttribute2());
            psEquip.setString(36, equip.getExpandAttribute3());
            psEquip.setString(37, equip.getExpandAttribute4());
            psEquip.executeUpdate();
        }
    }

    public static Equip getEquip(Integer itemId, Short position, InventoryEquipRtnDTO inventoryEquipment) {
        Equip equip = new Equip(itemId, position);
        equip.setUpgradeSlots(Optional.ofNullable(inventoryEquipment.getUpgradeSlots()).orElse((byte) 0));
        equip.setLevel(Optional.ofNullable(inventoryEquipment.getLevel()).orElse((byte) 0));
        equip.setStr(Optional.ofNullable(inventoryEquipment.getAttStr()).orElse((short) 0));
        equip.setDex(Optional.ofNullable(inventoryEquipment.getAttDex()).orElse((short) 0));
        equip.setInt(Optional.ofNullable(inventoryEquipment.getAttInt()).orElse((short) 0));
        equip.setLuk(Optional.ofNullable(inventoryEquipment.getAttLuk()).orElse((short) 0));
        equip.setHp(Optional.ofNullable(inventoryEquipment.getHp()).orElse((short) 0));
        equip.setMp(Optional.ofNullable(inventoryEquipment.getMp()).orElse((short) 0));
        equip.setWatk(Optional.ofNullable(inventoryEquipment.getPAtk()).orElse((short) 0));
        equip.setMatk(Optional.ofNullable(inventoryEquipment.getMAtk()).orElse((short) 0));
        equip.setWdef(Optional.ofNullable(inventoryEquipment.getPDef()).orElse((short) 0));
        equip.setMdef(Optional.ofNullable(inventoryEquipment.getMDef()).orElse((short) 0));
        equip.setAcc(Optional.ofNullable(inventoryEquipment.getAcc()).orElse((short) 0));
        equip.setAvoid(Optional.ofNullable(inventoryEquipment.getAvoid()).orElse((short) 0));
        equip.setHands(Optional.ofNullable(inventoryEquipment.getHands()).orElse((short) 0));
        equip.setSpeed(Optional.ofNullable(inventoryEquipment.getSpeed()).orElse((short) 0));
        equip.setJump(Optional.ofNullable(inventoryEquipment.getJump()).orElse((short) 0));
        equip.setVicious(Optional.ofNullable(inventoryEquipment.getVicious()).orElse((short) 0));
        equip.setItemLevel(Optional.ofNullable(inventoryEquipment.getItemLevel()).orElse((byte) 0));
        equip.setItemExp(Optional.ofNullable(inventoryEquipment.getItemExp()).orElse(0));
        equip.setRingId(Optional.ofNullable(inventoryEquipment.getRingId()).orElse(0));
        equip.setUpgradeHistory(Optional.ofNullable(inventoryEquipment.getUpgradeHistory()).orElse(""));
        //TODO equip 新增属性
        equip.setLevelExpand(Optional.ofNullable(inventoryEquipment.getLevelExpand()).orElse(0));
        equip.setCombinationType(Optional.ofNullable(inventoryEquipment.getCombinationType()).orElse(0));
        equip.setStarLevel(Optional.ofNullable(inventoryEquipment.getStarLevel()).orElse(0));
        equip.setMaxStar(Optional.ofNullable(inventoryEquipment.getMaxStar()).orElse(0));
        equip.setStarCount(Optional.ofNullable(inventoryEquipment.getStarCount()).orElse(0));
        equip.setUpgradeResetCount(Optional.ofNullable(inventoryEquipment.getUpgradeResetCount()).orElse(0));
        equip.setUpgradeReturn(Optional.ofNullable(inventoryEquipment.getUpgradeReturn()).orElse(0));
        equip.setChaosHistory(Optional.ofNullable(inventoryEquipment.getChaosHistory()).orElse(""));
        equip.setAbsorbHistory(Optional.ofNullable(inventoryEquipment.getAbsorbHistory()).orElse(""));
        equip.setExpandAttribute1(Optional.ofNullable(inventoryEquipment.getExpandAttribute1()).orElse(0));
        equip.setExpandAttribute2(Optional.ofNullable(inventoryEquipment.getExpandAttribute2()).orElse(0));
        equip.setExpandAttribute3(Optional.ofNullable(inventoryEquipment.getExpandAttribute3()).orElse(""));
        equip.setExpandAttribute4(Optional.ofNullable(inventoryEquipment.getExpandAttribute4()).orElse(""));
        return equip;
    }

    public static void insertMtsTable(Client c, Connection con, InventoryType invType, Equip equip, short quantity, int price, String date) throws SQLException {
        try (PreparedStatement pse = con.prepareStatement("INSERT INTO mts_items (tab, type, itemid, quantity, expiration, giftFrom, seller, price, upgradeslots, level, str, dex, `int`, luk, hp, mp, watk, matk, wdef, mdef, acc, avoid, hands, speed, jump, locked, owner, sellername, sell_ends, vicious, flag, itemexp, itemlevel, ringid,upgradeHistory,levelExpand,combinationType, maxStar,starLevel,starCount,upgradeResetCount,upgradeReturn, chaosHistory,absorbHistory,expandAttribute1,expandAttribute2,expandAttribute3,expandAttribute4) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")) {
            pse.setInt(1, 1);
            pse.setInt(2, invType.getType());
            pse.setInt(3, equip.getItemId());
            pse.setInt(4, quantity);
            pse.setLong(5, equip.getExpiration());
            pse.setString(6, equip.getGiftFrom());
            pse.setInt(7, c.getPlayer().getId());
            pse.setInt(8, price);
            pse.setInt(9, equip.getUpgradeSlots());
            pse.setInt(10, equip.getLevel());
            pse.setInt(11, equip.getStr());
            pse.setInt(12, equip.getDex());
            pse.setInt(13, equip.getInt());
            pse.setInt(14, equip.getLuk());
            pse.setInt(15, equip.getHp());
            pse.setInt(16, equip.getMp());
            pse.setInt(17, equip.getWatk());
            pse.setInt(18, equip.getMatk());
            pse.setInt(19, equip.getWdef());
            pse.setInt(20, equip.getMdef());
            pse.setInt(21, equip.getAcc());
            pse.setInt(22, equip.getAvoid());
            pse.setInt(23, equip.getHands());
            pse.setInt(24, equip.getSpeed());
            pse.setInt(25, equip.getJump());
            pse.setInt(26, 0);
            pse.setString(27, equip.getOwner());
            pse.setString(28, c.getPlayer().getName());
            pse.setString(29, date);
            pse.setInt(30, equip.getVicious());
            pse.setInt(31, equip.getFlag());
            pse.setInt(32, equip.getItemExp());
            pse.setByte(33, equip.getItemLevel()); // thanks Jefe for noticing missing itemlevel labels
            pse.setInt(34, equip.getRingId());
            pse.setString(35, equip.getUpgradeHistory());
            //TODO equip 新增属性
            pse.setInt(36, equip.getLevelExpand());
            pse.setInt(37, equip.getCombinationType());
            pse.setInt(38, equip.getMaxStar());
            pse.setInt(39, equip.getStarLevel());
            pse.setInt(40, equip.getStarCount());
            pse.setInt(41, equip.getUpgradeResetCount());
            pse.setInt(42, equip.getUpgradeReturn());
            pse.setString(43, equip.getChaosHistory());
            pse.setString(44, equip.getAbsorbHistory());
            pse.setInt(45, equip.getExpandAttribute1());
            pse.setInt(46, equip.getExpandAttribute2());
            pse.setString(47, equip.getExpandAttribute3());
            pse.setString(48, equip.getExpandAttribute4());
            pse.executeUpdate();
        }
    }


    public static void buildByDb(Row obj, InventorySearchRtnDTO rtnDTO, Long inventoryEquipmentId) {
        InventoryEquipRtnDTO build = InventoryEquipRtnDTO.builder()
                .id(inventoryEquipmentId)
                .inventoryItemId(obj.getLong("inventoryitemid"))
                .upgradeSlots(obj.getByte("upgradeslots"))
                .level(obj.getByte("level"))
                .attStr(obj.getShort("str"))
                .attDex(obj.getShort("dex"))
                .attInt(obj.getShort("int"))
                .attLuk(obj.getShort("luk"))
                .hp(obj.getShort("hp"))
                .mp(obj.getShort("mp"))
                .pAtk(obj.getShort("watk"))
                .mAtk(obj.getShort("matk"))
                .pDef(obj.getShort("wdef"))
                .mDef(obj.getShort("mdef"))
                .acc(obj.getShort("acc"))
                .avoid(obj.getShort("avoid"))
                .hands(obj.getShort("hands"))
                .speed(obj.getShort("speed"))
                .jump(obj.getShort("jump"))
                .locked(obj.getInt("locked"))
                .vicious(obj.getShort("vicious"))
                .itemLevel(obj.getByte("itemlevel"))
                .itemExp(obj.getInt("itemexp"))
                .ringId(obj.getInt("ringid"))
                .upgradeHistory(obj.getString("upgradehistory"))
                .levelExpand(obj.getInt("levelExpand"))
                .combinationType(obj.getInt("combinationType"))
                .maxStar(obj.getInt("maxStar"))
                .starLevel(obj.getInt("starLevel"))
                .starCount(obj.getInt("starCount"))
                .upgradeResetCount(obj.getInt("upgradeResetCount"))
                .upgradeReturn(obj.getInt("upgradeReturn"))
                .chaosHistory(obj.getString("chaosHistory"))
                .absorbHistory(obj.getString("absorbHistory"))
                .expandAttribute1(obj.getInt("expandAttribute1"))
                .expandAttribute2(obj.getInt("expandAttribute2"))
                .expandAttribute3(obj.getString("expandAttribute3"))
                .expandAttribute4(obj.getString("expandAttribute4"))
                .build();
        rtnDTO.setInventoryEquipment(build);
    }

    public static void buildByOnline(InventorySearchRtnDTO rtnDTO, Equip equip) {
        rtnDTO.setInventoryEquipment(InventoryEquipRtnDTO.builder()
                .id(-1L)
                .inventoryItemId(-1L)
                .upgradeSlots(equip.getUpgradeSlots())
                .level(equip.getLevel())
                .attStr(equip.getStr())
                .attDex(equip.getDex())
                .attInt(equip.getInt())
                .attLuk(equip.getLuk())
                .hp(equip.getHp())
                .mp(equip.getMp())
                .pAtk(equip.getWatk())
                .mAtk(equip.getMatk())
                .pDef(equip.getWdef())
                .mDef(equip.getMdef())
                .acc(equip.getAcc())
                .avoid(equip.getAvoid())
                .hands(equip.getHands())
                .speed(equip.getSpeed())
                .jump(equip.getJump())
                .locked(0)
                .vicious(equip.getVicious())
                .itemLevel(equip.getItemLevel())
                .itemExp(equip.getItemExp())
                .ringId(equip.getRingId())
                .upgradeHistory(equip.getUpgradeHistory())
                //TODO equip 新增属性
                .levelExpand(equip.getLevelExpand())
                .combinationType(equip.getCombinationType())
                .maxStar(equip.getMaxStar())
                .starLevel(equip.getStarLevel())
                .starCount(equip.getStarCount())
                .upgradeResetCount(equip.getUpgradeResetCount())
                .upgradeReturn(equip.getUpgradeReturn())
                .chaosHistory(equip.getChaosHistory())
                .absorbHistory(equip.getAbsorbHistory())
                .expandAttribute1(equip.getExpandAttribute1())
                .expandAttribute2(equip.getExpandAttribute2())
                .expandAttribute3(equip.getExpandAttribute3())
                .expandAttribute4(equip.getExpandAttribute4())
                .build());
    }

    public static void updateDb(InventoryequipmentMapper inventoryequipmentMapper, InventoryEquipRtnDTO equipment, InventoryitemsDO inventoryitemsDO) {
        inventoryequipmentMapper.updateByQuery(InventoryequipmentDO.builder()
                        .upgradeslots(Optional.ofNullable(equipment.getUpgradeSlots()).map(Byte::intValue).orElse(null))
                        .level(Optional.ofNullable(equipment.getLevel()).map(Byte::intValue).orElse(null))
                        .str(Optional.ofNullable(equipment.getAttStr()).map(Short::intValue).orElse(null))
                        .dex(Optional.ofNullable(equipment.getAttDex()).map(Short::intValue).orElse(null))
                        .inte(Optional.ofNullable(equipment.getAttInt()).map(Short::intValue).orElse(null))
                        .luk(Optional.ofNullable(equipment.getAttLuk()).map(Short::intValue).orElse(null))
                        .hp(Optional.ofNullable(equipment.getHp()).map(Short::intValue).orElse(null))
                        .mp(Optional.ofNullable(equipment.getMp()).map(Short::intValue).orElse(null))
                        .watk(Optional.ofNullable(equipment.getPAtk()).map(Short::intValue).orElse(null))
                        .matk(Optional.ofNullable(equipment.getMAtk()).map(Short::intValue).orElse(null))
                        .wdef(Optional.ofNullable(equipment.getPDef()).map(Short::intValue).orElse(null))
                        .mdef(Optional.ofNullable(equipment.getMDef()).map(Short::intValue).orElse(null))
                        .acc(Optional.ofNullable(equipment.getAcc()).map(Short::intValue).orElse(null))
                        .avoid(Optional.ofNullable(equipment.getAvoid()).map(Short::intValue).orElse(null))
                        .hands(Optional.ofNullable(equipment.getHands()).map(Short::intValue).orElse(null))
                        .speed(Optional.ofNullable(equipment.getSpeed()).map(Short::intValue).orElse(null))
                        .jump(Optional.ofNullable(equipment.getJump()).map(Short::intValue).orElse(null))
                        .vicious(Optional.ofNullable(equipment.getVicious()).map(Short::intValue).orElse(null))
                        .upgradehistory(Optional.ofNullable(equipment.getUpgradeHistory()).orElse(""))
                        .levelExpand(Optional.ofNullable(equipment.getLevelExpand()).orElse(0))
                        .combinationType(Optional.ofNullable(equipment.getCombinationType()).orElse(0))
                        .maxStar(Optional.ofNullable(equipment.getMaxStar()).orElse(0))
                        .starLevel(Optional.ofNullable(equipment.getStarLevel()).orElse(0))
                        .starCount(Optional.ofNullable(equipment.getStarCount()).orElse(0))
                        .upgradeResetCount(Optional.ofNullable(equipment.getUpgradeResetCount()).orElse(0))
                        .upgradeReturn(Optional.ofNullable(equipment.getUpgradeReturn()).orElse(0))
                        .chaosHistory(Optional.ofNullable(equipment.getChaosHistory()).orElse(""))
                        .absorbHistory(Optional.ofNullable(equipment.getAbsorbHistory()).orElse(""))
                        .expandAttribute1(Optional.ofNullable(equipment.getExpandAttribute1()).orElse(0))
                        .expandAttribute2(Optional.ofNullable(equipment.getExpandAttribute2()).orElse(0))
                        .expandAttribute3(Optional.ofNullable(equipment.getExpandAttribute3()).orElse(""))
                        .expandAttribute4(Optional.ofNullable(equipment.getExpandAttribute4()).orElse(""))
                        .build(),
                QueryWrapper.create().where(INVENTORYEQUIPMENT_D_O.INVENTORYITEMID.eq(inventoryitemsDO.getInventoryitemid())));
    }
}
