-- 添加是否随机刷挂怪
INSERT INTO `game_config` ( `config_type`, `config_sub_type`, `config_clazz`, `config_code`, `config_value`, `config_desc`)
VALUES ( 'server', 'Game Mechanics', 'java.lang.Boolean', 'use_monster_random_refresh_position', 'true', 'use_monster_random_refresh_position');
INSERT INTO `lang_resources` (`lang_type`, `lang_base`, `lang_code`, `lang_value`) VALUES ('zh-CN', 'game_config', 'use_monster_random_refresh_position', '是否开启怪物随机刷新位置.关闭后后怪物将在固定位置刷新,重启服务器生效');
INSERT INTO `lang_resources` (`lang_type`, `lang_base`, `lang_code`, `lang_value`) VALUES ('en-US', 'game_config', 'use_monster_random_refresh_position', 'Do you want to enable the monster to randomly refresh its position.');

-- 冒险家最高等级
INSERT INTO `game_config` ( `config_type`, `config_sub_type`, `config_clazz`, `config_code`, `config_value`, `config_desc`)
VALUES ( 'server', 'Game Mechanics', 'java.lang.Integer', 'mxj_max_level', '200', 'mxj_max_level');
INSERT INTO `lang_resources` (`lang_type`, `lang_base`, `lang_code`, `lang_value`) VALUES ('zh-CN', 'game_config', 'mxj_max_level', '冒险家升级最高等级,默认200,重启服务器生效');
INSERT INTO `lang_resources` (`lang_type`, `lang_base`, `lang_code`, `lang_value`) VALUES ('en-US', 'game_config', 'mxj_max_level', 'Adventurer upgrades to the highest level.');

-- 骑士团最高等级
INSERT INTO `game_config` ( `config_type`, `config_sub_type`, `config_clazz`, `config_code`, `config_value`, `config_desc`)
VALUES ( 'server', 'Game Mechanics', 'java.lang.Integer', 'qst_max_level', '120', 'qst_max_level');
INSERT INTO `lang_resources` (`lang_type`, `lang_base`, `lang_code`, `lang_value`) VALUES ('zh-CN', 'game_config', 'qst_max_level', '骑士团升级最高等级,默认120级,重启服务器生效');
INSERT INTO `lang_resources` (`lang_type`, `lang_base`, `lang_code`, `lang_value`) VALUES ('en-US', 'game_config', 'qst_max_level', 'Knights upgrade to the highest level.');

-- 重生后的等级
INSERT INTO `game_config` ( `config_type`, `config_sub_type`, `config_clazz`, `config_code`, `config_value`, `config_desc`)
VALUES ( 'server', 'Game Mechanics', 'java.lang.Integer', 'rebirth_level', '10', 'rebirth_level');
INSERT INTO `lang_resources` (`lang_type`, `lang_base`, `lang_code`, `lang_value`) VALUES ('zh-CN', 'game_config', 'rebirth_level', '转生后的等级,默认10级,重启服务器生效');
INSERT INTO `lang_resources` (`lang_type`, `lang_base`, `lang_code`, `lang_value`) VALUES ('en-US', 'game_config', 'rebirth_level', 'Level after Rebirth.');

-- 添加服务端宠吸
INSERT INTO `game_config` ( `config_type`, `config_sub_type`, `config_clazz`, `config_code`, `config_value`, `config_desc`)
VALUES ( 'server', 'Game Mechanics', 'java.lang.Boolean', 'use_pet_full_screen_picking_up_things', 'false', 'use_pet_full_screen_picking_up_things');
INSERT INTO `lang_resources` (`lang_type`, `lang_base`, `lang_code`, `lang_value`) VALUES ('zh-CN', 'game_config', 'use_pet_full_screen_picking_up_things', '(宠吸)是否开启服务端宠物全屏吸物.默认关闭,重启服务器生效');
INSERT INTO `lang_resources` (`lang_type`, `lang_base`, `lang_code`, `lang_value`) VALUES ('en-US', 'game_config', 'use_pet_full_screen_picking_up_things', 'Do you want to enable full screen pet picking on the server.');

-- 添加每次转生后装备升级次数
INSERT INTO `game_config` ( `config_type`, `config_sub_type`, `config_clazz`, `config_code`, `config_value`, `config_desc`)
VALUES ( 'server', 'Game Mechanics', 'java.lang.Integer', 'each_time_reborn_equipment_add_level_up', '0', 'use_pet_full_screen_picking_up_things');
INSERT INTO `lang_resources` (`lang_type`, `lang_base`, `lang_code`, `lang_value`) VALUES ('zh-CN', 'game_config', 'each_time_reborn_equipment_add_level_up', '每次转生后装备增加的升级次数,默认0不增加.');
INSERT INTO `lang_resources` (`lang_type`, `lang_base`, `lang_code`, `lang_value`) VALUES ('en-US', 'game_config', 'each_time_reborn_equipment_add_level_up', '每次转生后装备增加的升级次数,默认0不增加.');


-- 服务器根据玩家IP或Mac限制注册的数量,小于等于0则代表不限制注册数量
INSERT INTO `game_config` ( `config_type`, `config_sub_type`, `config_clazz`, `config_code`, `config_value`, `config_desc`)
VALUES ( 'server', 'Game Mechanics', 'java.lang.Integer', 'max_accounts_per_ip_or_mac', '-1', 'use_pet_full_screen_picking_up_things');
INSERT INTO `lang_resources` (`lang_type`, `lang_base`, `lang_code`, `lang_value`) VALUES ('zh-CN', 'game_config', 'max_accounts_per_ip_or_mac', '服务器根据玩家IP或Mac限制注册的数量,小于等于0则代表不限制注册数量.');
INSERT INTO `lang_resources` (`lang_type`, `lang_base`, `lang_code`, `lang_value`) VALUES ('en-US', 'game_config', 'max_accounts_per_ip_or_mac', '服务器根据玩家IP或Mac限制注册的数量,小于等于0则代表不限制注册数量.');

