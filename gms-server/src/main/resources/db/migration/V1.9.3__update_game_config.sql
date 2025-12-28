--
INSERT INTO `game_config` ( `config_type`, `config_sub_type`, `config_clazz`, `config_code`, `config_value`, `config_desc`)
VALUES ( 'server', 'Game Mechanics', 'java.lang.String', 'broadcast_white_list', '1,20,69', 'broadcast_white_list');
INSERT INTO `lang_resources` (`lang_type`, `lang_base`, `lang_code`, `lang_value`) VALUES ('zh-CN', 'game_config', 'broadcast_white_list', '广播白名单，角色id使用，号隔开，添加后不在全服播报时间');
INSERT INTO `lang_resources` (`lang_type`, `lang_base`, `lang_code`, `lang_value`) VALUES ('en-US', 'game_config', 'broadcast_white_list', '广播白名单，角色id使用，号隔开，添加后不在全服播报时间');

--
INSERT INTO `game_config` ( `config_type`, `config_sub_type`, `config_clazz`, `config_code`, `config_value`, `config_desc`)
VALUES ( 'server', 'Game Mechanics', 'java.lang.Boolean', 'gm_riding_pets_never_hungry', 'false', 'gm_riding_pets_never_hungry');
INSERT INTO `lang_resources` (`lang_type`, `lang_base`, `lang_code`, `lang_value`) VALUES ('zh-CN', 'game_config', 'gm_riding_pets_never_hungry', '骑乘宠物是否开启不饥饿');
INSERT INTO `lang_resources` (`lang_type`, `lang_base`, `lang_code`, `lang_value`) VALUES ('en-US', 'game_config', 'gm_riding_pets_never_hungry', '骑乘宠物是否开启不饥饿');

--
INSERT INTO `game_config` ( `config_type`, `config_sub_type`, `config_clazz`, `config_code`, `config_value`, `config_desc`)
VALUES ( 'server', 'Game Mechanics', 'java.lang.Boolean', 'family_rep_per_level_up_notice', 'true', 'family_rep_per_level_up_notice');
INSERT INTO `lang_resources` (`lang_type`, `lang_base`, `lang_code`, `lang_value`) VALUES ('zh-CN', 'game_config', 'family_rep_per_level_up_notice', '升级获得学院名声提示默认开启有提示');
INSERT INTO `lang_resources` (`lang_type`, `lang_base`, `lang_code`, `lang_value`) VALUES ('en-US', 'game_config', 'family_rep_per_level_up_notice', '升级获得学院名声提示默认开启有提示');

--
INSERT INTO `game_config` ( `config_type`, `config_sub_type`, `config_clazz`, `config_code`, `config_value`, `config_desc`)
VALUES ( 'server', 'Game Mechanics', 'java.lang.Boolean', 'battleship_unlimited_hp', 'true', 'battleship_unlimited_hp');
INSERT INTO `lang_resources` (`lang_type`, `lang_base`, `lang_code`, `lang_value`) VALUES ('zh-CN', 'game_config', 'battleship_unlimited_hp', '船长的船开启无限耐久');
INSERT INTO `lang_resources` (`lang_type`, `lang_base`, `lang_code`, `lang_value`) VALUES ('en-US', 'game_config', 'battleship_unlimited_hp', '船长的船开启无限耐久');

--
INSERT INTO `game_config` ( `config_type`, `config_sub_type`, `config_clazz`, `config_code`, `config_value`, `config_desc`)
VALUES ( 'server', 'Game Mechanics', 'java.lang.String', 'job_buff_original_time_list', '2321005,3121002,3221002,4221006,4211005', 'job_buff_original_time_list');
INSERT INTO `lang_resources` (`lang_type`, `lang_base`, `lang_code`, `lang_value`) VALUES ('zh-CN', 'game_config', 'job_buff_original_time_list', '角色的buff技能使用技能原来的时间名单,技能id之间使用,隔开');
INSERT INTO `lang_resources` (`lang_type`, `lang_base`, `lang_code`, `lang_value`) VALUES ('en-US', 'game_config', 'job_buff_original_time_list', '角色的buff技能使用技能原来的时间名单,技能id之间使用,隔开');


