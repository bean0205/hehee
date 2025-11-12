import vi from './vi';
import en from './en';

export const translations = {
  vi,
  en,
};

export type TranslationKeys = typeof vi;
export type Language = keyof typeof translations;
