package org.gms.server;

import org.gms.dao.entity.ExtraStorageDO;
import org.gms.util.DatabaseConnection;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

/**
 * 矿石仓库管理类
 * 处理矿石的存储、加载、修改等操作
 */
public class ExtraStorage {
    private static final Logger log = LoggerFactory.getLogger(ExtraStorage.class);
    private static final int LOCK_COUNT = 400;
    private static final Lock[] LOCKS = new Lock[LOCK_COUNT];

    static {
        // 初始化分段锁，避免并发操作冲突
        for (int i = 0; i < LOCK_COUNT; i++) {
            LOCKS[i] = new ReentrantLock(true);
        }
    }

    private final long accountId; // 所属账号ID
    private final long characterId; // 所属角色ID（可选，若为角色专属）
    private final List<ExtraStorageDO> mCache = new ArrayList<>();
    private final Lock lock = new ReentrantLock(true);

    public ExtraStorage(long accountId, long characterId) {
        this.accountId = accountId;
        this.characterId = characterId;
    }

    /**
     * 从数据库加载矿石仓库数据
     */
    public void loadFromDB() {
        Lock lock = LOCKS[(int) (accountId % LOCK_COUNT)];
        lock.lock();
        try (Connection con = DatabaseConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(
                     "SELECT * FROM extrastorage WHERE accountid = ? AND characterid = ?"
             )) {
            ps.setLong(1, accountId);
            ps.setLong(2, characterId);
            try (ResultSet rs = ps.executeQuery()) {
                mCache.clear();
                while (rs.next()) {
                    ExtraStorageDO item = ExtraStorageDO.builder()
                            .inventoryequipmentid(rs.getLong("inventoryequipmentid"))
                            .characterid(rs.getLong("characterid"))
                            .accountid(rs.getLong("accountid"))
                            .itemid(rs.getLong("itemid"))
                            .quantity(rs.getInt("quantity"))
                            .type(rs.getInt("type"))
                            .build();
                    mCache.add(item);
                }
            }
        } catch (SQLException e) {
            log.error("加载矿石仓库失败（accountId: {}, characterId: {}）", accountId, characterId, e);
        } finally {
            lock.unlock();
        }
    }

    /**
     * 保存矿石仓库数据到数据库
     */
    public void saveToDB() {
        Lock lock = LOCKS[(int) (accountId % LOCK_COUNT)];
        lock.lock();
        try (Connection con = DatabaseConnection.getConnection()) {
            // 先删除旧数据
            try (PreparedStatement deletePs = con.prepareStatement(
                    "DELETE FROM extrastorage WHERE accountid = ? AND characterid = ?"
            )) {
                deletePs.setLong(1, accountId);
                deletePs.setLong(2, characterId);
                deletePs.executeUpdate();
            }

            // 插入新数据
            try (PreparedStatement insertPs = con.prepareStatement(
                    "INSERT INTO extrastorage (characterid, accountid, itemid, quantity, type) " +
                            "VALUES (?, ?, ?, ?, ?)"
            )) {
                for (ExtraStorageDO item : mCache) {
                    insertPs.setLong(1, item.getCharacterid());
                    insertPs.setLong(2, item.getAccountid());
                    insertPs.setLong(3, item.getItemid());
                    insertPs.setInt(4, item.getQuantity());
                    insertPs.setInt(5, item.getType());
                    insertPs.addBatch();
                }
                insertPs.executeBatch();
            }
        } catch (SQLException e) {
            log.error("保存矿石仓库失败（accountId: {}, characterId: {}）", accountId, characterId, e);
        } finally {
            lock.unlock();
        }
    }

    /**
     * 添加矿石到仓库
     * @param itemId 矿石物品ID
     * @param quantity 数量
     * @param type 物品类型
     */
    public void addItem(long itemId, int quantity, int type) {
        lock.lock();
        try {
            // 检查是否已有该矿石，若有则累加数量
            for (ExtraStorageDO item : mCache) {
                if (item.getItemid() == itemId && item.getType() == type) {
                    item.setQuantity(item.getQuantity() + quantity);
                    return;
                }
            }
            // 新增矿石记录
            ExtraStorageDO newItem = ExtraStorageDO.builder()
                    .characterid(characterId)
                    .accountid(accountId)
                    .itemid(itemId)
                    .quantity(quantity)
                    .type(type)
                    .build();
            mCache.add(newItem);
        } finally {
            lock.unlock();
        }
    }

    /**
     * 从仓库移除矿石
     * @param itemId 矿石物品ID
     * @param quantity 数量
     * @param type 物品类型
     * @return 是否移除成功
     */
    public boolean removeItem(long itemId, int quantity, int type) {
        lock.lock();
        try {
            for (ExtraStorageDO item : mCache) {
                if (item.getItemid() == itemId && item.getType() == type) {
                    if (item.getQuantity() >= quantity) {
                        item.setQuantity(item.getQuantity() - quantity);
                        // 若数量为0则移除记录
                        if (item.getQuantity() == 0) {
                            mCache.remove(item);
                        }
                        return true;
                    }
                    return false; // 数量不足
                }
            }
            return false; // 未找到矿石
        } finally {
            lock.unlock();
        }
    }

    /**
     * 获取仓库中所有矿石
     */
    public List<ExtraStorageDO> getmCache() {
        lock.lock();
        try {
            return new ArrayList<>(mCache); // 返回副本避免外部修改
        } finally {
            lock.unlock();
        }
    }

    /**
     * 查找指定矿石的数量
     */
    public int getItemQuantity(long itemId, int type) {
        lock.lock();
        try {
            for (ExtraStorageDO item : mCache) {
                if (item.getItemid() == itemId && item.getType() == type) {
                    return item.getQuantity();
                }
            }
            return 0;
        } finally {
            lock.unlock();
        }
    }
}