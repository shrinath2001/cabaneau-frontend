"use client";

import { useEffect } from "react";
import { useTranslations } from "@/app/providers/TranslationsProvider";
import DateRangePicker from "./DateRangePicker";

const titleByLocale: Record<string, string> = {
  en: "Select Dates & Guests",
  fr: "Sélectionner les dates et invités",
  de: "Daten und Gäste auswählen",
  nl: "Selecteer data en gasten",
};

interface CabinInfo {
  slug: string;
  name: string;
  lodgifyId: string;
  capacity?: number;
}

interface MobileBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  cabin: CabinInfo;
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialAdults?: number;
  onSave: (params: { checkIn: string; checkOut: string; adults: number }) => void;
}

/**
 * MobileBottomSheet - Slide-up sheet wrapping the custom DateRangePicker.
 * Mirrors DesktopBookingModal behaviour for the mobile layout.
 */
export default function MobileBottomSheet({
  isOpen,
  onClose,
  cabin,
  initialCheckIn,
  initialCheckOut,
  initialAdults = 1,
  onSave,
}: MobileBottomSheetProps) {
  const { locale } = useTranslations();
  const title = titleByLocale[locale] || titleByLocale.en;
  const closeLabel = ({ en: "Close", fr: "Fermer", de: "Schließen", nl: "Sluiten" }[locale]) || "Close";

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = ({
    checkIn,
    checkOut,
    adults,
  }: {
    checkIn: string;
    checkOut: string;
    adults: number;
  }) => {
    onSave({ checkIn, checkOut, adults });
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-[60] lg:hidden"
        onClick={onClose}
      />

      <div className="fixed bottom-0 left-0 right-0 bg-white z-[70] lg:hidden transform transition-transform duration-300 ease-out max-h-[90vh] overflow-hidden flex flex-col">
        {/* Drag handle */}
        <div className="flex justify-center py-3 flex-shrink-0">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-5 pb-3 border-b border-gray-300 flex items-center justify-between flex-shrink-0">
          <h3 className="font-logga font-semibold text-[18px] uppercase text-gray-800">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label={closeLabel}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Picker */}
        <div className="px-5 py-4 overflow-y-auto">
          <DateRangePicker
            slug={cabin.slug}
            locale={locale}
            capacity={cabin.capacity}
            initialCheckIn={initialCheckIn}
            initialCheckOut={initialCheckOut}
            initialAdults={initialAdults}
            enabled={isOpen}
            onConfirm={handleConfirm}
          />
        </div>
      </div>
    </>
  );
}
