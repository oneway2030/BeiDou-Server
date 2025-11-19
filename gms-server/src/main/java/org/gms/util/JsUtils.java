package org.gms.util;

import org.gms.client.Character;
import org.gms.client.inventory.ItemFactory;
import org.gms.server.ItemInformationProvider;
import org.gms.server.life.MonsterDropEntry;
import org.gms.server.life.MonsterInformationProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Iterator;

/**
 * Js工具类（单例模式）
 * 用于提供JavaScript脚本交互相关的工具方法
 */
public class JsUtils {

    private static final Logger log = LoggerFactory.getLogger(JsUtils.class);
    // 静态单例实例
    private static final JsUtils INSTANCE = new JsUtils();

    // 私有构造方法，防止外部实例化
    private JsUtils() {
        // 初始化操作（如果需要）
    }

    // 公共静态方法，提供全局访问点
    public static JsUtils getInstance() {
        return INSTANCE;
    }

    public String whoDrops(Character player, String searchString) {
        StringBuilder output = new StringBuilder();
        try {
            Iterator<Pair<Integer, String>> listIterator = ItemInformationProvider.getInstance().getItemDataByName(searchString).iterator();
            if (listIterator.hasNext()) {
                int count = 1;
                while (listIterator.hasNext() && count <= 3) {
                    Pair<Integer, String> data = listIterator.next();
                    output.append("#b").append(data.getRight()).append("#k ").append(I18nUtil.getMessage("WhoDropsCommand.message3")).append("\r\n");
                    try (Connection con = DatabaseConnection.getConnection();
                         PreparedStatement ps = con.prepareStatement("SELECT dropperid FROM drop_data WHERE itemid = ? LIMIT 50")) {
                        ps.setInt(1, data.getLeft());
                        try (ResultSet rs = ps.executeQuery()) {
                            while (rs.next()) {
                                String resultName = MonsterInformationProvider.getInstance().getMobNameFromId(rs.getInt("dropperid"));
                                if (resultName != null) {
                                    output.append(resultName).append(", ");
                                }
                            }
                        }
                    } catch (Exception e) {
                        player.dropMessage(6, I18nUtil.getMessage("WhoDropsCommand.message4"));
                        e.printStackTrace();
                    }
                    output.append("\r\n\r\n");
                    count++;
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return output.toString();
    }

    public String WhatDropsFrom(Character player, String monsterName) {
        StringBuilder output = new StringBuilder();
        try {
            int limit = 3;
            Iterator<Pair<Integer, String>> listIterator = MonsterInformationProvider.getMobsIDsFromName(monsterName).iterator();
            for (int i = 0; i < limit; i++) {
                if (listIterator.hasNext()) {
                    Pair<Integer, String> data = listIterator.next();
                    int mobId = data.getLeft();
                    String mobName = data.getRight();
                    output.append(mobName).append(" ").append(I18nUtil.getMessage("WhatDropsFromCommand.message3")).append("\r\n\r\n");
                    for (MonsterDropEntry drop : MonsterInformationProvider.getInstance().retrieveDrop(mobId)) {
                        try {
                            String name = ItemInformationProvider.getInstance().getName(drop.itemId);
                            if (name == null || name.equals("null") || drop.chance == 0) {
                                continue;
                            }
                            // 计算精度丢失的问题
                            float chance = Math.max(1000000F / drop.chance / (!MonsterInformationProvider.getInstance().isBoss(mobId) ? player.getDropRate() : player.getBossDropRate()), 1);
                            output.append("- ").append(name).append(" (1/").append((int) chance).append(")\r\n");
                        } catch (Exception ex) {
                            ex.printStackTrace();
                        }
                    }
                    output.append("\r\n");
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return output.toString();
    }

    /**
     * 单独为指定 inventoryitemid 的装备插入/更新 JSON 额外属性
     * @param inventoryitemid 装备关联的 inventoryitemid（从 inventoryitems 表获取）
     * @param jsonStr 要存储的 JSON 字符串（需保证格式合法，如 "{\"key1\":\"value1\"}"）
     * @throws SQLException 数据库操作异常
     */
    public void updateEquipmentExtraJson(int inventoryitemid, String jsonStr) throws SQLException {

        if (inventoryitemid <= 0) {
            throw new IllegalArgumentException("inventoryitemid 必须为正整数");
        }
        if (jsonStr == null || jsonStr.trim().isEmpty()) {
            throw new IllegalArgumentException("JSON 字符串不能为空");
        }

        String sql = "UPDATE `inventoryequipment` SET `upgradehistory` = ? WHERE `inventoryitemid` = ?";
        // 使用 try-with-resources 自动关闭资源（推荐）
        try (Connection con = DatabaseConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setString(1, jsonStr);
            ps.setInt(2, inventoryitemid);

            int affectedRows = ps.executeUpdate();
            if (affectedRows == 0) {
                throw new RuntimeException("未找到 inventoryitemid = " + inventoryitemid + " 的装备记录");
            }

            log.info("更新成功：inventoryitemid={}, JSON={}", inventoryitemid, jsonStr);

        } catch (Exception e) {
            log.error("updateEquipmentExtraJson 失败：inventoryitemid={}", inventoryitemid, e);
            throw new SQLException("更新 JSON 失败：" + e.getMessage(), e);
        }
        // 无需手动关闭，try-with-resources 会自动处理
    }

    public String queryEquipmentExtraJson(int inventoryitemid) throws SQLException {
        // 1. 校验参数合法性
        if (inventoryitemid <= 0) {
            throw new IllegalArgumentException("inventoryitemid 必须为正整数");
        }

        // 2. SQL：精准查询指定 inventoryitemid 的 upgradehistory 字段
        String sql = "SELECT `upgradehistory` FROM `inventoryequipment` WHERE `inventoryitemid` = ? LIMIT 1";

        try (PreparedStatement ps =  DatabaseConnection.getConnection().prepareStatement(sql)) {
            ps.setInt(1, inventoryitemid);
            try (ResultSet rs = ps.executeQuery()) {
                // 3. 处理查询结果：有记录则返回 JSON 字符串，无记录或 JSON 为 NULL 则返回空串
                if (rs.next()) {
                    // MySQL JSON 类型通过 getString 直接获取字符串格式
                    String jsonStr = rs.getString("upgradehistory");
                    return jsonStr != null ? jsonStr : "";
                } else {
                    // 无对应装备记录，返回空串（可根据业务改为抛异常）
                    return "";
                }
            }
        }
    }
}
