import { Collection } from "discord.js";

export default class Cache {
    static recruitment: Collection<string, string> = new Collection<string, string> ();
}