import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    Guild,
    StringSelectMenuBuilder,
} from "discord.js";
import type Client from "../../Client";

export class RowBuilder {
    constructor(private client: Client) {
        this.client = client;
    }

    private buttonSecondary(customId: string) {
        return new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setCustomId(customId);
    }

    choose(endWith: string = "", endWithAccess: string = "") {
        return [
            new ActionRowBuilder<ButtonBuilder>().addComponents(
                this.buttonSecondary(
                    `${endWith === "" ? "access" : `access.${endWith}${endWithAccess}`}`,
                ).setLabel("Принять"),
                this.buttonSecondary(
                    `${endWith === "" ? "cancel" : `cancel.${endWith}`}`,
                ).setLabel("Отклонить"),
            ),
        ];
    }

    sets() {
        const guild = this.client.utils.getGuild() as Guild;

        return [
            new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId("recruitment")
                    .setOptions(
                        this.client.config.set.roles
                            .filter((r) => guild.roles.cache.has(r.role))
                            .map((data) => {
                                const role = guild.roles.cache.get(data.role)!;
                                return {
                                    label: data?.label || role.name,
                                    value: data.role,
                                    description: data?.description,
                                };
                            }),
                    ),
            ),
        ];
    }
}
