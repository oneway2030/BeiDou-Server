var status;
var sel1, sel2, sel3, sel4;
var menu = Array("����ҩˮ","�سɾ�1", "˲��֮ʯ", "�����̵�", "�����̵�", "�����̵�", "��װ��ָ","������Ʒ","��װ�̵�","�سɾ�2","�߼�װ��");

function start() {
	status = -1;
	sel1 = -1;
	if(cm.getJobId() == 910 || cm.getJobId() == 900 || cm.getJobId() == 800 ) {
	var text = "��⵽����GM����Ա(����910/900/800),�Ƿ�ʹ��GM�̵ꣿ\r\n";
	text += generateSelectionMenu(menu);
	cm.sendSimple(text);
	}
	else {
   		cm.openShopNPC(9201101);  //��Ҷ�ǹ���ҩˮ�̵�
		cm.dispose();
	}
}

function action(mode, type, selection) {
	status++;
	 if(mode != 1) {
		if(mode == 0 && type != 4)
			status -= 2;
		else {
			cm.dispose();
			return;
		}
	}
	if(status == 0) {
		if(sel1 == -1)
			sel1 = selection;
		 if(sel1 == 0) { 
			cm.openShopNPC(9201101); 
			cm.dispose();
		} else if(sel1 == 1) { 
			cm.openShopNPC(1337); 
			cm.dispose();
		} else if(sel1 == 2) { 
			cm.openShopNPC(1338); 
			cm.dispose();
              		} else if(sel1 == 3) { 
			cm.openShopNPC(9999992);
			cm.dispose();
                                } else if(sel1 == 4) {
			cm.openShopNPC(9999993);
			cm.dispose();
                                } else if(sel1 == 5) {
			cm.openShopNPC(9999994);
			cm.dispose();
                                } else if(sel1 == 6) {
			cm.openShopNPC(9999995);
			cm.dispose();
		} else if(sel1 == 7) {
			cm.openShopNPC(9999996);
			cm.dispose();
		} else if(sel1 == 8) {
			cm.openShopNPC(9999997);
			cm.dispose();
		} else if(sel1 == 9) {
			cm.openShopNPC(9999998);
			cm.dispose();
		} else if(sel1 == 10) {
			cm.openShopNPC(9999999);
			cm.dispose();
                                } 
	} else if(status == 1) {
		if(sel1 == 2) {
			var item1 = cm.getEquipInSlot(1);
			var item2 = cm.getEquipInSlot(2);
			if(item1 == null || item2 == null) {
				cm.sendOk("���װ���ź�");
				cm.dispose();
			} else {
				cm.eatEquip(cm.getPlayer(), item2, item1);
				cm.removeItem(2, 1, 1);
			}
		}
	}
}

function generateSelectionMenu(array) { // nice tool for generating a string for the sendSimple functionality
	var menu = "";
	for(var i = 0; i < array.length; i++) {
		menu += "#L" + i + "##r" + array[i] + "#k#l";
		if(i % 4 == 3) {
			menu += "\r\n";
		} else {
			menu += "\t";
		}
	}
	return menu;
}

//    cm.openShopNPC(11100);    //���ӻ��̵꣨������ۡ����ܡ�ħ��ʯ�ȣ��۸��
//    cm.openShopNPC(9201058);    //����Ҷ�Ƿ����̵�
//    cm.openShopNPC(9201059);    //����Ҷ�������̵�
//    cm.openShopNPC(9201060);    //����Ҷ��ҩˮ�̵�
//    cm.openShopNPC(9201099);    //����Ҷ�������̵�1�����ܡ�ѩ�̡���ʯ�����ʸ�ȣ��۸���ˣ�
//    cm.openShopNPC(9201101);    //����Ҷ�������̵�2�����ֱ�̬������ҩˮ���۸��
//    cm.openShopNPC(1337);    //��GMר���̵�1��GM��װ����ɫ�سɾ��߼�װ���ȣ�ȫ��1��ң�
//    cm.openShopNPC(1338);    //��������Ҷ���̵꣨�ɽ�ˮ+�߼�˲��֮ʯ��
//    cm.openShopNPC(9999992);    //��GM�����̵꣨����ͳ�����Ʒȫ��1��ң�
//    cm.openShopNPC(9999993);    //��GM�����̵꣨ȫ��1��ң�
//    cm.openShopNPC(9999994);    //��GM�����̵꣨ȫ��1��ң�
//    cm.openShopNPC(9999995);    //��GM��װ��ָ�̵꣨ȫ��1��ң�
//    cm.openShopNPC(9999996);    //��GM���顢���Ρ������̵꣨ȫ��1��ң�
//    cm.openShopNPC(9999997);    //��GM��װ����ñ�Ӷ����·�Ь���̵꣨ȫ��1��ң����಻�Ǻࣩܶ
//    cm.openShopNPC(9999998);    //��GMר���̵�2��100%�����سɾ��ᡢ����ף������������ʯ��ȫ��1��ң�
//    cm.openShopNPC(9999999);    //��GMר���̵�3��GM��װ���߼�װ���ȣ�ȫ��1��ң