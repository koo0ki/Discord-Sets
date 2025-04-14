import type { GuildMember, ImageSize, User } from "discord.js";
import type Client from "../Client";

export class Utils {
    private client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    toCode(txt: any) {
        return "```fix\n" + txt + "```";
    }

    getGuild() {
        return this.client.guilds.cache.get(this.client.config.system.guildId);
    }

    getAvatar(member: GuildMember | User, size: ImageSize = 4096) {
        return member.displayAvatarURL({
            extension: "png",
            forceStatic: false,
            size: size,
        });
    }

    isAllowed(member: GuildMember) {
        return member.roles.cache.some((r) =>
            this.client.config.roles.allowed.includes(r.id),
        );
    }
}
