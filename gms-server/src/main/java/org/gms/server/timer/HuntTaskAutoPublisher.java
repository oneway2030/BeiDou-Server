package org.gms.server.timer;

import com.alibaba.fastjson2.JSON;
import com.alibaba.fastjson2.JSONArray;
import com.alibaba.fastjson2.JSONObject;
import lombok.Getter;
import lombok.Setter;
import org.gms.client.Character;
import org.gms.client.inventory.InventoryType;
import org.gms.client.inventory.manipulator.InventoryManipulator;
import org.gms.net.server.Server;
import org.gms.net.server.channel.Channel;
import org.gms.server.CashShop;
import org.gms.server.ItemInformationProvider;
import org.gms.server.TimerManager;
import org.gms.server.life.MonsterInformationProvider;
import org.gms.util.PacketCreator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.ScheduledFuture;

/**
 * 狩猎任务自动发布器
 * 功能：每隔指定时间自动发布狩猎任务
 * 支持两种任务类型：
 * - type=1: 收集物品，需要玩家提交道具
 * - type=2: 打BOSS，第一个击杀该BOSS的玩家获得奖励
 */
public class HuntTaskAutoPublisher {
    private static final Logger log = LoggerFactory.getLogger(HuntTaskAutoPublisher.class);
    private static HuntTaskAutoPublisher instance = null;

    // 奖励配置（从配置文件读取）
    private int goldReward = 100000;
    private int expReward = 50000;
    private int cashReward = 100;
    private List<RewardItem> rewardItems = new ArrayList<>();

    public static HuntTaskAutoPublisher getInstance() {
        if (instance == null) {
            instance = new HuntTaskAutoPublisher();
        }
        return instance;
    }

    /**
     * 奖励物品类
     */
    @Getter
    @Setter
    public static class RewardItem {
        private int itemId;    // 物品ID
        private int count;     // 奖励数量
        private double chance; // 获取概率（0-1）
        private String name;   // 物品名称（用于显示）

        public RewardItem() {
        }
    }

    /**
     * 狩猎任务配置类
     */
    @Getter
    @Setter
    public static class HuntItem {
        private int type;      // 1=收集物品, 2=打BOSS
        private int itemId;    // 物品ID（type=1时使用）
        private int bossId;    // BOSS ID（type=2时使用）
        private String name;
        private int needCount; // 需求数量（type=1时使用）

        public HuntItem() {
        }
    }

    /**
     * 当前任务数据类
     */
    @Getter
    @Setter
    public static class CurrentTask {
        private int type;             // 1=收集物品, 2=打BOSS
        private int itemId;           // 物品ID
        private int bossId;           // BOSS ID
        private String itemName;       // 物品/BOSS名称
        private int needCount;        // 需求数量
        private boolean completed;
        private String completedByName;
        private long completedTime;
        private long startTime;
        private long endTime;

        public CurrentTask() {
            this.completed = false;
            this.completedByName = "";
            this.completedTime = 0;
        }

        /**
         * 判断是否是BOSS狩猎任务
         */
        public boolean isBossTask() {
            return type == 2;
        }
    }

    // 配置路径
    private static final String CONFIG_PATH = "scripts-zh-CN/BeiDouSpecial/任务/狩猎任务配置.json";

    // 狩猎物品列表
    private List<HuntItem> huntItems = new ArrayList<>();

    // 任务间隔时间（秒）
    private int taskInterval = 3600;

    // 当前任务
    private CurrentTask currentTask = new CurrentTask();

    // 定时任务
    private ScheduledFuture<?> scheduledTask = null;

    // 随机数生成器
    private Random random = new Random();

    // 任务锁
    private final Object taskLock = new Object();

    /**
     * 私有构造函数
     */
    private HuntTaskAutoPublisher() {
        loadConfig();
    }

