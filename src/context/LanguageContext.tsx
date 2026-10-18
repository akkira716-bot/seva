'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  SupportedLanguage, 
  SUPPORTED_LANGUAGES, 
  translations, 
  TranslationKey, 
  LanguageOption 
} from '@/locales/translations';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  supportedLanguages: LanguageOption[];
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>('en');

  // Load language from localStorage on client-side mount
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('seva_lang') as SupportedLanguage;
      if (savedLang && SUPPORTED_LANGUAGES.some(l => l.code === savedLang)) {
        setLanguageState(savedLang);
      }
    } catch {
      // LocalStorage not available or restricted
    }
  }, []);

  const setLanguage = (newLang: SupportedLanguage) => {
    setLanguageState(newLang);
    try {
      localStorage.setItem('seva_lang', newLang);
      document.documentElement.lang = newLang;
    } catch {
      // Ignore storage errors
    }
  };

  const t = (key: TranslationKey, params?: Record<string, string | number>): string => {
    const langDict = translations[language] || translations.en;
    let text = (langDict as Record<string, string>)[key] || (translations.en as Record<string, string>)[key] || key;

    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramValue));
      });
    }

    return text;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        supportedLanguages: SUPPORTED_LANGUAGES,
        t
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
