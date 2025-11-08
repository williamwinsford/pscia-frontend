'use client';

import { useI18n } from '@/contexts/I18nContext';
import { Locale, localeNames, localeFlags } from '@/i18n/config';

export function useLanguage() {
  const { locale, changeLocale, t } = useI18n();

  const languages = ['pt', 'en', 'es'] as const;

  return {
    locale,
    currentLanguage: localeNames[locale],
    currentFlag: localeFlags[locale],
    changeLanguage: changeLocale,
    languages: languages.map(lang => ({
      code: lang,
      name: localeNames[lang],
      flag: localeFlags[lang]
    })),
    t
  };
}

