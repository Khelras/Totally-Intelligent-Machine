import { Events, type Client } from 'discord.js';
import type { EventModule } from '../handlers/eventHandler.js';

// Ready Event
const readyEvent: EventModule<Events.ClientReady> = {
    name: Events.ClientReady,
    once: true,
    execute(client: Client<true>): void {
        console.log(`✅ Logged in as ${client.user.tag}`);
    },
};

export default readyEvent;