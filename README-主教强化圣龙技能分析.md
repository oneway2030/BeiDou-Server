# 主教（Bishop）4转技能「强化圣龙」资源文件分析

## 技能概述

| 技能ID | 技能名称 | 转职阶段 | Java常量名 | 说明 |
|--------|---------|---------|-----------|------|
| `2311006` | 圣龙召唤 | 三转（祭司/Priest） | `SUMMON_DRAGON` | 召唤圣龙守护主人并攻击怪物 |
| `2321003` | 强化圣龙 | 四转（主教/Bishop） | `BAHAMUT` | 强化版圣龙，最多攻击6个敌人 |

### 技能依赖关系

```
圣龙召唤 (2311006) 等级15以上 → 解锁 → 强化圣龙 (2321003)
```

---

## 一、服务端资源文件

### 1.1 技能常量定义

| 文件路径 | 说明 |
|---------|------|
| `gms-server/src/main/java/org/gms/constants/skills/Bishop.java` | 主教四转技能常量，包含 `BAHAMUT = 2321003` |
| `gms-server/src/main/java/org/gms/constants/skills/Bishop.java.backup.java` | Bishop.java 备份文件 |
| `gms-server/src/main/java/org/gms/constants/skills/Priest.java` | 主教三转技能常量，包含 `SUMMON_DRAGON = 2311006` |

#### Bishop.java 内容

```java
public class Bishop {
    public static final int MAPLE_WARRIOR = 2321000;
    public static final int BIG_BANG = 2321001;
    public static final int MANA_REFLECTION = 2321002;
    public static final int BAHAMUT = 2321003;        // 强化圣龙
    public static final int INFINITY = 2321004;
    public static final int HOLY_SHIELD = 2321005;
    public static final int RESURRECTION = 2321006;
    public static final int ANGEL_RAY = 2321007;
    public static final int GENESIS = 2321008;
    public static final int HEROS_WILL = 2321009;
}
```

#### Priest.java 内容

```java
public class Priest {
    public static final int ELEMENTAL_RESISTANCE = 2310000;
    public static final int DISPEL = 2311001;
    public static final int MYSTIC_DOOR = 2311002;
    public static final int HOLY_SYMBOL = 2311003;
    public static final int SHINING_RAY = 2311004;
    public static final int DOOM = 2311005;
    public static final int SUMMON_DRAGON = 2311006;   // 圣龙召唤
}
```

---

### 1.2 技能 WZ 数据文件

| 文件路径 | 说明 |
|---------|------|
| `gms-server/wz/Skill.wz/232.img.xml` | 主教四转技能数据（含强化圣龙 2321003） |
| `gms-server/wz/Skill.wz/232.img.xml.backup.xml` | 备份文件 |
| `gms-server/wz/Skill.wz/231.img.xml` | 主教三转技能数据（含圣龙 2311006） |

#### 232.img.xml 中强化圣龙(2321003)的关键数据节点

```xml
<imgdir name="2321003">
  <!-- 技能图标 -->
  <canvas name="icon" width="32" height="32">...</canvas>
  <!-- 技能等级属性 -->
  <imgdir name="level">
    <imgdir name="1">
      <int name="mpCon" value="13"/>          <!-- MP消耗 -->
      <int name="time" value="55"/>           <!-- 持续时间(秒) -->
      <int name="matk" value="255"/>          <!-- 魔法攻击力 -->
      <int name="mastery" value="10"/>        <!-- 熟练度 -->
      <int name="mobCount" value="6"/>        <!-- 攻击怪物数 -->
    </imgdir>
    <!-- ... 等级2-30的属性数据 ... -->
  </imgdir>
  <!-- 召唤兽动画 -->
  <imgdir name="summon">
    <imgdir name="summoned">...</imgdir>  <!-- 召唤动画 -->
    <imgdir name="fly">...</imgdir>       <!-- 飞行动画 -->
    <imgdir name="stand">...</imgdir>     <!-- 站立动画 -->
    <imgdir name="attack1">...</imgdir>   <!-- 攻击动画 -->
    <imgdir name="die">...</imgdir>       <!-- 死亡动画 -->
  </imgdir>
  <!-- 前置技能需求 -->
  <imgdir name="req">
    <int name="2311006" value="15"/>  <!-- 需要圣龙召唤等级15 -->
  </imgdir>
</imgdir>
```

---

### 1.3 技能名称/描述文件（String）

| 文件路径 | 语言 | 说明 |
|---------|------|------|
| `gms-server/wz/String.wz/Skill.img.xml` | 英文 | 英文技能名称和描述 |
| `gms-server/wz-zh-CN/String.wz/Skill.img.xml` | 中文 | 中文技能名称和描述 |
| `gms-server/wz-zh-CN/String.wz/Skill.img.xml.backup.xml` | 中文 | 备份文件 |

