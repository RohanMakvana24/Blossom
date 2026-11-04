import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ArrowRight, MapPin, X } from 'lucide-react';
import { whatsappEnquiry } from '@/lib/salon-contact';
import {
  validateBookingInput,
} from '@/lib/salon-hero-config';

const SALON_SERVICES = [
  'Haircut & Styling',
  'Hair Colour & Care',
  'Skin & Facial Care',
  'Makeup',
  'Nail Art',
  'Grooming',
];

export const SalonHero: React.FC = () => {

  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);
  const bookingButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [clientName, setClientName] = useState<string>('');
  const [selectedService, setSelectedService] = useState<string>(SALON_SERVICES[0]);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [bookingError, setBookingError] = useState<string | null>(null);

  useEffect(() => {
    if (!isBookingOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsBookingOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
      bookingButtonRef.current?.focus();
    };
  }, [isBookingOpen]);

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
    window.open(whatsappEnquiry(`Hello Blossom Family Salon, I would like to enquire about an appointment.\nName: ${clientName.trim()}\nService: ${selectedService}\nPreferred date/time: ${selectedSlot.trim()}\nPlease confirm availability.`), '_blank', 'noopener,noreferrer');
    setIsBookingOpen(false);
  };

  return (
    <section
      id="home"
      aria-label="Blossom Family Salon in Rajkot"
      className="blossom-hero"
    >
      <div className="blossom-hero-inner">
        <div className="blossom-hero-copy">
          <div className="blossom-hero-eyebrow"><span /> BLOSSOM FAMILY SALON · RAJKOT</div>
          <h1>A little care.<br />A whole new<br /><em>you.</em><span className="blossom-hero-star" aria-hidden="true">&#10035;</span></h1>
          <p className="blossom-hero-description">Hair, beauty, nail art, makeup and grooming at our Kotecha Circle salon in Rajkot. Get in touch to find the right service for you.</p>
          <div className="blossom-hero-actions">
            <button ref={bookingButtonRef} type="button" className="blossom-hero-book" onClick={() => { setBookingError(null); setIsBookingOpen(true); }}>Enquire on WhatsApp <ArrowUpRight size={19} /></button>
            <a href="#our-services" className="blossom-hero-explore">Explore our services <ArrowRight size={17} /></a>
          </div>
          <div className="blossom-hero-details">
            <span><MapPin size={15} /> Kotecha Circle, Rajkot</span>
            <span>Images are illustrative</span>
          </div>
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
        <div className="blossom-hero-bottom"><span>ONE SALON. EVERY GENERATION.</span><p>Hair <i /> Beauty <i /> Personal care</p><a href="#our-services" aria-label="Discover Blossom services">DISCOVER BLOSSOM <ArrowRight size={15} /></a></div>
      </div>

      {/* WhatsApp appointment enquiry */}
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
                  Enquire at Blossom Family Salon
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Send your preference on WhatsApp. The salon will confirm availability directly.
                </p>
              </div>
              <button
                ref={closeButtonRef}
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
                  Service of interest
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
                <label htmlFor="preferred-time-input" className="block text-xs font-medium text-foreground mb-1.5">
                  Preferred date and time
                </label>
                <input id="preferred-time-input" type="text" value={selectedSlot} onChange={(event) => setSelectedSlot(event.target.value)} placeholder="e.g. Saturday afternoon" className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
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
                  Continue to WhatsApp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
