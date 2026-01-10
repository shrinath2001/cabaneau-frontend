'use client';

interface FlagIconProps {
  code: string;
  className?: string;
  idSuffix?: string; // Unique suffix for SVG clipPath IDs to avoid conflicts
}

/**
 * Renders flag SVG for supported language codes
 * Supports: en (UK), fr (France), de (Germany), nl (Netherlands)
 */
export const FlagIcon = ({ code, className = 'w-6 h-4', idSuffix = '' }: FlagIconProps) => {
  switch (code.toLowerCase()) {
    case 'en':
      return (
        <svg className={className} viewBox="0 0 60 30" xmlns="http://www.w3.org/2000/svg">
          <clipPath id={`uk-s${idSuffix}`}><path d="M0,0 v30 h60 v-30 z"/></clipPath>
          <clipPath id={`uk-t${idSuffix}`}><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/></clipPath>
          <g clipPath={`url(#uk-s${idSuffix})`}>
            <path d="M0,0 v30 h60 v-30 z" fill="#012169"/>
            <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
            <path d="M0,0 L60,30 M60,0 L0,30" clipPath={`url(#uk-t${idSuffix})`} stroke="#C8102E" strokeWidth="4"/>
            <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
            <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/>
          </g>
        </svg>
      );

    case 'fr':
      return (
        <svg className={className} viewBox="0 0 3 2" xmlns="http://www.w3.org/2000/svg">
          <rect width="1" height="2" x="0" fill="#002395"/>
          <rect width="1" height="2" x="1" fill="#FFFFFF"/>
          <rect width="1" height="2" x="2" fill="#ED2939"/>
        </svg>
      );

    case 'de':
      return (
        <svg className={className} viewBox="0 0 5 3" xmlns="http://www.w3.org/2000/svg">
          <rect width="5" height="3" y="0" x="0" fill="#000"/>
          <rect width="5" height="2" y="1" x="0" fill="#D00"/>
          <rect width="5" height="1" y="2" x="0" fill="#FFCE00"/>
        </svg>
      );

    case 'nl':
      return (
        <svg className={className} viewBox="0 0 9 6" xmlns="http://www.w3.org/2000/svg">
          <rect width="9" height="2" y="0" fill="#AE1C28"/>
          <rect width="9" height="2" y="2" fill="#FFFFFF"/>
          <rect width="9" height="2" y="4" fill="#21468B"/>
        </svg>
      );

    default:
      // Fallback - show a generic globe icon
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" strokeWidth="2"/>
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" strokeWidth="2"/>
        </svg>
      );
  }
};

/**
 * Get display name for language code
 * Returns native name for dropdown display
 */
export const getLanguageDisplayName = (code: string): string => {
  const names: Record<string, string> = {
    en: 'English',
    fr: 'Français',
    de: 'Deutsch',
    nl: 'Nederlands',
  };
  return names[code.toLowerCase()] || code.toUpperCase();
};

/**
 * Get short display label for language (uppercase code)
 */
export const getLanguageLabel = (code: string): string => {
  return code.toUpperCase();
};
