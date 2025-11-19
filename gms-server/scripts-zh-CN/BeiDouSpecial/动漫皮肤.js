/**
 脚本作者：江奈Mizuki
 本脚本的效果是可以找幸福村的圣诞老人通过抽奖或道具兑换获取二次元皮肤。
 **/
var ComicList = [
    [1008900, "带土"],
    [1008901, "斗笠死灵"],
    [1008906, "莉央"],
    [1008910, "潘多拉"],
    [1008913, "血月"],
    [1008918, "黑岩射手"],
    [1008923, "花江"],
    [1008926, "迪达拉"],
    [1008927, "天使"],
    [1008929, "咖喱柴犬"],
    [1008933, "露米"],
    [1008939, "天使-艾丽莎"],
    [1008940, "沢田纲吉"],
    [1008942, "星"],
    [1008946, "星见亚砂"],
    [1008948, "圣女贞德"],
    [1008950, "哈尔"],
    [1008953, "娜美"],
    [1008955, "萨博"],
    [1008956, "佩恩"],
    [1008959, "黑色少女"],
    [1008960, "纲"],
    [1009911, "宇智波鼬"],
    [1009912, "火影四代目"],
    [1009913, "鸣人发光-最终"],
    [1009914, "鸣人小新"],
    [1009915, "佐助3"],
    [1009916, "雏田"],
    [1009917, "纲手"],
    [1009918, "八门夜凯"],
    [1009919, "小南"],
    [1009920, "小樱"],
    [1009921, "迪达拉"],
    [1009922, "艾斯"],
    [1009923, "止水"],
    [1009924, "尼卡路飞"],
    [1009925, "不知火舞"],
    [1009926, "草薙京"],
    [1009927, "海贼王大和"],
    [1009928, "黑崎一护"],
    [1009929, "红发香克斯"],
    [1009930, "卡卡西坐下"],
    [1009931, "桔梗X犬夜叉"],
    [1009932, "弗利沙"],
    [1009933, "eva明日香"],
    [1009934, "魔人布欧"],
    [1009935, "圣斗士白羊座wu"],
    [1009936, "手枪+大刀版吴彦祖"],
    [1009937, "四皇路飞"],
    [1009938, "威尔"],
    [1009939, "夏油杰"],
    [1009940, "自在极意 白悟空"],
    [1009941, "艾尼路"],
    [1009942, "阿拉蕾"],
    [1009943, "蝎"],
    [1009944, "帝皇龙甲兽"],
    [1009945, "粉红幻影大剑全残影"],
    [1009946, "杀生丸"],
    [1009947, "天女兽"],
    [1009948, "军曹"],
    [1009949, "杰尼龟"],
    [1009950, "女帝"],
    [1009951, "远坂凛"],
    [1009952, "黑saber"],
    [1009953, "黑saber2"],
    [1009954, "高达"],
    [1009955, "光能使者阿祖"],
    [1009956, "海绵宝宝"],
    [1009957, "恐龙小新"],
    [1009958, "蜡笔小新 黑道"],
    [1009959, "蜡笔小新"],
    [1009960, "雷电将军"],
    [1009961, "墨镜五条悟"],
    [1009962, "尼卡定制3版本混合"],
    [1009963, "尼卡小新"],
    [1009964, "尼卡小新2"],
    [1009965, "骑车小新"],
    [1009966, "睡衣小新"],
    [1009967, "五条悟合体"],
    [1009968, "星见雅"],
    [1009969, "星穹1"],
    [1009970, "一拳超人"],
    [1009971, "一拳超人1"],
    [1009972, "泳衣成品"],
    [1009973, "泳装枪手"],
    [1009974, "圆神"],
    [1009975, "天使法"],
    [1009976, "天使枪"],
    [1009977, "托尔龙女仆"],
    [1009978, "家庭教师"],
    [1009979, "芙莉莲"],
    [1009980, "麻仓叶"],
    [1009981, "白贞德"],
    [1009982, "ALN4"],
    [1009983, "Q版星见雅"],
    [1009984, "超天酱"],
    [1009985, "纯爱战神"],
    [1009986, "独自升级"],
    [1009987, "独自升级程小雨"],
    [1009988, "红莲暗影"],
    [1009989, "瞌睡兔"],
    [1009990, "莉央完成"],
    [1009991, "千寻"],
    [1009992, "蛇女"],
    [1009993, "水兵月"],
    [1009994, "死灵姐姐"],
    [1009995, "妖梦"],
    [1009996, "小恶魔"],
    [1009997, "铃仙"],
    [1009998, "琪露诺"],
    [1009999, "蕾米莉亚"]
];
// 抽奖消耗的点卷数量
const DRAW_COST = 6000;
// 兑换所需道具ID
const EXCHANGE_ITEM_ID = 4000325;
// 兑换所需数量
const count = 1;
// 皮肤有效期（7天，单位：分钟）
const SKIN_DURATION = 7 * 60 * 24;
//当前选中
var mSelectedIndex=0;

