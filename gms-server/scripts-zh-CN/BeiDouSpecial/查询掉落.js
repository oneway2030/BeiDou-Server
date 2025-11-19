var status = -1;
var choice = 0;

function start() {
    action(1, 0, 0)
}


function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
        return;
    }

    if (mode == 1) {
        status++;
    } else {
        status--;
        if (status < 0) {
            cm.dispose();
            return;
        }
    }
    // 初始界面：显示两个查询选项
    if (status == 0) {
        let msg = "请选择查询类型：\r\n\r\n";
        msg += "#b#L0# 查询当前地图怪物掉落#l\r\n\r\n";
        msg += "#b#L1# 查询物品掉落（输入物品名称）#l\r\n\r\n";
        msg += "#L2# 查询怪物掉落（输入怪物名称）#l\r\n\r\n";
        cm.sendSimple(msg);
    }
    // 查询当前地图怪物掉落
    else if (status == 1 && selection == 0) {
        cm.dispose();
        cm.openNpc(9900001, "爆率一览");
    }
    // 处理物品ID查询
    else if (status == 1 && selection == 1) {
        choice = 0;
        cm.sendGetText("请输入要查询的物品名称：");
    }
    // 处理怪物名称查询
    else if (status == 1 && selection == 2) {
        choice = 1;
        cm.sendGetText("请输入要查询的怪物名称：");
    } else if (status == 2) {
        const searchString = cm.getText().trim();
        if (searchString === "") {
            cm.sendOk(choice === 0 ? "请输入物品名称" : "请输入怪物名称");
            cm.dispose();
            return;
        }
        queryDrops(searchString);
    }
}

// 怪物掉落查询方法
function queryDrops(searchString) {
    // 获取怪物ID（使用JsUtils单例优化查询逻辑）
    const JsUtils = Java.type('org.gms.util.JsUtils');
    let searchResult = "";
    if (choice === 0) {
        searchResult = JsUtils.getInstance().whoDrops(cm.getPlayer(), searchString);
    } else {
        searchResult = JsUtils.getInstance().WhatDropsFrom(cm.getPlayer(), searchString);
    }
    if (searchResult != null && searchResult.length > 0) {
        cm.sendOk(searchResult);
    } else {
        cm.sendOk(choice === 0 ? `未找到名称为【${monsterName}】的怪物` : `未找到名称为【${monsterName}】的物品`);
    }
    cm.dispose();
}

