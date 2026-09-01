import { client } from './client.js';
import { config } from './config.js';
import { loadEvents } from './handlers/eventHandler.js';

// Main Function
async function main(): Promise<void> {
    // Load and Run all of the Events
    await loadEvents(client);

    // Login to the Client
    await client.login(config.token);
}

// Catch and Log Errors
main().catch((err: unknown): never => {
    console.error('Failed to start bot: ', err);
    process.exit(1);
})