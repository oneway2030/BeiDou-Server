/**
 * @description 在线角色传送功能实现
 * 支持跨频道传送至目标角色位置，自动过滤自身角色
 * @author 吃瓜群众
 */

// 导入所需Java类
const ArrayList = Java.type('java.util.ArrayList');
const Server = Java.type('org.gms.net.server.Server');
const Client = Java.type('org.gms.client.Client');
var allCharacters;

function start() {
    levelStart();
}

/**
 * @description 显示在线角色列表（过滤自身），格式：[频道线]-[地图名称]-[角色名]-[等级]-[职业]
 */
function levelStart() {
    var worldS = Server.getInstance().getWorlds();
    var text = "#b在线总人数：";
    var text2 = "";
    var index = 0;
    allCharacters = new ArrayList();
    // 获取当前玩家信息
    const self = cm.getPlayer();
    const selfId = self.getId();

    for (let i = 0; i < worldS.size(); i++) {
        var world = worldS.get(i);
        var characters = world.getPlayerStorage().getAllCharacters();
        for (let j = 0; j < characters.size(); j++) {
            var character = characters.get(j);
            var id = character.getId();

            // 过滤自身角色
            // if (id === selfId) {
            //     continue;
            // }

            // 获取角色信息
            var name = character.getName();
            var job = character.getJob();
            var level = character.getLevel(); // 角色等级
            var channel = character.getClient().getChannel(); // 频道线
            var map = character.getMap(); // 地图对象
            var mapName = map.getMapName(); // 地图名称

            // 按格式拼接显示文本：[频道]-[地图]-[名字]-[等级]-[职业]
            // 【几线-地图】使用#b#e（蓝色加粗），后续使用#b（常规蓝色）
            text2 += `#L${index}#` +
                `#b#e[ ${channel}线- ${mapName} ]  #n#r${name} - Lv ${level} - ${job.getName()}#l\r\n`;


            index++;
            allCharacters.add(character);
        }
    }

    text += `#r${index}#b 人：#n#l\r\n`;
    text += text2;
    cm.sendNextSelectLevel("SelectPlayer", text);
}

/**
 * @description 处理角色选择，执行跨频道传送
 * @param {String} index 选中的角色索引
 */
function levelSelectPlayer(index) {
    try {
        const targetIndex = parseInt(index, 10);
        const target = allCharacters.get(targetIndex);
        const self = cm.getPlayer();
        const client = cm.getClient();

        // 检查目标是否在线（防止查询后下线的情况）
        if (!target.isLoggedIn()) {
            cm.sendOk("目标玩家已下线");
            cm.dispose();
            return;
        }

        // 获取目标所在频道和地图
        const targetChannel = target.getClient().getChannel();
        const currentChannel = client.getChannel();
        const targetMap = target.getMap();
        const targetPos = target.getPosition();

        // 跨频道处理
        if (targetChannel !== currentChannel) {
            self.changeMap(targetMap, targetPos);
            // 切换频道并传送到目标位置
            client.changeChannel(targetChannel);
        } else {
            // 同频道直接传送
            self.changeMap(targetMap, targetPos);
        }
        cm.dispose();
    } catch (e) {
        cm.sendOk("传送失败：" + e.message);
        cm.dispose();
    }
}