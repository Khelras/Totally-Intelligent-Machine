import { Events, type ChatInputCommandInteraction, type Interaction } from 'discord.js';
import type { EventModule } from '../handlers/eventHandler.js';

const interactionCreateEvent: EventModule<Events.InteractionCreate> = {
    name: Events.InteractionCreate,
    once: false,
    async execute(interaction: Interaction): Promise<void> {
        // Interaction is a union type covering commands, buttons, menus, etc.
        // Checks if the Interaction is a Slash Command
        if (interaction.isChatInputCommand()) {
            // Cast the interaction to a ChatInputCommandInteraction for type safety
            const chatInteraction: ChatInputCommandInteraction = interaction;
            const command = interaction.client.commands.get(chatInteraction.commandName);

            // Command not found in the collection
            if (!command) {
                // Log a warning and return early
                console.warn(`⚠️ No command matching "${chatInteraction.commandName}" was found.`);
                return;
            }

            try {
                // Execute the command's execute function
                await command.execute(chatInteraction);
            } catch (error: unknown) {
                // Error Handling: Log the error and reply to the user
                console.error(`Error executing command "${chatInteraction.commandName}": `, error);

                // Send an ephemeral message to the user indicating that an error occurred
                const errorMessage = { content: 'There was an error executing this command.', ephemeral: true };
                if (chatInteraction.replied || chatInteraction.deferred) {
                    await chatInteraction.followUp(errorMessage);
                } else {
                    await chatInteraction.reply(errorMessage);
                }
            }
        }

    },
};

export default interactionCreateEvent;