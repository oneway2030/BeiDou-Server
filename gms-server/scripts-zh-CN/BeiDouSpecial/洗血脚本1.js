
function start() {
    status = -1;

    action(1, 0, 0);
}
function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        if (status >= 0 && mode == 0) {

            cm.sendOk("想好了再来吧~");
            cm.dispose();
            return;
        }
        if (mode == 1) {
            status++;
        }
        else {
            status--;
        }
        if (status == 0) {
			
            var text = "";
		    text += "点券换血：\r\n";
			text += "\t\t#b10点券 = 1 HP上限\r\n\t\t#k最高可以洗到30,000 HP上限。\r\n\r\n";
			text += "点券余额：#b" +  cm.getPlayer().getCashShop().getCash(1)  + "#k\r\n";
			text += "请输入您要兑换的#rHP#k数值：";
			cm.sendGetNumber(text, 1, 1, 9999999);
		
		} else if (status == 1){
			if (cm.getNX(1) < 10 * selection) {
				cm.sendOk("抱歉，您点券余额不足");
				return;
			}
			var hp = cm.getPlayer().getMaxHp() + selection;
			if (hp > 30000){
				cm.sendOk("抱歉，请确认您的血量洗血后不会到达30000 HP上限。\r\n\r\n您现在的 HP上限：#b"+(hp - selection));
			} else {
				var cost = 10 * selection;
				cm.gainNX(-cost);
				cm.getPlayer().setMaxHp(hp);
				cm.processCommand("@解卡");//自动输入代码
				cm.getPlayer().fakeRelog();
				cm.sendOk("恭喜您， 您已消耗 " + cost + "点券 #k增加了 #b" + selection + "HP上限#k。\r\n\r\n您现在的HP上限为：\r\n\t#b" + hp + "\r\n\r\n#k即可生效。");
			}
			cm.dispose();
		}
    }
}
