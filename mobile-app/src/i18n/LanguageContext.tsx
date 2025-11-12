import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { translations, Language } from './locales';
import * as Localization from 'expo-localization';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, any>) => string;
  availableLanguages: { code: Language; name: string; flag: string }[];
}

const LANGUAGE_STORAGE_KEY = '@pinyourword_language';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Helper function to get nested translation
const getNestedTranslation = (obj: any, path: string): string => {
  const keys = path.split('.');
  let result = obj;
  
  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = result[key];
    } else {
      return path; // Return key if translation not found
    }
  }
  
  return typeof result === 'string' ? result : path;
};

// Helper function to replace parameters in translation
const replaceParams = (text: string, params?: Record<string, any>): string => {
  if (!params) return text;
  
  let result = text;
  Object.keys(params).forEach(key => {
    result = result.replace(new RegExp(`{{${key}}}`, 'g'), String(params[key]));
  });
  
  return result;
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('vi');

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (savedLanguage && (savedLanguage === 'vi' || savedLanguage === 'en')) {
        setLanguageState(savedLanguage as Language);
      } else {
        // Detect system language
        const locales = Localization.getLocales();
        const deviceLanguage = locales[0]?.languageCode || 'en';
        const detectedLanguage = deviceLanguage === 'vi' ? 'vi' : 'en';
        setLanguageState(detectedLanguage);
      }
    } catch (error) {
      console.error('Error loading language:', error);
    }
  };

  const setLanguage = async (lang: Language) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
      setLanguageState(lang);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  const t = (key: string, params?: Record<string, any>): string => {
    const translation = getNestedTranslation(translations[language], key);
    return replaceParams(translation, params);
  };

  const availableLanguages = [
    { code: 'vi' as Language, name: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'en' as Language, name: 'English', flag: '🇺🇸' },
  ];

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        availableLanguages,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
