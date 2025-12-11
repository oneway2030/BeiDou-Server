/**
 * @description 一键出售装备,可以自定义出售位置1-96格子
 *
 * @author 吃瓜群众
 */

const InventoryType = Java.type('org.gms.client.inventory.InventoryType');
// var column = ["装备", "消耗", "设置", "其他", "商城"];
var column = ["装备", "消耗", "其他"];
var text;
var sellType = InventoryType.EQUIP;
var startStr = "开始";
var endStr = "结束";
var curChoose = 0;

function start() {
    levelStart();
}

// 对话开始
function levelStart() {
    text = "#k请选择需要快捷出售方式：(提示：现金装备也会被出售并且没有金币，请谨慎设置)#n\r\n\r\n";
    for (let i = 0; i < column.length; i++) {
        let sellType = getSellType(i);
        text += "#L" + i + "##b出售" + column[i] + "栏的道具#r(" + getValue(sellType, startStr) + "-" + getValue(sellType, endStr) + "格)#l\r\n\r\n";
    }
    text += "\r\n\r\n";
    for (let i = column.length; i <= column.length + 2; i++) {
        text += "#L" + i + "##k设置" + column[i - 3] + "出售位置#l\r\n";
    }
    // 选择删除哪一栏
    cm.sendNextSelectLevel("ChooseInventory", text);
}

// 选择了背包栏
function levelChooseInventory(choose) {
    if (choose < 3) {
        curChoose = choose;
        // 3. 获取起始/结束位置并校验（提前校验无效值，减少后续计算）
        const start = getValue(sellType, startStr);
        const end = getValue(sellType, endStr);
        cm.sendNextLevel("Sell", `#k确认出售 #r${start}-${end} 格 【${column[choose]}】#k物品?！\r\n`);
        // cm.sendNextLevel("Dispose","图书馆的是法国");

    } else {
        settings(choose);
    }
}

//出售东西
function levelSell() {
    const ShopFactory = Java.type('org.gms.server.ShopFactory');
    const ItemInformationProvider = Java.type('org.gms.server.ItemInformationProvider');
    const ii = ItemInformationProvider.getInstance(); // 提前获取单例实例，避免重复创建
    let sellType = getSellType(curChoose);
    if (sellType === InventoryType.UNDEFINED) {
        cm.sendOk("出售异常请与GM联系");
        cm.dispose();
        return;
    }
    const start = getValue(sellType, startStr);
    const end = getValue(sellType, endStr);
    if (!(start > 0 && end > 0 && start < end && start <= 95 && end <= 96 && end >= 10)) {
        cm.sendOk("设置的位置有误，无法出售！\r\n要求：起始格子1-95，结束格子10-96，且起始格子必须小于结束格子！");
        cm.dispose();
        return;
    }
    let totalPrice = 0;
    const shop = ShopFactory.getInstance().getShop(11000); // 提前获取商店实例
    const inventory = cm.getInventory(sellType); // 提前获取背包实例
    for (let i = start; i <= end; i++) {
        const item = inventory.getItem(i);
        if (item) {
            //不允许卖点装
            if (sellType === InventoryType.EQUIP && ii.isCashItem(item.getItemId())) {
                continue;
            } else {
                const quantity = item.getQuantity();
                // 执行出售操作
                shop.sell(cm.getClient(), sellType, i, quantity);
                // 累加价格（使用ii单例，避免重复获取）
                totalPrice += ii.getPrice(item.getItemId(), quantity);
            }
        }
    }
    cm.sendOk(`#k出售 #r${start}-${end} 格 【${column[curChoose]}】#k物品成功！\r\n总计获取金币：#r${cm.numberWithCommas(totalPrice)}#k`);
    cm.dispose();
}

function settings(choose) {
    if (choose == 3) {
        sellType = InventoryType.EQUIP;
    } else if (choose == 4) {
        sellType = InventoryType.USE;
    } else if (choose == 5) {
        sellType = InventoryType.ETC;
    }
    let text = "#k请选择出售#r【" + column[choose - 3] + "】.#k需要设置的位置： #l\r\n\r\n"
    text += "#L0# #k设置#r【起始】#k位置 #n#k(当前第 #n#r" + getValue(sellType, startStr) + " #k格)#l\r\n\r\n";
    text += "#L1# #k设置#r【结束】#k位置 #n#k(当前第 #n#r" + getValue(sellType, endStr) + " #k格)#l\r\n\r\n";
    cm.sendNextSelectLevel("ChooseSettings", text);
}

function levelChooseSettings(keyType) {
    let index = getValue(sellType, keyType) - 1;
    if (keyType === 0) {//开始位置
        cm.getInputTextLevel("StartSettings", "请输入1-" + index + "数字");
    } else if (keyType === 1) {//结束位置
        cm.getInputTextLevel("EndSettings", "请输入" + index + "-96数字");
    }
}

//存储开始值
function levelStartSettings(inputText) {
    const num = Number(inputText.trim());
    if (Number.isInteger(num) && num > 0) {
        cm.saveOrUpdateCharacterExtendValue(getKey(sellType, startStr), "" + inputText);
        cm.sendOk("设置成功");
        cm.dispose()
    } else {
        cm.sendOk("请输入正确的数字！起始格子1-95，结束的格子10-96，起始格子必须小于结束格子！");
        cm.dispose();
    }
}

//存储结束值
function levelEndSettings(inputText) {
    const num = Number(inputText.trim());
    if (Number.isInteger(num) && num > 0) {
        cm.saveOrUpdateCharacterExtendValue(getKey(sellType, endStr), "" + inputText);
        cm.sendOk("设置成功");
        cm.dispose()
    } else {
        cm.sendOk("请输入正确的数字！起始格子1-95，结束的格子10-96，起始格子必须小于结束格子！");
        cm.dispose();
    }
}

function getKey(itemType, keyType) {
    return "" + itemType + "_" + keyType;
}

function getValue(itemType, keyType) {
    var value = cm.getCharacterExtendValue(getKey(itemType, keyType));
    if (value) {
        return Number(value)
    }
    return keyType === startStr ? 1 : 96;
}

function getSellType(index) {
    let type = InventoryType.UNDEFINED;
    if (index === 0) {
        type = InventoryType.EQUIP;
    } else if (index === 1) {
        type = InventoryType.USE;
    } else if (index === 2) {
        type = InventoryType.ETC
    }
    return type;
}
