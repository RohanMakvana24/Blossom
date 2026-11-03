export interface UnisexServiceLook {
  index: number;
  numberLabel: string;
  shortTab: string;
  title: string;
  audienceTag: string;
  description: string;
  cropBox: [number, number]; // [x0, x1] aspect ratio box
  accentColor: string;
}

export interface UnisexServiceCardItem {
  id: string;
  serviceIndex: number;
  name: string;
  genderLabel: 'Boys & Men' | 'Girls & Women' | 'Unisex Formula';
  duration: string; // Volume / Net Wt
  price: string;
  cropBox: [number, number, number, number];
}

export const DEPTH_KX = [1.2, 0.744, 0.496, 0.346, 0.235, 0.15, 0.085] as const;
export const DEPTH_KF = [1.14, 0.89, 0.777, 0.704, 0.651, 0.616, 0.59] as const;
export const DEPTH_KH = [1.18, 0.832, 0.574, 0.436, 0.334, 0.258, 0.19] as const;
export const DEPTH_KB = [0, 0, 1.5, 4, 8, 12, 17] as const;
export const DEPTH_KO = [1, 1, 1, 1, 0.86, 0.5, 0] as const;

export const UNISEX_SERVICES: UnisexServiceLook[] = [
  {
    index: 0,
    numberLabel: '01',
    shortTab: 'Argan Elixir',
    title: 'Moroccan Argan Gold Elixir',
    audienceTag: 'Unisex · Styling & Shine Oil',
    description:
      'Cold-pressed organic Moroccan argan oil infused with 24K gold leaf and vitamin E for weightless mirror shine, frizz control, and thermal protection.',
    cropBox: [0, 220],
    accentColor: '#c89d54',
  },
  {
    index: 1,
    numberLabel: '02',
    shortTab: 'Keratin Silk',
    title: 'Keratin & Peptide Silk Masque',
    audienceTag: 'Unisex · Colour & Bond Care',
    description:
      'Hydrolyzed bio-keratin and triple-peptide reconstruction complex engineered to seal cuticles and lock in balayage and global hair colour vibrancy.',
    cropBox: [0, 220],
    accentColor: '#b98179',
  },
  {
    index: 2,
    numberLabel: '03',
    shortTab: 'Matte Clay',
    title: 'Volcanic Matte Styling Clay',
    audienceTag: 'Boys & Girls · Texture & Hold',
    description:
      'Kaolin volcanic mineral clay and organic beeswax formula delivering reworkable high-definition matte texture, zero flake residue, and cedarwood scent.',
    cropBox: [0, 220],
    accentColor: '#7a9a8b',
  },
  {
    index: 3,
    numberLabel: '04',
    shortTab: 'Glow Serum',
    title: '24K Hydra-Glow Glass Serum',
    audienceTag: 'Unisex · Facial & Skin Care',
    description:
      'Multi-molecular hyaluronic acid, niacinamide, and suspended 24K gold micro-florentines for instant dewy glass-skin radiance and deep barrier repair.',
    cropBox: [0, 220],
    accentColor: '#d4a373',
  },
  {
    index: 4,
    numberLabel: '05',
    shortTab: 'Bond Shampoo',
    title: 'Bond-Repair Violet Shampoo',
    audienceTag: 'Unisex · Salon Wash Ritual',
    description:
      'Sulfate-free amino bond builder with crushed violet botanical pigments to neutralize brassiness, strengthen bleached strands, and restore silkiness.',
    cropBox: [0, 220],
    accentColor: '#9b87d4',
  },
  {
    index: 5,
    numberLabel: '06',
    shortTab: 'Hair Parfüm',
    title: 'Soie De Rose Hair Parfüm',
    audienceTag: 'Bridal & Couture · Hair Mist',
    description:
      'Alcohol-free silk protein hair mistinfused with Damask rose, white oud, and camellia seed oil for luminous bridal scent and static-free softness.',
    cropBox: [0, 220],
    accentColor: '#d98da1',
  },
  {
    index: 6,
    numberLabel: '07',
    shortTab: 'Oud Beard Oil',
    title: 'Royal Oud Beard & Groom Oil',
    audienceTag: 'Boys & Men · Grooming Apothecary',
    description:
      'Lightweight jojoba, sweet almond, and aged Cambodian oud wood elixir that softens coarse beard hair, soothes post-shave skin, and tames flyaways.',
    cropBox: [0, 220],
    accentColor: '#4ea885',
  },
  {
    index: 7,
    numberLabel: '08',
    shortTab: 'Scalp Tonic',
    title: 'Ayurvedic Bhringraj Scalp Tonic',
    audienceTag: 'Unisex · Head Massage Elixir',
    description:
      'Slow-steeped Bhringraj, Brahmi, and rosemary root concentrate designed for warm champi cranial massage and revitalized hair follicle density.',
    cropBox: [0, 220],
    accentColor: '#c98856',
  },
];

