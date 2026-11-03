export interface MapCameraConfig {
  center: [number, number]; // [lng, lat]
  zoom: number;
  pitch: number;
  bearing: number;
  speed: number;
  curve: number;
}

export interface MapFlyChapter {
  id: string;
  stepNumber: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  distanceLabel: string;
  landmarkTag: string;
  camera: MapCameraConfig;
}

export interface AffordablePriceItem {
  id: string;
  service: string;
  category: string;
  duration: string;
  price: string;
  popular?: boolean;
}

export const RAJKOT_STUDIO_INFO = {
  name: 'Blossom Unisex Salon — Rajkot',
  landmark: 'Fitness 5 gym, Kotecha Cir',
  area: 'Jala Ram Nagar',
  city: 'Rajkot, Gujarat 360007',
  fullAddress: 'Fitness 5 gym, Kotecha Cir, Jala Ram Nagar, Rajkot, Gujarat 360007',
  phoneDisplay: '096380 55173',
  phoneHref: 'tel:+919638055173',
  hours: '10:00 AM – 09:00 PM (Daily)',
  coordinates: [70.7773, 22.2905] as [number, number],
  googleMapsUrl:
    'https://www.google.com/maps/search/?api=1&query=Fitness+5+gym,+Kotecha+Cir,+Jala+Ram+Nagar,+Rajkot,+Gujarat+360007',
};

export const AFFORDABLE_PRICE_MENU: AffordablePriceItem[] = [
  {
    id: 'mens-haircut',
    service: 'Signature Haircut & Styling',
    category: 'Boys & Men',
    duration: '35 Min',
    price: '₹249',
    popular: true,
  },
  {
    id: 'womens-layer-cut',
    service: 'Butterfly / Layer Cut & Blowdry',
    category: 'Girls & Women',
    duration: '45 Min',
    price: '₹499',
    popular: true,
  },
  {
    id: 'beard-contour',
    service: 'Razor Beard Contour & Hot Towel',
    category: 'Boys & Men',
    duration: '25 Min',
    price: '₹149',
  },
  {
    id: 'botanical-spa',
    service: 'Argan Hair Spa & Ozone Steam',
    category: 'Unisex Care',
    duration: '50 Min',
    price: '₹599',
    popular: true,
  },
  {
    id: 'detan-glow',
    service: 'Hydra Detan & Instant Face Glow',
    category: 'Unisex Skin',
    duration: '40 Min',
    price: '₹399',
  },
  {
    id: 'keratin-smooth',
    service: 'Keratin Smooth & Mirror Gloss',
    category: 'Unisex Ritual',
    duration: '90 Min',
    price: '₹1,499',
  },
];

export const MAP_FLY_CHAPTERS: MapFlyChapter[] = [
  {
    id: 'rajkot-overview',
    stepNumber: '01',
    badge: 'Step 01 · City Overview',
    title: 'Heart of Rajkot · Kalawad Road',
    subtitle: 'Race Course Ring & Central West Rajkot',
    description:
      'Starting from central Rajkot near Race Course Ring Road, follow the main Kalawad Road corridor straight toward Kotecha Circle.',
    distanceLabel: '1.4 km to Studio · 4 Min Drive',
    landmarkTag: 'Kalawad Road Corridor',
    camera: {
      center: [70.7885, 22.2968],
      zoom: 13.9,
      pitch: 34,
      bearing: -16,
      speed: 1.25,
      curve: 1.42,
    },
  },
  {
    id: 'kotecha-circle',
    stepNumber: '02',
    badge: 'Step 02 · Key Junction',
    title: 'Kotecha Circle (Kotecha Chowk)',
    subtitle: 'Iconic Kalawad Road Circle, Rajkot',
    description:
      'Our camera flies directly into Kotecha Circle — the prime landmark junction connecting Kalawad Road, Nirmala Convent Road, and Jala Ram Nagar.',
    distanceLabel: '150 m to Studio · 1 Min Walk',
    landmarkTag: 'Kotecha Cir, Rajkot',
    camera: {
      center: [70.7795, 22.2917],
      zoom: 15.85,
      pitch: 52,
      bearing: 28,
      speed: 1.15,
      curve: 1.35,
    },
  },
  {
    id: 'jalaram-nagar-gym',
    stepNumber: '03',
    badge: 'Step 03 · Exact Landmark',
    title: 'Fitness 5 Gym · Jala Ram Nagar',
    subtitle: 'Fitness 5 gym, Kotecha Cir, Jala Ram Nagar',
    description:
      'Just off Kotecha Circle inside Jala Ram Nagar, spot the prominent Fitness 5 Gym complex with easy front-side two-wheeler and car parking.',
    distanceLabel: 'Arrived · Pinpoint Location',
    landmarkTag: 'Fitness 5 Gym Building',
    camera: {
      center: [70.7777, 22.2908],
      zoom: 17.1,
      pitch: 60,
      bearing: -22,
      speed: 1.05,
      curve: 1.25,
    },
  },
  {
    id: 'blossom-rajkot-studio',
    stepNumber: '04',
    badge: 'Step 04 · Destination & Prices',
    title: 'Blossom Unisex Salon · Affordable Luxury',
    subtitle: 'Rajkot, Gujarat 360007 · Call 096380 55173',
    description:
      'Welcome to Blossom Unisex Salon at Fitness 5 gym, Kotecha Cir, Jala Ram Nagar, Rajkot. Experience premium haircuts, colour, and grooming at affordable everyday prices.',
    distanceLabel: 'Open Daily · 096380 55173',
    landmarkTag: 'Blossom Salon Entrance',
    camera: {
      center: [70.7773, 22.2905],
      zoom: 17.85,
      pitch: 64,
      bearing: 16,
      speed: 1.0,
      curve: 1.2,
    },
  },
];

