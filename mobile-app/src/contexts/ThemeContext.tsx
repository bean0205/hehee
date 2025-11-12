import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeMode = 'light' | 'dark' | 'auto';

interface ThemeContextType {
  isDarkMode: boolean;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  colors: typeof lightColors;
}

const lightColors = {
  // Primary - Deep Blue for Travel
  primary: {
    main: '#1E3A8A',
    light: '#3B82F6',
    dark: '#1E40AF',
  },
  
  // Accent - Yellow/Orange for "Want to Go"
  accent: {
    main: '#F59E0B',
    light: '#FCD34D',
    dark: '#D97706',
  },
  
  // Neutrals
  neutral: {
    white: '#FFFFFF',
    gray50: '#F9FAFB',
    gray100: '#F3F4F6',
    gray200: '#E5E7EB',
    gray300: '#D1D5DB',
    gray400: '#9CA3AF',
    gray500: '#6B7280',
    gray600: '#4B5563',
    gray700: '#374151',
    gray800: '#1F2937',
    gray900: '#111827',
    black: '#000000',
  },
  
  // Status Colors
  status: {
    visited: '#10B981', // Green
    wantToGo: '#F59E0B', // Orange/Yellow
    success: '#10B981',
    error: '#EF4444',
  },
  
  // Semantic Colors
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
  
  // Background
  background: {
    main: '#FFFFFF',
    secondary: '#F9FAFB',
    card: '#FFFFFF',
    elevated: '#F3F4F6',
  },
  
  // Text
  text: {
    primary: '#111827',
    secondary: '#6B7280',
    disabled: '#9CA3AF',
    inverse: '#FFFFFF',
  },
  
  // Border
  border: {
    main: '#E5E7EB',
    light: '#F3F4F6',
    dark: '#D1D5DB',
  },
};

const darkColors = {
  // Primary - Lighter blue for dark mode
  primary: {
    main: '#60A5FA',
    light: '#93C5FD',
    dark: '#3B82F6',
  },
  
  // Accent
  accent: {
    main: '#FBBF24',
    light: '#FCD34D',
    dark: '#F59E0B',
  },
  
  // Neutrals - inverted for dark mode
  neutral: {
    white: '#000000',
    gray50: '#0F172A',
    gray100: '#1E293B',
    gray200: '#334155',
    gray300: '#475569',
    gray400: '#64748B',
    gray500: '#94A3B8',
    gray600: '#CBD5E1',
    gray700: '#E2E8F0',
    gray800: '#F1F5F9',
    gray900: '#F8FAFC',
    black: '#FFFFFF',
  },
  
  // Status Colors
  status: {
    visited: '#34D399',
    wantToGo: '#FBBF24',
    success: '#34D399',
    error: '#F87171',
  },
  
  // Semantic Colors
  success: '#34D399',
  error: '#F87171',
  warning: '#FBBF24',
  info: '#60A5FA',
  
  // Background
  background: {
    main: '#0F172A',
    secondary: '#1E293B',
    card: '#1E293B',
    elevated: '#334155',
  },
  
  // Text
  text: {
    primary: '#F8FAFC',
    secondary: '#CBD5E1',
    disabled: '#64748B',
    inverse: '#0F172A',
  },
  
  // Border
  border: {
    main: '#334155',
    light: '#1E293B',
    dark: '#475569',
  },
};

const THEME_STORAGE_KEY = '@pinyourword_theme_mode';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('auto');
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');

  // Load saved theme preference
  useEffect(() => {
    loadThemePreference();
  }, []);

  // Update dark mode when theme mode or system preference changes
  useEffect(() => {
    if (themeMode === 'auto') {
      setIsDarkMode(systemColorScheme === 'dark');
    } else {
      setIsDarkMode(themeMode === 'dark');
    }
  }, [themeMode, systemColorScheme]);

  const loadThemePreference = async () => {
    try {
      const savedMode = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedMode && (savedMode === 'light' || savedMode === 'dark' || savedMode === 'auto')) {
        setThemeModeState(savedMode as ThemeMode);
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    }
  };

  const setThemeMode = async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
      setThemeModeState(mode);
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const toggleTheme = () => {
    const newMode = isDarkMode ? 'light' : 'dark';
    setThemeMode(newMode);
  };

  const colors = isDarkMode ? darkColors : lightColors;

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        themeMode,
        setThemeMode,
        toggleTheme,
        colors,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
