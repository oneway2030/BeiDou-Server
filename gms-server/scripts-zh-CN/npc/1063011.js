var status = -1;
var questId = 21728; //Puppeteer's Cave
var questId2 = 21730;//Eliminate the Puppeteer


function start(){
	action(1, 0, 0);
java.lang.System.out.println("111");
}

function action(mode, type, selection) {
	if(status === -1){
		
		var questStatus1 = cm.getQuestStatus(questId);
		var questStatus2 = cm.getQuestStatus(questId2);
		if(questStatus1 == 1){//Complete
			cm.forceCompleteQuest(questId);
			cm.dispose();
			return;
		}
		if(questStatus2 == 2){
			cm.dispose();
			return;
		}
		
		//cm.getPlayer().dropMessage(5, "����: ������˹�������żʦ");
		cm.sendGetText("һ�����ɵ�������͸�˼ž�. #b���밵��!");
		status = 1;
	}
	if(status === 1){
		var input = cm.getText();
		if(input == null){
			return;
		}
		var people = cm.getPlayer().getMap().getCharacters().size();
		if(people > 1){
			cm.getPlayer().dropMessage(5, "��������������");
			cm.dispose();
		}
		if(input === 'Francis is a genius Puppeteer!'|| input === '������˹�������żʦ'){
			cm.warp(910510000);
			cm.dispose();
		}else{
			cm.dispose();
		}
	}
}