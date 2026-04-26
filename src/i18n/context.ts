import { createContext } from 'react';
import { SUPPORTED_LANGUAGES } from './index';
import type { LocaleDictionary } from './index';
import type { LanguageCode } from '../types';

export type I18nContextValue = {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  messages: LocaleDictionary;
  supportedLanguages: typeof SUPPORTED_LANGUAGES;
  locale: string;
  formatMessage: (template: string, values: Record<string, string | number>) => string;
};

export const I18nContext = createContext<I18nContextValue | null>(null);