    /**
     * 加载配置文件
     */
    private void loadConfig() {
        File configFile = new File(CONFIG_PATH);
        if (!configFile.exists()) {
            log.warn("狩猎任务配置文件不存在: {}", CONFIG_PATH);
            initDefaultConfig();
            return;
        }

        try (FileReader reader = new FileReader(configFile)) {
            JSONObject config = JSON.parseObject(reader);

            // 加载狩猎物品
            JSONArray itemsArray = config.getJSONArray("HUNT_ITEMS");
            if (itemsArray != null) {
                for (int i = 0; i < itemsArray.size(); i++) {
                    JSONObject itemObj = itemsArray.getJSONObject(i);
                    HuntItem item = new HuntItem();
                    item.setType(itemObj.getIntValue("type"));
                    item.setItemId(itemObj.getIntValue("itemId"));
                    item.setBossId(itemObj.getIntValue("bossId"));
                    item.setName(itemObj.getString("name"));
                    item.setNeedCount(itemObj.getIntValue("needCount"));
                    huntItems.add(item);
                }
            }

            // 加载配置
            JSONObject huntConfig = config.getJSONObject("HUNT_CONFIG");
            if (huntConfig != null) {
                taskInterval = huntConfig.getIntValue("TASK_INTERVAL", 3600);
            }

            // 加载奖励配置
            JSONObject rewardInfo = config.getJSONObject("REWARD_INFO");
            if (rewardInfo != null) {
                goldReward = rewardInfo.getIntValue("GOLD_REWARD", 100000);
                expReward = rewardInfo.getIntValue("EXP_REWARD", 50000);
                cashReward = rewardInfo.getIntValue("CASH_REWARD", 100);

                // 加载奖励物品集合
                JSONArray rewardItemsArray = rewardInfo.getJSONArray("REWARD_ITEMS");
                if (rewardItemsArray != null) {
                    for (int i = 0; i < rewardItemsArray.size(); i++) {
                        JSONObject itemObj = rewardItemsArray.getJSONObject(i);
                        RewardItem rewardItem = new RewardItem();
                        rewardItem.setItemId(itemObj.getIntValue("itemId"));
                        rewardItem.setCount(itemObj.getIntValue("count", 1));
                        Double chance = itemObj.getDouble("chance");
                        rewardItem.setChance(chance != null ? chance : 0.0);
                        rewardItem.setName(itemObj.getString("name"));
                        rewardItems.add(rewardItem);
                    }
                }
            }

            log.info("狩猎任务配置加载完成 - 物品数量:{}, 任务间隔:{}秒", huntItems.size(), taskInterval);
        } catch (IOException e) {
            log.error("加载狩猎任务配置失败", e);
            initDefaultConfig();
        }
    }

    /**
     * 初始化默认配置
     */
    private void initDefaultConfig() {
        taskInterval = 3600;
        log.warn("加载狩猎任务配置失败，使用默认配置（无狩猎物品）");
    }

    /**
     * 启动定时任务
     */
    public void start() {
        if (huntItems.isEmpty()) {
            log.warn("狩猎物品列表为空，无法启动狩猎任务");
            return;
        }

        // 发布第一个任务
        publishNewTask();

        // 启动定时任务（设置延迟为 taskInterval，避免立即重复）
        scheduledTask = TimerManager.getInstance().register(this::publishNewTask, taskInterval * 1000L, taskInterval * 1000L);
        log.info("狩猎任务自动发布器已启动，间隔:{}秒", taskInterval);
    }

    /**
     * 停止定时任务
     */
    public void stop() {
        if (scheduledTask != null) {
            TimerManager.getInstance().stop(scheduledTask);
            scheduledTask = null;
        }
        log.info("狩猎任务自动发布器已停止");
    }

