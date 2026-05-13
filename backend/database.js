const Database = require('better-sqlite3');
const path = require('path');
require('dotenv').config({ path: '../.env' });

const dbPath = path.join(__dirname, 'data.db');
const db = new Database(dbPath);

const initDb = () => {
  try {
    db.exec(`
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
    `);
    console.log("  ✅ Local SQLite database initialized at " + dbPath);
  } catch (err) {
    console.error("  ❌ Database initialization failed:", err);
  }
};

module.exports = {
  query: (text, params = []) => {
    // Convert $1, $2, $3 to ?
    const sql = text.replace(/\$\d+/g, '?');
    const stmt = db.prepare(sql);
    if (sql.trim().toUpperCase().startsWith('SELECT')) {
      const rows = stmt.all(params);
      return { rows };
    } else {
      const result = stmt.run(params);
      return { rows: [], result };
    }
  },
  initDb
};
