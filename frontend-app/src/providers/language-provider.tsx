'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { appLanguages, defaultLanguage, type AppLanguage } from '@/utils/languages';
import { LANGUAGE_STORAGE_KEY } from '@/constants/strings';

type LanguageContextValue = {
  language: AppLanguage;
  setLanguage: (code: string) => void;
  languages: AppLanguage[];
};

const LanguageContext = createContext<LanguageContextValue>({
  language: defaultLanguage,
  setLanguage: () => undefined,
  languages: appLanguages,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [languageCode, setLanguageCode] = useState(defaultLanguage.code);

  useEffect(() => {
    const saved =
      typeof window !== 'undefined' ? window.localStorage.getItem(LANGUAGE_STORAGE_KEY) : null;
    if (saved && appLanguages.some((item) => item.code === saved)) {
      setLanguageCode(saved);
    }
  }, []);

  const value = useMemo(() => {
    const language =
      appLanguages.find((item) => item.code === languageCode) ?? defaultLanguage;

    return {
      language,
      languages: appLanguages,
      setLanguage: (code: string) => {
        setLanguageCode(code);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(LANGUAGE_STORAGE_KEY, code);
        }
      },
    };
  }, [languageCode]);

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
