'use client';

import { useEffect, useRef } from 'react';
import DesktopGuestSteppers from './DesktopGuestSteppers';
import type { GuestCounts } from '../search/GuestSteppers';

type GuestField = keyof GuestCounts;

interface DesktopGuestsPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  value: GuestCounts;
  onChange: (field: GuestField, next: number) => void;
  locale: string;
  peopleCap?: number;
  allowDogs?: boolean;
}

/**
 * Airbnb-style Guests dropdown for the desktop booking card - deliberately
 * separate from the dates popover (no calendar in here, no steppers there),
 * matching how Airbnb splits the two.
 */
export default function DesktopGuestsPopover({
  isOpen,
  onClose,
  value,
  onChange,
  locale,
  peopleCap,
  allowDogs,
}: DesktopGuestsPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={popoverRef}
      className="absolute z-50 top-full right-0 mt-2 w-full bg-white shadow-xl border border-gray-200 p-5"
    >
      <DesktopGuestSteppers
        value={value}
        onChange={onChange}
        locale={locale}
        peopleCap={peopleCap}
        allowDogs={allowDogs}
      />
    </div>
  );
}
