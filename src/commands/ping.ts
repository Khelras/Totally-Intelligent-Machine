import { Message, SlashCommandBuilder, type ChatInputCommandInteraction } from 'discord.js';
import type { Command } from '../types/command.js';

// Ping Command
const ping: Command = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Check the bot\'s current latency.'),
    guildOnly: false,
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const { resource } = await interaction.reply({ content: 'Pinging...', withResponse: true  });
        const sent: Message<boolean> | null | undefined = resource?.message;

        // Ensure Sent Message is Valid
        if (!sent) {
            await interaction.editReply('⚠️ Failed to calculate latency.');
            return;
        }

        // Calculate how long it took Discord to receive our reply (Round-trip time).
        const latency: number = sent.createdTimestamp - interaction.createdTimestamp;
        await interaction.editReply(`🏓 Pong! \nLatency: ${latency}ms. \nAPI: ${interaction.client.ws.ping}ms.`);
    },
};

export default ping;