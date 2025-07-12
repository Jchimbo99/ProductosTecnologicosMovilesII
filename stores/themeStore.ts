import { create } from 'zustand';


interface ThemeState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: 'light',
  toggleTheme: () =>
    set((state: ThemeState) => ({
      theme: state.theme === 'light' ? 'dark' : 'light',
    })),
}));
