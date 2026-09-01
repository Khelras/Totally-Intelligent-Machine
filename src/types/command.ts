import type {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    SlashCommandOptionsOnlyBuilder,
    SlashCommandSubcommandsOnlyBuilder
} from 'discord.js';

// SlashCommandData Type to represent the different types of Slash Commands in unison
export type SlashCommandData = SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | SlashCommandOptionsOnlyBuilder;

// Every command file must export an object matching this shape
export type Command = {
    // The metadata of the command (name, description, options, etc.)
    data: SlashCommandData;

    // The function that runs when the command is invoked
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}