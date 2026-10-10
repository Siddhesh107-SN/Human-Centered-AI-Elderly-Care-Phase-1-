import { useState, useEffect, createContext, useContext } from 'react';
import { translations } from '../translations';

const TranslationContext = createContext();

export function TranslationProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('carepulse_lang') || 'en';
  });

  const changeLanguage = (newLang) => {
    if (['en', 'hi', 'mr'].includes(newLang)) {
      setLang(newLang);
      localStorage.setItem('carepulse_lang', newLang);
      document.documentElement.lang = newLang;
    }
  };

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (key, fallback = '') => {
    return translations[lang]?.[key] || translations['en']?.[key] || fallback || key;
  };

  return (
    <TranslationContext.Provider value={{ lang, changeLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  return useContext(TranslationContext);
}
