import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Compass,
  MapPin,
  Navigation,
  Phone,
  Clock,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  RotateCcw,
  ChevronRight,
  Scissors,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import {
  RAJKOT_STUDIO_INFO,
  AFFORDABLE_PRICE_MENU,
  MAP_FLY_CHAPTERS,
  MapCameraConfig,
  getActiveChapterOnScroll,
  interpolateCameraState,
  projectLngLatToViewport,
} from '@/lib/salon-map-config';

// Landmarks along the route in Rajkot for the 3D vector perspective stage
const RAJKOT_ROUTE_POINTS: Array<{
  id: string;
  label: string;
  sublabel: string;
  coords: [number, number];
  isDestination?: boolean;
}> = [
  {
    id: 'race-course',
    label: 'Race Course Ring',
    sublabel: 'Central Rajkot Start',
    coords: [70.7918, 22.2992],
  },
  {
    id: 'kalawad-corridor',
    label: 'Kalawad Road',
    sublabel: 'Main West Arterial',
    coords: [70.7852, 22.2948],
  },
  {
    id: 'kotecha-chowk',
    label: 'Kotecha Circle',
    sublabel: 'Key Landmark Chowk',
    coords: [70.7795, 22.2917],
  },
  {
    id: 'fitness5-blossom',
    label: 'Blossom Unisex Salon',
    sublabel: 'Fitness 5 gym, Kotecha Cir, Jala Ram Nagar',
    coords: RAJKOT_STUDIO_INFO.coordinates,
    isDestination: true,
  },
];

// Secondary streets around Kotecha Circle & Jala Ram Nagar for rich 3D vector rendering
const SURROUNDING_ROADS: Array<{
  name: string;
  points: [number, number][];
  primary?: boolean;
}> = [
  {
    name: 'KALAWAD ROAD',
    primary: true,
    points: [
      [70.796, 22.3018],
      [70.7885, 22.2968],
      [70.7795, 22.2917],
      [70.771, 22.2868],
    ],
  },
  {
    name: 'NIRMALA CONVENT RD',
    points: [
      [70.7795, 22.2917],
      [70.7762, 22.2965],
      [70.7728, 22.301],
    ],
  },
  {
    name: 'JALA RAM NAGAR MAIN RD',
    primary: true,
    points: [
      [70.7795, 22.2917],
      [70.7782, 22.291],
      [70.7773, 22.2905],
      [70.7755, 22.2896],
    ],
  },
  {
    name: 'AMIN MARG CONNECTOR',
    points: [
      [70.7795, 22.2917],
      [70.7825, 22.2872],
      [70.785, 22.283],
    ],
  },
  {
    name: 'UNIVERSITY RD LINK',
    points: [
      [70.7777, 22.2908],
      [70.7765, 22.2928],
      [70.7745, 22.2945],
    ],
  },
];

// Architectural 3D block footprints around Kotecha Circle & Jala Ram Nagar
const CITY_BLOCKS: Array<{
  id: string;
  coords: [number, number];
  w: number;
  h: number;
  label?: string;
  highlight?: boolean;
}> = [
  {
    id: 'fitness-5-complex',
    coords: [70.77745, 22.29065],
    w: 44,
    h: 28,
    label: 'FITNESS 5 GYM COMPLEX',
    highlight: true,
  },
  {
    id: 'jalaram-block-a',
    coords: [70.7766, 22.2901],
    w: 34,
    h: 22,
  },
  {
    id: 'kotecha-plaza-north',
    coords: [70.7788, 22.2926],
    w: 38,
    h: 24,
  },
  {
    id: 'kotecha-plaza-east',
    coords: [70.7808, 22.2912],
    w: 36,
    h: 24,
  },
  {
    id: 'kalawad-arcade',
    coords: [70.7836, 22.2939],
    w: 42,
    h: 24,
  },
];

