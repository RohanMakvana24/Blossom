'use client';

import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ChevronLeft, ChevronRight, Scissors, Check, X } from 'lucide-react';
import {
  DockPerson,
  HaircutCategory,
  Wall,
  HAIRCUT_DESIGNS,
  PUSH,
  POP,
  buildWall,
  filterHaircutDesigns,
  createPortraitFallbackDataUri,
} from '@/lib/haircut-dock-config';
import { validateBookingInput } from '@/lib/salon-hero-config';

export type { DockPerson };

export type FlipCardDockProps = {
  people?: DockPerson[];
  /** scale of the tile under the cursor */
  magnify?: number;
  /** how far the magnification reaches, in tiles */
  spread?: number;
  /** scale of the tiles away from the cursor while it's over the wall */
  shrink?: number;
  /** when idle, a random portrait pops and flies into the cover */
  autoplay?: boolean;
  /** seconds between autoplay picks */
  interval?: number;
  background?: string;
  /** text colour */
  color?: string;
  className?: string;
};

const QUICK_SLOTS = ['11:30 AM', '02:00 PM', '04:30 PM', '07:00 PM'];
const SILKY_EASE = 0.12; // smoother per-frame exponential approach for butter-smooth tile gliding

// Memoized wall grid so hover/active changes never trigger a 56-tile React re-render
const WallTilesGrid = memo(function WallTilesGrid({
  wall,
  category,
  filteredPeople,
  wallRef,
  tileRefs,
  onSelectTile,
}: {
  wall: Wall;
  category: HaircutCategory;
  filteredPeople: DockPerson[];
  wallRef: React.RefObject<HTMLDivElement | null>;
  tileRefs: React.MutableRefObject<HTMLButtonElement[]>;
  onSelectTile: (tileIndex: number) => void;
}) {
  return (
    <div ref={wallRef} className="absolute inset-0 p-2 will-change-transform md:p-3">
      {wall.tiles.map((t, i) => {
        const p = filteredPeople[t.person];
        if (!p) return null;
        const badgeNum = t.person + 1 < 10 ? `0${t.person + 1}` : `${t.person + 1}`;
        return (
          <button
            key={`${category}-${t.r}-${t.c}`}
            ref={(el) => {
              if (el) tileRefs.current[i] = el;
            }}
            type="button"
            data-person={t.person}
            data-active={t.person === 0 ? 'true' : 'false'}
            aria-label={`${p.name} — ${p.role}`}
            tabIndex={wall.tiles.findIndex((o) => o.person === t.person) === i ? 0 : -1}
            onClick={() => onSelectTile(i)}
            className="group absolute cursor-pointer p-1 sm:p-1.5 opacity-80 [backface-visibility:hidden] will-change-[transform,opacity] focus-visible:outline-2 focus-visible:outline-[#e60073]"
            style={{
              left: `${(t.c / wall.cols) * 100}%`,
              top: `${(t.r / wall.rows) * 100}%`,
              width: `${100 / wall.cols}%`,
              height: `${100 / wall.rows}%`,
            }}
          >
            <div className="relative size-full overflow-hidden rounded-xl ring-1 ring-black/10 group-data-[active=true]:ring-2 group-data-[active=true]:ring-[#e60073] dark:ring-white/10 dark:group-data-[active=true]:ring-[#ff3b9a]">
              <img
                src={p.thumb}
                alt=""
                decoding="async"
                draggable={false}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = createPortraitFallbackDataUri(
                    p.name,
                    p.role,
                    t.person
                  );
                }}
                className="size-full object-cover [backface-visibility:hidden]"
              />
              <span className="pointer-events-none absolute bottom-1.5 left-1.5 rounded bg-black/65 px-1.5 py-0.5 font-mono text-[9px] font-medium tabular-nums text-white/90">
                {badgeNum}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
});

export default function FlipCardDock({
  people = HAIRCUT_DESIGNS,
  magnify = 1.32,
  spread = 2.2,
  shrink = 0.88,
  autoplay = true,
  interval = 3.4,
  background,
  color,
  className = '',
}: FlipCardDockProps) {
  const [category, setCategory] = useState<HaircutCategory>('all');
  const filteredPeople = useMemo(
    () => filterHaircutDesigns(people, category),
    [people, category]
  );

  const [active, setActive] = useState(0);
  const [size, setSize] = useState({ w: 0, h: 0 });

  // Style Reservation Modal State
  const [isReserveOpen, setIsReserveOpen] = useState(false);
  const [clientName, setClientName] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(QUICK_SLOTS[1]);
  const [reserveError, setReserveError] = useState<string | null>(null);
  const [confirmedCut, setConfirmedCut] = useState<{
    clientName: string;
    styleName: string;
    price: string;
    slot: string;
  } | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const wallCanvasRef = useRef<HTMLDivElement>(null);
  const wallRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const textRefs = useRef<HTMLSpanElement[]>([]);
  const tileRefs = useRef<HTMLButtonElement[]>([]);
  const cardRefs = useRef<HTMLDivElement[]>([]);
  const selectRef = useRef<(tile: number) => void>(() => {});
  const selectPersonRef = useRef<(personIndex: number) => void>(() => {});

  // Read live by the loop, so tuning them doesn't reset the wall
  const tune = useRef({ magnify, spread, shrink });
  useEffect(() => {
    tune.current = { magnify, spread, shrink };
  }, [magnify, spread, shrink]);

  const safeActive = active < filteredPeople.length ? active : 0;

  const wall = useMemo(
    () => (size.w && size.h ? buildWall(size.w, size.h, filteredPeople.length) : null),
    [size, filteredPeople.length]
  );

  useEffect(() => {
    const canvasEl = wallCanvasRef.current;
    if (!canvasEl) return;
    const rect = canvasEl.getBoundingClientRect();
    if (rect.width && rect.height) {
      setSize({ w: rect.width, h: rect.height });
    }
    const ro = new ResizeObserver(([e]) =>
      setSize({ w: e.contentRect.width, h: e.contentRect.height })
    );
    ro.observe(canvasEl);
    return () => ro.disconnect();
  }, []);

  // The name and metadata rise out of their masks on every change
  useEffect(() => {
    const validTextRefs = textRefs.current.filter(Boolean);
    if (!validTextRefs.length) return;
    gsap.killTweensOf(validTextRefs);
    gsap.fromTo(
      validTextRefs,
      { yPercent: 95, opacity: 0.2 },
      { yPercent: 0, opacity: 1, duration: 0.42, ease: 'power3.out', stagger: 0.03 }
    );
  }, [safeActive, category]);

  useEffect(() => {
    const canvasEl = wallCanvasRef.current;
    const stage = stageRef.current;
    const wallEl = wallRef.current;
    const sectionEl = sectionRef.current;
    if (!wall || !canvasEl || !stage || !wallEl || !filteredPeople.length) return;

    const tiles = tileRefs.current.slice(0, wall.tiles.length);
    const cards = cardRefs.current.slice(0, filteredPeople.length);
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

    let isSectionVisible = true;
    const io =
      typeof IntersectionObserver !== 'undefined' && sectionEl
        ? new IntersectionObserver(
            ([entry]) => {
              isSectionVisible = entry.isIntersecting;
            },
            { threshold: 0.1 }
          )
        : null;
    if (sectionEl) io?.observe(sectionEl);

    // Cache stage geometry relative to wallCanvasRef so fly() never triggers synchronous layout reflow
    const getStageMetrics = () => {
      const cRect = canvasEl.getBoundingClientRect();
      const sRect = stage.getBoundingClientRect();
      return {
        cx: sRect.left - cRect.left + sRect.width / 2,
        cy: sRect.top - cRect.top + sRect.height / 2,
        w: sRect.width || 320,
        h: sRect.height || 320,
      };
    };
    let stageMetrics = getStageMetrics();

    /* ---- Pre-decoded per-person cover layers (zero img.src mutation during flight!) ---- */
    let z = filteredPeople.length + 10;
    const activeFlights = new Set<HTMLDivElement>();

    cards.forEach((card, i) => {
      if (!card) return;
      card.style.zIndex = String(i === 0 ? z : 1);
      gsap.set(card, {
        opacity: i === 0 ? 1 : 0,
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,
        force3D: true,
      });
    });

    const markActiveTiles = (activePersonIdx: number) => {
      for (let i = 0; i < tiles.length; i++) {
        const btn = tiles[i];
        if (!btn) continue;
        const isMatch = wall.tiles[i]?.person === activePersonIdx;
        btn.dataset.active = isMatch ? 'true' : 'false';
      }
    };
    markActiveTiles(0);

    const cw = size.w / wall.cols;
    const ch = size.h / wall.rows;
    const centers = wall.tiles.map(({ r, c }) => ({ x: (c + 0.5) * cw, y: (r + 0.5) * ch }));
    const state = wall.tiles.map(() => ({ s: 1, x: 0, y: 0, o: 0.8 }));
    let px = 0;
    let py = 0;

    const hideSettledInactive = (keepPerson: number) => {
      cards.forEach((c, idx) => {
        if (!c || idx === keepPerson || activeFlights.has(c)) return;
        gsap.set(c, { opacity: 0 });
      });
    };

    const fly = (person: number, fromTileIdx: number | undefined) => {
      const card = cards[person];
      if (!card) return;

      card.style.zIndex = String(++z);
      gsap.killTweensOf(card);
      activeFlights.delete(card);

      if (fromTileIdx === undefined || fromTileIdx < 0 || reduced) {
        gsap.set(card, { opacity: 1, x: 0, y: 0, scaleX: 1, scaleY: 1, force3D: true });
        hideSettledInactive(person);
        return;
      }

      // Compute exact tile position in canvas coordinates from in-memory state (zero DOM reflow!)
      const tileCenter = centers[fromTileIdx];
      const tileState = state[fromTileIdx];
      if (!tileCenter || !tileState || !stageMetrics.w) {
        stageMetrics = getStageMetrics();
      }
      const startX = tileCenter.x + tileState.x + px - stageMetrics.cx;
      const startY = tileCenter.y + tileState.y + py - stageMetrics.cy;
      const tileW = (cw - 12) * tileState.s;
      const tileH = (ch - 12) * tileState.s;
      const startScaleX = Math.max(0.18, tileW / stageMetrics.w);
      const startScaleY = Math.max(0.18, tileH / stageMetrics.h);

      activeFlights.add(card);
      gsap.fromTo(
        card,
        {
          opacity: 1,
          x: startX,
          y: startY,
          scaleX: startScaleX,
          scaleY: startScaleY,
          force3D: true,
        },
        {
          opacity: 1,
          x: 0,
          y: 0,
          scaleX: 1,
          scaleY: 1,
          duration: 0.5,
          ease: 'power3.out',
          overwrite: true,
          onComplete: () => {
            activeFlights.delete(card);
            hideSettledInactive(person);
          },
        }
      );
    };

    let current = 0;
    let hoverTimer = 0;
    let pendingHoverTile = -1;

    const select = (tile: number) => {
      if (!wall.tiles[tile]) return;
      const person = wall.tiles[tile].person;
      if (person === current) return;
      current = person;
      markActiveTiles(person);
      setActive(person);
      fly(person, tile);
    };

    selectPersonRef.current = (personIdx: number) => {
      const wrapped =
        ((personIdx % filteredPeople.length) + filteredPeople.length) % filteredPeople.length;
      if (wrapped === current) return;
      current = wrapped;
      markActiveTiles(wrapped);
      setActive(wrapped);
      const matchingTileIdx = wall.tiles.findIndex((t) => t.person === wrapped);
      fly(wrapped, matchingTileIdx >= 0 ? matchingTileIdx : undefined);
    };

    /* ---- wall: 2D magnify, parting, dimming and parallax ---- */
    let pointer: { x: number; y: number } | null = null;
    let pop = -1;
    let frame = 0;
    let clock = 0;

    const render = () => {
      frame = 0;
      const now = performance.now();
      const dt = Math.min(clock ? (now - clock) / 16.667 : 1, 2.5);
      clock = now;
      const k = 1 - Math.pow(1 - SILKY_EASE, dt);
      const { magnify: mag, spread: reach, shrink: low } = tune.current;
      const R = reach * Math.min(cw, ch);
      let moving = false;

      // Subtle parallax lean
      const gx = pointer ? -(pointer.x - size.w / 2) * 0.012 : 0;
      const gy = pointer ? -(pointer.y - size.h / 2) * 0.012 : 0;
      px += (gx - px) * k;
      py += (gy - py) * k;
      if (Math.abs(gx - px) + Math.abs(gy - py) > 0.04) moving = true;
      wallEl.style.transform = `translate3d(${px.toFixed(2)}px, ${py.toFixed(2)}px, 0)`;

      let nearest = -1;
      let best = Infinity;
      for (let i = 0; i < tiles.length; i++) {
        const tile = tiles[i];
        if (!tile) continue;
        const st = state[i];
        let s = i === pop ? POP : 1;
        let x = 0;
        let y = 0;
        let o = i === pop ? 1 : 0.8;
        if (pointer) {
          const dx = centers[i].x - pointer.x;
          const dy = centers[i].y - pointer.y;
          const d = Math.hypot(dx, dy);
          if (d < best) {
            best = d;
            nearest = i;
          }
          const t = d >= R ? 0 : 0.5 * (1 + Math.cos((Math.PI * d) / R));
          s = low + (mag - low) * t;
          o = 0.42 + 0.58 * t;
          const p = d ? (t * (1 - t) * 3.6 * PUSH * Math.min(cw, ch)) / d : 0;
          x = dx * p;
          y = dy * p;
        }
        const ds = s - st.s;
        const dx2 = x - st.x;
        const dy2 = y - st.y;
        const dO = o - st.o;
        if (Math.abs(ds) + Math.abs(dx2) / 100 + Math.abs(dy2) / 100 + Math.abs(dO) < 0.0008) {
          st.s = s;
          st.x = x;
          st.y = y;
          st.o = o;
        } else {
          st.s += ds * k;
          st.x += dx2 * k;
          st.y += dy2 * k;
          st.o += dO * k;
          moving = true;
        }
        tile.style.transform = `translate3d(${st.x.toFixed(2)}px, ${st.y.toFixed(2)}px, 0) scale3d(${st.s.toFixed(4)}, ${st.s.toFixed(4)}, 1)`;
        tile.style.opacity = st.o.toFixed(3);
        tile.style.zIndex = String(Math.round(st.s * 100));
      }

      // Smooth 40ms hover settle so sweeping across the wall doesn't fire 10 overlapping flights
      if (pointer && nearest >= 0 && best < Math.max(cw, ch) * 0.72) {
        if (nearest !== pendingHoverTile) {
          pendingHoverTile = nearest;
          window.clearTimeout(hoverTimer);
          hoverTimer = window.setTimeout(() => {
            if (pointer && pendingHoverTile === nearest) {
              select(nearest);
            }
          }, 40);
        }
      } else if (pendingHoverTile !== -1) {
        pendingHoverTile = -1;
        window.clearTimeout(hoverTimer);
      }

      if (moving) frame = requestAnimationFrame(render);
    };

    const kick = () => {
      if (frame) return;
      clock = 0;
      frame = requestAnimationFrame(render);
    };

    selectRef.current = (tile: number) => {
      window.clearTimeout(hoverTimer);
      pendingHoverTile = tile;
      select(tile);
      if (reduced) return;
      pop = tile;
      kick();
      window.setTimeout(() => {
        if (pop === tile) pop = -1;
        kick();
      }, 600);
    };

    let cachedCanvasRect = canvasEl.getBoundingClientRect();
    const updateCachedRects = () => {
      cachedCanvasRect = canvasEl.getBoundingClientRect();
      stageMetrics = getStageMetrics();
    };
    window.addEventListener('scroll', updateCachedRects, { passive: true });
    window.addEventListener('resize', updateCachedRects, { passive: true });

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || reduced) return;
      if ((e.target as HTMLElement).closest('[data-hole-card="true"]')) {
        if (pointer !== null) {
          pointer = null;
          pendingHoverTile = -1;
          window.clearTimeout(hoverTimer);
          kick();
        }
        return;
      }
      pointer = {
        x: e.clientX - cachedCanvasRect.left,
        y: e.clientY - cachedCanvasRect.top,
      };
      pop = -1;
      kick();
    };
    const onEnter = () => {
      updateCachedRects();
    };
    const onLeave = () => {
      pointer = null;
      pendingHoverTile = -1;
      window.clearTimeout(hoverTimer);
      kick();
    };
    canvasEl.addEventListener('pointerenter', onEnter);
    canvasEl.addEventListener('pointermove', onMove, { passive: true });
    canvasEl.addEventListener('pointerleave', onLeave);
    kick();

    const timer =
      autoplay && !reduced
        ? window.setInterval(() => {
            if (pointer || document.hidden || isReserveOpen || !isSectionVisible) return;
            selectRef.current(Math.floor(Math.random() * tiles.length));
          }, interval * 1000)
        : 0;

    return () => {
      io?.disconnect();
      cancelAnimationFrame(frame);
      window.clearInterval(timer);
      window.clearTimeout(hoverTimer);
      cards.forEach((c) => c && gsap.killTweensOf(c));
      window.removeEventListener('scroll', updateCachedRects);
      window.removeEventListener('resize', updateCachedRects);
      canvasEl.removeEventListener('pointerenter', onEnter);
      canvasEl.removeEventListener('pointermove', onMove);
      canvasEl.removeEventListener('pointerleave', onLeave);
    };
  }, [wall, size, filteredPeople, autoplay, interval, isReserveOpen]);

  const person = filteredPeople[safeActive] ?? filteredPeople[0];
  const styleNumber = safeActive + 1 < 10 ? `0${safeActive + 1}` : `${safeActive + 1}`;
  const totalCountLabel =
    filteredPeople.length < 10 ? `0${filteredPeople.length}` : `${filteredPeople.length}`;

  const handleCategoryChange = (nextCategory: HaircutCategory) => {
    setCategory(nextCategory);
    setActive(0);
  };

  const handleSelectTileStable = React.useCallback((tileIdx: number) => {
    selectRef.current(tileIdx);
  }, []);

  const handleReserveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const check = validateBookingInput({
      clientName,
      service: person.name,
      timeSlot: selectedSlot,
    });
    if (!check.valid) {
      setReserveError(check.error ?? 'Please enter your name.');
      return;
    }
    setReserveError(null);
    setConfirmedCut({
      clientName: clientName.trim(),
      styleName: person.name,
      price: person.price,
      slot: selectedSlot,
    });
    setIsReserveOpen(false);
  };

  return (
    <section
      ref={sectionRef}
      aria-label="Blossom Salon Signature Haircut & Styling Designs"
      className={`relative isolate flex h-full w-full flex-col overflow-hidden bg-[#f5f3ef] text-zinc-950 antialiased dark:bg-[#0b0b0d] dark:text-zinc-50 ${className}`}
      style={{
        ...(background ? { background } : {}),
        ...(color ? { color } : {}),
      }}
    >
      {/* Top Luxury Editorial Header Bar (Matching Hero & Our Products) */}
      <div className="relative z-30 flex flex-wrap items-center justify-between gap-2 border-b border-zinc-900/8 bg-[#f5f3ef]/90 px-3.5 py-2.5 backdrop-blur-md sm:gap-3 sm:px-5 sm:py-3 md:px-7 dark:border-white/10 dark:bg-[#0b0b0d]/90">
        {/* Left: Unboxed Eyebrow + Cormorant Garamond Display Title */}
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5 text-[10px] font-medium tracking-wide text-zinc-500 sm:text-[11px] dark:text-zinc-400">
            <span className="font-semibold text-[#e60073] dark:text-[#ff3b9a]">
              Blossom Unisex Salon
            </span>
            <span aria-hidden="true">·</span>
            <span>Style Lookbook</span>
          </div>
          <h2
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            className="text-xl leading-none font-semibold tracking-tight sm:text-2xl md:text-[28px]"
          >
            Signature{' '}
            <span className="italic font-normal text-[#e60073] dark:text-[#ff3b9a]">
              Haircuts.
            </span>
          </h2>
        </div>

        {/* Center: Interactive Unisex Category Filter Tabs */}
        <div
          role="group"
          aria-label="Filter haircut styles by gender"
          className="order-3 flex w-full items-center justify-between gap-1 overflow-x-auto rounded-full border border-zinc-900/10 bg-zinc-900/[0.04] p-1 [scrollbar-width:none] sm:order-none sm:w-auto sm:justify-start dark:border-white/10 dark:bg-white/[0.04]"
        >
          {(
            [
              ['all', 'All Looks (20)'],
              ['men', 'Boys & Men (10)'],
              ['women', 'Girls & Women (10)'],
            ] as const
          ).map(([catKey, label]) => {
            const isSelected = category === catKey;
            return (
              <button
                key={catKey}
                type="button"
                onClick={() => handleCategoryChange(catKey)}
                className={`flex-1 cursor-pointer rounded-full px-2.5 py-1 text-[11px] font-medium whitespace-nowrap transition-colors sm:flex-initial sm:px-3.5 sm:py-1.5 sm:text-xs ${
                  isSelected
                    ? 'bg-zinc-900 text-white shadow-xs dark:bg-[#ff3b9a] dark:text-zinc-950'
                    : 'text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Right: Step Controls + Active Style Counter + Reserve CTA */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {confirmedCut && (
            <span className="hidden items-center gap-1.5 font-mono text-[11px] text-[#e60073] lg:inline-flex dark:text-[#ff3b9a]">
              <Check className="h-3.5 w-3.5" />
              Booked: {confirmedCut.styleName} ({confirmedCut.slot})
            </span>
          )}

          <div className="flex items-center gap-0.5 rounded-full border border-zinc-900/10 bg-white/80 px-1.5 py-0.5 sm:gap-1 sm:px-2 sm:py-1 dark:border-white/10 dark:bg-zinc-900/80">
            <button
              type="button"
              aria-label="Previous haircut style"
              onClick={() => selectPersonRef.current(safeActive - 1)}
              className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-zinc-700 transition-colors hover:bg-zinc-900/8 dark:text-zinc-300 dark:hover:bg-white/10"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <span className="px-1 font-mono text-[10px] font-medium tabular-nums text-zinc-700 sm:px-1.5 sm:text-[11px] dark:text-zinc-300">
              {styleNumber} / {totalCountLabel}
            </span>
            <button
              type="button"
              aria-label="Next haircut style"
              onClick={() => selectPersonRef.current(safeActive + 1)}
              className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-zinc-700 transition-colors hover:bg-zinc-900/8 dark:text-zinc-300 dark:hover:bg-white/10"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              setReserveError(null);
              setIsReserveOpen(true);
            }}
            className="flex cursor-pointer items-center gap-1.5 rounded-full bg-zinc-900 px-3 py-1.5 text-[11px] font-semibold whitespace-nowrap text-white transition-opacity hover:opacity-90 sm:px-4 sm:py-2 sm:text-xs dark:bg-[#ff3b9a] dark:text-zinc-950"
          >
            <Scissors className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span>Reserve This Cut</span>
          </button>
        </div>
      </div>

      {/* Interactive FlipCardDock Portrait Wall Stage */}
      <div
        ref={wallCanvasRef}
        className="relative isolate m-2.5 flex-1 overflow-hidden rounded-2xl border border-zinc-900/8 bg-[#ebe7e0]/65 sm:m-3 md:m-5 dark:border-white/8 dark:bg-[#111115]"
      >
        {wall && (
          <WallTilesGrid
            wall={wall}
            category={category}
            filteredPeople={filteredPeople}
            wallRef={wallRef}
            tileRefs={tileRefs}
            onSelectTile={handleSelectTileStable}
          />
        )}

        {/* Central Editorial Hole: Unboxed Header + Clean Framed Showcase Card */}
        {wall && person && (
          <div
            data-hole-card="true"
            className="pointer-events-none absolute z-[200] flex flex-col items-center justify-center gap-1 p-1 sm:gap-2 sm:p-2.5 [container-type:size]"
            style={{
              left: `${(wall.hole.c0 / wall.cols) * 100}%`,
              top: `${(wall.hole.r0 / wall.rows) * 100}%`,
              width: `${(wall.hole.cols / wall.cols) * 100}%`,
              height: `${(wall.hole.rows / wall.rows) * 100}%`,
            }}
          >
            {/* Unboxed Editorial Title Lockup */}
            <div className="flex max-w-full flex-col items-center gap-0.5 px-0.5 text-center sm:px-2" aria-live="polite">
              <div className="max-w-full overflow-hidden font-mono text-[8px] font-medium tracking-[0.05em] text-zinc-500 uppercase sm:text-[10px] sm:tracking-[0.18em] dark:text-zinc-400">
                <span
                  ref={(el) => {
                    if (el) textRefs.current[0] = el;
                  }}
                  className="block truncate will-change-transform"
                >
                  {person.role} · {person.duration} ·{' '}
                  <span className="font-semibold text-[#e60073] dark:text-[#ff3b9a]">
                    {person.price}
                  </span>
                </span>
              </div>

              <h3
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                className="max-w-full overflow-hidden text-[clamp(17px,5.8cqw,38px)] leading-[1.08] font-semibold tracking-[-0.02em] whitespace-nowrap"
              >
                <span
                  ref={(el) => {
                    if (el) textRefs.current[1] = el;
                  }}
                  className="block truncate will-change-transform"
                >
                  <span className="italic font-normal text-[#e60073] dark:text-[#ff3b9a]">
                    {styleNumber}.
                  </span>{' '}
                  {person.name}
                </span>
              </h3>
            </div>

            {/* Central Portrait Stage: Pre-decoded per-person cover layers for zero-stutter flights */}
            <div
              ref={stageRef}
              className="pointer-events-auto relative isolate aspect-[4/5] w-[min(96cqw,calc((100cqh-46px)*0.8))] rounded-2xl bg-zinc-900 ring-1 ring-zinc-900/12 shadow-[0_18px_40px_-14px_rgba(0,0,0,0.18)] sm:aspect-square sm:w-[min(94cqw,calc(100cqh-74px))] dark:ring-white/15 dark:shadow-[0_22px_50px_-14px_rgba(0,0,0,0.68)]"
            >
              {filteredPeople.map((p, i) => (
                <div
                  key={p.id}
                  ref={(el) => {
                    if (el) cardRefs.current[i] = el;
                  }}
                  className="absolute inset-0 overflow-hidden rounded-2xl [backface-visibility:hidden] will-change-[transform,opacity]"
                >
                  <img
                    src={p.cover}
                    alt={p.name}
                    decoding="async"
                    draggable={false}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = createPortraitFallbackDataUri(p.name, p.role, i);
                    }}
                    className="size-full object-cover [backface-visibility:hidden]"
                  />
                </div>
              ))}

              {/* Measured Editorial Scrim Overlay at Bottom of Central Portrait */}
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 z-[120] flex flex-col justify-end rounded-b-2xl bg-gradient-to-t from-black/90 via-black/55 to-transparent p-2.5 pt-8 text-white sm:p-3.5 sm:pt-10"
              >
                <div className="flex flex-col items-stretch gap-1.5 sm:flex-row sm:items-end sm:justify-between sm:gap-2">
                  <div className="min-w-0">
                    <div className="font-mono text-[8.5px] tracking-[0.14em] whitespace-nowrap text-[#ff7ab8] uppercase sm:text-[9.5px] sm:tracking-[0.18em]">
                      Styling Finish
                    </div>
                    <p className="truncate text-[11px] font-medium text-zinc-100 sm:text-xs">
                      {person.technique}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setReserveError(null);
                      setIsReserveOpen(true);
                    }}
                    className="pointer-events-auto shrink-0 cursor-pointer rounded-lg bg-white/95 px-2.5 py-1 text-center font-mono text-[9.5px] font-semibold tracking-wider text-zinc-950 uppercase transition-transform hover:scale-105 sm:py-1.5 sm:text-[10px]"
                  >
                    Book {person.price}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Style Reservation Modal */}
      {isReserveOpen && person && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="reserve-style-title"
          className="fixed inset-0 z-[600] flex items-center justify-center bg-black/65 p-4 backdrop-blur-xs"
        >
          <div className="w-full max-w-md space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 text-zinc-950 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-mono text-[10px] tracking-[0.2em] text-[#e60073] uppercase dark:text-[#ff3b9a]">
                  Blossom Salon · Style {styleNumber}
                </div>
                <h3
                  id="reserve-style-title"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                  className="text-2xl font-semibold"
                >
                  Reserve: {person.name}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {person.role} · {person.duration} · {person.price}
                </p>
              </div>
              <button
                type="button"
                aria-label="Close style reservation dialog"
                onClick={() => setIsReserveOpen(false)}
                className="cursor-pointer rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-900 dark:hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleReserveSubmit} className="space-y-4" noValidate>
              <div>
                <label
                  htmlFor="style-client-name"
                  className="mb-1.5 block text-xs font-medium text-zinc-800 dark:text-zinc-200"
                >
                  Your Full Name
                </label>
                <input
                  id="style-client-name"
                  type="text"
                  value={clientName}
                  onChange={(e) => {
                    setClientName(e.target.value);
                    if (reserveError) setReserveError(null);
                  }}
                  placeholder="e.g. Rajveer Zala"
                  className="w-full rounded-xl border border-zinc-300 bg-transparent px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-amber-500/40 focus:outline-none dark:border-zinc-800"
                />
              </div>

              <div>
                <span className="mb-1.5 block text-xs font-medium text-zinc-800 dark:text-zinc-200">
                  Select Preferred Time Slot
                </span>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {QUICK_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`cursor-pointer rounded-xl border py-2 font-mono text-xs font-medium tabular-nums transition-colors ${
                        selectedSlot === slot
                          ? 'border-zinc-900 bg-zinc-900 text-white dark:border-amber-400 dark:bg-amber-400 dark:text-zinc-950'
                          : 'border-zinc-200 hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-900'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {reserveError && (
                <p role="alert" className="text-xs font-medium text-red-500">
                  {reserveError}
                </p>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsReserveOpen(false)}
                  className="cursor-pointer rounded-xl border border-zinc-200 px-4 py-2 text-xs font-medium hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="cursor-pointer rounded-xl bg-zinc-900 px-5 py-2 text-xs font-semibold text-white hover:opacity-90 dark:bg-amber-400 dark:text-zinc-950"
                >
                  Confirm Cut ({person.price})
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

