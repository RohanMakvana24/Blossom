import React, { useState } from 'react';
import {
  Scissors,
  Sparkles,
  Calendar,
  ChevronDown,
  ChevronUp,
  Layers,
  RotateCcw,
  Check,
  Clock,
  MapPin,
  X,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { Salon3DCanvas } from './salon-3d-canvas';
import {
  SALON_FINISHES,
  SALON_FOCUS_PRESETS,
  getFocusPreset,
  validateBookingInput,
  type SalonFinishId,
  type SalonFocusId,
} from '@/lib/salon-hero-config';

const SALON_SERVICES = [
  'Signature Haircut & Blowout Styling — ₹950',
  'French Balayage & Gloss Hair Colour — ₹3,800',
  'Moroccan Argan & Keratin Silk Spa — ₹2,400',
  'Classic Beard Trim & Hot-Towel Grooming — ₹650',
];

const TIME_SLOTS = ['11:00 AM', '01:30 PM', '04:00 PM', '06:30 PM', '08:00 PM'];

export const SalonHero: React.FC = () => {
  const { theme, resolvedTheme } = useTheme();
  const isDark = theme === 'dark' || resolvedTheme === 'dark';

  // Instant Chair Reservation Modal / Drawer State
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);
  const [clientName, setClientName] = useState<string>('');
  const [selectedService, setSelectedService] = useState<string>(SALON_SERVICES[0]);
  const [selectedSlot, setSelectedSlot] = useState<string>(TIME_SLOTS[2]);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<{
    clientName: string;
    service: string;
    timeSlot: string;
  } | null>(null);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateBookingInput({
      clientName,
      service: selectedService,
      timeSlot: selectedSlot,
    });
    if (!validation.valid) {
      setBookingError(validation.error ?? 'Please fill in all fields.');
      return;
    }
    setBookingError(null);
    setConfirmedBooking({
      clientName: clientName.trim(),
      service: selectedService.split(' — ')[0],
      timeSlot: selectedSlot,
    });
    setIsBookingOpen(false);
  };

  return (
    <section
      id="home"
      aria-label="Blossom Unisex Salon Hero Section"
      className="relative min-h-screen w-full pt-16 overflow-hidden flex items-center bg-background text-foreground transition-colors duration-300"
    >
      {/* Main Split Hero Container */}
      <div className="relative z-10 max-w-[1400px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 items-center gap-8 px-6 md:px-10 py-8 lg:py-12">
        {/* Left Column: Clean Brand Story & Primary Actions (5 cols on desktop) */}
        <div className="lg:col-span-5 flex flex-col items-start justify-center space-y-6 z-20">
          {/* Unboxed Metadata Line */}
          <div className="flex flex-wrap items-center gap-2 text-xs tracking-wide text-muted-foreground">
            <span className="font-semibold text-[#e60073] dark:text-[#ff3b9a]">BLOSSOM Unisex Salon</span>
            <span aria-hidden="true">·</span>
            <span>Alkapuri &amp; Bhayli, Vadodara</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">10:00 AM – 09:00 PM</span>
          </div>

          {/* Expressive Display Headline */}
          <h1
            className="font-serif font-semibold tracking-tight text-foreground leading-[1.05]"
            style={{
              fontSize: 'clamp(2.5rem, 4.2vw, 4.1rem)',
              textWrap: 'balance',
            }}
          >
            Where Signature Hair Styling Meets{' '}
            <span className="italic font-normal text-[#e60073] dark:text-[#ff3b9a]">
              Modern Elegance.
            </span>
          </h1>

          {/* Clean Salon Body Copy */}
          <p className="text-base leading-relaxed text-muted-foreground max-w-[52ch]">
            Welcome to Blossom Unisex Salon in Vadodara — your destination for precision haircuts,
            dimensional hair colour, keratin smoothing, and signature bridal &amp; grooming care.
          </p>

          {/* Primary & Secondary CTA Row */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => {
                setBookingError(null);
                setIsBookingOpen(true);
              }}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#1d072c] to-[#e60073] text-white text-sm font-semibold tracking-tight hover:opacity-95 transition-opacity cursor-pointer whitespace-nowrap shrink-0 shadow-[0_4px_18px_rgba(230,0,115,0.28)]"
            >
              Book Appointment
            </button>

            <a
              href="#services"
              className="px-5 py-3 rounded-xl border border-border bg-background hover:bg-muted text-foreground text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
            >
              <Sparkles className="w-4 h-4 text-[#e60073] dark:text-[#ff3b9a]" />
              <span>Our Products</span>
            </a>
          </div>

          {/* Confirmed Reservation Readout or Clean Salon Proof */}
          {confirmedBooking ? (
            <div
              role="status"
              className="w-full p-3.5 rounded-xl border border-[#e60073]/40 bg-[#e60073]/10 text-xs flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Check className="w-4 h-4 text-[#e60073] dark:text-[#ff3b9a] shrink-0" />
                <div className="truncate">
                  <span className="font-semibold text-foreground">{confirmedBooking.clientName}</span>
                  <span className="text-muted-foreground"> · {confirmedBooking.service} at </span>
                  <span className="font-mono tabular-nums font-medium text-foreground">
                    {confirmedBooking.timeSlot}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsBookingOpen(true)}
                className="text-xs font-medium underline text-foreground hover:opacity-80 shrink-0 cursor-pointer"
              >
                Modify
              </button>
            </div>
          ) : (
            <div className="w-full pt-4 border-t border-border grid grid-cols-3 gap-4 text-left">
              <div>
                <div className="text-lg font-mono font-semibold tabular-nums text-foreground">
                  4,800+
                </div>
                <div className="text-xs text-muted-foreground">Happy Clients / Yr</div>
              </div>
              <div>
                <div className="text-lg font-mono font-semibold tabular-nums text-foreground">
                  2 Studios
                </div>
                <div className="text-xs text-muted-foreground">Alkapuri &amp; Bhayli</div>
              </div>
              <div>
                <div className="text-lg font-mono font-semibold tabular-nums text-foreground">
                  4.9 ★
                </div>
                <div className="text-xs text-muted-foreground">Client Rating (1.2k)</div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Salon Showcase Viewport (7 cols on desktop) */}
        <div className="lg:col-span-7 relative w-full h-[380px] sm:h-[480px] lg:h-[600px] flex items-center justify-center">
          <Salon3DCanvas
            finishId="obsidian-gold"
            focusId="overview"
            exploded={false}
            isDark={isDark}
          />
        </div>
      </div>

      {/* Interactive Chair Session Reservation Modal */}
      {isBookingOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-dialog-title"
          className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-black/60"
        >
          <div className="w-full max-w-md rounded-2xl border border-border bg-background text-foreground p-6 shadow-xl space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="booking-dialog-title" className="text-xl font-serif font-semibold">
                  Reserve Your Chair at Blossom Salon
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Complimentary scalp analysis &amp; espresso included with every session.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsBookingOpen(false)}
                aria-label="Close booking dialog"
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-4" noValidate>
              <div>
                <label
                  htmlFor="client-name-input"
                  className="block text-xs font-medium text-foreground mb-1.5"
                >
                  Client Full Name
                </label>
                <input
                  id="client-name-input"
                  type="text"
                  value={clientName}
                  onChange={(e) => {
                    setClientName(e.target.value);
                    if (bookingError) setBookingError(null);
                  }}
                  placeholder="e.g. Aaravsinh Jadeja"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
                />
              </div>

              <div>
                <label
                  htmlFor="salon-service-select"
                  className="block text-xs font-medium text-foreground mb-1.5"
                >
                  Select Signature Service
                </label>
                <select
                  id="salon-service-select"
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
                >
                  {SALON_SERVICES.map((svc) => (
                    <option key={svc} value={svc}>
                      {svc}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <span className="block text-xs font-medium text-foreground mb-1.5">
                  Preferred Time Slot (Today)
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {TIME_SLOTS.map((slot) => {
                    const active = selectedSlot === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-2 px-2.5 rounded-xl border text-xs font-mono tabular-nums font-medium transition-colors cursor-pointer whitespace-nowrap ${
                          active
                            ? 'border-foreground bg-foreground text-background'
                            : 'border-border bg-background text-foreground hover:bg-muted'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>

              {bookingError && (
                <p role="alert" className="text-xs font-medium text-red-500">
                  {bookingError}
                </p>
              )}

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsBookingOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-border text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-foreground text-background text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Confirm Chair Reservation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
