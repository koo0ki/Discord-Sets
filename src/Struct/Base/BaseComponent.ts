import type Client from "../Client";

export interface IComponentOptions {
    name: string;
}

export class BaseComponent {
    public options: IComponentOptions;
    public run: (client: Client, ...args: any[]) => Promise<any>;

    constructor(
        options: IComponentOptions,
        run: (client: Client, ...args: any[]) => Promise<any>,
    ) {
        this.options = options;
        this.run = run;
    }
}