    /**
     * 重新加载配置并重新发布任务
     */
    public void reload() {
        synchronized (taskLock) {
            // 停止当前定时任务
            stop();

            // 清空当前配置
            huntItems.clear();
            rewardItems.clear();
            taskInterval = 3600;

            // 重新加载配置
            loadConfig();

            // 重新发布任务
            if (!huntItems.isEmpty()) {
                publishNewTask();

                // 重新启动定时任务（设置延迟为 taskInterval，避免立即重复）
                scheduledTask = TimerManager.getInstance().register(this::publishNewTask, taskInterval * 1000L, taskInterval * 1000L);
                log.info("狩猎任务配置已重新加载，任务间隔:{}秒", taskInterval);
            } else {
                log.warn("狩猎任务配置重新加载失败，狩猎物品列表为空");
            }
        }
    }

    /**
     * 发布新任务
     */
    private void publishNewTask() {
        synchronized (taskLock) {
            if (huntItems.isEmpty()) {
                log.warn("狩猎物品列表为空，无法发布任务");
                return;
            }

            // 随机选择一个物品
            int randomIndex = random.nextInt(huntItems.size());
            HuntItem selectedItem = huntItems.get(randomIndex);

            // 创建新任务
            currentTask = new CurrentTask();
            currentTask.setType(selectedItem.getType());
            currentTask.setItemId(selectedItem.getItemId());
            currentTask.setBossId(selectedItem.getBossId());

            // 设置任务名称（如果配置中没有，自动获取）
            String taskName = selectedItem.getName();
            if (selectedItem.getType() == 2) {
                // BOSS任务
                if (taskName == null || taskName.isEmpty()) {
                    taskName = MonsterInformationProvider.getInstance().getMobNameFromId(selectedItem.getBossId());
                    if (taskName == null) {
                        taskName = "BOSS";
                    }
                }
            } else {
                // 收集物品任务
                if (taskName == null || taskName.isEmpty()) {
                    taskName = ItemInformationProvider.getInstance().getName(selectedItem.getItemId());
                    if (taskName == null) {
                        taskName = "未知道具";
                    }
                }
            }
            currentTask.setItemName(taskName);
            currentTask.setNeedCount(selectedItem.getNeedCount());
            currentTask.setStartTime(System.currentTimeMillis());
            currentTask.setEndTime(System.currentTimeMillis() + taskInterval * 1000L);
            currentTask.setCompleted(false);
            currentTask.setCompletedByName("");
            currentTask.setCompletedTime(0);

            log.info("发布狩猎任务 - 类型:{}, 名称:{}, 物品ID:{}, BOSSID:{}",
                    currentTask.getType(), selectedItem.getName(), selectedItem.getItemId(), selectedItem.getBossId());

            // 全服广播新任务
            broadcastNewTask(selectedItem);
        }
    }

    /**
     * 全服广播新任务
     */
    private void broadcastNewTask(HuntItem item) {
        String message = "[狩猎任务] 新任务发布啦！\r\n";
        String name = item.getName();

        if (item.getType() == 2) {
            // BOSS狩猎任务
            if (name == null || name.isEmpty()) {
                name = MonsterInformationProvider.getInstance().getMobNameFromId(item.getBossId());
                if (name == null) {
                    name = "BOSS";
                }
            }
            message += "狩猎BOSS：" + name + "，\r\n";
            message += "第一个击杀该BOSS的玩家获得奖励！\r\n";
        } else {
            // 收集物品任务
            if (name == null || name.isEmpty()) {
                name = ItemInformationProvider.getInstance().getName(item.getItemId());
                if (name == null) {
                    name = "未知道具";
                }
            }
            message += "需要道具：" + name + " x" + item.getNeedCount() + "，\r\n";
            message += "全服只有一个玩家能够完成任务，先到先得！\r\n";
        }
        message += "限时：" + (taskInterval / 3600) + "小时";

        try {
            for (Channel channel : Server.getInstance().getChannelsFromWorld(0)) {
                channel.broadcastPacket(PacketCreator.serverNotice(6, message));
            }
        } catch (Exception e) {
            log.error("广播狩猎任务失败", e);
        }
    }

