import { collectFiles } from '../utils/fileCollector.js';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import type { Client } from 'discord.js';
import type { Command } from '../types/command.js';

const __filename: string = fileURLToPath(import.meta.url);
const __dirname: string = dirname(__filename);

// Load Commands Function
export async function loadCommands(client: Client): Promise<void> {
    const commandsPath: string = join(__dirname, '../commands');
    const commandFiles: string[] = collectFiles(commandsPath);

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