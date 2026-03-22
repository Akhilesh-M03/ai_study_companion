/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('theme-cyber-dark');

  useEffect(() => {
    document.documentElement.classList.remove(
      'theme-cyber-dark',
      'theme-cyber-light',
      'theme-stream-dark',
      'theme-stream-light'
    );
    document.documentElement.classList.add(theme);
    window.localStorage.setItem('ai-tutor-theme', theme);
  }, [theme]);

  const themes = [
    {
      id: 'theme-cyber-dark',
      name: 'Cyber Dark',
      colors: { bg: '#0F172A', card: '#1E293B', primary: '#2563EB', secondary: '#0F766E' },
    },
    {
      id: 'theme-cyber-light',
      name: 'Cyber Light',
      colors: { bg: '#F8FAFC', card: '#FFFFFF', primary: '#2563EB', secondary: '#0F766E' },
    },
    {
      id: 'theme-stream-dark',
      name: 'Stream Dark',
      colors: { bg: '#111827', card: '#1F2937', primary: '#0EA5E9', secondary: '#0284C7' },
    },
    {
      id: 'theme-stream-light',
      name: 'Stream Light',
      colors: { bg: '#F3F4F6', card: '#FFFFFF', primary: '#0EA5E9', secondary: '#0369A1' },
    },
  ];

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};

