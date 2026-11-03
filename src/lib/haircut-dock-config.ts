export type HaircutCategory = 'all' | 'men' | 'women';

export type DockPerson = {
  id: string;
  name: string;
  role: string;
  category: 'men' | 'women';
  price: string;
  duration: string;
  technique: string;
  cover: string;
  thumb: string;
};

export type Tile = {
  r: number;
  c: number;
  person: number;
};

export type Wall = {
  cols: number;
  rows: number;
  tiles: Tile[];
  hole: {
    c0: number;
    r0: number;
    cols: number;
    rows: number;
  };
};

export const POOL = 12; // cover layers, so overlapping flights each get one
export const FLY = { min: 0.38, max: 0.68, pace: 2.2 }; // flight length from the hover gap
export const CELL = 118; // target tile size, px
export const EASE = 0.16; // per-frame approach of scale, offset and opacity
export const PUSH = 0.42; // how far tiles part around the cursor, in tiles
export const POP = 1.26; // autoplay's pop scale

// A wall of tiles with a balanced centered hole for the editorial showcase card
export function buildWall(w: number, h: number, n: number): Wall {
  const safeN = Math.max(1, n);
  const cols = Math.max(5, Math.round(w / CELL));
  const rows = Math.max(5, Math.round(h / CELL));
  const hc = Math.min(cols - 2, Math.max(3, Math.round(cols * (w < 640 ? 0.62 : 0.36))));
  const hr = Math.min(rows - 2, Math.max(3, Math.round(rows * 0.72)));
  const c0 = Math.floor((cols - hc) / 2);
  const r0 = Math.floor((rows - hr) / 2);
  const tiles: Tile[] = [];
  let seq = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (r < r0 || r >= r0 + hr || c < c0 || c >= c0 + hc) {
        tiles.push({ r, c, person: seq % safeN });
        seq++;
      }
    }
  }
  return { cols, rows, tiles, hole: { c0, r0, cols: hc, rows: hr } };
}

export function filterHaircutDesigns(
  designs: DockPerson[],
  category: HaircutCategory
): DockPerson[] {
  if (category === 'all') return designs;
  return designs.filter((d) => d.category === category);
}

