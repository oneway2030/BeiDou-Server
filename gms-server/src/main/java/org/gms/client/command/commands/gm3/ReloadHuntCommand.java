package org.gms.client.command.commands.gm3;

import org.gms.client.Character;
import org.gms.client.Client;
import org.gms.client.command.Command;
import org.gms.server.timer.HuntTaskAutoPublisher;

public class ReloadHuntCommand extends Command {
    {
        setDescription("重新加载狩猎任务配置并重新发布任务");
    }

    @Override
    public void execute(Client c, String[] params) {
        Character player = c.getPlayer();
        
        try {
            HuntTaskAutoPublisher.getInstance().reload();
            player.dropMessage(5, "狩猎任务配置已重新加载，新任务已发布！");
        } catch (Exception e) {
            player.dropMessage(5, "重新加载狩猎任务配置失败：" + e.getMessage());
        }
    }
}
