import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useColorScheme } from 'react-native';
import { AppState, UserSettings } from '../utils/types';
import { StorageService } from '../utils/storage';

interface ThemeContextType {
  isDark: boolean;
  reduceMotion: boolean;
  settings: UserSettings;
  appState: AppState;
  toggleFavorite: (planId: string) => Promise<void>;
  updateSettings: (settings: Partial<UserSettings>) => Promise<void>;
  refreshState: () => Promise<void>;
  colors: typeof import('../utils/constants').Colors.light;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [appState, setAppState] = useState<AppState>({
    settings: {
      name: '健身达人',
      dailyReminder: true,
      reminderTime: '08:00',
      restDuration: 30,
      soundEnabled: true,
      voiceEnabled: false,
      darkMode: 'system',
      reduceMotion: false,
      weeklyGoal: 4,
    },
    records: [],
    favorites: [],
    currentStreak: 0,
    lastWorkoutDate: null,
  });
  const [loaded, setLoaded] = useState(false);

  const isDark =
    appState.settings.darkMode === 'system'
      ? systemScheme === 'dark'
      : appState.settings.darkMode === 'dark';

  const loadState = useCallback(async () => {
    const state = await StorageService.loadState();
    setAppState(state);
    setLoaded(true);
  }, []);

  useEffect(() => {
    loadState();
  }, [loadState]);

  const toggleFavorite = async (planId: string) => {
    await StorageService.toggleFavorite(planId);
    await loadState();
  };

  const updateSettings = async (settings: Partial<UserSettings>) => {
    await StorageService.updateSettings(settings);
    await loadState();
  };

  const colors = isDark
    ? require('../utils/constants').Colors.dark
    : require('../utils/constants').Colors.light;

  if (!loaded) return null;

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        reduceMotion: appState.settings.reduceMotion,
        settings: appState.settings,
        appState,
        toggleFavorite,
        updateSettings,
        refreshState: loadState,
        colors,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
