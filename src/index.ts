import { client } from './client.js';
import { config } from './config.js';
import { Events } from 'discord.js';

// Main Function
async function main() {
    // Client Ready Event
    await client.once(Events.ClientReady, (c) => {
        console.log(`Ready! Logged in as ${c.user.tag}`)
    });

    // Login to the Client
    await client.login(config.token);
}

// Catch and Log Errors
main().catch((err) => {
    console.error('Failed to start bot: ', err);
    process.exit(1);
})