// 定义道具ID、兑换比例
const HP_ITEM_ID = 4032170;
const MP_ITEM_ID = 4032171;
const HP_PER_ITEM = 10;
const MP_PER_ITEM = 10;
let exchangeType = 0; // 0=HP, 1=MP
const KEY_WASH_HP = "key_wash_hp";
const KEY_WASH_MP = "key_wash_mp";

function start() {
	status = -1;
	action(1, 0, 0);
}

function action(mode, type, selection) {
	// 处理模式（确认/取消）
	if (mode === 1) {
		status++;
	} else {
		// 取消操作时返回上一级或关闭界面
		if (status > 0) {
			status--;
		} else {
			cm.dispose();
			return;
		}
	}

	// 获取玩家信息
	const player = cm.getPlayer();
	// 获取道具持有数量
	const hpItemCount = player.getItemQuantity(HP_ITEM_ID, false);
	const mpItemCount = player.getItemQuantity(MP_ITEM_ID, false);
	// 获取当前洗血次数
	const hpWashCount = getWashValue(0);
	const mpWashCount = getWashValue(1);

	// 初始界面 - 增加显示洗血次数
	if (status === 0) {
		let text = "\t\t\t\t\t\t\t\t#e#k欢迎来到#r[洗血]#k系统#n\t\t\t\t\r\n\r\n\r\n";
		text += "使用以下道具可兑换对应的属性提升：\r\n";
		text += `#i${HP_ITEM_ID}# #t${HP_ITEM_ID}# × 1 = ${HP_PER_ITEM} HP\r\n（当前持有：${hpItemCount}个,已洗次数：${hpWashCount}）#k\r\n\r\n`;
		text += `#i${MP_ITEM_ID}# #t${MP_ITEM_ID}# × 1 = ${MP_PER_ITEM} MP\r\n（当前持有：${mpItemCount}个,已洗次数：${mpWashCount}）#k\r\n\r\n`;
		text += "#L0##b兑换HP上限#l\r\n\r\n";
		text += "#L1##b兑换MP上限#l";
		cm.sendSimple(text);
	}
	// 兑换选择界面
	else if (status === 1) {
		if (selection === 0) {
			// 兑换HP处理
			exchangeType = 0;

			if (hpItemCount === 0) {
				cm.sendOk("你没有足够的#i" + HP_ITEM_ID + "#进行兑换");
				cm.dispose();
				return;
			}

			// 显示当前HP洗血次数
			cm.sendGetNumber(
				`请输入要兑换的数量（1个#i${HP_ITEM_ID}#可兑换+${HP_PER_ITEM}HP，当前持有：${hpItemCount}个 | 已洗次数：${hpWashCount}）`,
				1, 1, hpItemCount
			);
		} else if (selection === 1) {
			// 兑换MP处理
			exchangeType = 1;

			if (mpItemCount === 0) {
				cm.sendOk("你没有足够的#i" + MP_ITEM_ID + "#进行兑换");
				cm.dispose();
				return;
			}

			// 显示当前MP洗血次数
			cm.sendGetNumber(
				`请输入要兑换的数量（1个#i${MP_ITEM_ID}#可兑换+${MP_PER_ITEM}MP，当前持有：${mpItemCount}个 | 已洗次数：${mpWashCount}）`,
				1, 1, mpItemCount
			);
		} else {
			cm.dispose();
		}
	}
	// 确认兑换
	else if (status === 2) {
		const exchangeAmount = selection;
		const ITEM_ID = exchangeType === 0 ? HP_ITEM_ID : MP_ITEM_ID;

		// 再次检查道具数量（防止并发问题）
		const currentItemCount = player.getItemQuantity(ITEM_ID, false);
		if (exchangeAmount < 1 || exchangeAmount > currentItemCount) {
			cm.sendOk("兑换数量无效，请重新输入");
			cm.dispose();
			return;
		}

		// 计算提升的属性值
		const perItem = exchangeType === 0 ? HP_PER_ITEM : MP_PER_ITEM;
		const totalBoost = exchangeAmount * perItem;

		// 扣除道具并提升属性
		cm.gainItem(ITEM_ID, -exchangeAmount);
		if (exchangeType === 0) {
			player.addMaxHP(totalBoost);
		} else {
			player.addMaxMP(totalBoost);
		}

		// 获取当前属性值并处理显示
		const currentAttr = exchangeType === 0 ? player.getCurrentMaxHp() : player.getCurrentMaxMp();
		const displayAttr = currentAttr > 30000 ? 30000 : currentAttr;
		// 获取更新后的洗血次数
		const newWashCount = getWashValue(exchangeType) + exchangeAmount;

		// 显示结果信息（包含最新洗血次数）
		const resultText = exchangeType === 0 ?
			`成功兑换HP上限提升！\r\n消耗#i${ITEM_ID}# × ${exchangeAmount}\r\n获得HP上限：+${totalBoost}\r\n当前HP上限：${displayAttr}\r\n当前HP洗血总次数：${newWashCount}` :
			`成功兑换MP上限提升！\r\n消耗#i${ITEM_ID}# × ${exchangeAmount}\r\n获得MP上限：+${totalBoost}\r\n当前MP上限：${displayAttr}\r\n当前MP洗血总次数：${newWashCount}`;

		// 更新洗血次数（累加兑换数量）
		setWashValue(exchangeAmount);
		cm.sendOk(resultText);
		cm.dispose();
	} else {
		cm.dispose();
	}
}

// 新增type参数，明确获取哪种类型的洗血次数
function getWashValue(type) {
	const key = type === 0 ? KEY_WASH_HP : KEY_WASH_MP;
	return Number(cm.getCharacterExtendValue(key) || 0); // 处理未记录时的默认值
}

// 新增count参数，支持一次累加多个次数
function setWashValue(addCount) {
	const key = exchangeType === 0 ? KEY_WASH_HP : KEY_WASH_MP;
	const currentCount = getWashValue(exchangeType);
	const newCount = currentCount + addCount;
	cm.saveOrUpdateCharacterExtendValue(key, newCount+"");
}