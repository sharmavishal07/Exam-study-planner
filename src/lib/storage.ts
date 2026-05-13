import { Subject, StudyTask, StudySettings, StreakData } from './types';
import { api } from './api';

const getUserId = () => localStorage.getItem('custom_user_id');

export const storage = {
  getSubjects: async (): Promise<Subject[]> => {
    const userId = getUserId();
    if (!userId) return [];
    
    try {
      return await api.getSubjects(userId);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      return [];
    }
  },
  
  setSubjects: async (subjects: Subject[]) => {
    const userId = getUserId();
    if (!userId) return;

    try {
      await api.setSubjects(userId, subjects);
    } catch (error) {
      console.error('Error saving subjects:', error);
    }
  },

  getTasks: async (): Promise<StudyTask[]> => {
    const userId = getUserId();
    if (!userId) return [];
    
    try {
      return await api.getTasks(userId);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return [];
    }
  },

  setTasks: async (tasks: StudyTask[]) => {
    const userId = getUserId();
    if (!userId) return;

    try {
      await api.setTasks(userId, tasks);
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  },

  getSettings: async (): Promise<StudySettings> => {
    const userId = getUserId();
    const defaultSettings: StudySettings = {
      hours_available_per_day: 3,
      preferred_study_days_per_week: 5,
      start_date: new Date().toLocaleDateString('en-CA'),
      custom_holidays: [0, 6],
    };

    if (!userId) return defaultSettings;

    try {
      const data = await api.getSettings(userId);
      return data || defaultSettings;
    } catch (error) {
      console.error('Error fetching settings:', error);
      return defaultSettings;
    }
  },

  setSettings: async (settings: StudySettings) => {
    const userId = getUserId();
    if (!userId) return;

    try {
      await api.setSettings(userId, settings);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  },

  getStreak: async (): Promise<StreakData> => {
    const userId = getUserId();
    const defaultStreak: StreakData = { current_streak: 0, longest_streak: 0, last_study_date: null };
    
    if (!userId) return defaultStreak;

    try {
      const data = await api.getStreak(userId);
      return data || defaultStreak;
    } catch (error) {
      console.error('Error fetching streak:', error);
      return defaultStreak;
    }
  },

  setStreak: async (streak: StreakData) => {
    const userId = getUserId();
    if (!userId) return;

    try {
      await api.setStreak(userId, streak);
    } catch (error) {
      console.error('Error saving streak:', error);
    }
  },
};
