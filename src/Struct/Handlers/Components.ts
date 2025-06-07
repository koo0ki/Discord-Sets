import fs from "fs";
import type Client from "../Client";
import type { IComponentOptions } from "../Base/BaseComponent";
import { Collection } from "discord.js";

export type component = "Buttons" | "Modals" | "Menus";

export interface IComponent {
    options: IComponentOptions;
    run: (client: Client, ...args: any[]) => Promise<any>;
}

export class Components {
    public cache = new Collection<string, IComponent>();

    constructor(
        private client: Client,
        private type: component,
    ) {
        this.client = client;
        this.type = type;

        this.init();
    }

    async init() {
        try {
            const files = fs
                .readdirSync(`${__dirname}/../../App/${this.type}`)
                .filter((f) => f.endsWith(".ts"));

            for (let i = 0; i < files.length; i++) {
                const component = (
                    await import(
                        `${__dirname}/../../App/${this.type}/${files[i]}`
                    )
                ).default;

                this.cache.set(component.options.name, component);
            }
        } catch {
            this.client.logger.error(`Failed to load ${this.type}`);
        }
    }
}