export const UNISEX_SERVICE_ITEMS: UnisexServiceCardItem[] = [
  // 1. Argan Elixir
  {
    id: 'prod-1-elixir',
    serviceIndex: 0,
    name: '24K Moroccan Argan Hair Elixir',
    genderLabel: 'Unisex Formula',
    duration: '100 ml · 3.4 oz',
    price: '₹1,650',
    cropBox: [0, 240, 0, 220],
  },
  {
    id: 'prod-1-butter',
    serviceIndex: 0,
    name: 'Argan & Shea Finishing Butter',
    genderLabel: 'Girls & Women',
    duration: '150 ml · 5.0 oz',
    price: '₹1,400',
    cropBox: [0, 240, 0, 220],
  },
  // 2. Keratin Silk
  {
    id: 'prod-2-serum',
    serviceIndex: 1,
    name: 'Keratin Peptide Leave-In Silk',
    genderLabel: 'Unisex Formula',
    duration: '200 ml · 6.7 oz',
    price: '₹2,100',
    cropBox: [0, 240, 0, 220],
  },
  {
    id: 'prod-2-masque',
    serviceIndex: 1,
    name: 'Deep Bond Keratin Repair Tub',
    genderLabel: 'Girls & Women',
    duration: '250 g · 8.8 oz',
    price: '₹2,450',
    cropBox: [0, 240, 0, 220],
  },
  // 3. Matte Clay
  {
    id: 'prod-3-spray',
    serviceIndex: 2,
    name: 'Sea Salt & Mineral Texture Spray',
    genderLabel: 'Boys & Men',
    duration: '150 ml · 5.0 oz',
    price: '₹1,150',
    cropBox: [0, 240, 0, 220],
  },
  {
    id: 'prod-3-clay',
    serviceIndex: 2,
    name: 'Volcanic Kaolin Matte Clay Jar',
    genderLabel: 'Boys & Men',
    duration: '120 g · 4.0 oz',
    price: '₹1,350',
    cropBox: [0, 240, 0, 220],
  },
  // 4. Glow Serum
  {
    id: 'prod-4-serum',
    serviceIndex: 3,
    name: '24K Hydra-Glow Glass Skin Drops',
    genderLabel: 'Unisex Formula',
    duration: '50 ml · 1.7 oz',
    price: '₹2,250',
    cropBox: [0, 240, 0, 220],
  },
  {
    id: 'prod-4-creme',
    serviceIndex: 3,
    name: 'Ceramide Barrier Cloud Crème',
    genderLabel: 'Girls & Women',
    duration: '75 ml · 2.5 oz',
    price: '₹1,950',
    cropBox: [0, 240, 0, 220],
  },
  // 5. Bond Shampoo
  {
    id: 'prod-5-shampoo',
    serviceIndex: 4,
    name: 'No.05 Bond-Plex Violet Shampoo',
    genderLabel: 'Unisex Formula',
    duration: '250 ml · 8.4 oz',
    price: '₹1,750',
    cropBox: [0, 240, 0, 220],
  },
  {
    id: 'prod-5-mask',
    serviceIndex: 4,
    name: 'Platinum Gloss Toning Masque',
    genderLabel: 'Girls & Women',
    duration: '200 g · 7.0 oz',
    price: '₹1,890',
    cropBox: [0, 240, 0, 220],
  },
  // 6. Hair Parfüm
  {
    id: 'prod-6-mist',
    serviceIndex: 5,
    name: 'Soie De Rose Couture Hair Mist',
    genderLabel: 'Girls & Women',
    duration: '90 ml · 3.0 oz',
    price: '₹2,600',
    cropBox: [0, 240, 0, 220],
  },
  {
    id: 'prod-6-balm',
    serviceIndex: 5,
    name: 'Velvet Rose Cuticle & Tip Balm',
    genderLabel: 'Unisex Formula',
    duration: '60 g · 2.0 oz',
    price: '₹980',
    cropBox: [0, 240, 0, 220],
  },
  // 7. Oud Beard Oil
  {
    id: 'prod-7-oil',
    serviceIndex: 6,
    name: 'Royal Cambodian Oud Beard Oil',
    genderLabel: 'Boys & Men',
    duration: '60 ml · 2.0 oz',
    price: '₹1,550',
    cropBox: [0, 240, 0, 220],
  },
  {
    id: 'prod-7-balm',
    serviceIndex: 6,
    name: 'Charcoal & Cedar Aftershave Salve',
    genderLabel: 'Boys & Men',
    duration: '100 g · 3.4 oz',
    price: '₹1,250',
    cropBox: [0, 240, 0, 220],
  },
  // 8. Scalp Tonic
  {
    id: 'prod-8-tonic',
    serviceIndex: 7,
    name: 'Bhringraj & Rosemary Root Tonic',
    genderLabel: 'Unisex Formula',
    duration: '150 ml · 5.0 oz',
    price: '₹1,450',
    cropBox: [0, 240, 0, 220],
  },
  {
    id: 'prod-8-scrub',
    serviceIndex: 7,
    name: 'Himalayan Salt Detox Scalp Scrub',
    genderLabel: 'Unisex Formula',
    duration: '180 g · 6.3 oz',
    price: '₹1,600',
    cropBox: [0, 240, 0, 220],
  },
];

export function wrapMod(x: number, n: number): number {
  return ((x % n) + n) % n;
}

export function clampVal(x: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, x));
}

export function computeModelDepth(index: number, p: number, totalModels: number): number {
  let d = wrapMod(index - p, totalModels);
  if (d > totalModels - 1) {
    d -= totalModels;
  }
  return d;
}

export function interpolateDepthTable(d: number, table: readonly number[]): number {
  const k = clampVal(d + 1, 0, 6);
  const a = Math.floor(k);
  const b = Math.min(6, a + 1);
  const t = k - a;
  return table[a] + (table[b] - table[a]) * t;
}

export function computeRailCardOffset(
  cardIndex: number,
  p: number,
  cardSize: number,
  totalCards: number
): number {
  const all = cardSize * totalCards;
  if (all <= 0) return 0;
  let y = wrapMod(cardIndex * cardSize - p * 2 * cardSize, all);
  if (y > all - cardSize) {
    y -= all;
  }
  return y;
}