#### 中文技能描述

**2321003（强化圣龙）：**
> 一定时间内召唤圣龙.最多攻击6个敌人
> 必需技能 : 圣龙召唤等级15以上

**2311006（圣龙召唤）：**
> [最高等级:30] 召唤圣龙守护主人，并攻击怪物。
> 技能点增加，可以召唤更强的龙。

---

### 1.4 技能处理代码

| 文件路径 | 说明 |
|---------|------|
| `gms-server/src/main/java/org/gms/net/server/channel/handlers/SummonDamageHandler.java` | 召唤兽伤害处理，圣龙和强化圣龙在白名单中 |
| `gms-server/src/main/java/org/gms/client/Character.java` | 角色类，引用 BAHAMUT / SUMMON_DRAGON |
| `gms-server/src/main/java/org/gms/server/StatEffect.java` | 技能效果处理，引用 BAHAMUT / SUMMON_DRAGON |

#### SummonDamageHandler.java 中的白名单

```java
private static final Set<Integer> SKILL_WHITELIST = Collections.unmodifiableSet(new HashSet<Integer>() {{
    add(2221005);   // 火魔兽
    add(2121005);   // 冰魔兽
    add(2311006);   // 圣龙（三转）
    add(2321003);   // 强化圣龙（四转）
}});
```

---

### 1.5 脚本文件

| 文件路径 | 说明 |
|---------|------|
| `gms-server/scripts-zh-CN/BeiDouSpecial/技能全满.js` | 包含 2321003 / 2311006 技能学习配置 |
| `gms-server/scripts-zh-CN/BeiDouSpecial/快速转职.js` | 包含 2321003 / 2311006 技能学习配置 |

---

## 二、游戏端（客户端）资源文件

| 文件路径 | 大小 | 说明 |
|---------|------|------|
| `clien/Data/Skill/232.img` | 5.3MB | 主教四转技能资源（含强化圣龙图标、特效动画） |
| `clien/Data/Skill/231.img` | - | 主教三转技能资源（含圣龙召唤图标、特效动画） |

客户端技能资源文件为编译后的 WZ 格式，包含：
- 技能图标（icon）
- 技能特效动画（effect）
- 召唤兽动画（summon - summoned/fly/stand/attack1/die）
- 命中特效（hit）

---

## 三、文件关系总览

```
技能ID: 2311006 (圣龙) / 2321003 (强化圣龙)
|
+-- 【服务端】
|   +-- 常量定义
|   |   +-- constants/skills/Priest.java          -> SUMMON_DRAGON = 2311006
|   |   +-- constants/skills/Bishop.java          -> BAHAMUT = 2321003
|   |
|   +-- WZ技能数据
|   |   +-- wz/Skill.wz/231.img.xml               -> 三转技能数据
|   |   +-- wz/Skill.wz/232.img.xml               -> 四转技能数据（强化圣龙核心数据）
|   |
|   +-- 技能名称描述
|   |   +-- wz/String.wz/Skill.img.xml            -> 英文名称
|   |   +-- wz-zh-CN/String.wz/Skill.img.xml      -> 中文名称
|   |
|   +-- 技能逻辑代码
|   |   +-- handlers/SummonDamageHandler.java      -> 召唤兽伤害计算（白名单）
|   |   +-- client/Character.java                  -> 角色技能管理
|   |   +-- server/StatEffect.java                 -> 技能效果解析
|   |
|   +-- 脚本
|       +-- scripts-zh-CN/.../技能全满.js           -> 技能学习脚本
|       +-- scripts-zh-CN/.../快速转职.js           -> 转职技能脚本
|
+-- 【游戏端（客户端）】
    +-- clien/Data/Skill/231.img                   -> 三转技能资源（图标+动画）
    +-- clien/Data/Skill/232.img                   -> 四转技能资源（图标+动画）
```

---

## 四、修改指南

如需修改强化圣龙技能，需同步修改以下文件：

| 修改内容 | 服务端文件 | 客户端文件 |
|---------|-----------|-----------|
| 技能伤害/MP/持续时间 | `wz/Skill.wz/232.img.xml` | - |
| 技能名称/描述 | `wz-zh-CN/String.wz/Skill.img.xml` | - |
| 技能图标/特效 | - | `clien/Data/Skill/232.img` |
| 技能ID/常量 | `constants/skills/Bishop.java` | - |
| 召唤兽行为 | `handlers/SummonDamageHandler.java` | - |
