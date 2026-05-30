package org.gms.util.packets;

import org.gms.client.Character;
import org.gms.client.inventory.InventoryType;
import org.gms.client.inventory.manipulator.InventoryManipulator;
import org.gms.constants.id.ItemId;
import org.gms.constants.id.MapId;
import org.gms.constants.inventory.ItemConstants;
import org.gms.server.CashShop;
import org.gms.util.DatabaseConnection;
import org.gms.util.NumberTool;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.gms.server.ItemInformationProvider;
import org.gms.util.PacketCreator;

import java.lang.ref.WeakReference;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.ThreadLocalRandom;
/**
 * 钓鱼系统
 * 1. 无鱼饵禁止钓鱼
 * 2. 基础成功率：普通鱼饵40%、高级鱼饵50%；钓鱼等级每1000次+1%成功率，最高99%
 * 3. 奖励概率：
 * - 经验：40%
 * - 物品：60%（内部6挡位：神话0.01%、传奇0.02%、超稀有0.1%、稀有1%、罕见10%、普通88.87%）
 * 4. 钓鱼成功则等级+1，物品列表优先读缓存，支持手动刷新缓存
 * 5. 特殊规则：钓到传奇/超稀有（itemType≥4）时全服广播
 *
 * @author FateJiki (RaGeZONE)
 * @author Ronan - timing pattern
 */
public class Fishing {
    private static final Logger log = LoggerFactory.getLogger(Fishing.class);

    // ========== 基础配置常量 ==========
    // 成功率配置
    public static final double COMMON_BAIT_BASE_RATE = 0.3;     // 普通鱼饵基础成功率：30%
    public static final double ADVANCED_BAIT_BASE_RATE = 0.6;   // 高级鱼饵基础成功率：60%
    public static final double MAX_SUCCESS_RATE = 0.99;         // 最高成功率：99%
    public static final double MAX_SUCCESS_LEVEL_RATE = 0.3;    // 等级加成最高成功率：30%
    private static final int LEVEL_STEP = 1000;                   // 每1000次成功钓鱼+1%成功率
    private static final double STEP_BONUS_RATE = 0.01;          // 每分段加成：1%

    // ========== 奖励配置常量 ==========
    private static final double REWARD_EXP_RATE = 0.4;           // 经验奖励概率：40%
    private static final double REWARD_ITEM_RATE = 0.6;          // 物品奖励概率：60%
    // 物品内部6挡位概率（总和=1.0）
    public static final double ITEM_RATE_MYTHIC = 0.0001;       // 神话：1/10000 = 0.01%
    public static final double ITEM_RATE_LEGENDARY = 0.0002;    // 传奇：1/5000 = 0.02%
    public static final double ITEM_RATE_SUPER_RARE = 0.001;    // 超稀有：1/1000 = 0.1%
    public static final double ITEM_RATE_RARE = 0.01;           // 稀有：1/100 = 1%
    public static final double ITEM_RATE_UNCOMMON = 0.1;        // 罕见：10/100 = 10%
    public static final double ITEM_RATE_COMMON = 0.8887;       // 普通：剩余概率 = 88.87%

    // 经验计算配置
    private static final double EXP_SCALE_RATIO = 1.0 / 2000;    // 经验=升级所需经验×1/2000
    private static final long EXP_NEEDED_DEFAULT = 100000L;      // 升级经验兜底值
    private static final double EXP_RANDOM_MIN = 0.8;            // 经验随机系数最小值
    private static final double EXP_RANDOM_MAX = 1.0;            // 经验随机系数最大值
    // 其他奖励
    private static final int CASH_REWARD = 5;                    // 每次钓鱼获取点卷数：5点

    // ========== 物品ID常量 ==========
    public static final int COMMON_FISHING_BAIT = 2300000;       // 普通鱼饵ID
    public static final int ADVANCED_FISHING_BAIT = 2300001;     // 高级鱼饵ID
    private static final int DEFAULT_REWARD_ITEM_ID = ItemId.MANA_ELIXIR; // 默认奖励物品ID

