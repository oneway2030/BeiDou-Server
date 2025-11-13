var sx = Math.floor(Math.random()*7+1)-1;
var jsx1 = Math.floor(Math.random()*11)-3;
var jsx2 = Math.floor(Math.random()*8)-3;
var xh1=100;//点券消耗量
var xh2=200;//抵用消耗量
var sj1=Math.floor(Math.random()*5);//0/1/2
var sj2=Math.floor(Math.random()*5);//0/1/2/3
var meso=1000000;//这里每次强化需要的钱
var fwq="XXX回顾冒险岛";//这里写服务器名字
var status = 0;
importPackage(java.util);
importPackage(net.sf.sunms.client);
importPackage(net.sf.sunms.server);
importPackage(java.util);
importPackage(Packages.client);
importPackage(Packages.server);
importPackage(Packages.tools);
importPackage(Packages.tools.packet);
var slot = Array("力量", "敏捷", "智力", "幸运", "HP", "MP", "物理攻击", "魔法攻击");
var num;

function start() {
	status = -1;
	action(1, 0, 0);
}

function action(mode, type, selection) {
	if (mode == -1) {
		cm.dispose();
	} else {
		if ((mode == 0 && status == 2) || (mode == 0 && status == 13)) {
			cm.dispose();
			return;
		}else 	
		if (status >= 0 && mode == 0) {
		cm.sendOk("#b好的,下次再见.");
		cm.dispose();
		return;
		}
		if (mode == 1)
			status++;
		else
			status--;
		if (status == 0){
		itemList = cm.getInventory(1).list().iterator();
		text = "\t\t#e========欢迎来到	#r"+fwq+"#k========\r\n\#e在我这里使用点券/抵用可以提高混沌卷轴的强化能力!\r\n#e#r\r\n#b将会消耗强化次数#r1次,#b请选择需要强化的装备!\r\n#k(每次强化需要手续费"+meso+")#k\r\n";
        text += "#e- 首先请选择要强化的道具 -#n\r\n#b";
        var indexof = 1;
        while (itemList.hasNext()) {
            var item = itemList.next();
            text += "#L" + item.getPosition() + "##v" + item.getItemId() + "#";
            if (indexof > 1 && indexof % 5 == 0) {
                text += "\r\n";
            }
            indexof++;
        }
        cm.sendSimple(text);
		} else if (status == 1){
			if(cm.getMeso() < meso){
				cm.sendOk("帐户余额不足！");
				cm.dispose();
				return;
			}
			num = selection;
		text ="您选择的装备是：#v"+cm.getInventory(1).getItem(num).getItemId()+"##t"+cm.getInventory(1).getItem(num).getItemId()+"#\r\n\r\n";
        text += "#e 接下来请选择您使用的卷轴 #n\r\n\r\n#b";
		text += "\r\n#L1##v2049100##z2049100#同时消耗"+xh1+"点券#b";//70
		text += "\r\n#L2##v2049100##z2049100#同时消耗#b"+xh2+"抵用";//30
        cm.sendSimple(text);
		} else if (status == 2) {
			if (selection == 1){//70
				if(cm.getPlayer().getCSPoints(1)<xh1){
					cm.sendOk("帐户余额不足！");
					cm.dispose();
					return;
				}
				if(cm.haveItem(2049100)){
					cm.sendSimple("是否使用祝福卷轴？\r\n#L11##r是#k#l\t\t#L12#否#l");
				}else {
					cm.sendOk("请确认背包中是否有#v2049100##z2049100#");
					cm.dispose();
				}
			}else if (selection == 2){//30
				if(cm.getPlayer().getCSPoints(2)<xh2){
					cm.sendOk("帐户余额不足！");
					cm.dispose();
					return;
				}
				if(cm.haveItem(2049100)){
					cm.sendSimple("是否使用祝福卷轴？\r\n#L21##r是#k#l\t\t#L22#否#l");
				}else {
					cm.sendOk("请确认背包中是否有#v2049100##z2049100#");
					cm.dispose();
				}
			} else {
				cm.dispose();
			}
		} else if (status == 3) {
			if(selection == 11){//70
				var cc = cm.getInventory(1).getItem(num).getItemId();
					status = 3;
					cm.sendYesNo("你要强化的装备为:\r\n\r\n#v"+cc+"#\r\n\r\n#r#e确定要开始强化吗?");
			}else if(selection == 12) {//70
				var cc = cm.getInventory(1).getItem(num).getItemId();
					status = 4;
					cm.sendYesNo("你要强化的装备为:\r\n\r\n#v"+cc+"#\r\n\r\n#r#e确定要开始强化吗?");
			}else if(selection == 21) {//30
				var cc = cm.getInventory(1).getItem(num).getItemId();
					status = 5;
					cm.sendYesNo("你要强化的装备为:\r\n\r\n#v"+cc+"#\r\n\r\n#r#e确定要开始强化吗?");
			}else if (selection == 22){//30
				var cc = cm.getInventory(1).getItem(num).getItemId();
					status = 6;
					cm.sendYesNo("你要强化的装备为:\r\n\r\n#v"+cc+"#\r\n\r\n#r#e确定要开始强化吗?");
			}
		} else if (status == 4){
			status = 10;
			if(!cm.haveItem(2340000)){
				cm.sendOk("#v2340000#物品数量不足！");
				cm.dispose();
				return;
			}
			var item = cm.getInventory(1).getItem(num).copy();
			if (item.getUpgradeSlots() <= 0){
				cm.sendOk("您选择的装备剩余强化次数不足！");
				cm.dispose();
				return;
			}
		    if(cm.getInventory(1).getItem(num).getExpiration() != -1) {
				cm.sendOk("限时装备不能使用强化卷轴.");
				cm.dispose();
				return;
			}
			if(sj1 == 1){
				cm.gainItem(2049100,-1);
				//cm.gainNX(-xh1);
				cm.gainItem(2340000,-1);
				cm.gainMeso(-meso);
				cm.sendOk("强化失败了！");
				cm.dispose();
			}else{
				cm.gainItem(2049100,-1);
				cm.gainNX(-xh1);
				cm.gainItem(2340000,-1);
				cm.gainMeso(-meso);
				cm.sendYesNo("#e#r强化成功！#k\r\n\t您选择的装备#v"+cm.getInventory(1).getItem(num).getItemId()+"#将提升属性如下：\r\n\t"+slot[sx]+"#r "+jsx1+"（HP/MP则为"+jsx1+"）#k\r\n\t#e#r是否保留该项加成？");
				//cm.sendNext("强化成功，请点击下一步离开");
			}
		} else if (status == 5){
			status = 10;
			var item = cm.getInventory(1).getItem(num).copy();
			if (item.getUpgradeSlots() <= 0){
				cm.sendOk("您选择的装备剩余强化次数不足！");
				cm.dispose();
				return;
			}
		    if(cm.getInventory(1).getItem(num).getExpiration() != -1) {
				cm.sendOk("限时装备不能使用强化卷轴.");
				cm.dispose();
				return;
			}
			if(sj1 == 1){
			var statup = new java.util.ArrayList();
			var itemId1 = cm.getInventory(1).getItem(num).getItemId();
			var item = cm.getInventory(1).getItem(num).copy();
			var ii = MapleItemInformationProvider.getInstance();
			var type =  ii.getInventoryType(itemId1);
				cm.gainMeso(-meso);
				cm.gainItem(2049100,-1);
				//cm.gainNX(-xh1);
				item.setUpgradeSlots(item.getUpgradeSlots()-1);
				MapleInventoryManipulator.removeFromSlot(cm.getC(),type,num,1, false);
				MapleInventoryManipulator.addFromDrop(cm.getC(), item,false);
				cm.sendOk("强化失败了！");
				cm.dispose();
			}else{
				cm.gainMeso(-meso);
				cm.gainItem(2049100,-1);
				cm.gainNX(-xh1);
				cm.sendYesNo("#e#r强化成功！#k\r\n\t您选择的装备#v"+cm.getInventory(1).getItem(num).getItemId()+"#将提升属性如下：\r\n\t"+slot[sx]+"#r "+jsx1+"（HP/MP则为"+jsx1+"）#k\r\n\t#e#r是否保留该项加成？");
			}
		} else if (status == 6){
			status = 11;
			if(!cm.haveItem(2340000)){
				cm.sendOk("#v2340000#物品数量不足！");
				cm.dispose();
				return;
			}
			var item = cm.getInventory(1).getItem(num).copy();
			if (item.getUpgradeSlots() <= 0){
				cm.sendOk("您选择的装备剩余强化次数不足！");
				cm.dispose();
				return;
			}
		    if(cm.getInventory(1).getItem(num).getExpiration() != -1) {
				cm.sendOk("限时装备不能使用强化卷轴.");
				cm.dispose();
				return;
			}
			if(sj2 == 2){
				cm.gainItem(2049100,-1);
				//cm.gainDY(-xh2);
				cm.gainItem(2340000,-1);
				cm.gainMeso(-meso);
				cm.sendOk("强化失败了！");
				cm.dispose();
			}else{
				cm.gainItem(2049100,-1);
				cm.gainDY(-xh2);
				cm.gainItem(2340000,-1);
				cm.gainMeso(-meso);
				cm.sendYesNo("#e#r强化成功！#k\r\n\t您选择的装备#v"+cm.getInventory(1).getItem(num).getItemId()+"#将提升属性如下：\r\n\t"+slot[sx]+"#r "+jsx2+"（HP/MP则为"+jsx2+"）#k\r\n\t#e#r是否保留该项加成？");
				//cm.sendNext("强化成功，请点击下一步离开");
			}
		} else if (status == 7){
			status = 11;
			var item = cm.getInventory(1).getItem(num).copy();
			if (item.getUpgradeSlots() <= 0){
				cm.sendOk("您选择的装备剩余强化次数不足！");
				cm.dispose();
				return;
			}
		    if(cm.getInventory(1).getItem(num).getExpiration() != -1) {
				cm.sendOk("限时装备不能使用强化卷轴.");
				cm.dispose();
				return;
			}
			if(sj2 == 2){
			var statup = new java.util.ArrayList();
			var itemId1 = cm.getInventory(1).getItem(num).getItemId();
			var item = cm.getInventory(1).getItem(num).copy();
			var ii = MapleItemInformationProvider.getInstance();
			var type =  ii.getInventoryType(itemId1);
				cm.gainItem(2049100,-1);
				//cm.gainDY(-xh2);
				cm.gainMeso(-meso);
				item.setUpgradeSlots(item.getUpgradeSlots()-1);
				MapleInventoryManipulator.removeFromSlot(cm.getC(),type,num,1, false);
				MapleInventoryManipulator.addFromDrop(cm.getC(), item,false);
				cm.sendOk("强化失败了！");
				cm.dispose();
			}else{
				cm.gainItem(2049100,-1);
				cm.gainDY(-xh2);
				cm.gainMeso(-meso);
				cm.sendYesNo("#e#r强化成功！#k\r\n\t您选择的装备#v"+cm.getInventory(1).getItem(num).getItemId()+"#将提升属性如下：\r\n\t"+slot[sx]+"#r "+jsx2+"（HP/MP则为"+jsx2+"）#k\r\n\t#e#r是否保留该项加成？");
				//cm.sendNext("强化成功，请点击下一步离开");
			}
		} else if (status == 11){//+sx1
			var statup = new java.util.ArrayList();
			var itemId1 = cm.getInventory(1).getItem(num).getItemId();
			var item = cm.getInventory(1).getItem(num).copy();
			var ii = MapleItemInformationProvider.getInstance();
			var type =  ii.getInventoryType(itemId1);
			var sx0 = item.getStr();//力量0
			var sx1 = item.getDex();//敏捷1
			var sx2 = item.getInt();//智力2
			var sx3 = item.getLuk();//运气3
			var sx4 = item.getHp();//HP4
			var sx5 = item.getMp();//MP5
			var sx6 = item.getWatk();//物攻6
			var sx7 = item.getMatk();//魔攻7
			var sx8 = item.getWdef();//物防8
			var sx9 = item.getMdef();//魔防9
			var sx10= item.getAcc();//命中10
			var sx11= item.getAvoid();//回避11
			var sx12= item.getHands();//手技12
			var sx13= item.getSpeed();//移动速度13
			var sx14= item.getJump();//跳跃力14
			item.setUpgradeSlots(item.getUpgradeSlots()-1);
			item.setLevel(item.getLevel()+1);
			if(sx==0){
			item.setStr(sx0+jsx1);
			}else if(sx==1){
			item.setDex(sx1+jsx1);
			}else if(sx==2){
			item.setInt(sx2+jsx1);
			}else if(sx==3){
			item.setLuk(sx3+jsx1);
			}else if(sx==4){
			item.setHp(sx4+jsx1*10);
			}else if(sx==5){
			item.setMp(sx5+jsx1*10);
			}else if(sx==6){
			item.setWatk(sx6+jsx1);
			}else if(sx==7){
			item.setMatk(sx7+jsx1);
			}else if(sx==8){
			item.setWdef(sx8+jsx1);
			}else if(sx==9){
			item.setMdef(sx9+jsx1);
			}else if(sx==10){
			item.setAcc(sx10+jsx1);
			}else if(sx==11){
			item.setAvoid(sx11+jsx1);
			}else if(sx==12){
			item.setHands(sx12+jsx1);
			}else if(sx==13){
			item.setSpeed(sx13+jsx1);
			}else if(sx==14){
			item.setJump(sx14+jsx1);
			}
			MapleInventoryManipulator.removeFromSlot(cm.getC(),type,num,1, false);
			MapleInventoryManipulator.addFromDrop(cm.getC(), item,false);
			cm.sendOk("#e强化完毕！");
			cm.dispose();
		} else if (status == 12) {//+sx2
			var statup = new java.util.ArrayList();
			var itemId1 = cm.getInventory(1).getItem(num).getItemId();
			var item = cm.getInventory(1).getItem(num).copy();
			var ii = MapleItemInformationProvider.getInstance();
			var type =  ii.getInventoryType(itemId1);
			var sx0 = item.getStr();//力量0
			var sx1 = item.getDex();//敏捷1
			var sx2 = item.getInt();//智力2
			var sx3 = item.getLuk();//运气3
			var sx4 = item.getHp();//HP4
			var sx5 = item.getMp();//MP5
			var sx6 = item.getWatk();//物攻6
			var sx7 = item.getMatk();//魔攻7
			var sx8 = item.getWdef();//物防8
			var sx9 = item.getMdef();//魔防9
			var sx10= item.getAcc();//命中10
			var sx11= item.getAvoid();//回避11
			var sx12= item.getHands();//手技12
			var sx13= item.getSpeed();//移动速度13
			var sx14= item.getJump();//跳跃力14
			item.setUpgradeSlots(item.getUpgradeSlots()-1);
			item.setLevel(item.getLevel()+1);
			if(sx==0){
			item.setStr(sx0+jsx2);
			}else if(sx==1){
			item.setDex(sx1+jsx2);
			}else if(sx==2){
			item.setInt(sx2+jsx2);
			}else if(sx==3){
			item.setLuk(sx3+jsx2);
			}else if(sx==4){
			item.setHp(sx4+jsx2*10);
			}else if(sx==5){
			item.setMp(sx5+jsx2*10);
			}else if(sx==6){
			item.setWatk(sx6+jsx2);
			}else if(sx==7){
			item.setMatk(sx7+jsx2);
			}else if(sx==8){
			item.setWdef(sx8+jsx2);
			}else if(sx==9){
			item.setMdef(sx9+jsx2);
			}else if(sx==10){
			item.setAcc(sx10+jsx2);
			}else if(sx==11){
			item.setAvoid(sx11+jsx2);
			}else if(sx==12){
			item.setHands(sx12+jsx2);
			}else if(sx==13){
			item.setSpeed(sx13+jsx2);
			}else if(sx==14){
			item.setJump(sx14+jsx2);
			}
			MapleInventoryManipulator.removeFromSlot(cm.getC(),type,num,1, false);
			MapleInventoryManipulator.addFromDrop(cm.getC(), item,false);
			cm.sendOk("#e强化完毕！");
			cm.dispose();
		}else if(status == 13){
			cm.dispose();
		}
	}
}
