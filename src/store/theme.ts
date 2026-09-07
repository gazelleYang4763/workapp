import { create } from 'zustand';
import { ThemeMode, Theme } from '@/types/theme';
import { lightTheme, darkTheme } from '@/config/theme';

interface ThemeStore {
  mode: ThemeMode;
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

const getInitialMode = (): ThemeMode => {
  const saved = localStorage.getItem('themeMode');
  return (saved as ThemeMode) || 'light';
};

const initialMode = getInitialMode();

export const useThemeStore = create<ThemeStore>((set) => ({
  mode: initialMode,
  theme: initialMode === 'light' ? lightTheme : darkTheme,
  
  toggleTheme: () =>
    set((state) => {
      const newMode = state.mode === 'light' ? 'dark' : 'light';
      localStorage.setItem('themeMode', newMode);
      document.documentElement.setAttribute('data-theme', newMode);
      return {
        mode: newMode,
        theme: newMode === 'light' ? lightTheme : darkTheme,
      };
    }),
  
  setTheme: (mode) =>
    set(() => {
      localStorage.setItem('themeMode', mode);
      document.documentElement.setAttribute('data-theme', mode);
      return {
        mode,
        theme: mode === 'light' ? lightTheme : darkTheme,
      };
    }),
}));
