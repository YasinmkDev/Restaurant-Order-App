import { useThemeStore } from '../store/theme.store';
import { ThemeTokens } from '../components/ui/theme';

export function useTheme() {
  const mode = useThemeStore((s) => s.mode);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const setMode = useThemeStore((s) => s.setMode);

  const colors = ThemeTokens[mode];
  const isDark = mode === 'dark';

  return {
    mode,
    isDark,
    colors,
    toggleTheme,
    setMode,
  };
}
