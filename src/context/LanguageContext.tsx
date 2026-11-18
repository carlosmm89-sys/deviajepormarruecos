import React, { createContext, useContext, ReactNode } from 'react';
import { langFromPath, localizePath } from '../i18n/urlLang';

export type Language = 'es' | 'en' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

/**
 * El idioma lo marca la URL: /en/... inglés, /fr/... francés, sin prefijo español.
 * Así cada idioma tiene sus propias páginas y Google las indexa por separado.
 */
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const language = (typeof window !== 'undefined' ? langFromPath(window.location.pathname) : 'es') as Language;
  if (typeof document !== 'undefined') document.documentElement.lang = language;

  const setLanguage = (lang: Language) => {
    try { localStorage.setItem('app_language', lang); } catch { /* sin almacenamiento */ }
    if (lang === language) return;
    // Misma página en el otro idioma; se carga entera para que tours, destinos y textos de la base de datos
    // lleguen ya en el nuevo idioma.
    const { pathname, search, hash } = window.location;
    window.location.href = `${localizePath(pathname, lang)}${search}${hash}`;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isLoading: false }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
