'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { theme } from '../styles/themes';
import { GlobalStyles } from '../styles/GlobalStyles';

type ThemeType = 'dark';

interface ThemeContextType {
  currentTheme: ThemeType;
  setCurrentTheme: (theme: ThemeType) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  currentTheme: 'dark',
  setCurrentTheme: () => {},
});

export const useAppTheme = () => useContext(ThemeContext);

export default function AppThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentTheme, setCurrentTheme] = useState<ThemeType>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Always force dark class on HTML root element for Tailwind components (if any remain)
  useEffect(() => {
    if (!mounted) return;
    const root = window.document.documentElement;
    root.classList.add('dark');
    root.style.colorScheme = 'dark';
  }, [mounted]);
 
  return (
    <ThemeContext.Provider value={{ currentTheme, setCurrentTheme }}>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        {mounted ? children : <div style={{ visibility: 'hidden' }}>{children}</div>}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}
