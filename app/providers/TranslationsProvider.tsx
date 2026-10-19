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

/** Replaces {name} placeholders in a CMS text with the given values. */
function fill(text: string, vars?: Record<string, string | number>): string {
  if (!text || !vars) return text;
  return text.replace(/\{(\w+)\}/g, (match, name) => (name in vars ? String(vars[name]) : match));
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

  // Text with {placeholders}, e.g. tf('daterange.min_stay', { n: 2 })
  const tf = useCallback(
    (key: string, vars?: Record<string, string | number>): string => fill(t(key), vars),
    [t]
  );

  // Singular/plural text: reads `<key>_one` when count is 1, else `<key>_other`.
  // {n} is replaced with the count; extra vars can be passed as well.
  const tn = useCallback(
    (key: string, count: number, vars?: Record<string, string | number>): string =>
      fill(t(count === 1 ? `${key}_one` : `${key}_other`), { n: count, ...vars }),
    [t]
  );

  return { t, tf, tn, locale };
}
