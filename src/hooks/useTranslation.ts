import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { translations, TranslationKey } from '../i18n/translations';

export function useTranslation() {
  const { language } = useLanguage();

  const t = useCallback((key: TranslationKey): string => {
    return translations[language][key] || translations['es'][key] || key;
  }, [language]);

  return { t, currentLanguage: language };
}
