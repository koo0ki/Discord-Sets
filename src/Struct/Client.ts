import { Client, GatewayIntentBits } from "discord.js";
import { Listeners } from "./Handlers/Listeners";
import { Logger } from "./Helpers/Logger";
import * as Config from "../config";
import { Utils } from "./Helpers/Utils";
import { Embeds } from "./Helpers/Storage/EmbedBuilder";
import { RowBuilder } from "./Helpers/Storage/RowBuilder";
import { Components, type component } from "./Handlers/Components";
import Cache from "./Helpers/Storage/Cache";

export default class extends Client<true> {
    public readonly config = Config;

    constructor() {
        super({
            intents: Object.values(GatewayIntentBits) as GatewayIntentBits[],
        });
    }

    public utils = new Utils(this);
    public logger = new Logger();

    public storage = {
        embeds: new Embeds(this),
        rows: new RowBuilder(this),
        cache: Cache,
    };

    public ls = new Listeners(this);
    public components = {
        buttons: new Components(this, "Buttons"),
        menus: new Components(this, "Menus"),
        modals: new Components(this, "Modals"),
    };

    init() {
        this.ls.init();
        this.login(this.config.system.token);
    }
}
