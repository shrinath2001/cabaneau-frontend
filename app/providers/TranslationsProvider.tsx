'use client';

import { createContext, useContext, useCallback, ReactNode } from 'react';

type TranslationsContextType = {
  t: (key: string) => string;
  locale: string;
};

const TranslationsContext = createContext<TranslationsContextType | null>(null);

type TranslationsProviderProps = {
  children: ReactNode;
  initialTranslations: Record<string, string>;
  locale: string;
};

export function TranslationsProvider({
  children,
  initialTranslations,
  locale,
}: TranslationsProviderProps) {
  // CMS-managed text only: if the key has no row in the Translations table,
  // render blank rather than a hardcoded fallback or the raw key.
  const t = useCallback(
    (key: string): string => {
      return initialTranslations[key] || '';
    },
    [initialTranslations]
  );

  return (
    <TranslationsContext.Provider value={{ t, locale }}>
      {children}
    </TranslationsContext.Provider>
  );
}

/**
 * Hook to access translations
 * @param namespace Optional namespace prefix to add to all keys
 */
export function useTranslations(namespace?: string) {
  const context = useContext(TranslationsContext);

  if (!context) {
    throw new Error('useTranslations must be used within a TranslationsProvider');
  }

  const { locale } = context;

  const t = useCallback(
    (key: string): string => {
      const fullKey = namespace ? `${namespace}.${key}` : key;
      return context.t(fullKey);
    },
    [context, namespace]
  );

  return { t, locale };
}
