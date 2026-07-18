import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, UserSettings, WorkoutRecord } from './types';

const STORAGE_KEY = '@home_workout_app_state';

const defaultSettings: UserSettings = {
  name: '健身达人',
  dailyReminder: true,
  reminderTime: '08:00',
  restDuration: 30,
  soundEnabled: true,
  voiceEnabled: false,
  darkMode: 'system',
  reduceMotion: false,
  weeklyGoal: 4,
};

const defaultState: AppState = {
  settings: defaultSettings,
  records: [],
  favorites: [],
  currentStreak: 0,
  lastWorkoutDate: null,
};

export class StorageService {
  static async loadState(): Promise<AppState> {
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEY);
      if (json) {
        const parsed = JSON.parse(json) as Partial<AppState>;
        return {
          ...defaultState,
          ...parsed,
          settings: { ...defaultSettings, ...parsed.settings },
        };
      }
    } catch (e) {
      console.warn('Failed to load state:', e);
    }
    return { ...defaultState };
  }

  static async saveState(state: AppState): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to save state:', e);
    }
  }

  static async addRecord(record: WorkoutRecord): Promise<void> {
    const state = await this.loadState();
    state.records.unshift(record);
    // 更新连续天数
    const today = new Date().toISOString().split('T')[0];
    const lastDate = state.lastWorkoutDate;
    if (lastDate) {
      const last = new Date(lastDate);
      const diff = Math.floor((new Date(today).getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
      if (diff === 1) {
        state.currentStreak += 1;
      } else if (diff > 1) {
        state.currentStreak = 1;
      }
    } else {
      state.currentStreak = 1;
    }
    state.lastWorkoutDate = today;
    await this.saveState(state);
  }

  static async toggleFavorite(planId: string): Promise<boolean> {
    const state = await this.loadState();
    const idx = state.favorites.indexOf(planId);
    if (idx >= 0) {
      state.favorites.splice(idx, 1);
    } else {
      state.favorites.push(planId);
    }
    await this.saveState(state);
    return idx < 0; // true if added
  }

  static async updateSettings(settings: Partial<UserSettings>): Promise<void> {
    const state = await this.loadState();
    state.settings = { ...state.settings, ...settings };
    await this.saveState(state);
  }

  static async getWeeklyStats(): Promise<{ day: string; minutes: number }[]> {
    const state = await this.loadState();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const result = days.map(d => ({ day: d, minutes: 0 }));
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);

    for (const record of state.records) {
      const d = new Date(record.completedAt);
      if (d >= weekStart) {
        const dayIdx = d.getDay();
        result[dayIdx].minutes += Math.floor(record.duration / 60);
      }
    }
    return result;
  }

  static async getTotalStats(): Promise<{ totalWorkouts: number; totalMinutes: number; totalCalories: number }> {
    const state = await this.loadState();
    return state.records.reduce(
      (acc, r) => ({
        totalWorkouts: acc.totalWorkouts + 1,
        totalMinutes: acc.totalMinutes + Math.floor(r.duration / 60),
        totalCalories: acc.totalCalories + r.caloriesBurned,
      }),
      { totalWorkouts: 0, totalMinutes: 0, totalCalories: 0 }
    );
  }
}
