const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize database
db.initDb();

// ==========================================
// Auth Routes
// ==========================================

// Sign Up
app.post('/api/auth/signup', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  try {
    // Check if user already exists
    const existing = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    const id = uuidv4();
    await db.query('INSERT INTO users (id, email, password) VALUES ($1, $2, $3)', [id, email, password]);

    res.json({ id, email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const user = await db.query('SELECT id, email FROM users WHERE email = $1 AND password = $2', [email, password]);
    if (user.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    res.json(user.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// Subjects Routes
// ==========================================

app.get('/api/subjects/:userId', async (req, res) => {
  try {
    const subjects = await db.query('SELECT * FROM subjects WHERE user_id = $1', [req.params.userId]);
    res.json(subjects.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/subjects/:userId', async (req, res) => {
  const { subjects } = req.body;
  const userId = req.params.userId;

  try {
    for (const s of subjects) {
      await db.query(`
        INSERT INTO subjects (id, user_id, name, difficulty, exam_date, total_topics, completed_topics)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT(id) DO UPDATE SET
          name = EXCLUDED.name,
          difficulty = EXCLUDED.difficulty,
          exam_date = EXCLUDED.exam_date,
          total_topics = EXCLUDED.total_topics,
          completed_topics = EXCLUDED.completed_topics
      `, [s.id, userId, s.name, s.difficulty, s.exam_date, s.total_topics, s.completed_topics]);
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// Tasks Routes
// ==========================================

app.get('/api/tasks/:userId', async (req, res) => {
  try {
    const tasks = await db.query('SELECT * FROM tasks WHERE user_id = $1', [req.params.userId]);
    res.json(tasks.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/tasks/:userId', async (req, res) => {
  const { tasks } = req.body;
  const userId = req.params.userId;

  try {
    for (const t of tasks) {
      await db.query(`
        INSERT INTO tasks (id, user_id, subject_id, topic_number, scheduled_date, completed, estimated_minutes)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT(id) DO UPDATE SET
          subject_id = EXCLUDED.subject_id,
          topic_number = EXCLUDED.topic_number,
          scheduled_date = EXCLUDED.scheduled_date,
          completed = EXCLUDED.completed,
          estimated_minutes = EXCLUDED.estimated_minutes
      `, [t.id, userId, t.subject_id, t.topic_number, t.scheduled_date, t.completed, t.estimated_minutes]);
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// Settings Routes
// ==========================================

app.get('/api/settings/:userId', async (req, res) => {
  try {
    const settings = await db.query('SELECT * FROM settings WHERE user_id = $1', [req.params.userId]);
    if (settings.rows.length === 0) {
      return res.json(null);
    }
    res.json(settings.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/settings/:userId', async (req, res) => {
  const { settings } = req.body;
  const userId = req.params.userId;

  try {
    await db.query(`
      INSERT INTO settings (user_id, hours_available_per_day, preferred_study_days_per_week, start_date, custom_holidays)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT(user_id) DO UPDATE SET
        hours_available_per_day = EXCLUDED.hours_available_per_day,
        preferred_study_days_per_week = EXCLUDED.preferred_study_days_per_week,
        start_date = EXCLUDED.start_date,
        custom_holidays = EXCLUDED.custom_holidays
    `, [userId, settings.hours_available_per_day, settings.preferred_study_days_per_week, settings.start_date, JSON.stringify(settings.custom_holidays)]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// Streaks Routes
// ==========================================

app.get('/api/streaks/:userId', async (req, res) => {
  try {
    const streak = await db.query('SELECT * FROM streaks WHERE user_id = $1', [req.params.userId]);
    res.json(streak.rows[0] || null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/streaks/:userId', async (req, res) => {
  const { streak } = req.body;
  const userId = req.params.userId;

  try {
    await db.query(`
      INSERT INTO streaks (user_id, current_streak, longest_streak, last_study_date)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT(user_id) DO UPDATE SET
        current_streak = EXCLUDED.current_streak,
        longest_streak = EXCLUDED.longest_streak,
        last_study_date = EXCLUDED.last_study_date
    `, [userId, streak.current_streak, streak.longest_streak, streak.last_study_date]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// Notes Routes
// ==========================================

app.get('/api/notes/:userId', async (req, res) => {
  try {
    const notes = await db.query('SELECT * FROM notes WHERE user_id = $1 ORDER BY last_updated DESC', [req.params.userId]);
    res.json(notes.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/notes/:userId', async (req, res) => {
  const { note } = req.body;
  const userId = req.params.userId;

  try {
    const id = note.id || uuidv4();
    await db.query(`
      INSERT INTO notes (id, user_id, subject_id, title, content)
      VALUES ($1, $2, $3, $4, $5)
    `, [id, userId, note.subject_id, note.title, note.content]);
    res.json({ id, success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/notes/:userId/:noteId', async (req, res) => {
  const { note } = req.body;
  const userId = req.params.userId;
  const noteId = req.params.noteId;

  try {
    await db.query(`
      UPDATE notes 
      SET title = $1, content = $2, subject_id = $3, last_updated = CURRENT_TIMESTAMP
      WHERE id = $4 AND user_id = $5
    `, [note.title, note.content, note.subject_id, noteId, userId]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/notes/:userId/:noteId', async (req, res) => {
  try {
    await db.query('DELETE FROM notes WHERE id = $1 AND user_id = $2', [req.params.noteId, req.params.userId]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`\n  ✅ Backend server running at http://localhost:${PORT}\n`);
});
