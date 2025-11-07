import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'app-theme-mode';

const ThemeModeContext = createContext({
  mode: 'dark',
  toggleColorMode: () => {},
  setMode: () => {},
});

export const ThemeModeProvider = ({ children }) => {
  const getInitialMode = () => {
    if (typeof window === 'undefined') {
      return 'dark';
    }
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const [mode, setMode] = useState(getInitialMode);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, mode);
    document.documentElement.dataset.themeMode = mode;
  }, [mode]);

  const toggleColorMode = useCallback(() => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const value = useMemo(
    () => ({
      mode,
      toggleColorMode,
      setMode,
    }),
    [mode, toggleColorMode],
  );

  return <ThemeModeContext.Provider value={value}>{children}</ThemeModeContext.Provider>;
};

export const useThemeMode = () => useContext(ThemeModeContext);
