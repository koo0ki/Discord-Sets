import { Events, TextChannel } from "discord.js";
import { BaseEvent } from "../../Struct/Base/BaseEvent";
import type Client from "../../Struct/Client";

export default new BaseEvent(
    {
        name: Events.ClientReady,
        once: true,
    },
    async (client: Client) => {
        client.logger.info(`${client.user.username} is inited`);

        const guild = client.utils.getGuild();
        if (guild) {
            const channel = guild.channels.cache.get(
                client.config.channels.sets,
            ) as TextChannel;

            if (!channel) {
                client.logger.error("Set channel not found");
                return process.exit();
            }

            const messages = await channel.messages.fetch();
            messages
                .filter((m) => m.author.id == client.user.id)
                .forEach((m) => {
                    m.delete();
                });

            channel.send({
                embeds: [client.storage.embeds.sets()],
                components: client.storage.rows.sets(),
            });
        } else {
            client.logger.error("Guild not found");
            return process.exit();
        }
    },
);
