INSERT INTO `game_config` ( `config_type`, `config_sub_type`, `config_clazz`, `config_code`, `config_value`, `config_desc`)
VALUES ( 'server', 'Game Mechanics', 'java.lang.Integer', 'family_add_add_level_range', '240', 'family_add_add_level_range');
INSERT INTO `lang_resources` (`lang_type`, `lang_base`, `lang_code`, `lang_value`) VALUES ('zh-CN', 'game_config', 'family_add_add_level_range', '学院登陆同学等级差异在多少级内');
INSERT INTO `lang_resources` (`lang_type`, `lang_base`, `lang_code`, `lang_value`) VALUES ('en-US', 'game_config', 'family_add_add_level_range', '学院登陆同学等级差异在多少级内');

INSERT INTO `game_config` ( `config_type`, `config_sub_type`, `config_clazz`, `config_code`, `config_value`, `config_desc`)
VALUES ( 'server', 'Game Mechanics', 'java.lang.String', 'job_buff_custom_time_list', '{"4121006":1800000,"2121004":60000,"2221004":60000,"2321004":60000}', 'job_buff_custom_time_list');
INSERT INTO `lang_resources` (`lang_type`, `lang_base`, `lang_code`, `lang_value`) VALUES ('zh-CN', 'game_config', 'job_buff_custom_time_list', '自定义buff时间');
INSERT INTO `lang_resources` (`lang_type`, `lang_base`, `lang_code`, `lang_value`) VALUES ('en-US', 'game_config', 'job_buff_custom_time_list', '自定义buff时间');

INSERT INTO `game_config` ( `config_type`, `config_sub_type`, `config_clazz`, `config_code`, `config_value`, `config_desc`)
VALUES ( 'server', 'Game Mechanics', 'java.lang.String', 'job_special_buff_time_list', '3121002,3221002', 'job_special_buff_time_list');
INSERT INTO `lang_resources` (`lang_type`, `lang_base`, `lang_code`, `lang_value`) VALUES ('zh-CN', 'game_config', 'job_special_buff_time_list', 'buff对自己无限时间，对别人原buff时间');
INSERT INTO `lang_resources` (`lang_type`, `lang_base`, `lang_code`, `lang_value`) VALUES ('en-US', 'game_config', 'job_special_buff_time_list', 'buff对自己无限时间，对别人原buff时间');

-- 第一条：更新 game_config 表中指定 config_code 的记录
UPDATE `game_config`
SET
    `config_type` = 'server',
    `config_sub_type` = 'Game Mechanics',
    `config_clazz` = 'java.lang.String',
    `config_value` = '2321005,3121002,3221002,4221006,4211005',
    `config_desc` = 'job_buff_original_time_list'
WHERE
    `config_code` = 'job_buff_original_time_list'; -- 关键：通过 config_code 定位唯一记录

-- 第二条：更新 lang_resources 表中 zh-CN 对应的记录
UPDATE `lang_resources`
SET
    `lang_value` = 'buff对自己或者对别人，都是原buff时间,技能id之间使用,隔开'
WHERE
    `lang_type` = 'zh-CN'
  AND `lang_base` = 'game_config'
  AND `lang_code` = 'job_buff_original_time_list'; -- 组合条件定位唯一语言记录

-- 第三条：更新 lang_resources 表中 en-US 对应的记录
UPDATE `lang_resources`
SET
    `lang_value` = 'buff对自己或者对别人，都是原buff时间,技能id之间使用,隔开'
WHERE
    `lang_type` = 'en-US'
  AND `lang_base` = 'game_config'
  AND `lang_code` = 'job_buff_original_time_list'; -- 组合条件定位唯一语言记录