export const SalonScrollFlyMap: React.FC = () => {
  const { theme, resolvedTheme } = useTheme();
  const isDark = (theme ?? resolvedTheme ?? 'dark') === 'dark';

  const [activeChapterId, setActiveChapterId] = useState<string>(MAP_FLY_CHAPTERS[0].id);
  const [selectedPriceId, setSelectedPriceId] = useState<string>(AFFORDABLE_PRICE_MENU[0].id);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [bookingToast, setBookingToast] = useState<string | null>(null);
  const [cameraHud, setCameraHud] = useState<MapCameraConfig>(MAP_FLY_CHAPTERS[0].camera);
  const [viewportSize, setViewportSize] = useState<{ w: number; h: number }>({ w: 760, h: 480 });

  const sectionRef = useRef<HTMLElement | null>(null);
  const mapStageRef = useRef<HTMLDivElement | null>(null);
  const chapterRefs = useRef<Record<string, HTMLElement | null>>({});

  // Smooth camera animation state for 60fps Mapbox-style flyTo transitions
  const animStateRef = useRef<{
    current: MapCameraConfig;
    from: MapCameraConfig;
    to: MapCameraConfig;
    startTime: number;
    durationMs: number;
    rafId: number;
    activeId: string;
  }>({
    current: MAP_FLY_CHAPTERS[0].camera,
    from: MAP_FLY_CHAPTERS[0].camera,
    to: MAP_FLY_CHAPTERS[0].camera,
    startTime: 0,
    durationMs: 950,
    rafId: 0,
    activeId: MAP_FLY_CHAPTERS[0].id,
  });

  const triggerFlyToChapter = useCallback((chapterId: string, scrollIntoViewCard = false) => {
    const chapter = MAP_FLY_CHAPTERS.find((c) => c.id === chapterId);
    if (!chapter) return;

    setActiveChapterId(chapter.id);
    const anim = animStateRef.current;
    anim.activeId = chapter.id;
    anim.from = anim.current;
    anim.to = chapter.camera;
    anim.startTime = performance.now();
    anim.durationMs = Math.round(900 / Math.max(0.75, chapter.camera.speed));

    cancelAnimationFrame(anim.rafId);
    const step = (now: number) => {
      const elapsed = now - anim.startTime;
      const t = Math.min(1, elapsed / anim.durationMs);
      const nextCam = interpolateCameraState(anim.from, anim.to, t);
      anim.current = nextCam;
      setCameraHud(nextCam);
      if (t < 1) {
        anim.rafId = requestAnimationFrame(step);
      }
    };
    anim.rafId = requestAnimationFrame(step);

    if (scrollIntoViewCard) {
      const cardEl = chapterRefs.current[chapter.id];
      if (cardEl) {
        cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, []);

  // Measure map stage container for crisp coordinate projection
  useEffect(() => {
    const stageEl = mapStageRef.current;
    if (!stageEl) return;
    const updateSize = () => {
      const rect = stageEl.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setViewportSize({ w: rect.width, h: rect.height });
      }
    };
    updateSize();
    const ro =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(updateSize) : null;
    ro?.observe(stageEl);
    window.addEventListener('resize', updateSize, { passive: true });
    return () => {
      cancelAnimationFrame(animStateRef.current.rafId);
      ro?.disconnect();
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  // Scroll listener matching Mapbox's `window.onscroll` active chapter flyTo pattern
  useEffect(() => {
    const handleScroll = () => {
      const sectionEl = sectionRef.current;
      if (!sectionEl) return;
      const sRect = sectionEl.getBoundingClientRect();
      if (sRect.bottom < 100 || sRect.top > window.innerHeight - 100) return;

      const bounds = MAP_FLY_CHAPTERS.map((ch) => {
        const el = chapterRefs.current[ch.id];
        if (!el) return { id: ch.id, top: 99999, bottom: 99999 };
        const r = el.getBoundingClientRect();
        return { id: ch.id, top: r.top, bottom: r.bottom };
      });

      const nextActive = getActiveChapterOnScroll(
        window.innerHeight,
        bounds,
        animStateRef.current.activeId
      );

      if (nextActive !== animStateRef.current.activeId) {
        triggerFlyToChapter(nextActive, false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [triggerFlyToChapter]);

  const handleCopyStudioAddress = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(RAJKOT_STUDIO_INFO.fullAddress).catch(() => {});
    }
    setCopiedAddress(true);
    window.setTimeout(() => setCopiedAddress(false), 2200);
  };

  const activeChapter =
    MAP_FLY_CHAPTERS.find((c) => c.id === activeChapterId) ?? MAP_FLY_CHAPTERS[0];
  const activeChapterIdx = MAP_FLY_CHAPTERS.findIndex((c) => c.id === activeChapter.id);
  const selectedPriceItem =
    AFFORDABLE_PRICE_MENU.find((p) => p.id === selectedPriceId) ?? AFFORDABLE_PRICE_MENU[0];

  // Project route & landmarks for the 3D vector map layer
  const projectedLandmarks = RAJKOT_ROUTE_POINTS.map((pt) => ({
    ...pt,
    screen: projectLngLatToViewport(pt.coords, cameraHud, viewportSize.w, viewportSize.h),
  }));

  const routeSvgPath = projectedLandmarks
    .map((pt, idx) => `${idx === 0 ? 'M' : 'L'} ${pt.screen.x.toFixed(1)} ${pt.screen.y.toFixed(1)}`)
    .join(' ');

  const zoomFactor = Math.max(0.7, Math.min(2.6, Math.pow(1.28, cameraHud.zoom - 14.5)));

  return (
    <section
      id="location"
      ref={sectionRef}
      aria-label="Blossom Salon Rajkot Interactive Scroll Fly-To Map and Affordable Prices"
      className="relative isolate scroll-mt-[68px] border-t border-zinc-200/90 bg-[#f6f3f5] pt-16 pb-14 text-zinc-900 sm:py-20 dark:border-zinc-800/80 dark:bg-[#0b0810] dark:text-zinc-100"
    >
      <div className="mx-auto max-w-[1360px] px-4 sm:px-8 lg:px-12">
        {/* Section Header + Quick Fly-To Chapter Pills */}
        <div className="mb-8 flex flex-col justify-between gap-5 border-b border-zinc-200/80 pb-6 lg:flex-row lg:items-end dark:border-zinc-800/80">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 font-mono text-[11px] font-semibold tracking-[0.2em] text-[#e60073] uppercase dark:text-[#ff3b9a]">
              <Navigation className="size-3.5" />
              <span>Interactive Scroll Fly-To Map · Rajkot Studio</span>
            </div>
            <h2
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              className="text-3xl leading-[1.05] font-semibold tracking-tight sm:text-4xl lg:text-[44px]"
            >
              Fly to{' '}
              <span className="font-normal italic text-[#e60073] dark:text-[#ff3b9a]">
                Kotecha Circle
              </span>{' '}
              &amp; Affordable Prices.
            </h2>
            <p className="max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
              Scroll through the landmarks below or tap any stop to fly the 3D camera directly to{' '}
              <strong className="font-semibold text-zinc-900 dark:text-zinc-100">
                {RAJKOT_STUDIO_INFO.fullAddress}
              </strong>
              .
            </p>
          </div>

          {/* Interactive Chapter Selector Bar */}
          <div
            role="group"
            aria-label="Fly to Rajkot landmark chapter"
            className="grid grid-cols-2 gap-1.5 rounded-2xl border border-zinc-200/90 bg-white/85 p-1.5 shadow-xs backdrop-blur-md sm:flex sm:flex-wrap sm:items-center dark:border-zinc-800 dark:bg-zinc-900/85"
          >
            {MAP_FLY_CHAPTERS.map((ch) => {
              const isSelected = ch.id === activeChapter.id;
              return (
                <button
                  key={ch.id}
                  type="button"
                  data-testid={`fly-tab-${ch.id}`}
                  onClick={() => triggerFlyToChapter(ch.id, false)}
                  className={`cursor-pointer rounded-xl px-2.5 py-1.5 text-left font-mono text-[10px] font-medium truncate transition-all sm:px-3 sm:text-[11px] ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#1d072c] to-[#e60073] text-white shadow-xs'
                      : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100'
                  }`}
                >
                  <span className="opacity-70">{ch.stepNumber}.</span> {ch.landmarkTag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main 12-Column Scroll-Fly-To Split Layout (Sticky Map Left + Scrolling Chapters Right) */}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Left 7 Columns: Sticky 3D Scroll-Fly-To Map Viewport */}
          <div className="lg:sticky lg:top-[84px] lg:col-span-7">
            <div className="overflow-hidden rounded-3xl border border-zinc-200/90 bg-[#120d18] shadow-[0_24px_60px_-18px_rgba(29,7,44,0.28)] dark:border-zinc-800">
              {/* Interactive 3D Perspective Map Canvas */}
              <div
                ref={mapStageRef}
                data-testid="scroll-fly-map-stage"
                data-active-chapter={activeChapter.id}
                className="relative isolate h-[300px] w-full overflow-hidden sm:h-[480px] lg:h-[580px]"
              >
                <svg
                  viewBox={`0 0 ${viewportSize.w} ${viewportSize.h}`}
                  className="pointer-events-none absolute inset-0 z-10 size-full select-none"
                  aria-hidden="true"
                >
                  <defs>
                    <radialGradient id="rajkotGlow" cx="50%" cy="50%" r="60%">
                      <stop
                        offset="0%"
                        stopColor={isDark ? '#e60073' : '#ff3b9a'}
                        stopOpacity={isDark ? '0.24' : '0.18'}
                      />
                      <stop offset="65%" stopColor="#1d072c" stopOpacity="0.08" />
                      <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                    </radialGradient>
                    <pattern
                      id="mapGridPattern"
                      width="44"
                      height="44"
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        d="M 44 0 L 0 0 0 44"
                        fill="none"
                        stroke={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(24,24,27,0.06)'}
                        strokeWidth="1"
                      />
                    </pattern>
                  </defs>

                  {/* Base Topographic Tint */}
                  <rect
                    width={viewportSize.w}
                    height={viewportSize.h}
                    fill={isDark ? '#0e0a14' : '#f3eef2'}
                  />
                  <rect width={viewportSize.w} height={viewportSize.h} fill="url(#mapGridPattern)" />
                  <circle
                    cx={viewportSize.w * 0.5}
                    cy={viewportSize.h * 0.5}
                    r={Math.min(viewportSize.w, viewportSize.h) * 0.54}
                    fill="url(#rajkotGlow)"
                  />

                  {/* Projected 3D Building Footprints around Kotecha Circle & Fitness 5 Gym */}
                  {CITY_BLOCKS.map((blk) => {
                    const pt = projectLngLatToViewport(
                      blk.coords,
                      cameraHud,
                      viewportSize.w,
                      viewportSize.h
                    );
                    const bw = blk.w * zoomFactor;
                    const bh = blk.h * zoomFactor;
                    return (
                      <g
                        key={blk.id}
                        transform={`translate(${pt.x.toFixed(1)}, ${pt.y.toFixed(1)}) rotate(${(-cameraHud.bearing * 0.35).toFixed(1)})`}
                      >
                        {/* 3D Extruded Roof + Shadow */}
                        <rect
                          x={-bw / 2 + 4}
                          y={-bh / 2 + 5}
                          width={bw}
                          height={bh}
                          rx="5"
                          fill="rgba(0,0,0,0.28)"
                        />
                        <rect
                          x={-bw / 2}
                          y={-bh / 2}
                          width={bw}
                          height={bh}
                          rx="5"
                          fill={
                            blk.highlight
                              ? isDark
                                ? 'rgba(230,0,115,0.28)'
                                : 'rgba(230,0,115,0.18)'
                              : isDark
                                ? 'rgba(255,255,255,0.05)'
                                : 'rgba(24,24,27,0.06)'
                          }
                          stroke={
                            blk.highlight
                              ? '#ff3b9a'
                              : isDark
                                ? 'rgba(255,255,255,0.12)'
                                : 'rgba(24,24,27,0.12)'
                          }
                          strokeWidth={blk.highlight ? '1.6' : '1'}
                        />
                        {blk.label && cameraHud.zoom >= 15.2 && (
                          <text
                            x="0"
                            y={bh / 2 + 12}
                            textAnchor="middle"
                            fill={isDark ? '#ff7ab8' : '#b8005c'}
                            fontSize="8.5"
                            fontWeight="700"
                            fontFamily="JetBrains Mono, monospace"
                            letterSpacing="1.1"
                          >
                            {blk.label}
                          </text>
                        )}
                      </g>
                    );
                  })}

                  {/* Projected Rajkot Road Network */}
                  {SURROUNDING_ROADS.map((road) => {
                    const pts = road.points.map((c) =>
                      projectLngLatToViewport(c, cameraHud, viewportSize.w, viewportSize.h)
                    );
                    const d = pts
                      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
                      .join(' ');
                    const mid = pts[Math.floor(pts.length / 2)] ?? pts[0];
                    return (
                      <g key={road.name}>
                        <path
                          d={d}
                          fill="none"
                          stroke={
                            road.primary
                              ? isDark
                                ? 'rgba(255,255,255,0.17)'
                                : 'rgba(24,24,27,0.16)'
                              : isDark
                                ? 'rgba(255,255,255,0.08)'
                                : 'rgba(24,24,27,0.09)'
                          }
                          strokeWidth={(road.primary ? 13 : 7) * Math.min(1.5, zoomFactor)}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <text
                          x={mid.x + 10}
                          y={mid.y - 8}
                          fill={isDark ? 'rgba(255,255,255,0.46)' : 'rgba(24,24,27,0.52)'}
                          fontSize="9"
                          fontWeight="600"
                          fontFamily="JetBrains Mono, monospace"
                          letterSpacing="1.4"
                        >
                          {road.name}
                        </text>
                      </g>
                    );
                  })}

                  {/* Active Highlighted Route Path from Race Course -> Kotecha Circle -> Fitness 5 Gym */}
                  <path
                    d={routeSvgPath}
                    fill="none"
                    stroke="#e60073"
                    strokeOpacity="0.34"
                    strokeWidth="14"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d={routeSvgPath}
                    fill="none"
                    stroke="#ff3b9a"
                    strokeWidth="3.5"
                    strokeDasharray="8 6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Projected Waypoint Nodes */}
                  {projectedLandmarks.map((lm) => {
                    const { x, y } = lm.screen;
                    if (
                      x < -120 ||
                      x > viewportSize.w + 120 ||
                      y < -120 ||
                      y > viewportSize.h + 120
                    ) {
                      return null;
                    }
                    return (
                      <g key={lm.id} transform={`translate(${x.toFixed(1)}, ${y.toFixed(1)})`}>
                        {lm.isDestination ? (
                          <>
                            <circle r="34" fill="#e60073" fillOpacity="0.2" />
                            <circle
                              r="20"
                              fill="none"
                              stroke="#ff3b9a"
                              strokeWidth="1.6"
                              strokeDasharray="4 3"
                            />
                            <circle r="8.5" fill="#e60073" stroke="#ffffff" strokeWidth="2.5" />
                          </>
                        ) : (
                          <>
                            <circle
                              r="11"
                              fill={isDark ? '#1d072c' : '#ffffff'}
                              stroke="#e60073"
                              strokeWidth="2"
                            />
                            <circle r="4" fill="#ff3b9a" />
                          </>
                        )}
                        <g transform="translate(14, -6)">
                          <rect
                            x="0"
                            y="-12"
                            rx="6"
                            width={Math.max(115, lm.label.length * 7.2)}
                            height="24"
                            fill={isDark ? 'rgba(9,6,13,0.9)' : 'rgba(255,255,255,0.94)'}
                            stroke={lm.isDestination ? '#e60073' : 'rgba(230,0,115,0.35)'}
                            strokeWidth="1"
                          />
                          <text
                            x="8"
                            y="3"
                            fill={isDark ? '#ffffff' : '#18181b'}
                            fontSize="10"
                            fontWeight="600"
                            fontFamily="Plus Jakarta Sans, sans-serif"
                          >
                            {lm.label}
                          </text>
                        </g>
                      </g>
                    );
                  })}
                </svg>

                {/* Top Telemetry & Active Chapter HUD Overlay */}
                <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex flex-wrap items-center justify-between gap-2 bg-gradient-to-b from-black/75 via-black/35 to-transparent p-3.5 sm:p-4">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/75 px-3 py-1 font-mono text-[10px] tracking-wider text-white uppercase backdrop-blur-md">
                    <span className="size-2 animate-pulse rounded-full bg-[#ff3b9a]" />
                    <span>{activeChapter.badge}</span>
                  </div>

                  <div className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/75 px-2.5 py-1 font-mono text-[9.5px] tabular-nums text-zinc-200 backdrop-blur-md sm:px-3 sm:text-[10px]">
                    <Compass className="size-3 text-[#ff3b9a]" />
                    <span>
                      {cameraHud.center[1].toFixed(4)}°N, {cameraHud.center[0].toFixed(4)}°E ·{' '}
                      {cameraHud.zoom.toFixed(1)}x · {Math.round(cameraHud.pitch)}°
                    </span>
                  </div>
                </div>
              </div>

              {/* Pinned Destination Studio Card (Floating inside map on sm+, stacked cleanly below map canvas on mobile) */}
              <div className="relative z-30 border-t border-white/10 bg-[#0d0814] p-4 text-white sm:absolute sm:right-4 sm:bottom-14 sm:w-[340px] sm:rounded-2xl sm:border sm:border-[#e60073]/40 sm:bg-[#0d0814]/92 sm:shadow-2xl sm:backdrop-blur-md">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono text-[9.5px] font-semibold tracking-[0.18em] text-[#ff3b9a] uppercase">
                      {activeChapter.distanceLabel}
                    </span>
                    <h3
                      style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                      className="mt-0.5 text-xl leading-tight font-semibold text-white"
                    >
                      Blossom Unisex Salon · Rajkot
                    </h3>
                  </div>
                  <span className="rounded-full bg-[#e60073]/25 px-2.5 py-0.5 font-mono text-[9.5px] font-semibold text-[#ff7ab8]">
                    Open
                  </span>
                </div>

                <p
                  data-testid="map-studio-address"
                  className="mt-2 flex items-start gap-2 text-xs leading-relaxed text-zinc-200"
                >
                  <MapPin className="mt-0.5 size-3.5 shrink-0 text-[#ff3b9a]" />
                  <span>{RAJKOT_STUDIO_INFO.fullAddress}</span>
                </p>

                <div className="mt-2.5 flex flex-wrap items-center gap-3 font-mono text-[11px] text-zinc-300">
                  <a
                    href={RAJKOT_STUDIO_INFO.phoneHref}
                    data-testid="map-studio-phone"
                    className="inline-flex items-center gap-1.5 font-semibold text-[#ff7ab8] hover:underline"
                  >
                    <Phone className="size-3.5" />
                    <span>{RAJKOT_STUDIO_INFO.phoneDisplay}</span>
                  </a>
                  <span aria-hidden="true">·</span>
                  <span className="inline-flex items-center gap-1 text-[10px] text-zinc-400">
                    <Clock className="size-3" />
                    10 AM – 9 PM
                  </span>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <a
                    href={RAJKOT_STUDIO_INFO.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#e60073] to-[#b8005c] px-3 py-2 font-mono text-[10px] font-semibold tracking-wider text-white uppercase transition hover:opacity-95"
                  >
                    <span>Directions</span>
                    <ExternalLink className="size-3" />
                  </a>
                  <button
                    type="button"
                    data-testid="copy-rajkot-address-btn"
                    onClick={handleCopyStudioAddress}
                    className="inline-flex cursor-pointer items-center justify-center gap-1 rounded-xl border border-white/15 bg-white/10 px-3 py-2 font-mono text-[10px] font-medium text-white transition hover:bg-white/15"
                  >
                    {copiedAddress ? (
                      <>
                        <Check className="size-3 text-emerald-400" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="size-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Bottom Camera Fly-To Controls Bar */}
              <div className="relative z-30 flex items-center justify-between gap-2 border-t border-white/10 bg-black/90 px-4 py-2.5 text-xs text-white backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => triggerFlyToChapter(MAP_FLY_CHAPTERS[0].id, false)}
                    className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-white/15 bg-white/8 px-2.5 py-1 font-mono text-[10px] text-zinc-200 transition hover:bg-white/15"
                  >
                    <RotateCcw className="size-3" />
                    <span>Overview</span>
                  </button>
                  <button
                    type="button"
                    data-testid="fly-next-chapter-btn"
                    onClick={() => {
                      const nextIdx = (activeChapterIdx + 1) % MAP_FLY_CHAPTERS.length;
                      triggerFlyToChapter(MAP_FLY_CHAPTERS[nextIdx].id, false);
                    }}
                    className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-[#e60073] px-3 py-1 font-mono text-[10px] font-semibold text-white transition hover:bg-[#ff3b9a]"
                  >
                    <span>
                      Fly Next ({MAP_FLY_CHAPTERS[(activeChapterIdx + 1) % MAP_FLY_CHAPTERS.length].stepNumber})
                    </span>
                    <ChevronRight className="size-3" />
                  </button>
                </div>

                <a
                  href={RAJKOT_STUDIO_INFO.phoneHref}
                  className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold text-[#ff7ab8] hover:underline"
                >
                  <Phone className="size-3" />
                  <span>{RAJKOT_STUDIO_INFO.phoneDisplay}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right 5 Columns: Scroll-Fly-To Story Chapters + Affordable Salon Price Card */}
          <div className="space-y-5 lg:col-span-5">
            {MAP_FLY_CHAPTERS.map((chapter) => {
              const isActive = chapter.id === activeChapter.id;
              return (
                <article
                  key={chapter.id}
                  ref={(el) => {
                    chapterRefs.current[chapter.id] = el;
                  }}
                  onClick={() => triggerFlyToChapter(chapter.id, false)}
                  className={`group cursor-pointer rounded-2xl border p-5 transition-all duration-300 sm:p-6 ${
                    isActive
                      ? 'border-[#e60073] bg-white shadow-[0_16px_40px_-14px_rgba(230,0,115,0.2)] dark:border-[#ff3b9a] dark:bg-[#150f1d]'
                      : 'border-zinc-200/80 bg-white/65 opacity-75 hover:opacity-100 dark:border-zinc-800/80 dark:bg-zinc-900/50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold tracking-[0.18em] text-[#e60073] uppercase dark:text-[#ff3b9a]">
                      <span
                        className={`size-2 rounded-full ${
                          isActive ? 'bg-[#e60073] dark:bg-[#ff3b9a]' : 'bg-zinc-400'
                        }`}
                      />
                      {chapter.badge}
                    </span>
                    <span className="rounded-full border border-zinc-200 px-2.5 py-0.5 font-mono text-[10px] text-zinc-600 dark:border-zinc-700 dark:text-zinc-300">
                      {chapter.distanceLabel}
                    </span>
                  </div>

                  <h3
                    style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                    className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50"
                  >
                    {chapter.title}
                  </h3>
                  <p className="font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
                    {chapter.subtitle}
                  </p>
                  <p className="mt-2.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                    {chapter.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between border-t border-zinc-200/70 pt-3 text-xs dark:border-zinc-800/80">
                    <span className="font-mono text-[10px] text-zinc-500 dark:text-zinc-400">
                      Camera: {chapter.camera.zoom.toFixed(1)}x · Pitch {chapter.camera.pitch}°
                    </span>
                    <span className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-[#e60073] dark:text-[#ff3b9a]">
                      <span>{isActive ? 'Camera Locked Here' : 'Tap to Fly Here'}</span>
                      <ChevronRight className="size-3.5" />
                    </span>
                  </div>
                </article>
              );
            })}

            {/* Affordable Prices Menu Card for Rajkot Studio */}
            <div
              data-testid="affordable-prices-card"
              className="rounded-3xl border border-[#e60073]/35 bg-gradient-to-br from-white via-[#fdf8fb] to-[#f9eef5] p-6 shadow-lg dark:border-[#ff3b9a]/35 dark:from-[#160d21] dark:via-[#120b1a] dark:to-[#1b0c24]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold tracking-[0.18em] text-[#e60073] uppercase dark:text-[#ff3b9a]">
                    <Sparkles className="size-3.5" />
                    <span>Blossom Rajkot · Pocket-Friendly Tariff</span>
                  </div>
                  <h3
                    style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                    className="mt-1 text-2xl font-semibold text-zinc-900 sm:text-3xl dark:text-zinc-50"
                  >
                    Affordable Studio Prices.
                  </h3>
                </div>
                <span className="rounded-full bg-[#e60073] px-3 py-1 font-mono text-[10px] font-semibold text-white">
                  Starts ₹149
                </span>
              </div>

              <p className="mt-1.5 text-xs text-zinc-600 dark:text-zinc-300">
                Visit us at{' '}
                <strong className="font-medium text-zinc-900 dark:text-white">
                  Fitness 5 gym, Kotecha Cir, Jala Ram Nagar, Rajkot
                </strong>{' '}
                or call{' '}
                <a
                  href={RAJKOT_STUDIO_INFO.phoneHref}
                  className="font-mono font-semibold text-[#e60073] underline dark:text-[#ff3b9a]"
                >
                  {RAJKOT_STUDIO_INFO.phoneDisplay}
                </a>
                .
              </p>

              <div className="mt-4 space-y-2">
                {AFFORDABLE_PRICE_MENU.map((item) => {
                  const isChosen = item.id === selectedPriceItem.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setSelectedPriceId(item.id);
                        triggerFlyToChapter('blossom-rajkot-studio', false);
                      }}
                      className={`flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-left transition-all ${
                        isChosen
                          ? 'border-[#e60073] bg-[#e60073]/10 dark:border-[#ff3b9a] dark:bg-[#ff3b9a]/15'
                          : 'border-zinc-200/80 bg-white/80 hover:border-[#e60073]/40 dark:border-zinc-800 dark:bg-zinc-900/70'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="truncate text-xs font-semibold text-zinc-900 sm:text-sm dark:text-zinc-100">
                            {item.service}
                          </span>
                          {item.popular && (
                            <span className="rounded bg-[#e60073]/15 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-[#e60073] uppercase dark:text-[#ff7ab8]">
                              Popular
                            </span>
                          )}
                        </div>
                        <span className="font-mono text-[10px] text-zinc-500 dark:text-zinc-400">
                          {item.category} · {item.duration}
                        </span>
                      </div>
                      <span className="shrink-0 font-mono text-sm font-bold text-[#e60073] dark:text-[#ff3b9a]">
                        {item.price}
                      </span>
                    </button>
                  );
                })}
              </div>

              {bookingToast && (
                <div
                  role="status"
                  className="mt-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2 font-mono text-xs text-emerald-700 dark:text-emerald-300"
                >
                  {bookingToast}
                </div>
              )}

              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  data-testid="book-affordable-service-btn"
                  onClick={() => {
                    setBookingToast(
                      `Reserved ${selectedPriceItem.service} (${selectedPriceItem.price}) at Kotecha Cir, Rajkot · Call ${RAJKOT_STUDIO_INFO.phoneDisplay}`
                    );
                  }}
                  className="inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1d072c] to-[#e60073] px-4 py-2.5 font-mono text-xs font-semibold tracking-wider text-white uppercase transition hover:opacity-95"
                >
                  <Scissors className="size-3.5" />
                  <span>
                    Book {selectedPriceItem.service.split(' ')[0]} ({selectedPriceItem.price})
                  </span>
                </button>
                <a
                  href={RAJKOT_STUDIO_INFO.phoneHref}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-zinc-300 bg-white px-4 py-2.5 font-mono text-xs font-semibold text-zinc-900 transition hover:border-[#e60073] dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                >
                  <Phone className="size-3.5 text-[#e60073] dark:text-[#ff3b9a]" />
                  <span>{RAJKOT_STUDIO_INFO.phoneDisplay}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
