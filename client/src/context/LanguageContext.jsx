import React, { createContext, useContext, useState, useEffect } from 'react';
import { LANGUAGES, getTranslation } from './translations';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [currentLang, setCurrentLang] = useState(() => {
    const saved = localStorage.getItem('docutrust_lang');
    if (saved) {
      const match = LANGUAGES.find((l) => l.code === saved);
      if (match) return match;
    }
    return LANGUAGES[0]; // English default
  });

  useEffect(() => {
    localStorage.setItem('docutrust_lang', currentLang.code);
    document.documentElement.lang = currentLang.code;
  }, [currentLang]);

  const t = getTranslation(currentLang.code);

  const setLanguage = (langOrCode) => {
    if (typeof langOrCode === 'string') {
      const found = LANGUAGES.find((l) => l.code === langOrCode);
      if (found) setCurrentLang(found);
    } else if (langOrCode && langOrCode.code) {
      setCurrentLang(langOrCode);
    }
  };

  return (
    <LanguageContext.Provider value={{ currentLang, setLanguage, t, languages: LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    // Fallback if rendered outside provider
    return {
      currentLang: LANGUAGES[0],
      setLanguage: () => {},
      t: getTranslation('en'),
      languages: LANGUAGES,
    };
  }
  return context;
}

export default LanguageContext;
