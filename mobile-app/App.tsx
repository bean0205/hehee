import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { AuthProvider } from './src/contexts/AuthContext';
import { PinProvider } from './src/contexts/PinContext';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
import { LanguageProvider } from './src/i18n/LanguageContext';
import { BadgeProvider } from './src/contexts/BadgeContext';
import RootNavigator from './src/navigation/RootNavigator';

function AppContent() {
  const { isDarkMode, colors } = useTheme();

  // Custom navigation theme
  const navigationTheme = {
    ...(isDarkMode ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDarkMode ? DarkTheme.colors : DefaultTheme.colors),
      primary: colors.primary.main,
      background: colors.background.main,
      card: colors.background.card,
      text: colors.text.primary,
      border: colors.border.main,
      notification: colors.primary.main,
    },
  };

  return (
    <>
      <NavigationContainer theme={navigationTheme}>
        <RootNavigator />
      </NavigationContainer>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
    </>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LanguageProvider>
        <ThemeProvider>
          <AuthProvider>
            <BadgeProvider>
              <PinProvider>
                <AppContent />
              </PinProvider>
            </BadgeProvider>
          </AuthProvider>
        </ThemeProvider>
      </LanguageProvider>
    </GestureHandlerRootView>
  );
}
