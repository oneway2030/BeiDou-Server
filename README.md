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
