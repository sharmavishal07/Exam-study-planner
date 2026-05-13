const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const api = {
  // Auth
  signup: async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Signup failed');
    return data;
  },

  login: async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    return data;
  },

  // Subjects
  getSubjects: async (userId: string) => {
    const res = await fetch(`${API_BASE}/subjects/${userId}`);
    if (!res.ok) throw new Error('Failed to fetch subjects');
    return res.json();
  },

  setSubjects: async (userId: string, subjects: any[]) => {
    const res = await fetch(`${API_BASE}/subjects/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subjects }),
    });
    if (!res.ok) throw new Error('Failed to save subjects');
  },

  // Tasks
  getTasks: async (userId: string) => {
    const res = await fetch(`${API_BASE}/tasks/${userId}`);
    if (!res.ok) throw new Error('Failed to fetch tasks');
    return res.json();
  },

  setTasks: async (userId: string, tasks: any[]) => {
    const res = await fetch(`${API_BASE}/tasks/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tasks }),
    });
    if (!res.ok) throw new Error('Failed to save tasks');
  },

  // Settings
  getSettings: async (userId: string) => {
    const res = await fetch(`${API_BASE}/settings/${userId}`);
    if (!res.ok) throw new Error('Failed to fetch settings');
    return res.json();
  },

  setSettings: async (userId: string, settings: any) => {
    const res = await fetch(`${API_BASE}/settings/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ settings }),
    });
    if (!res.ok) throw new Error('Failed to save settings');
  },

  // Streaks
  getStreak: async (userId: string) => {
    const res = await fetch(`${API_BASE}/streaks/${userId}`);
    if (!res.ok) throw new Error('Failed to fetch streak');
    return res.json();
  },

  setStreak: async (userId: string, streak: any) => {
    const res = await fetch(`${API_BASE}/streaks/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ streak }),
    });
    if (!res.ok) throw new Error('Failed to save streak');
  },
};
