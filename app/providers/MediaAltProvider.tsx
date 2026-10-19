'use client';

import { createContext, useCallback, useContext, ReactNode } from 'react';
import { lookupAlt, type MediaAltMap } from '../lib/mediaAlt';

const MediaAltContext = createContext<MediaAltMap>({});

export function MediaAltProvider({ children, altMap }: { children: ReactNode; altMap: MediaAltMap }) {
  return <MediaAltContext.Provider value={altMap}>{children}</MediaAltContext.Provider>;
}

/**
 * Returns a function that gives the media library's alt text for an image
 * URL, or the fallback (usually the item's title) when none is set.
 */
export function useMediaAlt() {
  const altMap = useContext(MediaAltContext);
  return useCallback((src: string | undefined | null, fallback: string) => lookupAlt(altMap, src, fallback), [altMap]);
}
