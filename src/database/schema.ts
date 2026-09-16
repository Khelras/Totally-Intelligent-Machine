import { db } from './database.js';

/**
 * Creates all required tables if they don't already exist. Safe to call
 * on every startup — `IF NOT EXISTS` makes this idempotent.
 */
export function initializeSchema(): void {
    // One row per user, globally — streaks are no longer tied to a guild.
    // last_channel_id/last_guild_id track where to send this user's
    // reminder, automatically updated on every /submit.
    db.exec(`
        CREATE TABLE IF NOT EXISTS streaks (
            user_id TEXT PRIMARY KEY,
            current_streak INTEGER NOT NULL DEFAULT 0,
            best_streak INTEGER NOT NULL DEFAULT 0,
            last_submission_date TEXT,
            last_channel_id TEXT,
            last_guild_id TEXT
        );
    `);

    // Submission history. guild_id is kept here (not just on streaks)
    // since a full log benefits from knowing exactly where each specific
    // submission happened, even if the user's "home channel" later changes.
    db.exec(`
        CREATE TABLE IF NOT EXISTS submissions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            channel_id TEXT NOT NULL,
            guild_id TEXT NOT NULL,
            submission_date TEXT NOT NULL,
            image_url TEXT,
            created_at TEXT NOT NULL DEFAULT (datetime('now')),
            FOREIGN KEY (user_id) REFERENCES streaks(user_id)
        );
    `);
    db.exec(`
        CREATE INDEX IF NOT EXISTS idx_submissions_user
        ON submissions (user_id);
    `);

    // This index is what makes "group reminders by channel" cheap later:
    // a single indexed lookup on streaks.last_channel_id finds everyone
    // whose home channel is a given one.
    db.exec(`
        CREATE INDEX IF NOT EXISTS idx_streaks_last_channel
        ON streaks (last_channel_id);
    `);
}