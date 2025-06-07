import {
    ActionRowBuilder,
    MessageFlags,
    ModalBuilder,
    TextInputBuilder,
    type StringSelectMenuInteraction,
} from "discord.js";
import { BaseComponent } from "../../Struct/Base/BaseComponent";
import type Client from "../../Struct/Client";

export default new BaseComponent(
    {
        name: "recruitment",
    },
    async (client: Client, menu: StringSelectMenuInteraction<"cached">) => {
        const roleId = menu.values[0];

        const data = client.config.set.roles.find((r) => r.role === roleId);
        if (!data) {
            return menu.reply({
                content: "Неизвестный набор",
                flags: MessageFlags.Ephemeral,
            });
        }

        const role = menu.guild.roles.cache.get(data.role);
        if (!role) {
            return menu.reply({
                content: "Неизвестная роль",
                flags: MessageFlags.Ephemeral,
            });
        }

        if (client.storage.cache.recruitment.has(`${menu.user.id}.${roleId}`)) {
            return menu.reply({
                content: "Вы уже отправили заявку",
                flags: MessageFlags.Ephemeral,
            });
        }

        return menu.showModal(
            new ModalBuilder()
                .setTitle(
                    data?.modalLabel || `Заявка на должность ${role.name}`,
                )
                .setCustomId(`${menu.customId}:${roleId}`)
                .addComponents(
                    data.question.map((q) => {
                        const question = client.config.set.questions.find(
                            (f) => f.custom_id === q,
                        )!;
                        return new ActionRowBuilder<TextInputBuilder>().addComponents(
                            new TextInputBuilder({ ...question }),
                        );
                    }),
                ),
        );
    },
);
