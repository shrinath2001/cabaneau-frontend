'use client';

import { createContext, useContext, useCallback, ReactNode } from 'react';

type TranslationsContextType = {
  t: (key: string, fallback?: string) => string;
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
  const t = useCallback(
    (key: string, fallback?: string): string => {
      return initialTranslations[key] || fallback || key;
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
    (key: string, fallback?: string): string => {
      const fullKey = namespace ? `${namespace}.${key}` : key;
      return context.t(fullKey, fallback);
    },
    [context, namespace]
  );

  return { t, locale };
}
