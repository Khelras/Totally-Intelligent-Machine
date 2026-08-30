import 'dotenv/config';

function requireEnv(key: string): string {
    // Get the Value based on the Provided Key
    const value = process.env[key];

    // Validate the Value
    if (value === undefined || value.trim() === '') { 
        throw new Error(`Missing required environment variable: ${key}`);
    }

    // Return the Value
    return value;
}

// Export a Config
export const config = {
    token: requireEnv('DISCORD_TOKEN'), // Token to the Discord Bot Application
    clientId: requireEnv('CLIENT_ID'), // Client ID of the Discord Bot
    guildId: requireEnv('GUILD_ID'), // Primary Guild ID
}