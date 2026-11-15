import type { BackgroundDef, FilterDef } from '@/game/types';

/** Photo backdrops, tagged by occasion (AGENT.md §5.8). */
export const BACKGROUNDS: BackgroundDef[] = [
  { id: 'bg-sandy-beach', name: 'Sandy Beach', tags: ['beach', 'summer', 'resort'], asset: 'placeholder_bg_sandy_beach' },
  { id: 'bg-beach-cafe', name: 'Beach Café Terrace', tags: ['beach', 'casual', 'resort'], asset: 'placeholder_bg_beach_cafe' },
  { id: 'bg-golden-dunes', name: 'Golden Hour Dunes', tags: ['summer', 'beach', 'minimal'], asset: 'placeholder_bg_golden_dunes' },
  { id: 'bg-soft-studio', name: 'Soft Studio', tags: ['minimal', 'formal'], asset: 'placeholder_bg_soft_studio' },
  { id: 'bg-cafe-terrace', name: 'Sidewalk Café', tags: ['casual', 'romantic', 'summer'], asset: 'placeholder_bg_cafe_terrace' },
  { id: 'bg-city-street', name: 'City Street', tags: ['casual', 'edgy', 'sporty'], asset: 'placeholder_bg_city_street' },
  { id: 'bg-rooftop', name: 'Rooftop at Dusk', tags: ['evening', 'romantic', 'glam'], asset: 'placeholder_bg_rooftop' },
  { id: 'bg-office', name: 'Modern Office', tags: ['corporate', 'minimal'], asset: 'placeholder_bg_office' },
  { id: 'bg-ballroom', name: 'Grand Ballroom', tags: ['formal', 'evening', 'romantic'], asset: 'placeholder_bg_ballroom' },
  { id: 'bg-pumpkin-patch', name: 'Pumpkin Patch', tags: ['holiday', 'cozy', 'casual'], asset: 'placeholder_bg_pumpkin_patch' },
  { id: 'bg-snowy-village', name: 'Snowy Village', tags: ['winter', 'holiday', 'cozy'], asset: 'placeholder_bg_snowy_village' },
  { id: 'bg-cozy-den', name: 'Cozy Den', tags: ['cozy', 'casual', 'knit'], asset: 'placeholder_bg_cozy_den' },
  { id: 'bg-club-lounge', name: 'VIP Night Club', tags: ['club', 'party', 'evening', 'bold'], asset: 'placeholder_bg_club_lounge' },
  { id: 'bg-owambe-hall', name: 'Owambe Marquee', tags: ['nigerian', 'traditional', 'formal', 'glam'], asset: 'placeholder_bg_owambe_hall' },
];

/** Photo filters; tags can earn the photo-match bonus (AGENT.md §5.8). */
export const FILTERS: FilterDef[] = [
  { id: 'none', name: 'No Filter', css: 'none', tags: [] },
  {
    id: 'golden',
    name: 'Golden Hour',
    css: 'sepia(0.22) saturate(1.18) hue-rotate(-8deg) brightness(1.03)',
    tags: ['summer', 'beach'],
  },
  {
    id: 'velvet-night',
    name: 'Velvet Night',
    css: 'contrast(1.08) saturate(1.22) hue-rotate(-10deg) brightness(0.95)',
    tags: ['club', 'evening', 'bold'],
  },
  {
    id: 'editorial-warm',
    name: 'Editorial Warm',
    css: 'sepia(0.14) contrast(1.08) saturate(1.14)',
    tags: ['formal', 'glam', 'nigerian'],
  },
  {
    id: 'runway-flash',
    name: 'Runway Flash',
    css: 'contrast(1.14) brightness(1.05) saturate(1.06)',
    tags: ['party', 'glam'],
  },
  {
    id: 'cool-breeze',
    name: 'Cool Breeze',
    css: 'saturate(0.9) hue-rotate(12deg) brightness(1.04)',
    tags: [],
  },
  { id: 'mono', name: 'Monochrome', css: 'grayscale(1) contrast(1.06)', tags: ['minimal'] },
];

export const DEFAULT_BACKGROUND_ID = 'bg-sandy-beach';
export const DEFAULT_FILTER_ID = 'none';
