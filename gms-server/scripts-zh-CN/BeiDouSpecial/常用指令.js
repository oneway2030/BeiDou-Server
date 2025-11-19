/*
*常用指令
*/
var status;

var common_heading = "@";
var staff_heading = "!";

// var levels = ["Common", "Donator", "JrGM", "GM", "SuperGM", "Developer", "Admin"];
var levels = ["通用", "贡献者", "小GM", "GM", "大GM", "开发者", "超级管理员"];
var commands;
var index = 0;

function writeHeavenMSCommands() {
    const CommandsExecutor = Java.type('org.gms.client.command.CommandsExecutor');
    commands = CommandsExecutor.getInstance().getCommandsNameDesc();
}

function start() {
    status = -1;
    writeHeavenMSCommands();
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        if (mode == 0 && type > 0) {
            cm.dispose();
            return;
        }
        if (mode == 1) {
            status++;
        } else {
            status--;
        }

        if (status == 0) {
            展示指令();
        } else if (status == 1) {
            cm.dispose();
        } else {
            cm.dispose();
        }
    }

    function 展示指令() {
        var lvComm, lvDesc, lvHead = (index < 2) ? common_heading : staff_heading;
        lvComm = commands.get(index).getLeft();
        lvDesc = commands.get(index).getRight();
        var sendStr = "你可以在聊天框中输入以下 #b" + levels[index] + " #k指令:\r\n";
        // 从最后一个元素开始倒序遍历（i从size-1递减到0）
        for (var i = lvComm.size() - 1; i >= 0; i--) {
            sendStr += "  #L" + i + "# " + lvHead + lvComm.get(i) + " - " + lvDesc.get(i);
            sendStr += "#l\r\n";
        }
        sendStr += "\r\n\r\n\r\n";
        cm.sendSimple(sendStr);
        cm.dispose();
    }
}