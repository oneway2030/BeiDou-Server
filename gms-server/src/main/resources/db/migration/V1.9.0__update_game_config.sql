-- 正向混沌
INSERT INTO `game_config` ( `config_type`, `config_sub_type`, `config_clazz`, `config_code`, `config_value`, `config_desc`)
VALUES ( 'server', 'Game Mechanics', 'java.lang.Integer', 'forward_chaos_scroll_stat_range', '5', 'forward_chaos_scroll_stat_range');
INSERT INTO `lang_resources` (`lang_type`, `lang_base`, `lang_code`, `lang_value`) VALUES ('zh-CN', 'game_config', 'forward_chaos_scroll_stat_range', '正向混沌的属性范围，0到N之间');
INSERT INTO `lang_resources` (`lang_type`, `lang_base`, `lang_code`, `lang_value`) VALUES ('en-US', 'game_config', 'forward_chaos_scroll_stat_range', '正向混沌的属性范围，0到N之间');