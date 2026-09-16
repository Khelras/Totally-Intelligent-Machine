import { db } from './database.js';

/**
 * Creates all required tables if they don't already exist. Safe to call
 * on every startup — `IF NOT EXISTS` makes this idempotent.
 */
export function initializeSchema(): void {
    // Per-server settings: where and when to post the daily reminder.
    db.exec(`
        CREATE TABLE IF NOT EXISTS guild_config (
            guild_id TEXT PRIMARY KEY,
            reminder_channel_id TEXT NOT NULL,
            reminder_time TEXT NOT NULL,
            timezone TEXT NOT NULL DEFAULT 'UTC'
        );
    `);

    // One row per submission event. A composite index on (user_id, guild_id)
    // speeds up the "has this user submitted today" lookup used by both
    // /submit and the straggler reminder job.
    db.exec(`
        CREATE TABLE IF NOT EXISTS submissions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            guild_id TEXT NOT NULL,
            submission_date TEXT NOT NULL,
            image_url TEXT,
            created_at TEXT NOT NULL DEFAULT (datetime('now')),
            FOREIGN KEY (guild_id) REFERENCES guild_config(guild_id)
        );
    `);
    db.exec(`
        CREATE INDEX IF NOT EXISTS idx_submissions_user_guild
        ON submissions (user_id, guild_id);
    `);

    // Cached streak state per user-per-guild, so /streak and the leaderboard
    // don't need to recompute from the full submissions history each time.
    db.exec(`
        CREATE TABLE IF NOT EXISTS streaks (
            user_id TEXT NOT NULL,
            guild_id TEXT NOT NULL,
            current_streak INTEGER NOT NULL DEFAULT 0,
            best_streak INTEGER NOT NULL DEFAULT 0,
            last_submission_date TEXT,
            PRIMARY KEY (user_id, guild_id),
            FOREIGN KEY (guild_id) REFERENCES guild_config(guild_id)
        );
    `);
}