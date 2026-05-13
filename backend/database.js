const { Pool } = require('pg');
require('dotenv').config({ path: '../.env' });

// Use the Supabase connection string from .env or a default
const connectionString = process.env.DATABASE_URL || process.env.VITE_SUPABASE_URL?.replace('https://', 'postgres://postgres:[YOUR_PASSWORD]@') + ':5432/postgres';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const initDb = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS subjects (
        id TEXT PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        difficulty TEXT NOT NULL,
        exam_date TEXT NOT NULL,
        total_topics INTEGER NOT NULL DEFAULT 0,
        completed_topics INTEGER NOT NULL DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        subject_id TEXT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
        topic_number INTEGER NOT NULL,
        scheduled_date TEXT NOT NULL,
        completed BOOLEAN DEFAULT FALSE,
        estimated_minutes INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS settings (
        user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        hours_available_per_day REAL NOT NULL,
        preferred_study_days_per_week INTEGER NOT NULL,
        start_date TEXT NOT NULL,
        custom_holidays JSONB DEFAULT '[]'
      );

      CREATE TABLE IF NOT EXISTS streaks (
        user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        current_streak INTEGER DEFAULT 0,
        longest_streak INTEGER DEFAULT 0,
        last_study_date TEXT
      );
    `);
    console.log("  ✅ Database tables initialized");
  } catch (err) {
    console.error("  ❌ Database initialization failed:", err);
  } finally {
    client.release();
  }
};

module.exports = {
  query: (text, params) => pool.query(text, params),
  initDb
};