    /**
     * 获取金币奖励
     */
    public int getGoldReward() {
        return goldReward;
    }

    /**
     * 获取经验奖励
     */
    public int getExpReward() {
        return expReward;
    }

    /**
     * 获取点券奖励
     */
    public int getCashReward() {
        return cashReward;
    }

    /**
     * 获取奖励物品列表
     */
    public List<RewardItem> getRewardItems() {
        return rewardItems;
    }

    /**
     * 获取当前任务
     */
    public CurrentTask getCurrentTask() {
        synchronized (taskLock) {
            // 检查任务是否过期
            if (!currentTask.isCompleted() && System.currentTimeMillis() > currentTask.getEndTime()) {
                // 任务过期，重置
                currentTask = new CurrentTask();
            }
            return currentTask;
        }
    }

    /**
     * 检测玩家是否可以完成当前任务（仅用于收集物品任务）
     *
     * @param player 玩家
     * @return 0=可以完成, 1=任务不存在或已完成, 2=任务已过期, 3=道具不足
     */
    public int canCompleteTask(Character player) {
        synchronized (taskLock) {
            // BOSS任务不需要通过这个方法提交
            if (currentTask.isBossTask()) {
                return 1;
            }

            // 检查任务是否存在且未完成
            if (currentTask.isCompleted() || currentTask.getItemId() == 0) {
                return 1;
            }

            // 检查任务是否过期
            if (System.currentTimeMillis() > currentTask.getEndTime()) {
                return 2;
            }

            // 检查玩家背包中是否有足够的道具（使用 getItemQuantity 自动匹配正确的背包类型）
            int itemCount = player.getItemQuantity(currentTask.getItemId(), false);
            if (itemCount < currentTask.getNeedCount()) {
                return 3;
            }

            return 0;
        }
    }

    /**
     * 处理怪物死亡（由MapleMap调用，检测是否是狩猎BOSS）
     *
     * @param monsterId 怪物ID
     * @param player    击杀玩家
     */
    public void onMonsterKilled(int monsterId, Character player) {
        synchronized (taskLock) {
            // 检查是否是BOSS任务且未完成
            if (!currentTask.isBossTask() || currentTask.isCompleted()) {
                return;
            }

            // 检查任务是否过期
            if (System.currentTimeMillis() > currentTask.getEndTime()) {
                return;
            }

            // 检查是否是目标BOSS
            if (currentTask.getBossId() != monsterId) {
                return;
            }

            // 标记任务完成并发放奖励
            giveBossRewards(player);
        }
    }

