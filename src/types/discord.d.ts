import type { Collection } from 'discord.js';
import type { Command } from './command.js';

// Declaration Merging: this adds a 'commands' property to every 'Client' instance in the codebase
declare module 'discord.js' {
    interface Client {
        commands: Collection<string, Command>;
    }
}