import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext();

const getInitialTheme = () => {
  if (typeof window === 'undefined') return false;
  
  const saved = localStorage.getItem('kekkon-theme');
  if (saved === 'dark') return true;
  if (saved === 'light') return false;
  
  // Default to light theme instead of following system preference
  return false;
};

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(getInitialTheme);

  const applyTheme = useCallback((dark) => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
      localStorage.setItem('kekkon-theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('kekkon-theme', 'light');
    }
  }, []);

  useEffect(() => {
    applyTheme(isDark);
  }, [isDark, applyTheme]);

  const toggleTheme = useCallback(() => {
    setIsDark(prev => {
      const newValue = !prev;
      applyTheme(newValue);
      return newValue;
    });
  }, [applyTheme]);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