    // ========== 文本/广播常量 ==========
    private static final int BROADCAST_TYPE = 4;                 // 钓鱼广播类型
    private static final String BROADCAST_TITLE = "钓鱼信息";     // 钓鱼广播标题
    private static final String TIP_EXP_GAIN = "钓鱼经验+1";      // 经验增加提示
    private static final String TIP_FISH_SUCCESS = "钓到了【%s】，%s"; // 成功钓鱼提示模板
    private static final String TIP_NO_BAIT = "没有可用的鱼饵，无法开始钓鱼！"; // 无鱼饵提示
    private static final String TIP_BAIT_USED_UP = "你的鱼饵已耗尽，自动退出钓鱼状态！"; // 鱼饵耗尽提示
    private static final String TIP_NOT_IN_FISH_AREA = "您不在捕鱼区!"; // 非钓鱼区提示
    private static final String TIP_LEVEL_TOO_LOW = "你必须达到30级以上才能钓鱼!"; // 等级不足提示
    private static final String TIP_CASH_GAIN = "获取点卷%d点";   // 点卷获取提示模板
    private static final String TIP_INV_FULL = "因#e#b%s#k#n 栏位不足，无法获得#r%s#k！"; // 背包满提示模板
    private static final String BROADCAST_RARE_ITEM = "恭喜玩家 %s 钓到了【%s】"; // 稀有物品广播模板

    // ========== 物品类型常量（适配6挡位） ==========
    private static final int ITEM_TYPE_EXP = -1;                 // 经验奖励标识
    private static final int ITEM_TYPE_COMMON = 1;               // 普通物品（88.87%）
    private static final int ITEM_TYPE_UNCOMMON = 2;             // 罕见物品（10%）
    private static final int ITEM_TYPE_RARE = 3;                 // 稀有物品（1%）
    private static final int ITEM_TYPE_SUPER_RARE = 4;           // 超稀有物品（0.1%）
    private static final int ITEM_TYPE_LEGENDARY = 5;            // 传奇物品（0.02%）
    private static final int ITEM_TYPE_MYTHIC = 6;               // 神话物品（0.01%）

    // ========== 缓存与状态 ==========
    // 物品缓存：key=物品类型(1=普通,2=罕见,3=稀有,4=超稀有,5=传奇,6=神话)
    private static final Map<Integer, int[]> ITEM_CACHE = new ConcurrentHashMap<>();
    // 物品名称缓存：避免重复查询
    private static final Map<Integer, String> ITEM_NAME_CACHE = new ConcurrentHashMap<>();
    // 钓鱼玩家列表（使用CopyOnWriteArrayList提高并发性能，弱引用避免内存泄漏）
    private final List<WeakReference<Character>> fishingCharacter = new CopyOnWriteArrayList<>();
    // 单例实例
    private static volatile Fishing instance = null;

    // ========== 单例实现 ==========
    private Fishing() {
        preloadItemCache(); // 预加载物品缓存
    }

    public static Fishing getInstance() {
        if (instance == null) {
            synchronized (Fishing.class) {
                if (instance == null) {
                    instance = new Fishing();
                }
            }
        }
        return instance;
    }

    // ========== 物品缓存逻辑 ==========
    private void preloadItemCache() {
        // 适配6挡位物品类型
        for (int type : new int[]{ITEM_TYPE_COMMON, ITEM_TYPE_UNCOMMON, ITEM_TYPE_RARE, ITEM_TYPE_SUPER_RARE, ITEM_TYPE_LEGENDARY, ITEM_TYPE_MYTHIC}) {
            loadItemsFromDB(type, null);
        }
        log.info("钓鱼物品缓存预加载完成，缓存数据量：{}", ITEM_CACHE.size());
    }

    public void refreshItemCache(Character player) {
        synchronized (ITEM_CACHE) {
            ITEM_CACHE.clear();
            log.info("开始手动刷新钓鱼物品缓存，已清空原有数据");

            // 适配6挡位物品类型
            for (int type : new int[]{ITEM_TYPE_COMMON, ITEM_TYPE_UNCOMMON, ITEM_TYPE_RARE, ITEM_TYPE_SUPER_RARE, ITEM_TYPE_LEGENDARY, ITEM_TYPE_MYTHIC}) {
                loadItemsFromDB(type, null);
            }
            log.info("钓鱼物品缓存手动刷新完成，新缓存数据量：{}", ITEM_CACHE.size());
            player.message("钓鱼物品重新加载成功");
        }
    }

