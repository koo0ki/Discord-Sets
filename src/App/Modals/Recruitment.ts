import { MessageFlags, ModalSubmitInteraction, TextChannel } from "discord.js";
import { BaseComponent } from "../../Struct/Base/BaseComponent";
import type Client from "../../Struct/Client";

export default new BaseComponent(
    {
        name: "recruitment",
    },
    async (client: Client, modal: ModalSubmitInteraction<"cached">) => {
        const roleId = modal.customId.split(":")[1]!;

        const data = client.config.set.roles.find((r) => r.role === roleId);
        if (!data) {
            return modal.reply({
                content: "Неизвестный набор",
                flags: MessageFlags.Ephemeral,
            });
        }

        const role = modal.guild.roles.cache.get(data.role);
        if (!role) {
            return modal.reply({
                content: "Неизвестная роль",
                flags: MessageFlags.Ephemeral,
            });
        }

        if (modal.member.roles.cache.has(roleId)) {
            return modal.reply({
                embeds: [
                    client.storage.embeds.default(
                        modal.member,
                        "Набор",
                        `Вы **уже** стоите на ветке <@&${roleId}>`,
                    ),
                ],
                flags: MessageFlags.Ephemeral,
            });
        }

        const log = modal.guild.channels.cache.get(
            data?.log || client.config.set.defaultAuditLogId,
        ) as TextChannel;
        if (!log) {
            return modal.reply({
                content: "Нет канала логов",
                flags: MessageFlags.Ephemeral,
            });
        }

        const dateJoined = Math.trunc(
            (modal.member.joinedTimestamp ?? Date.now()) / 1000,
        );

        await log.send({
            embeds: [
                client.storage.embeds
                    .color()
                    .setAuthor({
                        name: `${modal.user.username}`,
                        iconURL: client.utils.getAvatar(modal.user),
                    })
                    .setTitle(
                        data?.modalLabel || `Заявка на должность ${role.name}`,
                    )
                    .setDescription(
                        `Пользователь: ${modal.member.toString()}` +
                            "\n" +
                            `ID: **${modal.user.id}**` +
                            "\n" +
                            `Присоеденился: <t:${dateJoined}:f> (<t:${dateJoined}:R>)`,
                    )
                    .addFields(
                        data.question.map((id) => {
                            const question = client.config.set.questions.find(
                                (f) => f.custom_id === id,
                            )!;
                            return {
                                name: `> ${question.embed}:`,
                                value: client.utils.toCode(
                                    modal.fields.getTextInputValue(id),
                                ),
                            };
                        }),
                    ),
            ],
            components: client.storage.rows.choose(
                `SetRecruitment:${modal.user.id}:${roleId}`,
            ),
        });

        return modal.reply({
            embeds: [
                client.storage.embeds.default(
                    modal.member,
                    "Набор",
                    `Вы **успешно** отправили **заявку** на должность <@&${roleId}>`,
                ),
            ],
            flags: MessageFlags.Ephemeral,
        });
    },
);
