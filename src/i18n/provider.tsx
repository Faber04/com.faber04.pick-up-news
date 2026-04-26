import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { SUPPORTED_LANGUAGES, formatMessage, getDictionary } from './index';
import type { LocaleDictionary } from './index';
import type { LanguageCode } from '../types';
import { I18nContext } from './context';

const STORAGE_KEY = 'pickUpNews_language';

type I18nContextValue = {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  messages: LocaleDictionary;
  supportedLanguages: typeof SUPPORTED_LANGUAGES;
  locale: string;
  formatMessage: (template: string, values: Record<string, string | number>) => string;
};

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<LanguageCode>(() => {
    const savedLanguage = localStorage.getItem(STORAGE_KEY);
    return savedLanguage === 'en' ? 'en' : 'it';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language;
  }, [language]);

  const messages = useMemo(() => getDictionary(language), [language]);

  const value = useMemo<I18nContextValue>(() => ({
    language,
    setLanguage,
    messages,
    supportedLanguages: SUPPORTED_LANGUAGES,
    locale: messages.language.locale,
    formatMessage,
  }), [language, messages]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};