    private void loadItemsFromDB(int itemType, Connection conn) {
        List<Integer> itemList = new ArrayList<>();
        boolean needCloseConn = (conn == null);
        Connection dbConn = conn;

        try {
            dbConn = needCloseConn ? DatabaseConnection.getConnection() : dbConn;
            String sql = "SELECT item_id FROM fishing_items WHERE item_type = ?";
            try (PreparedStatement pstmt = dbConn.prepareStatement(sql)) {
                pstmt.setInt(1, itemType);
                try (ResultSet rs = pstmt.executeQuery()) {
                    while (rs.next()) {
                        itemList.add(rs.getInt("item_id"));
                    }
                }
            }

            int[] itemArray = itemList.stream().mapToInt(Integer::intValue).toArray();
            ITEM_CACHE.put(itemType, itemArray);
            log.debug("从数据库加载物品类型{}的数据，共{}条", itemType, itemArray.length);

        } catch (SQLException e) {
            log.error("从数据库加载物品类型{}失败", itemType, e);
        } finally {
            if (needCloseConn && dbConn != null) {
                try {
                    dbConn.close();
                } catch (SQLException e) {
                    log.warn("关闭数据库连接失败", e);
                }
            }
        }
    }

    public int[] getItemsByType(int itemType, Connection conn) {
        if (ITEM_CACHE.containsKey(itemType)) {
            int[] items = ITEM_CACHE.get(itemType);
            return items == null ? new int[0] : items;
        }

        loadItemsFromDB(itemType, conn);
        int[] items = ITEM_CACHE.get(itemType);
        return items == null ? new int[0] : items;
    }

    // ========== 物品名称缓存 ==========
    /**
     * 获取物品名称（带缓存，避免重复查询）
     */
    private String getCachedItemName(int itemId) {
        return ITEM_NAME_CACHE.computeIfAbsent(itemId, id -> {
            String name = ItemInformationProvider.getInstance().getName(id);
            return name == null ? "未知物品" : name;
        });
    }

    // ========== 玩家注册/注销 ==========
    public boolean registerFisherPlayer(Character chr) {
        // 先校验玩家有效性，再判断鱼饵
        if (chr == null || !chr.isLoggedInWorld() || !chr.isAlive()) {
            log.warn("尝试注册无效玩家钓鱼：{}", chr == null ? "null" : chr.getName());
            return false;
        }

        if (!hasValidBait(chr)) {
            chr.dropMessage(5, TIP_NO_BAIT);
            chr.unsitChairInternal(); // 退出钓鱼状态（逻辑后置，更合理）
            return false;
        }

        boolean isRegistered = fishingCharacter.stream()
                .map(WeakReference::get)
                .filter(Objects::nonNull)
                .anyMatch(c -> c.equals(chr));

        if (isRegistered) {
            log.debug("玩家{}已注册钓鱼，无需重复注册", chr.getName());
            return false;
        }
        fishingCharacter.add(new WeakReference<>(chr));
        log.info("玩家{}成功注册钓鱼", chr.getName());
        return true;
    }

    public void unregisterFisherPlayer(Character chr) {
        Iterator<WeakReference<Character>> iterator = fishingCharacter.iterator();
        while (iterator.hasNext()) {
            WeakReference<Character> ref = iterator.next();
            Character c = ref.get();
            if (c == null || c.equals(chr)) {
                iterator.remove();
//                    log.info("玩家{}已从钓鱼列表注销", chr == null ? "null" : chr.getName());
            }
        }
    }

    private boolean hasValidBait(Character chr) {
        int commonBait = chr.getInventory(InventoryType.USE).countById(COMMON_FISHING_BAIT);
        int advancedBait = chr.getInventory(InventoryType.USE).countById(ADVANCED_FISHING_BAIT);
        boolean hasBait = commonBait > 0 || advancedBait > 0;
        if (!hasBait) {
//            log.debug("玩家{}无可用鱼饵（普通：{}，高级：{}）", chr.getName(), commonBait, advancedBait);
        }
        return hasBait;
    }

    // ========== 成功率计算 ==========
    public double calculateLevelBonusRate(int fishLevel) {
        int bonusStep = fishLevel / LEVEL_STEP;
        double levelBonus = bonusStep * STEP_BONUS_RATE;
        double finalBonus = Math.min(levelBonus, MAX_SUCCESS_LEVEL_RATE);
//        log.debug("钓鱼等级{}，加成步数{}，最终加成率{}%", fishLevel, bonusStep, finalBonus * 100);
        return finalBonus;
    }

