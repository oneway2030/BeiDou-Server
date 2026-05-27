# BeiDou-Server 游戏冒险岛北斗服

本项目基于Cosmic来的汉化和优化，Cosmic地址：https://github.com/P0nk/Cosmic

## 项目概述

BeiDou-Server是一个完整的游戏冒险岛(MapleStory)服务器解决方案，包含客户端、服务端和后台管理系统。该项目采用现代化的技术架构，支持多世界、多频道的高并发游戏环境，提供完整的MMORPG游戏功能。

## 项目结构

```
BeiDou-Server/
├── clien/                    # 游戏客户端
├── gms-server/              # 游戏服务端
├── gms-ui/                  # 后台管理系统
├── pom.xml                  # Maven项目配置
├── .gitignore              # Git忽略文件
└── README.md               # 项目说明文档
```

## 详细目录结构

### 1. 客户端 (clien/)

客户端是游戏的前端程序，负责显示游戏界面和处理用户输入。

#### 主要组件
- **BeiDou.exe** - 游戏客户端主程序
- **Data/** - 游戏资源文件目录
  - **UI/** - 界面资源文件
  - **Character/** - 角色资源文件
    - Weapon/, Coat/, Pants/, Glove/, Shoes/, Hat/, Hair/, Face/, etc.
  - **Skill/** - 技能资源文件
- **DLL文件** - 各种动态链接库
  - Canvas.dll, ResMan.dll, PCOM.dll, etc.

#### 技术特点
- 基于原始MapleStory客户端优化
- 支持中文界面和内容本地化
- 集成了北斗服特有的功能模块

### 2. 服务端 (gms-server/)

服务端是游戏的核心，负责处理游戏逻辑、数据存储和网络通信。

#### 目录结构
```
gms-server/
├── src/
│   ├── main/
│   │   ├── java/org/gms/
│   │   │   ├── dao/           # 数据访问层
│   │   │   ├── net/          # 网络通信层
│   │   │   │   ├── netty/     # Netty服务器实现
│   │   │   │   ├── packet/    # 数据包处理
│   │   │   │   └── encryption/ # 数据加密
│   │   │   ├── server/       # 游戏逻辑层
│   │   │   │   ├── channel/  # 频道管理
│   │   │   │   ├── world/    # 世界管理
│   │   │   │   └── guild/     # 公会系统
│   │   │   ├── services/     # 服务管理
│   │   │   ├── scripting/    # 脚本系统
│   │   │   └── quest/        # 任务系统
│   │   └── resources/
│   │       ├── db/           # 数据库脚本
│   │       ├── i18n/         # 国际化资源
│   │       └── wz/           # 游戏资源文件
│   └── test/
├── scripts/                  # 游戏脚本文件
├── scripts-zh-CN/           # 中文游戏脚本
├── wz/                      # 游戏资源文件
├── wz-zh-CN/               # 中文游戏资源
├── pom.xml                 # Maven配置
└── README.md              # 服务端说明
```

#### 技术栈
- **Java 21** - 主要开发语言
- **Spring Boot 3.3.1** - 应用框架
- **Netty 4.1.109** - 网络通信框架
- **MyBatis-Flex** - ORM框架
- **MySQL 8** - 数据库
- **Druid** - 数据库连接池
- **Flyway** - 数据库迁移
- **FastJSON2** - JSON处理
- **GraalVM JS** - JavaScript支持

#### 核心功能模块

##### 网络通信模块
- **多版本协议支持**：支持不同版本客户端
- **加密通信**：数据传输加密保护
- **高并发处理**：基于Netty的高性能网络处理

##### 游戏逻辑模块
- **角色系统**：角色创建、属性管理、职业发展
- **任务系统**：主线任务、支线任务、重复任务
- **公会系统**：公会创建、成员管理、公会功能
- **交易系统**：玩家商店、雇佣商人、交易市场
- **社交系统**：好友系统、家族系统、婚姻系统
- **宠物系统**：宠物养成、宠物功能

##### 数据管理模块
- **角色数据**：角色信息、装备、技能等
- **账户数据**：用户认证、权限管理
- **游戏数据**：物品、怪物、NPC等
- **社交数据**：好友、公会、家族关系

##### 服务管理模块
- **定时任务**：数据保存、状态更新
- **后台服务**：清理、统计、维护
- **脚本系统**：NPC脚本、地图脚本、任务脚本

### 3. 后台管理系统 (gms-ui/)

后台管理系统是基于Web的管理界面，用于管理游戏服务器和玩家数据。

#### 目录结构
```
gms-ui/
├── src/
│   ├── components/         # 组件库
│   │   ├── navbar/         # 导航栏
│   │   ├── menu/          # 菜单组件
│   │   ├── chart/         # 图表组件
│   │   └── global-setting/ # 全局设置
│   ├── views/             # 页面视图
│   ├── router/           # 路由配置
│   ├── store/            # 状态管理
│   ├── utils/            # 工具函数
│   ├── api/              # API接口
│   ├── types/            # TypeScript类型定义
│   ├── locale/          # 国际化
│   │   ├── zh-CN/       # 中文
│   │   └── en-US/       # 英文
│   └── config/           # 配置文件
├── public/               # 静态资源
├── package.json         # 项目配置
├── vite.config.*.ts    # Vite配置
└── README.md           # 前端说明
```

#### 技术栈
- **Vue 3.2.40** - 前端框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具
- **Arco Design Vue 2.44.7** - UI组件库
- **Vue Router 4.0.14** - 路由管理
- **Pinia 2.0.23** - 状态管理
- **Axios** - HTTP客户端
- **ECharts 5.4.0** - 图表库
- **Vue I18n 9.13.1** - 国际化

#### 主要功能
- **服务器监控**：在线玩家、服务器状态
- **玩家管理**：角色管理、物品管理、权限管理
- **公会管理**：公会创建、成员管理、等级管理
- **系统配置**：游戏参数、经验倍率、掉落倍率
- **数据统计**：玩家统计、收入统计、活动统计
- **内容管理**：活动管理、公告管理、邮件系统

## 代码框架架构

### 整体架构

BeiDou-Server采用多层架构设计，确保代码的清晰性和可维护性：

```
┌─────────────────────────────────────────────────┐
│                客户端层                          │
│          (clien - 游戏客户端)                   │
└─────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────┐
│               网络通信层                         │
│          (Netty - TCP/UDP通信)                  │
└─────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────┐
│              业务逻辑层                          │
│    (server - 游戏逻辑、任务、公会等)            │
└─────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────┐
│              数据访问层                          │
│    (dao - 数据持久化、缓存管理)                 │
└─────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────┐
│                数据存储层                        │
│           (MySQL - 数据库存储)                  │
└─────────────────────────────────────────────────┘
```

### 服务端架构模式

#### 1. 多世界多频道架构
- **世界服务器**：管理多个游戏世界，每个世界有独立的游戏参数
- **频道服务器**：每个世界包含多个频道，支持大量玩家同时在线
- **负载均衡**：玩家在不同频道间自由移动，实现负载分散

#### 2. 模块化设计
- **核心模块**：角色、任务、公会等核心游戏功能
- **支持模块**：社交、交易、宠物等辅助功能
- **扩展模块**：脚本系统、插件系统支持功能扩展

#### 3. 事件驱动架构
- **事件总线**：游戏事件通过事件总线进行分发
- **异步处理**：耗时操作异步执行，提高响应速度
- **状态管理**：统一的游戏状态管理机制

### 数据流架构

```
客户端 → Netty服务器 → 游戏逻辑处理器 → 数据访问层 → 数据库
    ↑                                    ↓
    └────── 响应数据 ←──── 服务层 ←───────┘
```

## 功能模块详解

### 1. 角色管理系统

#### 核心功能
- **角色创建**：选择职业、分配属性、自定义外观
- **角色发展**：等级提升、技能学习、装备强化
- **角色状态**：HP/MP管理、buff状态、异常状态
- **角色存储**：多角色管理、世界切换、数据持久化

#### 数据结构
```java
public class CharactersDO {
    private Integer id;           // 角色ID
    private Integer accountid;    // 账户ID
    private Integer world;        // 所在世界
    private String name;          // 角色名称
    private Integer level;        // 等级
    private Integer exp;          // 经验值
    private Integer job;          // 职业
    private Integer hp, mp;       // 当前HP/MP
    private Integer maxhp, maxmp; // 最大HP/MP
    private Integer meso;         // 金币
    private Integer fame;         // 声望
    private Integer guildid;      // 公会ID
    private Integer party;        // 组队ID
    private Integer map;          // 所在地图
    private Integer gm;           // GM等级
}
```

### 2. 任务系统

#### 任务类型
- **主线任务**：推动剧情发展，解锁新功能
- **支线任务**：提供额外奖励，丰富游戏内容
- **重复任务**：日常任务，提供持续收益
- **活动任务**：限时活动任务，特殊奖励

#### 任务机制
- **任务条件**：等级、职业、物品、怪物数量等
- **任务奖励**：经验、金币、物品、技能等
- **任务追踪**：进度显示、自动导航、提示系统

### 3. 公会系统

#### 公会功能
- **公会创建**：消耗金币创建公会，设置公会信息
- **成员管理**：加入、离开、踢出、职位变更
- **公会等级**：通过活动提升公会等级
- **公会技能**：提供属性加成和特殊功能

#### 公会结构
```java
public class Guild {
    private Long guildid;         // 公会ID
    private Long leader;          // 会长ID
    private String name;          // 公会名称
    private Long gp;              // 公会点数
    private Integer capacity;     // 公会容量
    private String rankTitles;    // 职位名称
    private Integer logo;        // 公会标志
    private Integer logoColor;   // 标志颜色
}
```

### 4. 交易系统

#### 交易类型
- **玩家商店**：玩家开设个人商店，出售物品
- **雇佣商人**：NPC雇佣系统，自动贩卖物品
- **交易市场**：跨频道交易系统，安全交易

#### 交易机制
- **定价系统**：自由定价，市场调节
- **交易安全**：担保交易，防止欺诈
- **交易记录**：完整交易历史，便于查询

### 5. 社交系统

#### 社交功能
- **好友系统**：添加好友、好友列表、在线状态
- **家族系统**：组建家族、家族等级、家族技能
- **婚姻系统**：角色配对、婚礼仪式、离婚机制
- **聊天系统**：私聊、公会聊天、世界聊天

### 6. 宠物系统

#### 宠物功能
- **宠物养成**：饥饿度、疲劳度、亲密度管理
- **宠物技能**：学习技能、技能升级
- **宠物背包**：宠物物品存储
- **宠物功能**：自动拾取、自动回复等

### 7. 游戏数据模块（物品 / 怪物 / BOSS）

本节详细分析游戏数据模块的逻辑结构、资源匹配机制和新增内容的正确流程。

#### 7.1 核心概念：WZ 资源文件

游戏的所有静态数据（物品属性、怪物属性、地图配置、NPC配置等）都存储在 **WZ 资源文件**中。WZ 文件以 XML 格式存放，服务端通过 `DataProviderFactory` 读取。

**WZ 文件根目录：**`gms-server/wz/`，包含以下子目录：

| WZ 目录 | 内容 | 说明 |
|---|---|---|
| `Mob.wz/` | 怪物数据 | 每个怪物一个 `{mobId}.img.xml` 文件 |
| `Item.wz/` | 消耗品等物品 | 按类别分：Cash/Consume/Etc/Install/Pet/Special |
| `Character.wz/` | 装备数据 | 每个装备一个文件，按类别分：Weapon/Coat/Pants/Hat/Glove/Shoes/Cape/Accessory/Ring/Shield/Face/Hair/Longcoat/Dragon 等 |
| `String.wz/` | 名称/描述字符串 | `Mob.img`、`Npc.img`、`Eqp.img`、`Consume.img`、`Etc.img` 等 |
| `Map.wz/` | 地图数据 | 包含怪物刷新点 `life` 节点 |
| `Skill.wz/` | 技能数据 | 角色和怪物技能 |
| `Npc.wz/` | NPC 图形和数据 | NPC 外观和对话 |
| `UI.wz/` | UI 数据 | 包含 BOSS 血条配置 `UIWindow.img/MobGage/Mob` |
| `Quest.wz/` | 任务数据 | 任务条件和奖励 |
| `Effect.wz/` | 特效数据 | 技能特效、物品特效 |
| `Sound.wz/` | 音效数据 | 背景音乐和音效 |
| `Etc.wz/` | 其他配置 | Tips 等辅助数据 |
| `Reactor.wz/` | 反应堆数据 | 地图交互对象 |

**多语言支持：** 服务端优先读取 `wz-{language}/` 目录（如 `wz-zh-CN/`），若不存在则回退到 `wz/`。通过 `WZFiles` 枚举的 `getFile()` 方法实现（见 `WZFiles.java`）。

#### 7.2 物品系统逻辑结构

##### 物品 ID 规则

物品 ID 的**前缀数字**决定了物品类型：

| ID 前缀 | 类型 | InventoryType | WZ 数据目录 |
|---|---|---|---|
| `1xx` | 装备（Equip） | EQUIP(1) / EQUIPPED(5) | `Character.wz/` |
| `2xx` | 消耗品（Use） | USE(2) | `Item.wz/Consume/` |
| `3xx` | 设置道具（Setup） | SETUP(3) | `Item.wz/Install/` |
| `4xx` | 其他（Etc） | ETC(4) | `Item.wz/Etc/` |
| `5xx` | 商城道具（Cash） | CASH(5) | `Item.wz/Cash/` |

##### 核心 Java 类

| 类 | 路径 | 职责 |
|---|---|---|
| `Item` | `client/inventory/Item.java` | 所有物品基类：`id, position, quantity, cashId, petid, flag, expiration` |
| `Equip` | `client/inventory/Equip.java` | 装备类（继承 Item）：`str, dex, _int, luk, hp, mp, watk, matk, wdef, mdef, acc, avoid, speed, jump` 等 |
| `Pet` | `client/inventory/Pet.java` | 宠物类（继承 Item） |
| `Inventory` | `client/inventory/Inventory.java` | 背包容器，管理一组物品 |
| `InventoryType` | `client/inventory/InventoryType.java` | 枚举：EQUIP, USE, SETUP, ETC, CASH, EQUIPPED |
| `ItemConstants` | `constants/inventory/ItemConstants.java` | 物品类型判断工具（`isEquipment`, `isThrowingStar`, `isPotion` 等） |
| `ItemInformationProvider` | `server/ItemInformationProvider.java` | **核心加载器**，从 WZ 读取所有物品属性，30+ 个缓存 Map |
| `ItemFactory` | `client/inventory/ItemFactory.java` | 物品持久化，从数据库加载/保存物品 |
| `InventoryManipulator` | `client/inventory/manipulator/InventoryManipulator.java` | 物品增删改操作 |
| `EquipUtils` | `client/inventory/EquipUtils.java` | 装备属性操作工具类 |

##### 物品数据加载流程

```
1. ItemInformationProvider.getInstance() 单例初始化
   ├── 创建 itemData  = DataProviderFactory(WZFiles.ITEM)     → Item.wz/
   ├── 创建 equipData = DataProviderFactory(WZFiles.CHARACTER) → Character.wz/
   ├── 创建 stringData = DataProviderFactory(WZFiles.STRING)   → String.wz/
   └── 创建 etcData   = DataProviderFactory(WZFiles.ETC)      → Etc.wz/

2. getItemData(itemId) 被调用
   ├── 根据 ID 前缀判断类型（1xx→装备, 2xx→消耗品...）
   ├── 在对应 WZ 目录中查找 {itemId}.img.xml
   └── 返回 Data 对象（懒加载 + 缓存）

3. 数据库层（运行时数据）
   ├── ItemFactory.INVENTORY(1)    → 角色背包
   ├── ItemFactory.STORAGE(2)      → 仓库
   ├── ItemFactory.CASH_EXPLORER(3-5) → 商城背包
   └── ItemFactory.MERCHANT(6)     → 雇佣商人
```

##### 装备 WZ 数据结构示例

装备文件 `Character.wz/Weapon/{equipId}.img.xml` 中的 `info` 节点包含：
- `reqSTR, reqDEX, reqINT, reqLUK` — 属性需求
- `reqJob` — 职业需求（0=无限制）
- `reqLevel` — 等级需求
- `incSTR, incDEX, incINT, incLUK` — 属性加成
- `incPAD, incMAD` — 物理/魔法攻击力
- `incPDD, incMDD` — 物理/魔法防御力
- `incACC, incEVA` — 命中/闪避
- `incSpeed, incJump` — 速度/跳跃
- `slots` — 可升级次数
- `desc` — 物品描述

#### 7.3 怪物系统逻辑结构

##### 核心 Java 类

| 类 | 路径 | 职责 |
|---|---|---|
| `Monster` | `server/life/Monster.java` | 怪物运行时实例：HP/MP、aggro 控制器、状态效果、技能使用 |
| `MonsterStats` | `server/life/MonsterStats.java` | 怪物静态属性：`hp, mp, exp, level, boss, PADamage, PDDamage, MADamage, MDDamage, name, skills, revives, movetype` 等 |
| `LifeFactory` | `server/life/LifeFactory.java` | **核心加载器**，从 `Mob.wz` 和 `String.wz` 读取数据 |
| `MonsterInformationProvider` | `server/life/MonsterInformationProvider.java` | 怪物掉落、攻击动画、技能动画信息的缓存管理 |
| `MobSkillFactory` | `server/life/MobSkillFactory.java` | 怪物技能工厂 |
| `MobSkill` | `server/life/MobSkill.java` | 怪物技能实例 |
| `MobAttackInfo` | `server/life/MobAttackInfo.java` | 怪物攻击信息 |
| `SpawnPoint` | `server/life/SpawnPoint.java` | 刷新点管理，控制怪物重生时间间隔 |
| `MonsterDropEntry` | `server/life/MonsterDropEntry.java` | 怪物掉落条目：`itemId, chance, Minimum, Maximum, questid` |
| `Element` / `ElementalEffectiveness` | `server/life/Element.java` | 元素属性和克制关系 |
| `MobId` | `constants/id/MobId.java` | **怪物 ID 常量定义**（Zakum、Horntail 等） |

##### 怪物 WZ 数据结构

文件路径：`wz/Mob.wz/{mobId}.img.xml`，结构如下：

```xml
<imgdir name="{mobId}.img">
  <imgdir name="info">           <!-- 核心属性 -->
    <int name="maxHP" value="..."/>
    <int name="maxMP" value="..."/>
    <int name="exp" value="..."/>
    <int name="level" value="..."/>
    <int name="boss" value="1"/>          <!-- 1=BOSS, 0=普通怪 -->
    <int name="PADamage" value="..."/>    <!-- 物理攻击力 -->
    <int name="PDDamage" value="..."/>    <!-- 物理防御力 -->
    <int name="MADamage" value="..."/>    <!-- 魔法攻击力 -->
    <int name="MDDamage" value="..."/>    <!-- 魔法防御力 -->
    <int name="acc" value="..."/>         <!-- 命中 -->
    <int name="eva" value="..."/>         <!-- 闪避 -->
    <int name="speed" value="..."/>       <!-- 移动速度 -->
    <string name="elemAttr" value="S1"/>  <!-- 元素属性 -->
    <int name="hpTagColor" value="..."/>  <!-- BOSS 血条颜色 -->
    <int name="hpTagBgcolor" value="..."/> <!-- BOSS 血条背景色 -->
    <int name="undead" value="0"/>        <!-- 是否不死系 -->
    <int name="explosiveReward" value="0"/> <!-- 爆装备 -->
    <int name="publicReward" value="0"/>  <!-- 自由拾取 -->
    <imgdir name="revive">               <!-- 死亡后复活的怪物ID列表（多阶段BOSS用） -->
      <int value="8800001"/>
    </imgdir>
    <imgdir name="skill">                <!-- 怪物技能配置 -->
      <imgdir name="0">
        <int name="skill" value="..."/>
        <int name="level" value="..."/>
        <int name="effect" value="..."/>
        <int name="cooltime" value="..."/>
      </imgdir>
    </imgdir>
    <imgdir name="ban">                  <!-- 传送信息 -->
      <string name="banMsg" value="..."/>
      <imgdir name="banMap">
        <imgdir name="0">
          <int name="field" value="..."/>
          <string name="portal" value="..."/>
        </imgdir>
      </imgdir>
    </imgdir>
  </imgdir>
  <imgdir name="attack1">...</imgdir>  <!-- 攻击动画 -->
  <imgdir name="attack2">...</imgdir>
  <imgdir name="stand">...</imgdir>    <!-- 站立动画 -->
  <imgdir name="move">...</imgdir>     <!-- 移动动画 -->
  <imgdir name="hit1">...</imgdir>     <!-- 受击动画 -->
  <imgdir name="die1">...</imgdir>     <!-- 死亡动画 -->
  <imgdir name="fly">...</imgdir>      <!-- 飞行怪物的飞行动画 -->
  <imgdir name="skill1">...</imgdir>   <!-- 技能动画 -->
</imgdir>
```

##### 怪物名称

怪物名称存储在 `wz/String.wz/Mob.img.xml` 中，通过 ID 查找：
```xml
<imgdir name="Mob.img">
  <imgdir name="1110100">         <!-- 怪物ID -->
    <string name="name" value="绿蘑菇"/>
  </imgdir>
  <imgdir name="8800000">         <!-- Zakum -->
    <string name="name" value="扎昆"/>
  </imgdir>
</imgdir>
```

##### 怪物数据加载流程

```
1. LifeFactory.getMonster(mid) 被调用
   ├── 从 DataProviderFactory(WZFiles.MOB) 获取 Mob.wz 数据
   ├── 读取 Mob.wz/{mid}.img.xml → getMonsterStats(mid)
   │   ├── 解析 info 节点 → MonsterStats 对象
   │   ├── 读取 String.wz/Mob.img/{mid}/name → 怪物名称
   │   ├── 解析 attack1/attack2/... → MobAttackInfoHolder 列表
   │   ├── 解析 skill 节点 → MobSkillId 集合
   │   ├── 解析 revive 节点 → 复活怪物ID列表
   │   ├── 解析 elemAttr → 元素克制关系
   │   └── 计算各动画帧总延迟 → animationTimes Map
   ├── 缓存 MonsterStats 到 monsterStats Map
   └── 创建 Monster 实例返回

2. 掉落数据（数据库）
   ├── MonsterInformationProvider 从 drop_data 表读取
   │   SELECT * FROM drop_data WHERE dropperid = ?
   ├── 全局掉落从 drop_data_global 表读取
   └── 缓存在 drops / globaldrops Map 中

3. 地图刷新
   ├── MapFactory.loadLifeFromWz() → 从 Map.wz 的 life 节点读取
   │   每个怪物有: id, type("m"), cy, f, fh, rx0, rx1, x, y, hide, mobTime, team
   ├── 也可从数据库 plife 表加载 → loadLifeFromDb()
   └── SpawnPoint 管理重生逻辑
```

#### 7.4 BOSS 系统逻辑结构

BOSS 与普通怪物**没有独立的子类**，而是通过 `MonsterStats.boss` 标志来区分。以下是 BOSS 的特殊处理：

##### BOSS 标识和特殊逻辑

| 功能 | 说明 | 代码位置 |
|---|---|---|
| BOSS 标识 | WZ `info/boss` 字段，`boss=1` | `MonsterStats.isBoss()` |
| BOSS 血条 | `isBoss() && hpbarBosses.contains(mid)` 时显示 | `Monster.hasBossHPBar()` |
| 血条配置 | 从 `UI.wz/UIWindow.img/MobGage/Mob` 读取 BOSS ID 列表 | `LifeFactory.getHpBarBosses()` |
| 刷新倍率 | BOSS 不受 `mob_respawn_rate` 影响，始终为 1 | `MapFactory.loadLifeRaw()` |
| 家族声望 | BOSS 击杀给予更多声望（`family_rep_per_boss_kill`） | - |
| BOSS 日志 | 击杀记录在 `BosslogDaily` 和 `BosslogWeekly` 数据库表 | - |

##### 多阶段 BOSS 机制

以 **Zakum（扎昆）** 为例：
- `MobId.ZAKUM_1/2/3`（8800000-8800002）— 三个阶段
- `MobId.ZAKUM_ARM_1-8`（8800003-8800010）— 八条手臂
- 死亡后通过 WZ 的 `info/revive` 字段自动召唤下一阶段

**Horntail（暗黑独角兽）** 同理：
- 8 个身体部位（头、手、翅膀、腿、尾巴等）
- 8 个死亡状态（`DEAD_HORNTAIL_MIN/MAX`）
- 1 个主体

##### BOSS 事件脚本

BOSS 副本通过事件脚本控制，位于 `gms-server/scripts/event/`：
- `ZakumBattle.js` / `ZakumPQ.js` — 扎昆战斗和前置
- `HorntailBattle.js` / `HorntailPQ.js` — 暗黑独角兽
- `PinkBeanBattle.js` — 粉红怪
- `AreaBoss*.js` — 区域 BOSS 刷新器（Kimera, Mano, Faust 等约 15 种）
- `BossRushPQ.js` — BOSS Rush 副本

#### 7.5 资源匹配机制：客户端与服务端如何对应

服务端和客户端使用**相同的 WZ 文件**（或至少相同 ID 的数据结构），通过 **ID-based matching** 实现匹配：

```
客户端 WZ 文件 ←→ 服务端 WZ 文件 (相同 ID)
                  ↓
         服务端 Provider 层读取
                  ↓
         Java 对象 (Monster / Item / NPC / Map)
                  ↓
         数据库 (inventoryitems / drop_data 等)
```

**匹配关系对照表：**

| 资源类型 | 服务端 ID 来源 | WZ 文件 | String 文件 |
|---|---|---|---|
| 物品 | `Item.getItemId()` | `Item.wz/{category}/{itemId}.img` 或 `Character.wz/{category}/{itemId}.img` | `String.wz/Consume.img`、`String.wz/Eqp.img` 等 |
| 怪物 | `Monster.getId()` | `Mob.wz/{mobId}.img` | `String.wz/Mob.img/{mobId}/name` |
| 地图 | `MapleMap.getId()` | `Map.wz/{mapId}.img` | `String.wz/Map.img` |
| NPC | `NPC.getId()` | `Npc.wz/{npcId}.img` | `String.wz/Npc.img/{npcId}/name` |
| 技能 | `Skill.getId()` | `Skill.wz/{skillId}.img` | `String.wz/Skill.img` |

**关键点：**
- 服务端通过 `DataProviderFactory` 读取 WZ XML 文件
- 客户端直接使用编译后的 WZ 文件
- `String.wz` 提供的名称/描述在服务端用于搜索、日志等，客户端也使用它来显示
- BOSS 的血条显示由 `UI.wz/UIWindow.img/MobGage/Mob` 中的 BOSS ID 列表控制，服务端和客户端共享此列表
- **不需要修改 Java 代码** — 所有数据都通过 WZ 文件和数据库驱动

#### 7.6 新增内容的正确流程

##### 新增普通怪物

1. **创建 WZ 数据文件**（必须）
   - 在 `gms-server/wz/Mob.wz/` 中创建 `{newMobId}.img.xml`
   - 包含 `info` 节点：`maxHP, maxMP, exp, level, boss(=0), PADamage, PDDamage, MADamage, MDDamage, elemAttr` 等
   - 包含动画节点：`stand, move, hit1, die1, attack1` 等

2. **添加怪物名称**（必须）
   - 在 `gms-server/wz/String.wz/Mob.img.xml` 中添加怪物名称

3. **配置掉落数据**（必须）
   - 在数据库 `drop_data` 表中添加掉落配置：
     ```sql
     INSERT INTO drop_data (dropperid, itemid, chance, minimum_quantity, maximum_quantity, questid)
     VALUES ({mobId}, {itemId}, {chance}, {minQty}, {maxQty}, {questId});
     ```

4. **配置地图刷新点**（按需）
   - 方式一：在 `Map.wz` 的对应地图 XML 的 `life` 节点中添加怪物刷新点
   - 方式二：在数据库 `plife` 表中添加记录

##### 新增 BOSS

在新增普通怪物的基础上，额外需要：

5. **设置 BOSS 标识**
   - WZ `info` 节点中设置 `boss` = 1

6. **配置 BOSS 血条**（推荐）
   - 在 `gms-server/wz/UI.wz/UIWindow.img/MobGage/Mob` 中添加 BOSS ID
   - 在 `info` 中设置 `hpTagColor` 和 `hpTagBgcolor`（血条颜色）

7. **添加 MobId 常量**（推荐）
   - 在 `gms-server/src/main/java/org/gms/constants/id/MobId.java` 中添加 BOSS ID 常量

8. **创建 BOSS 事件脚本**（如需副本机制）
   - 在 `gms-server/scripts/event/` 中创建事件脚本（如 `NewBossBattle.js`）

9. **配置多阶段复活**（如需）
   - 在 WZ 的 `info/revive` 节点中设置死亡后召唤的怪物 ID 列表

##### 新增消耗品

1. **创建 WZ 数据文件**
   - 在 `gms-server/wz/Item.wz/Consume/` 中创建 XML 文件

2. **添加物品名称和描述**
   - 在 `gms-server/wz/String.wz/Consume.img.xml` 中添加名称和描述

3. **配置掉落/商店**（按需）
   - 在数据库 `drop_data` 或 `shop` 表中配置

##### 新增装备

1. **创建 WZ 数据文件**
   - 在 `gms-server/wz/Character.wz/{category}/` 中创建 `{equipId}.img.xml`
   - 装备类别目录：`Weapon/`, `Coat/`, `Pants/`, `Hat/`, `Glove/`, `Shoes/`, `Cape/`, `Accessory/`, `Ring/`, `Shield/`, `Face/`, `Hair/`, `Longcoat/`, `Dragon/`

2. **装备 WZ 数据必须包含完整属性**
   - `info` 节点下需包含：`reqSTR, reqDEX, reqINT, reqLUK, reqJob, reqLevel, incSTR, incDEX, incINT, incLUK, incPAD, incMAD, incPDD, incMDD, incACC, incEVA, incSpeed, incJump, slots, desc` 等

3. **添加装备名称和描述**
   - 在 `gms-server/wz/String.wz/Eqp.img.xml` 中添加

##### 修改文件汇总表

| 操作 | 必须修改的文件/位置 |
|---|---|
| 新增怪物 | `wz/Mob.wz/{id}.img.xml`, `wz/String.wz/Mob.img.xml`, 数据库 `drop_data` |
| 新增 BOSS | 同上 + `MobId.java`, `wz/UI.wz/UIWindow.img/MobGage/Mob`, 事件脚本 |
| 新增消耗品 | `wz/Item.wz/Consume/{id}.img.xml`, `wz/String.wz/Consume.img.xml` |
| 新增装备 | `wz/Character.wz/{category}/{id}.img.xml`, `wz/String.wz/Eqp.img.xml` |
| 新增怪物掉落 | 数据库 `drop_data` 表 |
| 新增全局掉落 | 数据库 `drop_data_global` 表 |
| 修改怪物属性 | `wz/Mob.wz/{id}.img.xml` 的 `info` 节点 |
| 修改物品属性 | `wz/Item.wz` 或 `wz/Character.wz` 对应文件 |

> **注意：** 大多数新增内容不需要修改 Java 代码。`LifeFactory`、`ItemInformationProvider`、`MonsterInformationProvider` 会自动读取新的 WZ 数据和数据库记录。只有在需要新的 Java 逻辑（如特殊 BOSS 行为、新的物品效果类型）时才需要修改 Java 代码。

### 8. 角色系统深度分析与新职业添加指南

本节详细分析角色系统的逻辑结构，以及如何添加新职业（以暗影双刀为例）。

#### 8.1 角色系统核心逻辑

##### 职业定义
职业在 `client/Job.java` 枚举中定义，每个职业有唯一的ID和名称。职业ID的规则如下：

| 职业系列 | ID范围 | 说明 |
|---|---|---|
| 冒险家 | 0-599 | 初心者、战士、魔法师、弓箭手、飞侠、海盗 |
| 骑士团 | 1000-1999 | 魂骑士、炎术士、风灵使者、夜行者、奇袭者 |
| 战神 | 2000-2199 | 战神系列职业 |
| 龙神 | 2200-2299 | 龙神系列职业 |

##### 职业分支规则
每个职业系列分为多个分支，通过职业ID的十位数区分：
- **战士系**：100（战士）→ 110（剑客）→ 111（勇士）→ 112（英雄）
- **魔法师系**：200（魔法师）→ 210（火毒法师）→ 211（火毒巫师）→ 212（火毒魔导士）
- **弓箭手系**：300（弓箭手）→ 310（猎人）→ 311（射手）→ 312（神射手）
- **飞侠系**：400（飞侠）→ 410（刺客）→ 411（无影人）→ 412（隐士）
- **海盗系**：500（海盗）→ 510（拳手）→ 511（斗士）→ 512（冲锋队长）

##### 角色创建流程
1. **客户端发送创建请求**：包含职业、外观、属性等信息
2. **服务端验证**：检查职业ID、属性值、物品等
3. **创建角色对象**：使用 `CharacterFactory` 和 `CharacterFactoryRecipe`
4. **初始化角色数据**：设置初始属性、装备、技能
5. **保存到数据库**：插入 `characters` 表

##### 技能系统
- **技能常量**：定义在 `constants/skills/` 目录下，每个职业一个文件
- **技能数据**：存储在 `Skill.wz/` 目录下，按职业ID分组
- **技能加载**：`SkillFactory` 从WZ文件读取技能数据
- **技能学习**：通过NPC脚本或任务奖励学习技能

#### 8.2 添加新职业（暗影双刀）的完整流程

##### 第一步：在Job枚举中添加新职业
在 `client/Job.java` 中添加双刀职业的枚举值：

```java
// 飞侠系 - 双刀分支
DUALBLADE_1(430, I18nUtil.getMessage("job.name.430")),  // 见习刀客
DUALBLADE_2(431, I18nUtil.getMessage("job.name.431")),  // 双刀客
DUALBLADE_3(432, I18nUtil.getMessage("job.name.432")),  // 双刀侠
DUALBLADE_4(433, I18nUtil.getMessage("job.name.433")),  // 血刀
DUALBLADE_5(434, I18nUtil.getMessage("job.name.434")),  // 暗影双刀
```

##### 第二步：创建技能常量文件
在 `constants/skills/` 目录下创建 `DualBlade.java`：

```java
package org.gms.constants.skills;

public class DualBlade {
    // 一转技能
    public static final int KATARA_MASTERY = 4300000;
    public static final int SHARPNESS = 4300001;
    public static final int FLASH_JUMP = 4301000;
    public static final int FATAL_BLOW = 4301001;
    public static final int SLASH_STORM = 4301002;
    
    // 二转技能
    public static final int DUAL_BLADE_MASTERY = 4310000;
    public static final int HASTE = 4311000;
    public static final int UPPER_STAB = 4311001;
    public static final int FKAIRO_SLASH = 4311002;
    
    // 三转技能
    public static final int ADVANCED_BLADE_MASTERY = 4320000;
    public static final int BLOODY_STORM = 4331000;
    public static final int MIRROR_IMAGE = 4331002;
    public static final int DEAD_OWL = 4331003;
    
    // 四转技能
    public static final int EXPERT_BLADE_MASTERY = 4340000;
    public static final int BLADE_FURY = 4341000;
    public static final int PHANTOM_BLOW = 4341001;
    public static final int ASURA = 4341002;
}
```

##### 第三步：添加技能WZ数据
在 `Skill.wz/` 目录下创建双刀职业的技能文件：
- `430.img.xml` - 一转技能数据
- `431.img.xml` - 二转技能数据
- `432.img.xml` - 三转技能数据
- `433.img.xml` - 三转技能数据
- `434.img.xml` - 四转技能数据

每个文件包含技能的详细数据，如伤害、MP消耗、冷却时间等。

##### 第四步：创建角色创建器
在 `client/creator/` 目录下创建 `DualBladeCreator.java`：

```java
package org.gms.client.creator.veteran;

import org.gms.client.Client;
import org.gms.client.Job;
import org.gms.client.creator.CharacterFactory;
import org.gms.client.creator.CharacterFactoryRecipe;
import org.gms.client.inventory.InventoryType;
import org.gms.client.inventory.Item;
import org.gms.constants.id.ItemId;
import org.gms.constants.id.MapId;
import org.gms.server.ItemInformationProvider;

public class DualBladeCreator extends CharacterFactory {
    private static final int[] equips = {ItemId.BROWN_BATTLEDORE, ItemId.RED_JUNGAO, 
            ItemId.BROWN_BATTLEDORE_PANTS, ItemId.RED_JUNGAO_PANTS, ItemId.BRONZE_CHAIN_BOOTS};
    private static final int[] weapons = {ItemId.KATARA, ItemId.SHORT_SWORD};
    private static final int[] startingHpMp = {794, 407};

    private static CharacterFactoryRecipe createRecipe(Job job, int level, int map, 
            int top, int bottom, int shoes, int weapon) {
        CharacterFactoryRecipe recipe = new CharacterFactoryRecipe(job, level, map, 
                top, bottom, shoes, weapon);
        ItemInformationProvider ii = ItemInformationProvider.getInstance();

        recipe.setDex(25);
        recipe.setRemainingAp(133);
        recipe.setRemainingSp(61);

        recipe.setMaxHp(startingHpMp[0]);
        recipe.setMaxMp(startingHpMp[1]);

        recipe.setMeso(100000);

        for (int i = 1; i < weapons.length; i++) {
            giveEquipment(recipe, ii, weapons[i]);
        }

        giveItem(recipe, ItemId.SUBI_THROWING_STARS, 500, InventoryType.USE);
        giveItem(recipe, ItemId.WHITE_POTION, 100, InventoryType.USE);
        giveItem(recipe, ItemId.BLUE_POTION, 100, InventoryType.USE);
        giveItem(recipe, ItemId.RELAXER, 1, InventoryType.SETUP);

        return recipe;
    }

    private static void giveEquipment(CharacterFactoryRecipe recipe, 
            ItemInformationProvider ii, int equipid) {
        Item nEquip = ii.getEquipById(equipid);
        recipe.addStartingEquipment(nEquip);
    }

    private static void giveItem(CharacterFactoryRecipe recipe, int itemid, 
            int quantity, InventoryType itemType) {
        recipe.addStartingItem(itemid, quantity, itemType);
    }

    public static int createCharacter(Client c, String name, int face, int hair, 
            int skin, int gender, int improveSp) {
        return createNewCharacter(c, name, face, hair, skin, gender, 
                createRecipe(Job.DUALBLADE_1, 30, MapId.KERNING_CITY, 
                equips[gender], equips[2 + gender], equips[4], weapons[0]));
    }
}
```

##### 第五步：添加装备数据
1. **武器数据**：在 `Character.wz/Weapon/` 目录下添加双刀武器数据
2. **装备名称**：在 `String.wz/Eqp.img.xml` 中添加装备名称和描述
3. **装备需求**：设置职业需求 `reqJob` 为双刀职业ID

##### 第六步：更新转职脚本
更新快速转职脚本 `scripts-zh-CN/BeiDouSpecial/快速转职.js`，添加双刀职业的转职逻辑：

```javascript
430: [//见习刀客 - 二转
    [
        {job_id: 431, name: "双刀客", level: 30, js: ""},
        {id: 4310000, max_Level: 20},
        {id: 4311001, max_Level: 20},
        {id: 4311002, max_Level: 20},
        {id: 4311003, max_Level: 20}
    ]
],
```

##### 第七步：更新其他脚本
1. **NPC脚本**：更新转职NPC脚本，支持双刀职业
2. **任务脚本**：更新相关任务脚本，支持双刀职业
3. **物品脚本**：更新物品使用脚本，支持双刀武器

#### 8.3 添加新职业的可行性评估

##### 优势
1. **系统架构支持**：项目采用数据驱动的设计，大部分数据通过WZ文件和数据库配置
2. **脚本灵活性**：转职逻辑通过JavaScript脚本实现，易于修改和扩展
3. **模块化设计**：角色创建、技能学习等模块相对独立

##### 挑战
1. **技能数据获取**：需要从其他MapleStory版本获取双刀职业的技能WZ数据
2. **多文件修改**：需要修改Java代码、WZ文件、脚本文件等多个位置
3. **平衡性调整**：需要调整双刀职业的技能伤害、MP消耗等参数
4. **客户端兼容**：需要确保客户端支持双刀职业的图形和动画

##### 建议流程
1. **获取技能数据**：从MapleStory其他版本（如CMS、TMS）获取双刀技能WZ数据
2. **逐步实现**：先实现基础功能（职业定义、技能学习），再完善细节（转职任务、平衡性）
3. **充分测试**：测试双刀职业的所有技能、转职流程、装备使用等
4. **文档记录**：记录所有修改的文件和配置，便于维护

#### 8.4 修改文件汇总表

| 操作 | 必须修改的文件/位置 |
|---|---|
| 添加职业定义 | `Job.java` |
| 添加技能常量 | `constants/skills/DualBlade.java` |
| 添加技能数据 | `Skill.wz/430.img.xml` 等 |
| 添加角色创建器 | `client/creator/veteran/DualBladeCreator.java` |
| 添加装备数据 | `Character.wz/Weapon/` 等 |
| 添加装备名称 | `String.wz/Eqp.img.xml` |
| 更新转职脚本 | `scripts-zh-CN/BeiDouSpecial/快速转职.js` |
| 更新NPC脚本 | 相关NPC脚本文件 |
| 更新任务脚本 | 相关任务脚本文件 |

> **注意：** 添加新职业是一个复杂的过程，需要修改多个文件。建议在开发分支上进行，充分测试后再合并到主分支。

### 9. 技能系统深度分析与新技能创建指南

本节详细分析技能系统的逻辑结构，以及如何创建一个新技能（复制现有技能并修改特效）。

#### 9.1 技能系统核心逻辑

##### 技能数据存储
技能数据存储在多个位置：

| 数据类型 | 存储位置 | 说明 |
|---|---|---|
| 技能属性数据 | `Skill.wz/{skillId}.img.xml` | 技能的伤害、MP消耗、冷却时间等 |
| 技能名称描述 | `String.wz/Skill.img.xml` | 技能的名称和描述 |
| 技能常量定义 | `constants/skills/*.java` | 技能ID的Java常量 |
| 技能特效数据 | `Skill.wz/{skillId}.img.xml` | 技能的动画特效、音效等 |

##### 技能ID规则
技能ID遵循特定规则：
- **格式**：`职业ID * 10000 + 技能编号`
- **示例**：战士一转技能 `1100000` = 110（战士ID）* 10000 + 0（技能编号）
- **转职阶段**：通过技能ID的千位数区分转职阶段

##### 技能加载流程
1. **SkillFactory.loadAllSkills()**：从 `Skill.wz/` 目录加载所有技能数据
2. **SkillFactory.loadFromData()**：解析每个技能的XML数据
3. **StatEffect.loadSkillEffectFromData()**：加载技能效果数据
4. **技能缓存**：加载后的技能存储在 `skills` Map中

##### 技能特效结构
技能特效在WZ文件中包含以下节点：

```xml
<imgdir name="{skillId}">
  <imgdir name="effect">      <!-- 技能特效动画 -->
    <canvas name="0">...</canvas>
    <canvas name="1">...</canvas>
  </imgdir>
  <imgdir name="hit">         <!-- 命中特效 -->
    <canvas name="0">...</canvas>
  </imgdir>
  <imgdir name="action">      <!-- 角色动作 -->
    <string name="0" value="alert2"/>
  </imgdir>
  <canvas name="icon">        <!-- 技能图标 -->
  </canvas>
  <imgdir name="level">       <!-- 各等级属性 -->
    <imgdir name="1">
      <int name="damage" value="105"/>
      <int name="mpCon" value="12"/>
    </imgdir>
  </imgdir>
</imgdir>
```

#### 9.2 创建新技能的完整流程

以创建一个新技能为例，假设我们要复制战士一转技能 `1100000`（铁体）并修改特效。

##### 第一步：复制技能WZ数据
1. **复制技能文件**：将 `Skill.wz/110.img.xml` 复制为 `Skill.wz/999.img.xml`（或其他未使用的ID）
2. **修改技能ID**：在复制的文件中，将所有技能ID从 `1100000` 修改为 `9990000`
3. **修改技能属性**：调整伤害、MP消耗、冷却时间等参数
4. **修改技能特效**：替换 `effect`、`hit` 等节点中的动画数据

##### 第二步：添加技能名称
在 `String.wz/Skill.img.xml` 中添加新技能的名称和描述：

```xml
<imgdir name="9990000">
  <string name="name" value="新技能名称"/>
  <string name="desc" value="[最高等级：20]技能描述"/>
  <string name="h1" value="等级1效果描述"/>
  <string name="h20" value="等级20效果描述"/>
</imgdir>
```

##### 第三步：添加技能常量
在 `constants/skills/` 目录下创建新文件或修改现有文件：

```java
package org.gms.constants.skills;

public class NewSkill {
    public static final int NEW_SKILL_1 = 9990000;
    public static final int NEW_SKILL_2 = 9990001;
}
```

##### 第四步：更新技能工厂
如果需要特殊处理，在 `SkillFactory.java` 中添加新技能的特殊逻辑：

```java
case NewSkill.NEW_SKILL_1:
    isBuff = true; // 或 false
    break;
```

##### 第五步：更新技能学习脚本
更新NPC脚本或任务脚本，让玩家可以学习新技能：

```javascript
cm.teachSkill(9990000, 0, 20, -1); // 学习技能，等级0-20
```

#### 9.3 修改特效的具体方法

##### 替换技能特效
1. **获取特效资源**：从其他技能或资源包中获取特效动画
2. **修改effect节点**：替换 `Skill.wz/{skillId}.img.xml` 中的 `effect` 节点
3. **修改hit节点**：替换命中特效
4. **调整动画参数**：修改 `delay`、`origin` 等参数

##### 特效资源格式
特效资源使用Canvas格式，包含多帧动画：

```xml
<imgdir name="effect">
  <canvas name="0" width="100" height="100">
    <vector name="origin" x="50" y="50"/>
    <int name="delay" value="100"/>
  </canvas>
  <canvas name="1" width="120" height="120">
    <vector name="origin" x="60" y="60"/>
    <int name="delay" value="100"/>
  </canvas>
</imgdir>
```

##### 特效参数说明
- **width/height**：特效图片尺寸
- **origin**：特效中心点坐标
- **delay**：帧延迟（毫秒）
- **z**：图层深度

#### 9.4 技能系统修改文件汇总

| 操作 | 必须修改的文件/位置 |
|---|---|
| 创建新技能数据 | `Skill.wz/{newSkillId}.img.xml` |
| 添加技能名称 | `String.wz/Skill.img.xml` |
| 添加技能常量 | `constants/skills/NewSkill.java` |
| 更新技能工厂（可选） | `SkillFactory.java` |
| 更新学习脚本 | 相关NPC或任务脚本 |
| 更新技能UI（可选） | 客户端技能UI文件 |

#### 9.5 注意事项

##### 技能ID选择
1. **避免冲突**：确保新技能ID不与现有技能冲突
2. **ID范围**：建议使用 `999xxxx` 等未使用的范围
3. **职业匹配**：如果技能属于特定职业，确保ID符合职业ID规则

##### 特效兼容性
1. **客户端支持**：确保客户端支持新特效的格式
2. **性能考虑**：特效动画帧数不宜过多，避免性能问题
3. **资源大小**：特效文件大小应适中，避免加载缓慢

##### 平衡性调整
1. **伤害数值**：根据游戏平衡性调整技能伤害
2. **MP消耗**：合理设置MP消耗
3. **冷却时间**：设置适当的冷却时间
4. **学习条件**：设置合理的等级和前置技能要求

#### 9.6 可行性评估

##### 优势
1. **数据驱动**：技能数据通过WZ文件配置，修改方便
2. **模块化设计**：技能系统相对独立，修改影响范围小
3. **脚本支持**：技能学习通过脚本实现，灵活度高

##### 挑战
1. **特效制作**：需要制作或获取新的特效资源
2. **客户端兼容**：需要确保客户端支持新技能特效
3. **平衡性测试**：需要充分测试技能平衡性

##### 建议流程
1. **选择基础技能**：选择一个现有技能作为模板
2. **复制修改数据**：复制技能数据并修改必要参数
3. **制作特效资源**：制作或获取新的特效资源
4. **添加到系统**：按照上述流程添加到游戏中
5. **测试调整**：充分测试并调整技能参数

> **注意：** 创建新技能需要修改WZ文件和脚本文件，建议在测试环境中进行，充分验证后再部署到生产环境。

## 技术特点

### 1. 高性能架构

#### 网络优化
- **Netty框架**：基于Netty的高性能网络通信
- **连接池**：数据库连接池管理，提高访问效率
- **数据缓存**：频繁访问数据缓存机制

#### 性能监控
- **性能指标**：实时监控服务器性能指标
- **日志系统**：完整的日志记录和分析
- **异常处理**：完善的异常处理机制

### 2. 可扩展性

#### 插件系统
- **脚本引擎**：支持JavaScript脚本扩展
- **模块化设计**：功能模块独立，易于扩展
- **配置驱动**：通过配置文件调整参数

#### 多版本支持
- **协议版本**：支持多版本客户端协议
- **向后兼容**：保持向后兼容性
- **平滑升级**：支持服务器平滑升级

### 3. 安全性

#### 数据安全
- **数据加密**：敏感数据加密存储
- **访问控制**：基于角色的访问控制
- **输入验证**：严格的输入数据验证

#### 防作弊机制
- **检测机制**：异常行为检测
- **封禁系统**：玩家封禁和解封
- **日志审计**：完整的操作日志

## 部署说明

### 环境要求

#### 服务端环境
- **Java 21** - OpenJDK 21
- **MySQL 8** - 数据库服务器
- **Maven** - 项目构建工具
- **Git** - 版本控制工具

#### 客户端环境
- **Windows** - 操作系统
- **DirectX** - 图形接口
- **网络连接** - 稳定的网络连接

#### 管理端环境
- **Node.js 20.15.0** - 运行环境
- **Yarn** - 包管理工具
- **现代浏览器** - Chrome、Firefox、Safari等

### 部署步骤

#### 服务端部署
1. **环境准备**：安装Java 21、MySQL 8、Maven
2. **数据库配置**：创建数据库，执行初始化脚本
3. **编译项目**：使用Maven编译项目
4. **启动服务**：运行启动脚本启动服务器

#### 客户端部署
1. **下载客户端**：从Release页面下载客户端
2. **配置连接**：修改服务器连接地址
3. **运行客户端**：运行BeiDou.exe启动游戏

#### 管理端部署
1. **环境准备**：安装Node.js 20.15.0和Yarn
2. **安装依赖**：在gms-ui目录执行`yarn install`
3. **启动服务**：执行`yarn dev`启动开发服务器
4. **访问系统**：浏览器访问管理界面

## 开发指南

### 开发环境搭建

#### 服务端开发
1. **IDE配置**：IntelliJ IDEA 2023.3+
2. **项目导入**：导入gms-server项目
3. **调试配置**：配置远程调试
4. **代码规范**：遵循项目编码规范

#### 管理端开发
1. **IDE配置**：VS Code或其他支持Vue的IDE
2. **环境配置**：Node.js + Yarn环境
3. **开发工具**：Vite热重载、ESLint代码检查

### 代码规范

#### 服务端规范
- **命名规范**：驼峰命名法
- **注释规范**：JavaDoc注释
- **异常处理**：统一的异常处理机制

#### 管理端规范
- **Vue组件**：单文件组件格式
- **TypeScript**：严格类型检查
- **代码风格**：ESLint + Prettier

## 贡献指南

### 开发流程
1. **Fork项目**：从主仓库Fork项目
2. **创建分支**：创建功能分支
3. **开发测试**：开发和测试功能
4. **提交PR**：提交Pull Request
5. **代码审查**：通过代码审查后合并

### 提交规范
- **提交信息**：清晰的提交信息
- **代码质量**：确保代码质量
- **测试覆盖**：必要的测试覆盖

## 许可证

本项目采用MIT许可证，详见LICENSE文件。

## 相关链接

- **项目主页**：https://github.com/BeiDouMS/BeiDou-Server
- **Wiki文档**：https://github.com/BeiDouMS/BeiDou-Server/wiki
- **Issue反馈**：https://github.com/BeiDouMS/BeiDou-Server/issues
- **Release版本**：https://github.com/BeiDouMS/BeiDou-Server/releases
- **Docker部署**：https://github.com/BeiDouMS/BeiDou-docker 

# BeiDou由来
北斗卫星导航系统（Beidou Navigation Satellite System，简称：BDS，又称为：COMPASS，中文音译名称：BeiDou）是中国自行研制的全球卫星导航系统，也是继GPS、GLONASS之后的第三个成熟的卫星导航系统。北斗卫星导航系统（BDS）和美国GPS、俄罗斯GLONASS、欧盟GALILEO，是联合国卫星导航委员会已认定的供应商。  
北斗卫星导航系统由空间段、地面段和用户段三部分组成，可在全球范围内全天候、全天时为各类用户提供高精度、高可靠定位、导航、授时服务，并且具备短报文通信能力。经过多年发展，北斗系统已成为面向全球用户提供全天候、全天时、高精度定位、导航与授时服务的重要新型基础设施。北斗系统定位导航授时服务，通过30颗卫星，免费向全球用户提供服务，全球范围水平定位精度优于9米、垂直定位精度优于10米，测速精度优于0.2米/秒、授时精度优于20纳秒。  
北斗这一词对于中国来说，有着特殊的意义。北斗，是中国的一个卫星导航系统，也是中国自主研制的第一个卫星导航系统。既然小伙伴说这个项目也要整个天体的名字，想了半天，就叫北斗好了！这也意味着我们要做的比HeavenMS和Cosmic更加优秀和强大！  

# 开发进展
[开发进展](https://github.com/BeiDouMS/BeiDou-Server/wiki/%E5%BC%80%E5%8F%91%E8%BF%9B%E5%BA%A6)

# gms-server 服务端
- 已实现自动创建数据库，执行初始化sql脚本，只要保证mysql是启动的即可  
- 已开放api端口8686
- 已引入swagger，swagger地址：http://localhost:8686/swagger-ui/index.html
- 接口由版本控制，如：v1 v2 v3。默认的swagger标签为name = ApiConstant.LATEST，默认的RequestMapping为："/" + ApiConstant.LATEST + "/xx"
- 接口如果增加新版本且接口不需要更新，只需要把ApiConstant.LATEST指向新版本即可。如果部分接口不兼容，需要把旧接口的Tag和RequestMapping都改成指定版本，如：ApiConstant.V1。其他的，只需要把ApiConstant.LATEST指向新版本即可。
- 支持多语言，脚本和wz针对多语言会读取不同的路径：wz-zh-CN，wz-en-US，script-zh-CN，script-en-US
- 不支持MySQL8以下的版本

## 开发环境
- OpenJDK 21：https://jdk.java.net/archive/
- Intellij IDEA 2023.3及以上：https://www.jetbrains.com/idea/
- MySQL8：https://github.com/SleepNap/NapMysqlTool/releases/latest 或者 https://downloads.mysql.com/archives/community/
- Maven：https://maven.apache.org/download.cgi
- git：https://git-scm.com/downloads
- DBeaver：https://dbeaver.io/download/ 或者 Navicat Lite：https://www.navicat.com/en/download/navicat-premium-lite

# gms-ui web端

## 开发环境部署

请根据自身实际情况选择性跳过已完成的步骤

**1 安装 NodeJS v20.15.0 （LTS 版）**

下载地址：https://nodejs.org/dist/v20.15.0/node-v20.15.0-x64.msi

**2 安装 Yarn**

```shell
npm install -g yarn
```

> 如提示npm命令不存在，可能是安装NodeJS时，安装程序配置的环境变量还没有生效，小白请使用重启大法

**3 初始化前端开发环境**

在命令行进入 gms-ui 目录，然后执行命令

```shell
yarn install
```

**4 启动开发环境**

```shell
yarn dev
```

## 备注
web中所有的图片均需要联网获取，感谢 https://maplestory.io 提供给的图片接口！  

# 客户端
服务端和客户端已经打包好了在[Release](https://github.com/BeiDouMS/BeiDou-Server/releases)中，大家直接下载即可。  
如果想下载北斗客户端的**早期Beta的版本**，可以[点击这里了解更多](https://github.com/BeiDouMS/BeiDou-Server/wiki/%E5%8C%97%E6%96%97%E5%AE%A2%E6%88%B7%E7%AB%AF%E5%8F%91%E5%B8%83) 

# docker
原服务端中docker相关配置已移除，配置已独立到[新的仓库](https://github.com/BeiDouMS/BeiDou-docker)，且支持[镜像拉取](https://github.com/BeiDouMS/BeiDou-docker/pkgs/container/beidou-server-all)。想参加docker开发，欢迎在新仓库进行pr。  
[了解更多](https://github.com/BeiDouMS/BeiDou-docker)

# Wiki
发现很多同学的问题基本在Wiki中都有答案，欢迎大家去看看。另外如果发现Wiki中没有的问题，欢迎提issue，或直接补充。已将Wiki开放为所有人都可以编辑。  
[Wiki地址](https://github.com/BeiDouMS/BeiDou-Server/wiki)

---

# 创建新技能教程：复制强化圣龙(2321003)给龙骑士职业

## 前置知识

- **技能ID规则**：`职业ID * 10000 + 技能编号`，例如主教四转 `232 * 10000 + 1003 = 2321003`
- **龙骑士(DragonKnight)职业ID**：`131`（三转），现有技能ID范围 `1310000 ~ 1311008`
- **强化圣龙**：技能ID `2321003`，属于主教(Bishop)四转技能

## 第一步：确定新技能ID

现有龙骑士技能最大ID是 `1311008`，新技能ID建议使用 **`1311009`**。

| 属性 | 值 |
|------|-----|
| 新技能ID | `1311009` |
| 原技能ID | `2321003`（强化圣龙） |
| 职业 | 龙骑士(DragonKnight) |
| 常量名 | `DRAGON_BREATH`（自定义） |

## 第二步：复制并修改技能WZ数据文件

**文件**：`gms-server/wz/Skill.wz/232.img.xml`

这个文件是单行XML，包含所有232系（主教）技能数据。需要：

1. **提取2321003的完整数据块** — 从 `<imgdir name="2321003">` 到对应的 `</imgdir>`
2. **修改技能ID** — 将所有 `2321003` 替换为 `1311009`
3. **修改所属文件** — 将数据放到 `gms-server/wz/Skill.wz/131.img.xml`（龙骑士技能文件）中

具体操作：

```bash
# 1. 在 232.img.xml 中找到 2321003 的数据块（从 <imgdir name="2321003"> 到下一个同级 </imgdir>）
# 2. 复制该数据块
# 3. 打开 131.img.xml，在 </imgdir> 结束标签前粘贴
# 4. 将粘贴内容中所有 "2321003" 替换为 "1311009"
```

需要修改的数据节点：

| 节点 | 说明 | 修改内容 |
|------|------|---------|
| `imgdir name="2321003"` | 技能根节点 | 改为 `1311009` |
| `imgdir name="level"` 内各等级 | 技能属性 | 根据需要调整 `damage`、`mpCon`、`time` 等 |
| `imgdir name="req"` | 前置技能需求 | 修改为龙骑士的前置技能ID |
| `imgdir name="summon"` | 召唤兽动画 | 替换为新的召唤兽动画数据 |
| `imgdir name="effect"` | 技能特效 | 替换为新的特效动画数据 |

## 第三步：修改技能名称/描述文件

### 3.1 英文版 String.wz

**文件**：`gms-server/wz/String.wz/Skill.img.xml`

在这个文件中添加新技能的名称和描述：

```xml
<imgdir name="1311009">
  <string name="desc" value="[最高等级：30]Summon a dragon to fight for you.最多攻击6个敌人"/>
  <string name="h1" value="MP Cost: 13, Attack: 255, Duration: 55sec"/>
  <!-- 每个等级的描述 h1 ~ h30 -->
</imgdir>
```

### 3.2 中文版 String.wz

**文件**：`gms-server/wz-zh-CN/String.wz/Skill.img.xml`

```xml
<imgdir name="1311009">
  <string name="desc" value="[最高等级：30]召唤圣龙为你战斗，最多攻击6个敌人"/>
  <string name="h1" value="消耗MP 13，基本攻击力 255，持续时间 55秒"/>
  <!-- 每个等级的描述 h1 ~ h30 -->
</imgdir>
```

## 第四步：修改Java技能常量

**文件**：`gms-server/src/main/java/org/gms/constants/skills/DragonKnight.java`

添加新技能常量：

```java
public class DragonKnight {
    // ... 现有技能 ...
    public static final int DRAGON_BLOOD = 1311008;
    public static final int DRAGON_BREATH = 1311009;  // 新增：龙息（复制自强化圣龙）
}
```

## 第五步：处理技能特殊逻辑（如需要）

以下文件中可能有针对 `2321003` 的特殊逻辑，需要检查并为新技能添加对应处理：

| 文件 | 说明 | 操作 |
|------|------|------|
| `StatEffect.java` | 技能效果处理 | 搜索 `2321003` 或 `BAHAMUT`，为 `1311009` 添加相同逻辑 |
| `Character.java` | 角色技能管理 | 搜索 `BAHAMUT`，检查是否有特殊处理 |
| `SummonDamageHandler.java` | 召唤兽伤害处理 | 搜索 `2321003`，为新技能添加白名单 |

```bash
# 在 gms-server/src 目录下搜索所有引用 2321003 的地方
grep -rn "2321003" gms-server/src/
grep -rn "BAHAMUT" gms-server/src/
```

## 第六步：替换技能特效和BGM

技能特效数据内嵌在 `Skill.wz/*.img.xml` 的技能数据中，主要包含：

| 数据节点 | 说明 | 替换方式 |
|---------|------|---------|
| `<imgdir name="effect">` | 技能释放特效动画（Canvas帧数据） | 替换为龙骑士风格的特效帧 |
| `<imgdir name="hit">` | 命中特效 | 替换为新的命中动画 |
| `<imgdir name="summon">` | 召唤兽动画（summoned/fly/stand/attack1/die） | 替换为龙骑士的龙动画 |

**特效替换方法**：
1. 从其他龙骑士技能（如 `DRAGON_ROAR = 1311006`）的动画数据中提取特效
2. 或从 `Effect.wz/Summon.img.xml` 中查找合适的龙动画
3. 替换对应节点的 Canvas 帧数据

**BGM替换**：
- BGM数据在 `Sound.wz/Skill.img.xml` 中，搜索 `2321003` 查找原技能音效
- 替换为新的音效ID

## 第七步：客户端资源（如需要）

客户端的技能资源通常打包在 WZ 文件中，如果客户端也需要显示新技能：

1. 确保客户端的 `Skill.wz` 中有对应 `131.img` 的数据
2. 技能图标（icon）、特效动画需要客户端支持
3. 如果是纯服务端修改（不改客户端），客户端可能无法显示新特效

## 第八步：测试

1. 启动服务端
2. 使用GM命令或脚本为角色添加新技能：
   ```
   !sp 1311009 30
   ```
3. 测试技能释放、伤害计算、召唤兽行为
4. 检查服务端日志是否有异常

## 完整文件修改清单

| 文件 | 操作 | 优先级 |
|------|------|--------|
| `gms-server/wz/Skill.wz/131.img.xml` | 添加新技能数据 | **必须** |
| `gms-server/wz/String.wz/Skill.img.xml` | 添加技能名称描述 | **必须** |
| `gms-server/wz-zh-CN/String.wz/Skill.img.xml` | 添加中文技能名称描述 | **必须** |
| `gms-server/src/.../skills/DragonKnight.java` | 添加技能常量 | **必须** |
| `gms-server/src/.../StatEffect.java` | 添加技能效果逻辑 | 按需 |
| `gms-server/src/.../Character.java` | 检查特殊处理 | 按需 |
| `gms-server/src/.../SummonDamageHandler.java` | 添加召唤兽白名单 | 按需 |
| `gms-server/wz/Sound.wz/Skill.img.xml` | 替换技能音效 | 按需 |
