import fs from "fs";
import type Client from "../Client";
import type { IEventsOptions } from "../Base/BaseEvent";

interface IListener {
    options: IEventsOptions;
    run: (client: Client, ...args: any[]) => Promise<any>;
}

export class Listeners {
    private client: Client;
    constructor(client: Client) {
        this.client = client;
    }

    async init() {
        const files = fs
            .readdirSync(`${__dirname}/../../App/Listeners`)
            .filter((f) => f.endsWith(".ts"));

        for (let i = 0; i < files.length; i++) {
            const listener: IListener = (
                await import(`${__dirname}/../../App/Listeners/${files[i]}`)
            ).default;

            if (
                listener &&
                typeof listener === "object" &&
                "options" in listener &&
                typeof listener.run === "function"
            ) {
                this.addListener(listener);
            }
        }
    }

    private addListener(listener: IListener) {
        this.client[listener.options.once ? "once" : "on"](
            listener.options.name,
            (...args) => {
                listener.run(this.client, ...args);
            },
        );
    }
}