// Editorial SVG portrait fallback if an external portrait is ever offline
export function createPortraitFallbackDataUri(name: string, role: string, index: number): string {
  const palettes = [
    ['#1c1917', '#78350f', '#f59e0b'],
    ['#0f172a', '#1e293b', '#eab308'],
    ['#18181b', '#3f3f46', '#d4a373'],
    ['#27171c', '#6b2d3c', '#f3c6b6'],
  ];
  const [c1, c2, accent] = palettes[index % palettes.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${c1}"/>
        <stop offset="100%" stop-color="${c2}"/>
      </linearGradient>
    </defs>
    <rect width="600" height="600" fill="url(#g)"/>
    <circle cx="300" cy="230" r="96" fill="${accent}" fill-opacity="0.22" stroke="${accent}" stroke-width="2"/>
    <path d="M160 510 C160 390 440 390 440 510" fill="${accent}" fill-opacity="0.16" stroke="${accent}" stroke-width="2"/>
    <text x="300" y="545" text-anchor="middle" fill="#f4f4f5" font-family="Georgia, serif" font-size="24">${name}</text>
    <text x="300" y="575" text-anchor="middle" fill="${accent}" font-family="sans-serif" font-size="13" letter-spacing="3">${role}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

type RawHaircutTuple = [
  url: string,
  name: string,
  role: string,
  category: 'men' | 'women',
  price: string,
  duration: string,
  technique: string,
];

// 20 Curated Unisex Salon Haircut & Styling Design Portraits (Boys & Girls)
const RAW_HAIRCUT_LOOKS: RawHaircutTuple[] = [
  [
    'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=800&q=85',
    'Textured Skin Fade',
    'Boys · Master Barber Cut',
    'men',
    '₹950',
    '45 Min',
    'Zero-Gap Foil Taper & Point-Cut Crown Texture',
  ],
  [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=85',
    'Butterfly Layer Cut',
    'Girls · Signature Blowout',
    'women',
    '₹1,650',
    '60 Min',
    'Internal Weight Removal & Round-Brush Silk Bounce',
  ],
  [
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=85',
    'Classic Pompadour Sculpt',
    'Men · Precision Barber Craft',
    'men',
    '₹1,250',
    '50 Min',
    'VG-10 Scissor Over Comb & Straight-Razor Cheek Line',
  ],
  [
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=85',
    'French Balayage Waves',
    'Women · Dimensional Colour',
    'women',
    '₹3,400',
    '120 Min',
    'Hand-Painted Honey Ribbons & Argan Gloss Seal',
  ],
  [
    'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800&q=85',
    'Velvet Curtain Bangs',
    'Girls · Face-Framing Cut',
    'women',
    '₹1,400',
    '45 Min',
    'Slide-Cut Cheekbone Grazing Fringe & Soft Ends',
  ],
  [
    'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=800&q=85',
    'Razor Low Drop Fade',
    'Boys · Street Crop & Line-Up',
    'men',
    '₹900',
    '40 Min',
    'Compressed Occipital Drop Fade & Matte Clay Finish',
  ],
  [
    'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=85',
    'Sleek Glass Hair Bob',
    'Women · Keratin Mirror Finish',
    'women',
    '₹2,200',
    '65 Min',
    'Laser-Sharp Jawline Perimeter & Amino Silk Press',
  ],
  [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=85',
    'Executive Taper & Quiff',
    'Men · Bespoke Scissor Cut',
    'men',
    '₹1,150',
    '45 Min',
    'Graduated Temple Taper & Blow-Dried Forelock Lift',
  ],
  [
    'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=85',
    'Honey Caramel Long Layers',
    'Women · Gloss & Feather Cut',
    'women',
    '₹1,900',
    '60 Min',
    'Long Cascading Face Frame & Botanical Shine Mist',
  ],
  [
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=85',
    'Korean Two-Block Fringe',
    'Boys · Soft Textured Volume',
    'men',
    '₹1,100',
    '45 Min',
    'Disconnected Undercut Base & Airy Texturized Crown',
  ],
  [
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=85',
    'Silk Press & Bottleneck Fringe',
    'Girls · Couture Styling',
    'women',
    '₹1,600',
    '50 Min',
    'Soft Arch Brow-Skimming Bangs & Thermal Silk Polish',
  ],
  [
    'https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=800&q=85',
    'Curly Burst Fade & Taper',
    'Boys · Natural Curl Definition',
    'men',
    '₹1,050',
    '45 Min',
    'Semi-Circular Ear Burst Fade & Botanical Curl Cream',
  ],
  [
    'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=800&q=85',
    'Parisian Blunt Clavicle Lob',
    'Women · Architectural Cut',
    'women',
    '₹1,800',
    '55 Min',
    'Zero-Elevation Collarbone Cut & Subtle Internal Bevel',
  ],
  [
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=85',
    'High Skin Fade & Messy Crop',
    'Boys · Matte Clay Finish',
    'men',
    '₹950',
    '40 Min',
    'High Bald Fade Transition & Choppy Point-Cut Fringe',
  ],
  [
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=85',
    'Bridal Hollywood Silk Waves',
    'Women · Couture Updo & Glow',
    'women',
    '₹2,800',
    '90 Min',
    'Sculpted S-Wave Pin Setting & 24K Gold Elixir Veil',
  ],
  [
    'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=800&q=85',
    'Razor Taper & Beard Contour',
    'Men · Hot-Towel Barber Ritual',
    'men',
    '₹1,350',
    '55 Min',
    'Hot-Towel Straight-Razor Line-Up & Oud Oil Conditioning',
  ],
  [
    'https://images.unsplash.com/photo-1517365830460-955ce3ccd263?auto=format&fit=crop&w=800&q=85',
    'Copper Spice Layered Curls',
    'Girls · Botanical Curl Spa',
    'women',
    '₹2,100',
    '70 Min',
    'Dry Curl-by-Curl Sculpting & Hydro-Lock Steam Infusion',
  ],
  [
    'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=85',
    'Mid Taper & Textured Twists',
    'Boys · Precision Line-Up',
    'men',
    '₹1,050',
    '45 Min',
    'Sharp Temple Line-Up & Sponge-Defined Crown Coil',
  ],
  [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=85&sat=-15',
    'Modern Shag & Wolf Cut',
    'Unisex · Editorial Texture',
    'men',
    '₹1,750',
    '55 Min',
    'Feather-Razor Crown Layers & Sea-Salt Diffused Movement',
  ],
  [
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=85&fp-y=0.35',
    'Feather-Light Wispy Bangs',
    'Girls · Airy Volume Cut',
    'women',
    '₹1,500',
    '50 Min',
    'Micro-Serrated Texturizing Shear & Weightless Crown Lift',
  ],
];

export const HAIRCUT_DESIGNS: DockPerson[] = RAW_HAIRCUT_LOOKS.map(
  ([url, name, role, category, price, duration, technique], idx) => ({
    id: `style-${idx + 1}`,
    name,
    role,
    category,
    price,
    duration,
    technique,
    cover: url,
    thumb: url.replace('&w=800&', '&w=320&'),
  })
);

