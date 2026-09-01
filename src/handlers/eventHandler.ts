import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import type { Client, ClientEvents } from 'discord.js';

// File and Directory Names
const __filename: string = fileURLToPath(import.meta.url);
const __dirname: string = dirname(__filename);

// Event Modules Type
export type EventModule<Name extends keyof ClientEvents = keyof ClientEvents> = {
    name: Name, // Event Type (uses the 'Events' enum from 'discord.js')
    once: boolean, // Listened to once or repeated
    execute(...args: ClientEvents[Name]): void | Promise<void>; // Execute function
}

// Load Events Function
export async function loadEvents(client: Client) {
    // Get the Event Paths and Files (filtered to only '.ts' and '.js' Files)
    const eventsPath: string = join(__dirname, '../events');
    const eventFiles: string[] = readdirSync(eventsPath).filter((file) => file.endsWith('.ts') || file.endsWith('.js'));
    
    // Loop through each Event File
    for (const file of eventFiles) {
        // Final File Path and the Event Module itself
        const filePath: string = join(eventsPath, file);
        const eventModule: { default: EventModule } = await import(`file://${filePath}`);
        const event: EventModule = eventModule.default;
        
        // Check if the Event is only listened to once or not
        if (event.once == true) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        }
    }
}