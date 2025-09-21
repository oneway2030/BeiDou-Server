-- 是否解除组队副本默认等级范围限制，开启时允许任意等级的玩家进入副本
INSERT INTO command_info (syntax, level, enabled, clazz, default_level) VALUES ('jk', 0, 1, 'DisposeCommand', 0);
INSERT INTO command_info (syntax, level, enabled, clazz, default_level) VALUES ('解卡', 0, 1, 'DisposeCommand', 0);