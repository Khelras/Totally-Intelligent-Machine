import 'dotenv/config';

// Bot Config Type
type BotConfig = {
    token: string; // Token to the Discord Bot Application
    clientID: string; // Client ID of the Discord Bot
    guildID: string; // Primary Guild ID
}

// Function to get a Value from a provided Key in the dotenv file
function requireEnv(key: string): string {
    // Get the Value based on the Provided Key
    const value: string | undefined = process.env[key];

    // Validate the Value
    if (value === undefined || value.trim() === '') { 
        throw new Error(`Missing required environment variable: ${key}`);
    }

    // Return the Value
    return value;
}

// Export the Bot Config
export const config: BotConfig = {
    token: requireEnv('DISCORD_TOKEN'),
    clientID: requireEnv('CLIENT_ID'),
    guildID: requireEnv('GUILD_ID'),
}