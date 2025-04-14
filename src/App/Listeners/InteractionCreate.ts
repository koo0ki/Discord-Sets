import { Events, TextChannel, type Interaction } from "discord.js";
import { BaseEvent } from "../../Struct/Base/BaseEvent";
import type Client from "../../Struct/Client";
import type { IComponent } from "../../Struct/Handlers/Components";

export default new BaseEvent(
    {
        name: Events.InteractionCreate,
    },
    async (client: Client, interaction: Interaction<"cached">) => {
        if (interaction.isButton()) {
            const button =
                client.components.buttons.cache.get(interaction.customId) ||
                client.components.buttons.cache.find((c: IComponent) =>
                    interaction.customId.startsWith(c.options.name),
                );

            if (button) {
                await button.run(client, interaction);
            }
        } else if (interaction.isStringSelectMenu()) {
            const menu =
                client.components.menus.cache.get(interaction.customId) ||
                client.components.menus.cache.find((c: IComponent) =>
                    interaction.customId.startsWith(c.options.name),
                );

            if (menu) {
                await menu.run(client, interaction);
            }
        } else if (interaction.isModalSubmit()) {
            const modal =
                client.components.modals.cache.get(interaction.customId) ||
                client.components.modals.cache.find((c: IComponent) =>
                    interaction.customId.startsWith(c.options.name),
                );

            if (modal) {
                await modal.run(client, interaction);
            }
        }
    },
);
