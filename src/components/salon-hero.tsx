import React, { useState } from 'react';
import { ArrowUpRight, ArrowRight, Check, Clock, MapPin, X } from 'lucide-react';
import {
  validateBookingInput,
} from '@/lib/salon-hero-config';

const SALON_SERVICES = [
  'Kids Haircut & Styling - Consultation at salon',
  'Signature Haircut & Blowout Styling — ₹950',
  'French Balayage & Gloss Hair Colour — ₹3,800',
  'Moroccan Argan & Keratin Silk Spa — ₹2,400',
  'Classic Beard Trim & Hot-Towel Grooming — ₹650',
];

const TIME_SLOTS = ['11:00 AM', '01:30 PM', '04:00 PM', '06:30 PM', '08:00 PM'];

export const SalonHero: React.FC = () => {

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
      className="blossom-hero"
    >
      <div className="blossom-hero-inner">
        <div className="blossom-hero-copy">
          <div className="blossom-hero-eyebrow"><span /> YOUR FAMILY. YOUR STYLE. YOUR SALON.</div>
          <h1>A little care.<br />A whole new<br /><em>you.</em><span className="blossom-hero-star" aria-hidden="true">&#10035;</span></h1>
          <p className="blossom-hero-description">Great hair days are for everyone. Discover thoughtful styling, beauty and grooming for women, men and little ones &mdash; all at Blossom.</p>
          <div className="blossom-hero-actions">
            <button type="button" className="blossom-hero-book" onClick={() => { setBookingError(null); setIsBookingOpen(true); }}>Book your appointment <ArrowUpRight size={19} /></button>
            <a href="#services" className="blossom-hero-explore">Explore our products <ArrowRight size={17} /></a>
          </div>
          <div className="blossom-hero-details">
            <span><MapPin size={15} /> Alkapuri &amp; Bhayli, Vadodara</span>
            <span><Clock size={15} /> Daily, 10 AM &ndash; 9 PM</span>
          </div>
          {confirmedBooking && <div role="status" className="blossom-hero-confirmation"><Check size={17} /><span>{confirmedBooking.clientName}, your {confirmedBooking.service} is reserved for {confirmedBooking.timeSlot}.</span><button type="button" onClick={() => setIsBookingOpen(true)}>Modify</button></div>}
        </div>
        <div className="blossom-hero-gallery" aria-label="Styling for women, men and kids">
          <figure className="blossom-portrait blossom-portrait-women">
            <img src="/images/hero-women.jpg" alt="Soft waves and a natural, polished hairstyle" fetchPriority="high" width="900" height="1350" />
            <figcaption><span>01 / WOMEN</span><strong>Express yourself.</strong><span>Hair &middot; Colour &middot; Beauty</span></figcaption>
          </figure>
          <div className="blossom-hero-side">
            <figure className="blossom-portrait blossom-portrait-men">
              <img src="/images/hero-men.jpg" alt="A clean, classic men's hairstyle" width="600" height="900" />
              <figcaption><span>02 / MEN</span><strong>Own your look.</strong><span>Hair &middot; Beard &middot; Grooming</span></figcaption>
            </figure>
            <figure className="blossom-portrait blossom-portrait-kids">
              <img src="/images/hero-kids.jpg" alt="A cheerful child with curly hair and a yellow hair bow" width="600" height="900" />
              <figcaption><span>03 / KIDS</span><strong>Little looks. Big smiles.</strong></figcaption>
            </figure>
          </div>
          <div className="blossom-hero-seal"><span>A LITTLE</span><span className="blossom-seal-flower" aria-hidden="true">&#10035;</span><span>BLOSSOM MAGIC</span></div>
        </div>
        <div className="blossom-hero-bottom"><span>ONE SALON. EVERY GENERATION.</span><p>Precision cuts <i /> Beautiful colour <i /> Personal care</p><a href="#services" aria-label="Discover Blossom products">DISCOVER BLOSSOM <ArrowRight size={15} /></a></div>
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
