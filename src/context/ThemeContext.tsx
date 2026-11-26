import React, { createContext, useContext, useState, useEffect } from 'react';

export type ColorTheme = 'blue' | 'green' | 'purple' | 'yellow';
export type ModeTheme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  colorTheme: ColorTheme;
  setColorTheme: (theme: ColorTheme) => void;
  mode: ModeTheme;
  setMode: (mode: ModeTheme) => void;
  isDark: boolean;
  toggleDarkWithWipe: (event?: React.MouseEvent) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [colorTheme, setColorThemeState] = useState<ColorTheme>(() => {
    return (localStorage.getItem('sahaya_color_theme') as ColorTheme) || 'blue';
  });

  const [mode, setModeState] = useState<ModeTheme>(() => {
    return (localStorage.getItem('sahaya_theme') as ModeTheme) || 'light';
  });

  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('sahaya_theme') as ModeTheme;
    if (saved === 'dark') return true;
    if (saved === 'system') {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const applyTheme = (cTheme: ColorTheme, mTheme: ModeTheme) => {
    const root = document.documentElement;

    // Apply color theme class: theme-blue, theme-green, theme-purple, theme-yellow
    root.classList.remove('theme-blue', 'theme-green', 'theme-purple', 'theme-yellow');
    root.classList.add(`theme-${cTheme}`);

    // Apply dark mode
    let dark = false;
    if (mTheme === 'dark') {
      dark = true;
    } else if (mTheme === 'system') {
      dark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    setIsDark(dark);

    if (dark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  const setColorTheme = (newColor: ColorTheme) => {
    setColorThemeState(newColor);
    localStorage.setItem('sahaya_color_theme', newColor);
    applyTheme(newColor, mode);
  };

  const setMode = (newMode: ModeTheme) => {
    setModeState(newMode);
    localStorage.setItem('sahaya_theme', newMode);
    applyTheme(colorTheme, newMode);
  };

  const toggleDarkWithWipe = (event?: React.MouseEvent) => {
    const nextMode: ModeTheme = isDark ? 'light' : 'dark';

    // If browser supports startViewTransition, run circular wipe from click coordinates
    if (typeof document !== 'undefined' && 'startViewTransition' in document && event) {
      const x = event.clientX;
      const y = event.clientY;
      document.documentElement.style.setProperty('--wipe-x', `${x}px`);
      document.documentElement.style.setProperty('--wipe-y', `${y}px`);
      document.documentElement.classList.add('theme-circular-transition');

      const transition = (document as unknown as { startViewTransition: (cb: () => void) => { finished: Promise<void> } }).startViewTransition(() => {
        setModeState(nextMode);
        localStorage.setItem('sahaya_theme', nextMode);
        applyTheme(colorTheme, nextMode);
      });

      transition.finished.finally(() => {
        document.documentElement.classList.remove('theme-circular-transition');
      });
    } else {
      setMode(nextMode);
    }
  };

  useEffect(() => {
    applyTheme(colorTheme, mode);

    if (mode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme(colorTheme, 'system');
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [colorTheme, mode]);

  return (
    <ThemeContext.Provider value={{ colorTheme, setColorTheme, mode, setMode, isDark, toggleDarkWithWipe }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