function start() {
    let text = "动漫皮肤获取,请选择你想要的操作：#b\r\n"
        + "#L1#抽奖获取皮肤（消耗6000点卷）#l\r\n\r\n"
        + "#L2#兑换指定皮肤（需要  #v" + EXCHANGE_ITEM_ID + "#   x" + count + ".）#l";
    cm.sendSelectLevel("Select", text);
}

//抽奖显示界面
function levelSelect1() {
    let text = "#k请点击下方按钮进行抽奖（消耗6000点卷，50%概率获得选中皮肤，50%概率获得100点卷）\r\n";
    text += "#L0##r点击进行抽奖#l\r\n\r\n\r\n\r\n";
    text += "#k以下是可抽奖获取的皮肤列表：#b\r\n";
    for (let i = 0; i < ComicList.length; i++) {
        // text += "#v" + ComicList[i][0] + ":# " + ComicList[i][1] + "\r\n";
        // text += "#v" + ComicList[i][0] + ":# " + ComicList[i][1] + "";
        text += "#v" + ComicList[i][0] + "#";
    }
    cm.sendSelectLevel("Lottery", text);
}

/**
 * 抽奖
 */
function levelLottery0() {
    const player = cm.getPlayer();
    // 检查点卷是否足够
    if (player.getMeso() >= DRAW_COST) {
        // 扣除点卷
        player.gainMeso(-DRAW_COST, true);
        // 50%概率抽奖结果
        const isSuccess = Math.random() < 0.5;

        if (isSuccess) {
            // 随机选择一个皮肤（从列表中随机选取）
            const randomIndex = Math.floor(Math.random() * ComicList.length);
            const selectedSkin = ComicList[randomIndex];
            // 发放皮肤
            player.gainEquip(selectedSkin[0], 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, SKIN_DURATION);
            cm.sendOk("恭喜你！抽奖成功，获得了#b" + selectedSkin[1] + "#k皮肤，有效期7天！");
        } else {
            // 发放100点卷
            player.gainMeso(100, true);
            cm.sendOk("很遗憾，抽奖未中奖，获得安慰奖100点卷！");
        }
    } else {
        cm.sendOk("你的点卷不足" + DRAW_COST + "，无法进行抽奖。");
    }
    cm.dispose();
}

/**
 * 兑换界面 - 一排显示两个皮肤选项且纵列对齐（第一列固定14个汉字宽度）
 */
function levelSelect2() {
    // 检查是否拥有兑换道具
    if (cm.haveItem(EXCHANGE_ITEM_ID, 1)) {
        let text = "你拥有兑换道具，可以兑换以下皮肤：#b\r\n";
        // 定义第一列宽度为14个汉字（每个汉字相当于2个字符宽度）
        const firstColumnWidth = 12;

        // 遍历皮肤列表，每两个元素为一行
        for (let i = 0; i < ComicList.length; i += 2) {
            // 处理第一个皮肤选项
            const firstItem = ComicList[i];
            const firstText = `#L${i}##v${firstItem[0]}:#  ${firstItem[1]}#l`;

            // 计算第一个选项名称的字符长度（汉字按2个字符计算）
            let nameLength = 0;
            for (let char of firstItem[1]) {
                // 正则判断是否为汉字
                nameLength += /[\u4e00-\u9fa5]/.test(char) ? 2 : 1;
            }

            // 计算需要补充的空格数（包含图标占位宽度补偿）
            const iconCompensation = 4; // 图标和格式字符的宽度补偿
            const totalNeeded = firstColumnWidth * 2 + iconCompensation;
            const spacesNeeded = Math.max(0, totalNeeded - nameLength);
            const spaces = ' '.repeat(spacesNeeded);

            // 添加第一个选项和填充空格
            text += firstText + spaces;

            // 如果存在第二个皮肤，添加第二个选项
            if (i + 1 < ComicList.length) {
                const secondItem = ComicList[i + 1];
                const secondText = `#L${i + 1}##v${secondItem[0]}:#${secondItem[1]}#l`;
                text += secondText;
            }

            // 每行结束添加换行
            text += "\r\n";
        }
        cm.sendNextSelectLevel("ConfirmExchange", text);
    } else {
        cm.sendOk("抱歉，无法进行兑换,需要  #v" + EXCHANGE_ITEM_ID + "#   x" + count + ".");
        cm.dispose();
    }
}

function levelConfirmExchange(index) {
    mSelectedIndex=index;
    // 点击上一步会自动调用level1，点击下一步会自动调用level3
    cm.sendLastNextLevel("Select2", "Exchange", "#b是否确认消耗#v"+EXCHANGE_ITEM_ID+"#  x"+count+" 兑换 #e#r["+ComicList[mSelectedIndex][1]+"] #b? ");
}



/*
'兑换
 */
function levelExchange() {
    const selectedSkin = ComicList[mSelectedIndex];
    // 消耗一个兑换道具
    cm.gainItem(EXCHANGE_ITEM_ID, -count);
    // 发放皮肤
    cm.getPlayer().gainEquip(selectedSkin[0], 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, SKIN_DURATION);
    cm.sendOk("兑换成功！你获得了#b" + selectedSkin[1] + "#k皮肤，有效期7天！");
    cm.dispose();
}


