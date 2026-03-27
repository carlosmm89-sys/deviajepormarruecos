import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'es' | 'en' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('es');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load persisted language from localStorage
    const saved = localStorage.getItem('app_language') as Language;
    if (saved && ['es', 'en', 'fr'].includes(saved)) {
      setLanguageState(saved);
    } else {
      // Auto-detect browser language if none saved
      const browserLang = navigator.language.split('-')[0];
      if (['es', 'en', 'fr'].includes(browserLang)) {
        setLanguageState(browserLang as Language);
      }
    }
    setIsLoading(false);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('app_language', lang);
    document.documentElement.lang = lang; // Accessibility update
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isLoading }}>
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
