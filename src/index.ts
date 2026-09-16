import { client } from './client.js';
import { config } from './config.js';
import { loadCommands } from './handlers/commandHandler.js';
import { loadEvents } from './handlers/eventHandler.js';
import { initializeSchema } from './database/schema.js';

// Main Function
async function main(): Promise<void> {
    // Initialise the Schema into the Database
    initializeSchema();

    // Load and Run all of the Commands and Events
    await loadCommands(client);
    await loadEvents(client);

    // Login to the Client
    await client.login(config.token);
}

// Catch and Log Errors
main().catch((err: unknown): never => {
    console.error('Failed to start bot: ', err);
    process.exit(1);
})