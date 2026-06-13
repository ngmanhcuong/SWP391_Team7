import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeMode = 'light' | 'dark';

export const normalizeThemeMode = (mode?: string): ThemeMode =>
  mode === 'dark' ? 'dark' : 'light';

export const applyThemeToDocument = (mode: ThemeMode) => {
  if (typeof document === 'undefined') return;

  const isDark = mode === 'dark';
  document.documentElement.classList.toggle('dark', isDark);
  document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
};

interface ThemeState {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'light',
      setMode: (mode) => {
        const normalized = normalizeThemeMode(mode);
        applyThemeToDocument(normalized);
        set({ mode: normalized });
      },
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        const normalized = normalizeThemeMode(state.mode);
        if (normalized !== state.mode) {
          state.mode = normalized;
        }
        applyThemeToDocument(normalized);
      },
    },
  ),
);

export const initTheme = () => {
  try {
    const raw = localStorage.getItem('theme-storage');
    if (!raw) {
      applyThemeToDocument('light');
      return;
    }
    const parsed = JSON.parse(raw) as { state?: { mode?: string } };
    applyThemeToDocument(normalizeThemeMode(parsed.state?.mode));
  } catch {
    applyThemeToDocument('light');
  }
};
