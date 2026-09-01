import { REST, Routes, type RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord.js';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { collectFiles } from './utils/fileCollector.js';
import { config } from './config.js';
import type { Command } from './types/command.js';

const __filename: string = fileURLToPath(import.meta.url);
const __dirname: string = dirname(__filename);

async function main(): Promise<void> {
    const commandsPath: string = join(__dirname, 'commands');
    const commandFiles: string[] = collectFiles(commandsPath);

    // Split commands to either be registered globally or for a specific guild based on the command's configuration
    const globalCommands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];
    const guildCommands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];

    // Loop through each command file and import it
    for (const filePath of commandFiles) {
        const commandModule: { default: Command } = await import(`file://${filePath}`);
        const command: Command = commandModule.default;
        const commandJson: RESTPostAPIChatInputApplicationCommandsJSONBody = command.data.toJSON();

        // Separate commands into global or guild based on the command's configuration
        if (command.guildOnly === true) {
            guildCommands.push(commandJson);
        } else {
            globalCommands.push(commandJson);
        }
    }

    const rest: REST = new REST().setToken(config.token);

    // Registering global commands
    console.log(`Registering ${globalCommands.length} global command(s)...`);
    await rest.put(Routes.applicationCommands(config.clientID), { body: globalCommands });

    // Registering guild-only commands if any exist
    if (guildCommands.length > 0) {
        console.log(`Registering ${guildCommands.length} guild-only command(s) to guild ${config.guildID}...`);
        await rest.put(Routes.applicationGuildCommands(config.clientID, config.guildID), { body: guildCommands });
    }

    // Command registration is complete
    console.log('✅ Command registration complete.');
}

// Catch and Log Errors
main().catch((error: unknown): never => {
    console.error('Failed to deploy commands: ', error);
    process.exit(1);
});