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

interface DesktopBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  cabin: CabinInfo;
  /** Current selection (ISO YYYY-MM-DD) to prefill the picker. */
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialAdults?: number;
  onSave: (params: { arrival: string; departure: string; adults: number }) => void;
}

/**
 * DesktopBookingModal - Centered modal wrapping the custom DateRangePicker.
 *
 * The picker owns selection state and rule enforcement; on confirm we convert
 * the ISO dates to Lodgify URL format (YYYYMMDD) and hand them to onSave.
 */
export default function DesktopBookingModal({
  isOpen,
  onClose,
  cabin,
  initialCheckIn,
  initialCheckOut,
  initialAdults = 1,
  onSave,
}: DesktopBookingModalProps) {
  const { locale } = useTranslations();
  const title = titleByLocale[locale] || titleByLocale.en;

  // Close on Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Lock body scroll while open
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
    onSave({
      arrival: checkIn.replace(/-/g, ""),
      departure: checkOut.replace(/-/g, ""),
      adults,
    });
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-[60] hidden lg:block"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-[70] hidden lg:flex items-center justify-center p-4">
        <div
          className="bg-white shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-300 flex items-center justify-between">
            <h3 className="font-logga font-semibold text-[18px] md:text-[20px] uppercase text-gray-800">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Picker */}
          <div className="px-6 py-4 overflow-y-auto">
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
      </div>
    </>
  );
}
