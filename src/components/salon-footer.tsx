import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import {
  ArrowUp,
  ArrowUpRight,
  Check,
  Clock,
  Copy,
  MapPin,
  Phone,
  Sparkles,
} from 'lucide-react';
import LogoIcon from '@/assets/logo/logo-icon';
import {
  FOOTER_COLUMNS,
  SALON_BRANCHES,
  getBranchById,
  validateVipRequest,
} from '@/lib/salon-footer-config';

export function SalonFooter() {
  const footerRef = useRef<HTMLElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const [selectedBranchId, setSelectedBranchId] = useState<string>(SALON_BRANCHES[0].id);
  const [contactInput, setContactInput] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [callbackConfirmed, setCallbackConfirmed] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const activeBranch = getBranchById(selectedBranchId);

  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;

    let hasAnimated = false;
    const revealItems = el.querySelectorAll('[data-footer-reveal]');
    const wordmarkChars = el.querySelectorAll('[data-wordmark-char]');

    gsap.set(revealItems, { y: 20, opacity: 0 });
    gsap.set(wordmarkChars, { yPercent: 55, opacity: 0 });

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting && !hasAnimated) {
          hasAnimated = true;
          gsap.to(revealItems, {
            y: 0,
            opacity: 1,
            duration: 0.65,
            stagger: 0.07,
            ease: 'power3.out',
            overwrite: true,
          });
          gsap.to(wordmarkChars, {
            yPercent: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.03,
            ease: 'expo.out',
            delay: 0.1,
            overwrite: true,
          });
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleWordmarkPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const box = wordmarkRef.current;
    const glow = glowRef.current;
    if (!box || !glow) return;
    const rect = box.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    glow.style.transform = `translate3d(${x - 160}px, ${y - 160}px, 0)`;
    glow.style.opacity = '1';
  };

  const handleWordmarkPointerLeave = () => {
    if (glowRef.current) {
      glowRef.current.style.opacity = '0';
    }
  };

  const handleCallbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateVipRequest(contactInput);
    if (!validation.valid) {
      setFormError(validation.error ?? 'Invalid input.');
      return;
    }
    setFormError(null);
    setCallbackConfirmed(validation.normalized ?? contactInput);
    setContactInput('');
  };

  const handleCopyAddress = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(activeBranch.address).catch(() => {});
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const wordmarkText = 'BLOSSOM SALON';

  return (
    <footer
      id="footer"
      ref={footerRef}
      className="relative overflow-hidden border-t border-zinc-200/90 bg-[#f8f4f7] text-zinc-900 transition-colors duration-300 dark:border-zinc-800/80 dark:bg-[#09060d] dark:text-zinc-100"
    >
      {/* Subtle Top Magenta-Pink Hairline */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#e60073]/70 to-transparent"
      />

      <div className="mx-auto max-w-[1360px] px-6 pt-16 pb-10 sm:px-10 lg:px-12 lg:pt-20">
        {/* Main Clean 12-Column Grid */}
        <div className="grid grid-cols-1 gap-12 border-b border-zinc-200/90 pb-14 lg:grid-cols-12 lg:gap-10 dark:border-zinc-800/80">
          {/* Left 5 Columns: Blossom Salon Vadodara Studio Info & Quick Callback */}
          <div data-footer-reveal className="flex flex-col justify-between space-y-6 lg:col-span-5">
            <div>
              <div className="mb-3.5 inline-flex items-center">
                <LogoIcon variant="obsidian" className="h-7 w-auto block dark:hidden" />
                <LogoIcon variant="light" className="h-7 w-auto hidden dark:block" />
              </div>

              <div className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-[#e60073] dark:text-[#ff3b9a]">
                <span className="size-1.5 rounded-full bg-[#e60073] dark:bg-[#ff3b9a]" />
                <span>BLOSSOM UNISEX SALON · {activeBranch.city.toUpperCase()}</span>
              </div>

              <h2 className="mt-2.5 font-serif text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
                Crafted Hair &amp; Grooming in{' '}
                <span className="font-normal italic text-[#e60073] dark:text-[#ff3b9a]">
                  {activeBranch.city}.
                </span>
              </h2>

              {/* Minimal Studio Branch Switcher */}
              <div className="mt-5 inline-flex flex-wrap gap-1 rounded-lg border border-zinc-300/80 bg-white/80 p-1 dark:border-zinc-800 dark:bg-zinc-900/90">
                {SALON_BRANCHES.map((branch) => {
                  const isSelected = branch.id === activeBranch.id;
                  return (
                    <button
                      key={branch.id}
                      type="button"
                      data-testid={`branch-tab-${branch.id}`}
                      onClick={() => setSelectedBranchId(branch.id)}
                      className={`cursor-pointer rounded-md px-3.5 py-1.5 font-mono text-[11px] font-medium transition-all ${
                        isSelected
                          ? 'bg-[#1d072c] text-white dark:bg-[#e60073] dark:text-white'
                          : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
                      }`}
                    >
                      {branch.area}
                    </button>
                  );
                })}
              </div>

              {/* Selected Vadodara Studio Details */}
              <div className="mt-4 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                <p
                  data-testid="active-branch-name"
                  className="font-medium text-zinc-900 dark:text-zinc-100"
                >
                  {activeBranch.name}
                </p>
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-[#e60073] dark:text-[#ff3b9a]" />
                  <span>{activeBranch.address}</span>
                </div>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 pt-1 font-mono text-xs text-zinc-500 dark:text-zinc-400">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="size-3.5 text-[#e60073] dark:text-[#ff3b9a]" />
                    {activeBranch.hours}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Phone className="size-3.5 text-[#e60073] dark:text-[#ff3b9a]" />
                    {activeBranch.phone}
                  </span>
                  <button
                    type="button"
                    data-testid="copy-branch-address"
                    onClick={handleCopyAddress}
                    className="inline-flex cursor-pointer items-center gap-1 text-[#e60073] transition hover:underline dark:text-[#ff3b9a]"
                  >
                    {copied ? (
                      <>
                        <Check className="size-3" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="size-3" />
                        <span>Copy Address</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Minimal Single-Line Appointment Callback Input */}
            <div className="max-w-md pt-1">
              {callbackConfirmed ? (
                <div
                  data-testid="vip-pass-confirmation"
                  className="flex items-center justify-between gap-3 rounded-xl border border-[#e60073]/40 bg-[#e60073]/10 px-4 py-3 text-xs dark:border-[#ff3b9a]/30 dark:bg-[#e60073]/15"
                >
                  <span className="flex items-center gap-2 font-medium text-zinc-900 dark:text-zinc-100">
                    <Sparkles className="size-3.5 text-[#e60073] dark:text-[#ff3b9a]" />
                    Callback requested for {callbackConfirmed} ({activeBranch.area})
                  </span>
                  <button
                    type="button"
                    onClick={() => setCallbackConfirmed(null)}
                    className="cursor-pointer font-mono text-[10px] font-semibold uppercase tracking-wider text-[#e60073] underline dark:text-[#ff3b9a]"
                  >
                    Reset
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCallbackSubmit} noValidate>
                  <div className="flex gap-2">
                    <label htmlFor="vip-contact-input" className="sr-only">
                      Mobile Number or Email
                    </label>
                    <input
                      id="vip-contact-input"
                      type="text"
                      value={contactInput}
                      onChange={(e) => {
                        setContactInput(e.target.value);
                        if (formError) setFormError(null);
                      }}
                      placeholder="Enter mobile number for quick booking..."
                      className="h-11 flex-1 rounded-xl border border-zinc-300 bg-white px-3.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#e60073] focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-[#ff3b9a]"
                    />
                    <button
                      type="submit"
                      data-testid="vip-submit-btn"
                      className="inline-flex h-11 shrink-0 cursor-pointer items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#1d072c] to-[#e60073] px-4 font-mono text-xs font-semibold uppercase tracking-wider text-white transition hover:opacity-95"
                    >
                      <span>Book</span>
                      <ArrowUpRight className="size-3.5" />
                    </button>
                  </div>
                  {formError && (
                    <p role="alert" className="mt-1.5 font-mono text-xs text-rose-600 dark:text-rose-400">
                      {formError}
                    </p>
                  )}
                </form>
              )}
            </div>
          </div>

          {/* Right 7 Columns: Clean 3-Column Navigation */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7 lg:pl-10">
            {FOOTER_COLUMNS.map((col) => (
              <div key={col.id} data-footer-reveal>
                <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-zinc-900 dark:text-zinc-100">
                  {col.title}
                </h3>
                <ul className="mt-4 space-y-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="group inline-flex items-center gap-1.5 text-sm text-zinc-600 transition-colors hover:text-[#e60073] dark:text-zinc-400 dark:hover:text-[#ff3b9a]"
                      >
                        <span>{link.label}</span>
                        <ArrowUpRight className="size-3.5 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Monumental BLOSSOM VADODARA Wordmark */}
        <div
          ref={wordmarkRef}
          onPointerMove={handleWordmarkPointerMove}
          onPointerLeave={handleWordmarkPointerLeave}
          className="relative my-6 select-none overflow-hidden py-2 text-center"
        >
          <div
            ref={glowRef}
            aria-hidden="true"
            className="pointer-events-none absolute top-0 left-0 size-[320px] rounded-full bg-[#e60073]/25 opacity-0 blur-3xl transition-opacity duration-300 dark:bg-[#ff2e93]/20"
          />

          <div
            aria-label="BLOSSOM SALON"
            className="relative z-10 flex items-center justify-center font-serif text-[clamp(2.4rem,9.2vw,8.2rem)] leading-[0.9] font-semibold tracking-[-0.03em] text-[#1d072c] dark:text-zinc-100/95"
          >
            {wordmarkText.split('').map((char, index) => (
              <span
                key={index}
                data-wordmark-char
                className="inline-block transition-transform duration-300 hover:-translate-y-1 hover:text-[#e60073] dark:hover:text-[#ff3b9a]"
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </div>
        </div>

        {/* Clean Bottom Copyright & Back to Top Bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-zinc-200/80 pt-6 font-mono text-[11px] text-zinc-500 sm:flex-row dark:border-zinc-800/80 dark:text-zinc-400">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>© {new Date().getFullYear()} BLOSSOM SALON, VADODARA.</span>
            <span>·</span>
            <span>ALKAPURI &amp; BHAYLI</span>
            <span>·</span>
            <span>BOYS &amp; GIRLS</span>
          </div>

          <button
            type="button"
            onClick={handleScrollToTop}
            data-testid="footer-back-to-top"
            className="group inline-flex cursor-pointer items-center gap-2 rounded-full border border-zinc-300 bg-white px-4 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-zinc-900 transition hover:border-[#e60073] hover:bg-[#e60073] hover:text-white dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-[#e60073] dark:hover:bg-[#e60073] dark:hover:text-white"
          >
            <span>Top</span>
            <ArrowUp className="size-3.5 transition-transform duration-200 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
