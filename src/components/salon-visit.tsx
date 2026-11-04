import { ArrowUpRight, MapPin, MessageCircle, Phone } from 'lucide-react';
import { SALON_ADDRESS, SALON_MAPS, SALON_PHONE, SALON_TEL, whatsappEnquiry } from '@/lib/salon-contact';

export function SalonVisit() {
  return <section id="visit" aria-labelledby="visit-title" className="bg-[#fffdfd] text-[#2b2029] dark:bg-[#100d12] dark:text-[#f8f1f5]">
    <div className="mx-auto grid max-w-[1440px] lg:grid-cols-[.9fr_1.1fr]">
      <div className="flex flex-col justify-between px-6 py-20 sm:px-10 lg:py-28 lg:pl-12 lg:pr-16">
        <div>
          <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.24em] text-[#a92764] dark:text-[#ff91c5]"><span className="h-px w-10 bg-current" /> Find Blossom</p>
          <h2 id="visit-title" className="mt-10 max-w-xl font-serif text-[clamp(3.5rem,6vw,6.4rem)] leading-[.97] tracking-[-.025em]">Right here <em className="font-normal text-[#af245f] dark:text-[#ff91c5]">in Rajkot.</em></h2>
          <p className="mt-8 max-w-md text-sm leading-7 text-[#6e5967] dark:text-[#d1b9c8]">Find us at Kotecha Circle near University Road. Call or message the salon before visiting to confirm current hours and availability.</p>
        </div>
        <div className="mt-14 flex flex-wrap gap-x-7 gap-y-4 text-sm font-semibold">
          <a href={SALON_TEL} className="inline-flex items-center gap-2 transition-colors hover:text-[#af245f] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#af245f]"><Phone size={16} className="text-[#af245f] dark:text-[#ff91c5]" />{SALON_PHONE}</a>
          <a href={whatsappEnquiry()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 transition-colors hover:text-[#af245f] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#af245f]"><MessageCircle size={16} className="text-[#af245f] dark:text-[#ff91c5]" />WhatsApp us</a>
        </div>
      </div>
      <div className="relative flex min-h-[440px] flex-col justify-end overflow-hidden bg-[#291626] px-6 py-12 text-white sm:px-10 lg:min-h-[590px] lg:px-14 lg:py-16 dark:bg-[#2a1b2a]">
        <div aria-hidden="true" className="absolute -right-16 -top-20 font-serif text-[clamp(14rem,32vw,31rem)] leading-none text-white/[.045]">B</div>
        <div aria-hidden="true" className="absolute left-0 top-0 h-full w-1 bg-[#e60073]" />
        <div className="relative max-w-xl">
          <MapPin size={32} strokeWidth={1.4} className="text-[#ff96c8]" />
          <p className="mt-7 text-[11px] font-bold uppercase tracking-[0.24em] text-[#ff96c8]">Kotecha Circle · Rajkot</p>
          <address className="mt-5 font-serif text-[clamp(1.8rem,3vw,3rem)] not-italic leading-[1.16]">{SALON_ADDRESS}</address>
          <a href={SALON_MAPS} target="_blank" rel="noopener noreferrer" className="mt-10 inline-flex min-h-12 items-center gap-3 border-b border-[#ff96c8] pb-2 text-sm font-semibold transition-colors hover:text-[#ff96c8] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">Get directions <ArrowUpRight size={18} /></a>
        </div>
      </div>
    </div>
  </section>;
}
