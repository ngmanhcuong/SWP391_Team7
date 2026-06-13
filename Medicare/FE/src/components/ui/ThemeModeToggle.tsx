import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useThemeStore, type ThemeMode } from '../../store/themeStore';

const OPTIONS: { value: ThemeMode; label: string; icon: React.ReactNode }[] = [
  { value: 'light', label: 'Sáng', icon: <Sun size={16} /> },
  { value: 'dark', label: 'Tối', icon: <Moon size={16} /> },
];

const ThemeModeToggle: React.FC = () => {
  const { mode, setMode } = useThemeStore();

  return (
    <div
      className="inline-flex rounded-2xl border border-gray-200 dark:border-slate-600 bg-gray-100/80 dark:bg-slate-800 p-1 shadow-inner"
      role="group"
      aria-label="Chế độ giao diện"
    >
      {OPTIONS.map((option) => {
        const isActive = mode === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => setMode(option.value)}
            aria-pressed={isActive}
            className={`
              relative flex min-w-[5.5rem] items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200
              ${isActive
                ? 'bg-white dark:bg-slate-700 text-[#1a56db] dark:text-blue-300 shadow-md shadow-blue-500/10'
                : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200'
              }
            `}
          >
            <span className={isActive ? 'text-[#1a56db] dark:text-blue-300' : ''}>{option.icon}</span>
            {option.label}
          </button>
        );
      })}
    </div>
  );
};

export default ThemeModeToggle;