    /**
     * 发放BOSS狩猎奖励
     */
    private void giveBossRewards(Character player) {
        String playerName = player.getName();

        // 标记任务完成
        currentTask.setCompleted(true);
        currentTask.setCompletedByName(playerName);
        currentTask.setCompletedTime(System.currentTimeMillis());

        log.info("狩猎任务完成 - 玩家:{}, 类型:BOSS狩猎, BOSSID:{}, BOSS名称:{}",
                playerName, currentTask.getBossId(), currentTask.getItemName());

        // 发放奖励
        StringBuilder rewardInfo = new StringBuilder();
        List<String> successRewards = new ArrayList<>();
        List<String> failRewards = new ArrayList<>();

        // 金币奖励
        player.gainMeso(goldReward, true);
        successRewards.add("金币 +" + goldReward);

        // 经验奖励
        player.gainExp(expReward, true, true, true);
        successRewards.add("经验 +" + expReward);

        // 点券奖励
        try {
            player.getCashShop().gainCash(CashShop.NX_CREDIT, cashReward);
            successRewards.add("点券 +" + cashReward);
        } catch (Exception e) {
            failRewards.add("点券 +" + cashReward + "(发放失败)");
            log.error("发放点券奖励失败，玩家:{}", playerName, e);
        }

        // 概率获得奖励物品（遍历奖励物品集合）
        for (RewardItem rewardItem : rewardItems) {
            if (random.nextDouble() < rewardItem.getChance()) {
                // 检查背包是否满
                if (player.getInventory(InventoryType.USE).getNumFreeSlot() >= 1) {
                    InventoryManipulator.addById(player.getClient(), rewardItem.getItemId(), (short) rewardItem.getCount());
                    String itemName = rewardItem.getName();
                    if (itemName == null || itemName.isEmpty()) {
                        itemName = ItemInformationProvider.getInstance().getName(rewardItem.getItemId());
                        if (itemName == null) {
                            itemName = "物品";
                        }
                    }
                    successRewards.add(itemName + " +" + rewardItem.getCount());
                } else {
                    String itemName = rewardItem.getName();
                    if (itemName == null || itemName.isEmpty()) {
                        itemName = "物品";
                    }
                    failRewards.add(itemName + " +" + rewardItem.getCount() + "(背包已满)");
                }
            }
        }

        // 广播任务完成
        broadcastTaskCompletion(playerName, successRewards, failRewards);

        // 给玩家发送奖励信息
        StringBuilder msg = new StringBuilder();
        msg.append("恭喜你完成了狩猎任务！\r\n\r\n");
        msg.append("获得奖励：\r\n");
        for (String reward : successRewards) {
            msg.append(reward).append("\r\n");
        }
        for (String reward : failRewards) {
            msg.append(reward).append("\r\n");
        }
        
        // 播放完成动画和声音（类似于组队副本过关效果）
        player.getClient().sendPacket(PacketCreator.showEffect("quest/carnival/win"));
        player.getClient().sendPacket(PacketCreator.playSound("MobCarnival/Win"));
        player.dropMessage(6, msg.toString());
    }

    /**
     * 标记任务为已完成（由JS调用，不执行扣除和奖励逻辑）
     *
     * @param playerName 完成任务的玩家名称
     */
    public void markTaskCompleted(String playerName) {
        synchronized (taskLock) {
            currentTask.setCompleted(true);
            currentTask.setCompletedByName(playerName);
            currentTask.setCompletedTime(System.currentTimeMillis());

            log.info("狩猎任务完成 - 玩家:{}, 物品ID:{}, 物品名:{}",
                    playerName, currentTask.getItemId(), currentTask.getItemName());

            // 广播任务完成
            broadcastTaskCompletion(playerName, null, null);
        }
    }

    /**
     * 广播任务完成
     */
    private void broadcastTaskCompletion(String playerName, List<String> successRewards, List<String> failRewards) {
        StringBuilder message = new StringBuilder();
        message.append("[狩猎任务] 恭喜玩家 ").append(playerName).append(" 完成了狩猎任务！\r\n");

        if (currentTask.isBossTask()) {
            message.append("狩猎BOSS：").append(currentTask.getItemName()).append("\r\n");
        } else {
            message.append("完成道具：#v").append(currentTask.getItemId()).append("# #z").append(currentTask.getItemId()).append("# × ").append(currentTask.getNeedCount()).append("\r\n");
        }

        if (successRewards != null && !successRewards.isEmpty()) {
            message.append("获得奖励：");
            for (int i = 0; i < successRewards.size(); i++) {
                if (i > 0) {
                    message.append("、");
                }
                message.append(successRewards.get(i));
            }
        } else {
            message.append("获得奖励：金币10万、经验5万、点券100");
        }

        try {
            for (Channel channel : Server.getInstance().getChannelsFromWorld(0)) {
                channel.broadcastPacket(PacketCreator.serverNotice(6, message.toString()));
            }
        } catch (Exception e) {
            log.error("广播狩猎任务完成失败", e);
        }
    }

    /**
     * 获取狩猎物品列表长度
     */
    public int getHuntItemsSize() {
        return huntItems.size();
    }

    /**
     * 获取任务间隔时间（秒）
     */
    public int getTaskInterval() {
        return taskInterval;
    }
}
