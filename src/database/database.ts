import Database from 'better-sqlite3';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename: string = fileURLToPath(import.meta.url);
const __dirname: string = dirname(__filename);

// The .sqlite file lives alongside this module, one level up from src once compiled
const dbPath: string = join(__dirname, '../../data.sqlite');

// better-sqlite3 is synchronous by design — no callbacks or promises needed,
// which keeps our command handlers simpler since every DB call just returns.
export const db: Database.Database = new Database(dbPath);

// WAL mode allows concurrent reads while a write is in progress, which
// matters once the cron scheduler and slash commands might touch the
// database around the same moment.
db.pragma('journal_mode = WAL');

// Enforces foreign key constraints (off by default in SQLite for
// historical reasons) — we want submissions/streaks tied to real guilds.
db.pragma('foreign_keys = ON');