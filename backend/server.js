const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const db = require('./database');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// ==========================================
// Auth Routes
// ==========================================

// Sign Up
app.post('/api/auth/signup', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  // Check if user already exists
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) {
    return res.status(409).json({ error: 'User with this email already exists' });
  }

  const id = uuidv4();
  db.prepare('INSERT INTO users (id, email, password) VALUES (?, ?, ?)').run(id, email, password);

  res.json({ id, email });
});

// Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = db.prepare('SELECT id, email FROM users WHERE email = ? AND password = ?').get(email, password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  res.json(user);
});

// ==========================================
// Subjects Routes
// ==========================================

app.get('/api/subjects/:userId', (req, res) => {
  const subjects = db.prepare('SELECT * FROM subjects WHERE user_id = ?').all(req.params.userId);
  res.json(subjects);
});

app.put('/api/subjects/:userId', (req, res) => {
  const { subjects } = req.body;
  const userId = req.params.userId;

  const upsert = db.prepare(`
    INSERT INTO subjects (id, user_id, name, difficulty, exam_date, total_topics, completed_topics)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      name = excluded.name,
      difficulty = excluded.difficulty,
      exam_date = excluded.exam_date,
      total_topics = excluded.total_topics,
      completed_topics = excluded.completed_topics
  `);

  const runAll = db.transaction((items) => {
    for (const s of items) {
      upsert.run(s.id, userId, s.name, s.difficulty, s.exam_date, s.total_topics, s.completed_topics);
    }
  });

  try {
    runAll(subjects);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// Tasks Routes
// ==========================================

app.get('/api/tasks/:userId', (req, res) => {
  const tasks = db.prepare('SELECT * FROM tasks WHERE user_id = ?').all(req.params.userId);
  // Convert SQLite integer booleans to JS booleans
  const formatted = tasks.map(t => ({ ...t, completed: !!t.completed }));
  res.json(formatted);
});

app.put('/api/tasks/:userId', (req, res) => {
  const { tasks } = req.body;
  const userId = req.params.userId;

  const upsert = db.prepare(`
    INSERT INTO tasks (id, user_id, subject_id, topic_number, scheduled_date, completed, estimated_minutes)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      subject_id = excluded.subject_id,
      topic_number = excluded.topic_number,
      scheduled_date = excluded.scheduled_date,
      completed = excluded.completed,
      estimated_minutes = excluded.estimated_minutes
  `);

  const runAll = db.transaction((items) => {
    for (const t of items) {
      upsert.run(t.id, userId, t.subject_id, t.topic_number, t.scheduled_date, t.completed ? 1 : 0, t.estimated_minutes);
    }
  });

  try {
    runAll(tasks);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// Settings Routes
// ==========================================

app.get('/api/settings/:userId', (req, res) => {
  const settings = db.prepare('SELECT * FROM settings WHERE user_id = ?').get(req.params.userId);
  if (!settings) {
    return res.json(null);
  }
  // Parse custom_holidays from JSON string
  settings.custom_holidays = JSON.parse(settings.custom_holidays || '[]');
  res.json(settings);
});

app.put('/api/settings/:userId', (req, res) => {
  const { settings } = req.body;
  const userId = req.params.userId;
  const holidays = JSON.stringify(settings.custom_holidays || []);

  db.prepare(`
    INSERT INTO settings (user_id, hours_available_per_day, preferred_study_days_per_week, start_date, custom_holidays)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(user_id) DO UPDATE SET
      hours_available_per_day = excluded.hours_available_per_day,
      preferred_study_days_per_week = excluded.preferred_study_days_per_week,
      start_date = excluded.start_date,
      custom_holidays = excluded.custom_holidays
  `).run(userId, settings.hours_available_per_day, settings.preferred_study_days_per_week, settings.start_date, holidays);

  res.json({ success: true });
});

// ==========================================
// Streaks Routes
// ==========================================

app.get('/api/streaks/:userId', (req, res) => {
  const streak = db.prepare('SELECT * FROM streaks WHERE user_id = ?').get(req.params.userId);
  res.json(streak || null);
});

app.put('/api/streaks/:userId', (req, res) => {
  const { streak } = req.body;
  const userId = req.params.userId;

  db.prepare(`
    INSERT INTO streaks (user_id, current_streak, longest_streak, last_study_date)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(user_id) DO UPDATE SET
      current_streak = excluded.current_streak,
      longest_streak = excluded.longest_streak,
      last_study_date = excluded.last_study_date
  `).run(userId, streak.current_streak, streak.longest_streak, streak.last_study_date);

  res.json({ success: true });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n  ✅ Backend server running at http://localhost:${PORT}\n`);
});
