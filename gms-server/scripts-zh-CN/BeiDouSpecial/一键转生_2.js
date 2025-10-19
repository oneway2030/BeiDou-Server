/*
	名字:	狼精灵狼神
	地圖:	达人殿堂
	描述:	140010110
*/

var jobs = Array(
  Array("冒险家", 000),
  Array("骑士团", 1000),
  Array("战神", 2000)
);

var status;

function start() {
  status = -1;
  if (!Packages.config.YamlConfig.config.server.USE_REBIRTH_SYSTEM) {
    cm.sendOk("...我在搜索我的主人，你看到他了吗？");
    cm.dispose();
    return;
  }
  action(1, 0, 0);
}

function action(mode, type, selection) {
  switch (mode) {
    case -1:
      cm.dispose();
      return;
    case 0:
      if (status == 0) {
        cm.dispose();
        return;
      }
      status--;
      break;
    case 1:
      status++;
      break;
  }

  if (status < 0) {
    cm.dispose();
    return;
  }

  try {
    switch (status) {
      case 0:
        cm.sendNext(
          "当你想要转生时来找我.你现在一共转生#r" +
            cm.getChar().getReborns() +
            " #k次."
        );
        break;
      case 1:
        cm.sendSimple(
          "你想让我做什么: \r\n \r\n #L0##b我要转生#l \r\n #L1##b下次再说#k#l"
        );
        break;
      case 2:
        if (selection == 0) {
          var jobId = cm.getJobId();
          var level = cm.getChar().getLevel();
          if ((jobId >= 1000 && jobId < 2000 && level >= 120) || level >= 200) {
            var sText = "#b请选择转生职业:\r\n";
            for (var i = 0; i < jobs.length; i++) {
              sText += "#L" + i + "#" + jobs[i][0] + "\r\n";
            }
            cm.sendSimple(sText);
          } else {
            cm.sendOk("你还没到满级, 无法转生！");
            cm.dispose();
          }
        } else if (selection == 1) {
          cm.sendOk("好的,再见");
          cm.dispose();
        }
        break;
      case 3:
        var jobId = jobs[selection][1];
        var player = cm.getChar();

        // 重置技能
        try {
          var skillList = player.getSkills();
          for (var skill in skillList) {
            player.changeSkillLevel(skill, 0, 0, 0);
          }

          for (var i = 0; i < 10; ++i) {
            player.gainSp(-99999999, i, false);
          }
        } catch (e) {
          cm.sendOk("重置技能失败: " + e.message);
          cm.dispose();
          break;
        }

        // 重置属性点
        try {
          player.setStr(4); // 初始力量
          player.setDex(4); // 初始敏捷
          player.setInt(4); // 初始智力
          player.setLuk(4); // 初始运气
          player.setRemainingAp((cm.getChar().getReborns() + 1) * 50); // 每重生一次返还50属性点
        } catch (e) {
          cm.sendOk("重置属性点失败: " + e.message);
          cm.dispose();
          break;
        }

        // 设置HP和MP
        try {
          player.updateHpMaxHp(50, 50);
          player.updateMpMaxMp(50, 50);
        } catch (e) {
          cm.sendOk("重置HP/MP失败: " + e.message);
          cm.dispose();
          break;
        }

        // 执行转生
        try {
          player.executeRebornAsId(jobId);
          cm.sendOk(
            "转生成功！等级、属性点和技能已重置！一共转生了#r" +
              player.getReborns() +
              "#k次！"
          );
        } catch (e) {
          cm.sendOk("转生过程中出现错误，请重试。");
        }

        cm.dispose();
        break;
    }
  } catch (e) {
    cm.sendOk("转生过程中出现未知错误，请重试。");
    cm.dispose();
  }
}
