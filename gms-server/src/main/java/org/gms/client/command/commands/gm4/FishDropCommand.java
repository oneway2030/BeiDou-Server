package org.gms.client.command.commands.gm4;

import org.gms.client.Character;
import org.gms.client.Client;
import org.gms.client.command.Command;
import org.gms.util.I18nUtil;
import org.gms.util.packets.Fishing;

public class FishDropCommand extends Command {
    {
        setDescription(I18nUtil.getMessage("FishDropCommand.message1"));
    }

    @Override
    public void execute(Client c, String[] params) {
        Character player = c.getPlayer();
        Fishing.getInstance().refreshItemCache(player);
    }
}