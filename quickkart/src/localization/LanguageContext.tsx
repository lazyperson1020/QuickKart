import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { strings, Language, TranslationSchema } from './strings';

export const LANGUAGE_STORAGE_KEY = 'app_language';

interface LanguageContextValue {
  language: Language;
  t: TranslationSchema;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  language: 'en',
  t: strings.en,
  setLanguage: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    AsyncStorage.getItem(LANGUAGE_STORAGE_KEY).then((saved) => {
      if (saved && saved in strings) {
        setLanguageState(saved as Language);
      }
    });
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  };

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      t: strings[language] ?? strings.en,
      setLanguage,
    }),
    [language],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useTranslation() {
  return useContext(LanguageContext);
}
