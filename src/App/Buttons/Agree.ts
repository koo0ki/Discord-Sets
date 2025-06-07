import { ButtonInteraction, MessageFlags } from "discord.js";
import { BaseComponent } from "../../Struct/Base/BaseComponent";
import type Client from "../../Struct/Client";

export default new BaseComponent(
    {
        name: "access.SetRecruitment",
    },
    async (client: Client, button: ButtonInteraction<"cached">) => {
        const targetId = button.customId.split(":")[1]!;
        const roleId = button.customId.split(":")[2]!;

        if (!client.utils.isAllowed(button.member)) {
            return button.reply({
                embeds: [
                    client.storage.embeds.default(
                        button.member,
                        "Принятие заявки",
                        `У Вас **нет** прав`,
                    ),
                ],
                flags: MessageFlags.Ephemeral,
            });
        }

        const target = button.guild.members.cache.get(targetId);
        if (!target) {
            return button.reply({
                embeds: [
                    client.storage.embeds.default(
                        button.member,
                        "Принятие заявки",
                        `Пользователя с ID **${targetId}** нет на сервере\n> Вы можете **отклонить** заявку`,
                    ),
                ],
                flags: MessageFlags.Ephemeral,
            });
        }

        await button.message.edit({
            embeds: [
                client.storage.embeds
                    .from(button.message.embeds[0] as any)
                    .setFooter({
                        text: `Принял: ${button.user.username}`,
                        iconURL: client.utils.getAvatar(button.user),
                    })
                    .setTimestamp(),
            ],
            components: [],
        });

        if (
            client.config.roles.staff &&
            !target.roles.cache.has(client.config.roles.staff)
        ) {
            await target.roles.add(client.config.roles.staff).catch(() => {});
        }

        if (!target.roles.cache.has(roleId)) {
            await target.roles.add(roleId).catch(() => {});
        }

        client.storage.cache.recruitment.delete(`${targetId}.${roleId}`);

        return button.reply({
            embeds: [
                client.storage.embeds.default(
                    button.member,
                    "Принятие заявки",
                    `Вы **приняли** заявку ${target ? target.toString() : `пользователя с ID **${targetId}}`} на роль <@&${roleId}>`,
                ),
            ],
            flags: MessageFlags.Ephemeral,
        });
    },
);
