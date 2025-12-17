-- 多开限制
INSERT INTO `game_config` ( `config_type`, `config_sub_type`, `config_clazz`, `config_code`, `config_value`, `config_desc`)
VALUES ( 'server', 'Game Mechanics', 'java.lang.Integer', 'max_accounts_per_user', '2', 'max_accounts_per_user');
INSERT INTO `lang_resources` (`lang_type`, `lang_base`, `lang_code`, `lang_value`) VALUES ('zh-CN', 'game_config', 'max_accounts_per_user', '多开设置，个用户（IP+HWID）最多允许登录的账号数量(必须配合deterred_multi_client和multi_open_whitelist_ip设置才生效)，大于0生效');
INSERT INTO `lang_resources` (`lang_type`, `lang_base`, `lang_code`, `lang_value`) VALUES ('en-US', 'game_config', 'max_accounts_per_user', '多开设置，个用户（IP+HWID）最多允许登录的账号数量(必须配合deterred_multi_client和multi_open_whitelist_ip设置才生效)，大于0生效');


-- 多开限制
INSERT INTO `game_config` ( `config_type`, `config_sub_type`, `config_clazz`, `config_code`, `config_value`, `config_desc`)
VALUES ( 'server', 'Game Mechanics', 'java.lang.String', 'multi_open_whitelist_ip', '127.0.0.1', 'multi_open_whitelist_ip');
INSERT INTO `lang_resources` (`lang_type`, `lang_base`, `lang_code`, `lang_value`) VALUES ('zh-CN', 'game_config', 'multi_open_whitelist_ip', '多开白名单(必须配合deterred_multi_client和max_accounts_per_user开启后才生效)');
INSERT INTO `lang_resources` (`lang_type`, `lang_base`, `lang_code`, `lang_value`) VALUES ('en-US', 'game_config', 'multi_open_whitelist_ip', '多开白名单(必须配合deterred_multi_client和max_accounts_per_user开启后才生效)');


