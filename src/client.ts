import { Client, GatewayIntentBits } from 'discord.js';

// Export the Client
export const client: Client = new Client({
    // Intentions of the Client
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
    ]
});