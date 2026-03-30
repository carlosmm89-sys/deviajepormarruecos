import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { translations, TranslationKey } from '../i18n/translations';

export function useTranslation() {
  const { language } = useLanguage();

  const t = useCallback((key: TranslationKey): string => {
    return translations[language][key] || translations['es'][key] || key;
  }, [language]);

  const td = useCallback((record: any, field: string): any => {
    if (!record) return '';
    if (language === 'es') return record[field];
    if (record.translations && record.translations[language] && record.translations[language][field]) {
      return record.translations[language][field];
    }
    return record[field];
  }, [language]);

  return { t, td, currentLanguage: language };
}