    private boolean hitFishingTime(Character chr, int baitLevel) {
        double baseRate = baitLevel == 1 ? COMMON_BAIT_BASE_RATE : ADVANCED_BAIT_BASE_RATE;
        int fishLevel = chr.getFishLevel();
        double levelBonus = calculateLevelBonusRate(fishLevel);
        double finalRate = Math.min(MAX_SUCCESS_RATE, Math.max(0.0, baseRate + levelBonus));

        // GM调试信息
        if (chr.isGM()) {
            chr.dropMessage(5, "----- 钓鱼成功率 -----");
            chr.dropMessage(5, "基础成功率: " + String.format("%.1f", baseRate * 100) + "%");
            chr.dropMessage(5, "等级加成: " + String.format("%.1f", levelBonus * 100) + "% (成功钓鱼数量: " + fishLevel + ")");
            chr.dropMessage(5, "最终成功率: " + String.format("%.1f", finalRate * 100) + "%");
        }

        boolean success = ThreadLocalRandom.current().nextDouble() < finalRate;
//        log.debug("玩家{}钓鱼成功率计算：基础{}% + 加成{}% = {}%，最终结果：{}",
//                chr.getName(), baseRate * 100, levelBonus * 100, finalRate * 100, success ? "成功" : "失败");
        return success;
    }

    // ========== 经验计算（独立封装） ==========
    private int calculateExpReward(Character chr) {
        // 1. 获取升级所需经验（兜底处理）
        long expNeeded = Math.max(chr.getExpNeededForNextLevel(), EXP_NEEDED_DEFAULT);
        // 2. 计算基础经验 = 升级经验 × 1/2000
        double baseExp = expNeeded * EXP_SCALE_RATIO;
        // 3. 生成 0.8~1.0 的随机系数
        double randomRate = EXP_RANDOM_MIN + ThreadLocalRandom.current().nextDouble() * (EXP_RANDOM_MAX - EXP_RANDOM_MIN);
        // 4. 最终经验（至少 1 点）
        return Math.max(1, NumberTool.doubleToInt(baseExp * randomRate));
    }

    // ========== 奖励获取（核心修改：适配6挡位概率） ==========
    /**
     * 获取钓鱼奖励类型/标识
     *
     * @return ITEM_TYPE_EXP(-1)：经验奖励；其他值：物品类型（1=普通/2=罕见/3=稀有/4=超稀有/5=传奇/6=神话）
     */
    public int getRandomRewardType() {
        // 第一步：40%概率返回经验标识，60%概率获取物品类型
        double rewardRandom = ThreadLocalRandom.current().nextDouble();
        if (rewardRandom < REWARD_EXP_RATE) {
            log.debug("随机奖励结果：经验（概率{}%）", REWARD_EXP_RATE * 100);
            return ITEM_TYPE_EXP;
        }

        // 第二步：60%概率按6挡位随机获取物品类型
        double itemRandom = ThreadLocalRandom.current().nextDouble();
        int itemType;

        // 按概率从低到高判断（神话→传奇→超稀有→稀有→罕见→普通）
        if (itemRandom < ITEM_RATE_MYTHIC) {
            itemType = ITEM_TYPE_MYTHIC; // 神话（0.01%）
        } else if (itemRandom < ITEM_RATE_MYTHIC + ITEM_RATE_LEGENDARY) {
            itemType = ITEM_TYPE_LEGENDARY; // 传奇（0.02%）
        } else if (itemRandom < ITEM_RATE_MYTHIC + ITEM_RATE_LEGENDARY + ITEM_RATE_SUPER_RARE) {
            itemType = ITEM_TYPE_SUPER_RARE; // 超稀有（0.1%）
        } else if (itemRandom < ITEM_RATE_MYTHIC + ITEM_RATE_LEGENDARY + ITEM_RATE_SUPER_RARE + ITEM_RATE_RARE) {
            itemType = ITEM_TYPE_RARE; // 稀有（1%）
        } else if (itemRandom < ITEM_RATE_MYTHIC + ITEM_RATE_LEGENDARY + ITEM_RATE_SUPER_RARE + ITEM_RATE_RARE + ITEM_RATE_UNCOMMON) {
            itemType = ITEM_TYPE_UNCOMMON; // 罕见（10%）
        } else {
            itemType = ITEM_TYPE_COMMON; // 普通（88.87%）
        }

//        log.debug("随机奖励结果：物品类型{}（概率区间{}%）", itemType, String.format("%.4f", itemRandom * 100));
        return itemType;
    }

