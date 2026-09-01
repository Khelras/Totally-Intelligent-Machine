import { readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import type { Client } from 'discord.js';
import type { Command } from '../types/command.js';

const __filename: string = fileURLToPath(import.meta.url);
const __dirname: string = dirname(__filename);

// Helper Function which Recursively Collects Command Files
function collectCommandFiles(dirPath: string): string[] {
    const entries: string[] = readdirSync(dirPath);
    let commandFiles: string[] = [];

    // Loop through each entry in the directory
    for (const entry of entries) {
        const fullPath: string = join(dirPath, entry);

        // It is a category sub-folder 
        if (statSync(fullPath).isDirectory()) {
            // Recurse into it and merge results.
            commandFiles = commandFiles.concat(collectCommandFiles(fullPath));
        }
        // Command file (either .ts or .js)
        else if (entry.endsWith('.ts') || entry.endsWith('.js')) {
            // Add the command file to the list
            commandFiles.push(fullPath);
        }
    }

    return commandFiles;
}

// Load Commands Function
export async function loadCommands(client: Client): Promise<void> {
    const commandsPath: string = join(__dirname, '../commands');
    const commandFiles: string[] = collectCommandFiles(commandsPath);

    // Loop through each command file and import it
    for (const filePath of commandFiles) {
        const commandModule: { default: Command } = await import(`file://${filePath}`);
        const command: Command = commandModule.default;

        // Guard against a malformed command file missing required fields
        if (!command.data || !command.execute) {
            console.warn(`⚠️ Skipping invalid command file: ${filePath}`);
            continue;
        }

        // Add the command to the client's commands collection
        client.commands.set(command.data.name, command);
    }

    console.log(`✅ Loaded ${client.commands.size} command(s).`);
}