export interface ChapterBound {
  id: string;
  top: number;
  bottom: number;
}

/**
 * Determines which scroll-fly-to chapter is currently active based on viewport bounds,
 * matching the Mapbox GL JS `scroll-fly-to` active chapter detection behavior.
 */
export function getActiveChapterOnScroll(
  viewportHeight: number,
  bounds: ChapterBound[],
  fallbackId: string = MAP_FLY_CHAPTERS[0].id
): string {
  if (!bounds.length || viewportHeight <= 0) return fallbackId;
  const triggerLine = viewportHeight * 0.48;

  // First check if a chapter straddles the viewport trigger line
  for (const b of bounds) {
    if (b.top <= triggerLine && b.bottom >= triggerLine) {
      return b.id;
    }
  }

  // Otherwise pick the chapter whose center is closest to the trigger line
  let bestId = fallbackId;
  let bestDist = Infinity;
  for (const b of bounds) {
    const center = (b.top + b.bottom) * 0.5;
    const dist = Math.abs(center - triggerLine);
    if (dist < bestDist) {
      bestDist = dist;
      bestId = b.id;
    }
  }
  return bestId;
}

/**
 * Smoothly interpolates between two MapCameraConfig states for 60fps flyTo transitions.
 */
export function interpolateCameraState(
  from: MapCameraConfig,
  to: MapCameraConfig,
  rawT: number
): MapCameraConfig {
  const t = Math.max(0, Math.min(1, rawT));
  // Smooth cubic ease-in-out
  const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  // Shortest angular distance for bearing
  let deltaBearing = ((to.bearing - from.bearing + 540) % 360) - 180;

  return {
    center: [
      from.center[0] + (to.center[0] - from.center[0]) * ease,
      from.center[1] + (to.center[1] - from.center[1]) * ease,
    ],
    zoom: from.zoom + (to.zoom - from.zoom) * ease,
    pitch: from.pitch + (to.pitch - from.pitch) * ease,
    bearing: from.bearing + deltaBearing * ease,
    speed: to.speed,
    curve: to.curve,
  };
}

/**
 * Projects a [lng, lat] coordinate onto 2D viewport coordinates with zoom, bearing, and pitch
 * so vector street overlays and custom landmark markers stay locked during flyTo transitions.
 */
export function projectLngLatToViewport(
  lngLat: [number, number],
  camera: MapCameraConfig,
  width: number,
  height: number
): { x: number; y: number; scale: number } {
  const scale = Math.pow(2, camera.zoom - 14) * 38000;
  const cosLat = Math.cos((camera.center[1] * Math.PI) / 180);
  const dxWorld = (lngLat[0] - camera.center[0]) * cosLat * scale;
  const dyWorld = -(lngLat[1] - camera.center[1]) * scale;

  const rad = (-camera.bearing * Math.PI) / 180;
  const cosB = Math.cos(rad);
  const sinB = Math.sin(rad);

  const rx = dxWorld * cosB - dyWorld * sinB;
  const ry = dxWorld * sinB + dyWorld * cosB;

  const pitchFactor = Math.cos((camera.pitch * Math.PI) / 180 * 0.68);
  const x = width * 0.5 + rx;
  const y = height * 0.5 + ry * pitchFactor;

  return { x, y, scale };
}
