import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark';

interface ThemeState {
  mode: ThemeMode;
  toggleTheme: () => void;
  setMode: (mode: ThemeMode) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'dark', // Default to sleek dark mode
      toggleTheme: () =>
        set((state) => ({ mode: state.mode === 'dark' ? 'light' : 'dark' })),
      setMode: (mode) => set({ mode }),
    }),
    {
      name: 'swift-courier-theme',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
