const path = require('path');
require('dotenv').config({ path: '../.env' });

const dbUrl = process.env.DATABASE_URL;
let isPostgres = false;
let pgPool = null;
let sqliteDb = null;

// Determine if we should use Supabase (Postgres) or local SQLite
if (dbUrl && dbUrl.startsWith('postgres://') && !dbUrl.includes('[YOUR-PASSWORD]')) {
  const { Pool } = require('pg');
  pgPool = new Pool({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false } // Required for external Supabase connections
  });
  isPostgres = true;
} else {
  const Database = require('better-sqlite3');
  const dbPath = path.join(__dirname, 'data.db');
  sqliteDb = new Database(dbPath);
}

const initDb = async () => {
  const schema = `
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS subjects (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        difficulty TEXT NOT NULL,
        exam_date TEXT NOT NULL,
        total_topics INTEGER NOT NULL DEFAULT 0,
        completed_topics INTEGER NOT NULL DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        subject_id TEXT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
        topic_number INTEGER NOT NULL,
        scheduled_date TEXT NOT NULL,
        completed BOOLEAN DEFAULT FALSE,
        estimated_minutes INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS settings (
        user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        hours_available_per_day REAL NOT NULL,
        preferred_study_days_per_week INTEGER NOT NULL,
        start_date TEXT NOT NULL,
        custom_holidays TEXT DEFAULT '[]'
      );

      CREATE TABLE IF NOT EXISTS streaks (
        user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        current_streak INTEGER DEFAULT 0,
        longest_streak INTEGER DEFAULT 0,
        last_study_date TEXT
      );

      CREATE TABLE IF NOT EXISTS notes (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        subject_id TEXT REFERENCES subjects(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        content TEXT,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
  `;

  try {
    if (isPostgres) {
      await pgPool.query(schema);
      console.log("  ✅ Connected to Cloud PostgreSQL (Supabase) Database");
    } else {
      sqliteDb.exec(schema);
      console.log("  ✅ Connected to Local SQLite Database at data.db");
    }
  } catch (err) {
    console.error("  ❌ Database initialization failed:", err);
  }
};

module.exports = {
  query: async (text, params = []) => {
    if (isPostgres) {
      // Postgres natively supports $1, $2, etc.
      // Postgres natively returns rows
      const result = await pgPool.query(text, params);
      return { rows: result.rows, result };
    } else {
      // Convert Postgres syntax $1, $2 to SQLite syntax ?, ?
      const sql = text.replace(/\$\d+/g, '?');
      const stmt = sqliteDb.prepare(sql);
      
      // Convert boolean params to 1/0 for SQLite compatibility if needed, though better-sqlite3 may handle it
      const safeParams = params.map(p => typeof p === 'boolean' ? (p ? 1 : 0) : p);

      if (sql.trim().toUpperCase().startsWith('SELECT')) {
        const rows = stmt.all(safeParams);
        return { rows };
      } else {
        const result = stmt.run(safeParams);
        return { rows: [], result };
      }
    }
  },
  initDb
};
