export type SalonFinishId = 'obsidian-gold' | 'champagne-platinum' | 'rose-copper';
export type SalonFocusId = 'overview' | 'shears' | 'throne' | 'elixir';

export interface SalonFinishPreset {
  id: SalonFinishId;
  label: string;
  metalHex: number;
  accentHex: number;
  leatherHex: number;
  podiumHexDark: number;
  podiumHexLight: number;
  swatchColor: string;
}

export interface SalonFocusPreset {
  id: SalonFocusId;
  label: string;
  subtitle: string;
  metricLabel: string;
  metricValue: string;
  cameraPos: [number, number, number];
  lookTarget: [number, number, number];
}

export const SALON_FINISHES: SalonFinishPreset[] = [
  {
    id: 'obsidian-gold',
    label: '24K Brushed Gold',
    metalHex: 0xd4af37,
    accentHex: 0xf5d061,
    leatherHex: 0x161618,
    podiumHexDark: 0x121215,
    podiumHexLight: 0xf4f1ea,
    swatchColor: '#D4AF37',
  },
  {
    id: 'champagne-platinum',
    label: 'Forged Platinum',
    metalHex: 0xd8dde6,
    accentHex: 0x94a3b8,
    leatherHex: 0x1e2024,
    podiumHexDark: 0x141619,
    podiumHexLight: 0xf1f5f9,
    swatchColor: '#CBD5E1',
  },
  {
    id: 'rose-copper',
    label: 'burnished Rose Gold',
    metalHex: 0xe09177,
    accentHex: 0xf4b6a0,
    leatherHex: 0x1c1514,
    podiumHexDark: 0x171211,
    podiumHexLight: 0xfaf3f0,
    swatchColor: '#E09177',
  },
];

export const SALON_FOCUS_PRESETS: SalonFocusPreset[] = [
  {
    id: 'overview',
    label: 'Full Atelier',
    subtitle: 'Complete 3D styling station with illuminated halo mirror, hydraulic throne & Japanese shears',
    metricLabel: 'Blade Tolerance',
    metricValue: '0.02 mm',
    cameraPos: [0.2, 1.85, 5.1],
    lookTarget: [0, 0.75, 0],
  },
  {
    id: 'shears',
    label: 'Damascus Shears',
    subtitle: 'Hand-honed VG-10 cobalt steel convex blades with precision tension jewel screw',
    metricLabel: 'Bevel Angle',
    metricValue: '38° Convex',
    cameraPos: [-1.15, 1.55, 3.1],
    lookTarget: [-0.85, 1.25, 0.35],
  },
  {
    id: 'throne',
    label: 'Hydraulic Chair',
    subtitle: 'Sculpted Italian full-grain leather styling chair with brushed metallic halo frame',
    metricLabel: 'Recline Arc',
    metricValue: '145° Zero-G',
    cameraPos: [1.25, 1.35, 3.45],
    lookTarget: [0, 0.55, 0],
  },
  {
    id: 'elixir',
    label: 'Botanical Elixir',
    subtitle: 'Cold-pressed Moroccan argan & keratin crystal flacon with micro-mist gold atomizer',
    metricLabel: 'Infusion Purity',
    metricValue: '99.4% Pure',
    cameraPos: [1.3, 1.25, 2.95],
    lookTarget: [0.95, 0.85, 0.4],
  },
];

export interface BookingInput {
  clientName: string;
  service: string;
  timeSlot: string;
}

export interface BookingValidationResult {
  valid: boolean;
  error?: string;
}

export function validateBookingInput(input: BookingInput): BookingValidationResult {
  const trimmedName = input.clientName.trim();
  if (!trimmedName || trimmedName.length < 2) {
    return { valid: false, error: 'Please enter your name (at least 2 characters).' };
  }
  if (!input.service.trim()) {
    return { valid: false, error: 'Please select a salon service.' };
  }
  if (!input.timeSlot.trim()) {
    return { valid: false, error: 'Please select a preferred time slot.' };
  }
  return { valid: true };
}

export function getFinishPreset(id: SalonFinishId): SalonFinishPreset {
  return SALON_FINISHES.find((f) => f.id === id) ?? SALON_FINISHES[0];
}

export function getFocusPreset(id: SalonFocusId): SalonFocusPreset {
  return SALON_FOCUS_PRESETS.find((f) => f.id === id) ?? SALON_FOCUS_PRESETS[0];
}
