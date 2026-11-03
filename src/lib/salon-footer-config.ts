export interface FooterLinkItem {
  label: string;
  href: string;
}

export interface FooterColumn {
  id: string;
  title: string;
  links: FooterLinkItem[];
}

export interface SalonBranch {
  id: string;
  name: string;
  area: string;
  city: string;
  address: string;
  hours: string;
  phone: string;
}

export const SALON_BRANCHES: SalonBranch[] = [
  {
    id: 'rajkot-kotecha',
    name: 'Blossom Salon — Kotecha Circle, Rajkot',
    area: 'Kotecha Cir · Rajkot',
    city: 'Rajkot',
    address: 'Fitness 5 gym, Kotecha Cir, Jala Ram Nagar, Rajkot, Gujarat 360007',
    hours: '10:00 AM – 09:00 PM (Daily)',
    phone: '096380 55173',
  },
  {
    id: 'alkapuri-flagship',
    name: 'Blossom Salon — Alkapuri',
    area: 'Alkapuri',
    city: 'Vadodara',
    address: '2nd Floor, Emerald One, R.C. Dutt Road, Alkapuri, Vadodara 390007',
    hours: '10:00 AM – 09:00 PM (Daily)',
    phone: '+91 265 235 8900',
  },
  {
    id: 'bhayli-prive',
    name: 'Blossom Salon — Bhayli',
    area: 'Sevasi · Bhayli',
    city: 'Vadodara',
    address: 'Studio 104, The Crest, Priya Cinema Road, Bhayli, Vadodara 391410',
    hours: '10:00 AM – 09:30 PM (Daily)',
    phone: '+91 265 235 8911',
  },
];

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    id: 'explore',
    title: 'Explore',
    links: [
      { label: 'Home', href: '#home' },
      { label: 'Our Products', href: '#services' },
      { label: 'Signature Haircuts', href: '#haircuts' },
      { label: 'Book Appointment', href: '#haircuts' },
    ],
  },
  {
    id: 'services',
    title: 'Unisex Services',
    links: [
      { label: 'Haircut & Styling', href: '#haircuts' },
      { label: 'Balayage & Hair Colour', href: '#haircuts' },
      { label: '24K Keratin & Hair Spa', href: '#services' },
      { label: 'Bridal & Grooming', href: '#haircuts' },
    ],
  },
  {
    id: 'connect',
    title: 'Connect',
    links: [
      { label: 'Instagram', href: '#footer' },
      { label: 'WhatsApp Concierge', href: '#footer' },
      { label: 'Google Maps (Vadodara)', href: '#footer' },
      { label: 'Privacy & Terms', href: '#home' },
    ],
  },
];

export function validateVipRequest(contact: string): {
  valid: boolean;
  error?: string;
  normalized?: string;
} {
  const trimmed = contact.trim();
  if (!trimmed) {
    return {
      valid: false,
      error: 'Please enter your mobile number or email.',
    };
  }
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
  const digitsOnly = trimmed.replace(/[\s\-+()]/g, '');
  const isPhone = /^\d{10,13}$/.test(digitsOnly);

  if (!isEmail && !isPhone) {
    return {
      valid: false,
      error: 'Enter a valid 10-digit mobile number or email.',
    };
  }
  return {
    valid: true,
    normalized: trimmed,
  };
}

export function getBranchById(branchId: string): SalonBranch {
  return SALON_BRANCHES.find((b) => b.id === branchId) ?? SALON_BRANCHES[0];
}