    // ========== 核心钓鱼逻辑 ==========
    public void doAllFishing() {
        if (fishingCharacter.isEmpty()) {
            log.debug("钓鱼列表为空，无需执行批量钓鱼");
            return;
        }

        // 使用 removeIf 清理无效玩家（CopyOnWriteArrayList 支持此操作）
        fishingCharacter.removeIf(ref -> {
            Character chr = ref.get();
            boolean shouldRemove = chr == null || !isValidFisherPlayer(chr);
            if (shouldRemove) {
                log.info("清理无效钓鱼玩家：{}", chr == null ? "null" : chr.getName());
            }
            return shouldRemove;
        });

        // 遍历有效玩家执行钓鱼
        fishingCharacter.forEach(ref -> {
            Character chr = ref.get();
            if (chr != null) {
                doFishing(chr);
            }
        });
    }

    public void doFishing(Character chr) {
        // 校验玩家有效性
        if (!isValidFisherPlayer(chr)) {
            log.warn("玩家{}钓鱼状态无效，退出钓鱼", chr == null ? "null" : chr.getName());
            if (chr != null) {
                chr.unsitChairInternal();
            }
            return;
        }

        // 1. 校验鱼饵
        int commonBait = chr.getInventory(InventoryType.USE).countById(COMMON_FISHING_BAIT);
        int advancedBait = chr.getInventory(InventoryType.USE).countById(ADVANCED_FISHING_BAIT);
        if (commonBait <= 0 && advancedBait <= 0) {
            chr.dropMessage(5, TIP_BAIT_USED_UP);
            chr.unsitChairInternal();
            log.debug("玩家{}鱼饵耗尽，退出钓鱼", chr.getName());
            return;
        }

        // 2. 基础环境校验
        if (!MapId.isFishingArea(chr.getMapId())) {
            chr.dropMessage(TIP_NOT_IN_FISH_AREA);
            chr.unsitChairInternal();
            log.debug("玩家{}不在钓鱼区，退出钓鱼", chr.getName());
            return;
        }
        if (chr.getLevel() < 30) {
            chr.dropMessage(5, TIP_LEVEL_TOO_LOW);
            chr.unsitChairInternal();
            log.debug("玩家{}等级不足30级，退出钓鱼", chr.getName());
            return;
        }

        // 3. 确定鱼饵等级 & 计算成功率
        int baitLevel = advancedBait > 0 ? 2 : 1;
        String fishingEffect;
        boolean isSuccess = hitFishingTime(chr, baitLevel);

        // 发放点卷（无论成功失败都给）
        chr.getCashShop().gainCash(CashShop.NX_CREDIT, CASH_REWARD);
        chr.dropMessage(5, String.format(TIP_CASH_GAIN, CASH_REWARD));
//        log.debug("玩家{}获取点卷{}点", chr.getName(), CASH_REWARD);

        if (!isSuccess) {
            fishingEffect = "Effect/BasicEff.img/Catch/Fail";
//            log.debug("玩家{}钓鱼失败", chr.getName());
        } else {
            // 钓鱼成功：等级+1
            chr.setFishLevel(chr.getFishLevel() + 1);
            fishingEffect = "Effect/BasicEff.img/Catch/Success";
            String rewardContent = "";

            // 获取奖励类型（40%经验 / 60%物品）
            int rewardType = getRandomRewardType();
            if (rewardType == ITEM_TYPE_EXP) {
                // 经验奖励
                int expAward = calculateExpReward(chr);
                chr.gainExp(expAward, true, true);
                rewardContent = expAward + " 经验值";
//                log.info("玩家{}钓鱼成功，获得经验{}", chr.getName(), expAward);
            } else {
                // 物品奖励：获取物品ID（兜底处理）
                int rewardId = DEFAULT_REWARD_ITEM_ID;
                int[] itemArray = getItemsByType(rewardType, null);
                if (itemArray != null && itemArray.length > 0) {
                    rewardId = itemArray[(int) (itemArray.length * ThreadLocalRandom.current().nextDouble())];
                }

                // 获取物品名称（使用缓存避免重复查询）
                String itemName = getCachedItemName(rewardId);
                rewardContent = itemName;

                // 发放物品（校验PlayerInteraction）
                if (chr.getAbstractPlayerInteraction() != null) {
                    if (chr.canHold(rewardId)) {
                        chr.getAbstractPlayerInteraction().gainItem(rewardId, true);
//                        log.debug("玩家{}钓鱼成功，获得物品{}（ID：{}）", chr.getName(), itemName, rewardId);
                    } else {
                        // 背包满提示
                        String invType = getInventoryTypeName(ItemConstants.getInventoryType(rewardId));
                        chr.showHint(String.format(TIP_INV_FULL, invType, itemName));
                        rewardContent += "……但因背包栏位不足而未能获取";
//                        log.warn("玩家{}背包栏位不足，无法获取物品{}（ID：{}）", chr.getName(), itemName, rewardId);
                    }
                } else {
                    rewardContent += "……但无法获取物品（交互对象为空）";
//                    log.error("玩家{}的AbstractPlayerInteraction为空，无法发放物品", chr.getName());
                }

                // 优化广播逻辑：仅超稀有/传奇/神话（type≥4）全服广播
                if (rewardType >= ITEM_TYPE_SUPER_RARE) {
                    String broadcastContent = String.format(BROADCAST_RARE_ITEM, chr.getName(), itemName);
                    chr.sendBroadcast(BROADCAST_TYPE, BROADCAST_TITLE, broadcastContent);
//                    log.info("玩家{}钓到稀有物品{}（类型{}），已全服广播", chr.getName(), itemName, rewardType);
                }
            }

            // 拼接成功提示并发送
            String successTip = String.format(TIP_FISH_SUCCESS, rewardContent, TIP_EXP_GAIN);
            chr.dropMessage(5, successTip);
//            log.debug("玩家{}钓鱼成功提示：{}", chr.getName(), successTip);
        }

        // 发送钓鱼效果
        chr.sendPacket(PacketCreator.showInfo(fishingEffect));
        chr.getMap().broadcastMessage(chr, PacketCreator.showForeignInfo(chr.getId(), fishingEffect), false);

        // 扣除鱼饵（无论成功失败都扣）
        int baitItemId = baitLevel == 1 ? COMMON_FISHING_BAIT : ADVANCED_FISHING_BAIT;
        InventoryManipulator.removeById(chr.getClient(), InventoryType.USE, baitItemId, 1, true, true);
//        log.debug("玩家{}扣除鱼饵{}（ID：{}）", chr.getName(), baitLevel == 1 ? "普通" : "高级", baitItemId);

        // 校验剩余鱼饵，无则退出
        int remainingCommon = chr.getInventory(InventoryType.USE).countById(COMMON_FISHING_BAIT);
        int remainingAdvanced = chr.getInventory(InventoryType.USE).countById(ADVANCED_FISHING_BAIT);
        if (remainingCommon <= 0 && remainingAdvanced <= 0) {
            chr.dropMessage(5, TIP_BAIT_USED_UP);
            chr.unsitChairInternal();
            log.info("玩家{}鱼饵耗尽，退出钓鱼状态", chr.getName());
        }
    }

    // ========== 辅助方法 ==========
    private boolean isValidFisherPlayer(Character chr) {
        boolean valid = chr != null && chr.isLoggedInWorld() && chr.isAlive() && chr.canFish();
        if (!valid) {
            log.warn("玩家{}钓鱼有效性校验失败：{}",
                    chr == null ? "null" : chr.getName(),
                    chr == null ? "玩家为空" :
                            !chr.isLoggedInWorld() ? "未登录" :
                                    !chr.isAlive() ? "已死亡" : "无法钓鱼");
        }
        return valid;
    }

    private String getInventoryTypeName(InventoryType type) {
        return switch (type) {
            case EQUIP -> "装备";
            case USE -> "消耗";
            case ETC -> "其他";
            case SETUP -> "设置";
            case CASH -> "现金";
            default -> "物品";
        };
    }

    public void clearItemCache() {
        synchronized (ITEM_CACHE) {
            ITEM_CACHE.clear();
            log.info("钓鱼物品缓存已清空");
        }
    }
}