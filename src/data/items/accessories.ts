import type { AccessoryItem, PaletteFamily } from '@/game/types';

/**
 * Accessory catalog, migrated to the accessory generator library in
 * `assets/placeholder/accessoriesArt.ts` (ids mirror ACCESSORY_CATALOG), plus
 * the two legacy items (tropical hair flower, beaded anklet) whose generators
 * have no new counterpart. Metal colors ('gold'/'silver'/'rose') are passed
 * through to the generators' metal gradient selector.
 */

function fam(metalOrHex: string): PaletteFamily {
  if (metalOrHex === 'gold' || metalOrHex === 'rose') return 'warm';
  if (metalOrHex === 'silver') return 'cool';
  return 'neutral';
}

function metalVariant(id: string, metal: 'gold' | 'silver' | 'rose'): AccessoryItem['variants'] {
  return [
    {
      id,
      name: metal.charAt(0).toUpperCase() + metal.slice(1),
      colors: { primary: metal },
      family: fam(metal),
    },
  ];
}

function colorVariant(id: string, color: string, color2?: string): AccessoryItem['variants'] {
  const family: PaletteFamily = (() => {
    if (color === 'gold' || color === 'rose') return 'warm';
    if (color === 'silver') return 'cool';
    const m = color.replace('#', '');
    if (m.length < 6) return 'neutral';
    const r = parseInt(m.slice(0, 2), 16);
    const g = parseInt(m.slice(2, 4), 16);
    const b = parseInt(m.slice(4, 6), 16);
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 510;
    const s = max === min ? 0 : (max - min) / (255 - Math.abs(max + min - 255));
    if (s < 0.16 || l < 0.1 || l > 0.93) return 'neutral';
    if (l > 0.72 && s < 0.55) return 'pastel';
    if (l < 0.42 && s > 0.45) return 'jewel';
    return 'cool';
  })();
  return [
    {
      id,
      name: 'Signature',
      colors: color2 ? { primary: color, secondary: color2 } : { primary: color },
      family,
    },
  ];
}

export const ACCESSORY_ITEMS: AccessoryItem[] = [
  // ---------- Bags ----------
  {
    id: 'bag_leather_tote',
    name: 'Structured Leather Tote',
    category: 'accessory',
    slot: 'bag',
    tags: ['casual', 'corporate'],
    unlock: { type: 'free' },
    asset: 'bag_leather_tote',
    variants: colorVariant('signature', '#7d492d'),
  },
  {
    id: 'bag_quilted_crossbody',
    name: 'Quilted Chain Crossbody',
    category: 'accessory',
    slot: 'bag',
    tags: ['formal', 'evening', 'glam'],
    unlock: { type: 'coins', cost: 30 },
    asset: 'bag_quilted_crossbody',
    variants: colorVariant('signature', '#1e1b22'),
  },
  {
    id: 'bag_mini_satchel',
    name: 'Mini Top-Handle Satchel',
    category: 'accessory',
    slot: 'bag',
    tags: ['corporate', 'girly'],
    unlock: { type: 'free' },
    asset: 'bag_mini_satchel',
    variants: colorVariant('signature', '#a83344'),
  },
  {
    id: 'bag_beaded_clutch',
    name: 'Pearl-Clasp Evening Clutch',
    category: 'accessory',
    slot: 'bag',
    tags: ['evening', 'formal', 'romantic'],
    unlock: { type: 'free' },
    asset: 'bag_beaded_clutch',
    variants: colorVariant('signature', '#e6d8be'),
  },
  {
    id: 'bag_metallic_baguette',
    name: 'Silver Baguette Shoulder Bag',
    category: 'accessory',
    slot: 'bag',
    tags: ['evening', 'metallic', 'glam'],
    unlock: { type: 'coins', cost: 35 },
    asset: 'bag_metallic_baguette',
    variants: colorVariant('signature', '#c8cfd6'),
  },
  {
    id: 'bag_slouchy_hobo',
    name: 'Soft Suede Hobo Bag',
    category: 'accessory',
    slot: 'bag',
    tags: ['casual', 'boho'],
    unlock: { type: 'free' },
    asset: 'bag_slouchy_hobo',
    variants: colorVariant('signature', '#8c6244'),
  },
  {
    id: 'bag_straw_tote',
    name: 'Woven Raffia Beach Tote',
    category: 'accessory',
    slot: 'bag',
    tags: ['beach', 'resort', 'summer'],
    unlock: { type: 'free' },
    asset: 'bag_straw_tote',
    variants: colorVariant('signature', '#d8be8e', '#2f5a78'),
  },
  {
    id: 'bag_bucket_bag',
    name: 'Drawstring Leather Bucket',
    category: 'accessory',
    slot: 'bag',
    tags: ['casual', 'boho'],
    unlock: { type: 'free' },
    asset: 'bag_bucket_bag',
    variants: colorVariant('signature', '#3e4e44'),
  },

  // ---------- Sunglasses ----------
  {
    id: 'shades_cateye',
    name: 'Noir Cat-Eye Frames',
    category: 'accessory',
    slot: 'glasses',
    tags: ['glam', 'edgy'],
    unlock: { type: 'free' },
    asset: 'shades_cateye',
    variants: colorVariant('signature', '#1e191e', '#261e28'),
  },
  {
    id: 'shades_aviator',
    name: 'Gold-Rim Aviators',
    category: 'accessory',
    slot: 'glasses',
    tags: ['sporty', 'resort'],
    unlock: { type: 'free' },
    asset: 'shades_aviator',
    variants: metalVariant('gold', 'gold'),
  },
  {
    id: 'shades_square',
    name: 'Oversized Tortoise Squares',
    category: 'accessory',
    slot: 'glasses',
    tags: ['glam', 'bold'],
    unlock: { type: 'free' },
    asset: 'shades_square',
    variants: colorVariant('signature', '#5a3520', '#3d2518'),
  },
  {
    id: 'shades_retro_oval',
    name: '90s Ivory Oval Shades',
    category: 'accessory',
    slot: 'glasses',
    tags: ['girly', 'casual', 'minimal'],
    unlock: { type: 'free' },
    asset: 'shades_retro_oval',
    variants: colorVariant('signature', '#f4efe6', '#222026'),
  },
  {
    id: 'shades_round_tortoise',
    name: 'Vintage Round Tortoiseshell',
    category: 'accessory',
    slot: 'glasses',
    tags: ['boho', 'romantic'],
    unlock: { type: 'free' },
    asset: 'shades_round_tortoise',
    variants: colorVariant('signature', '#6e3d1e', '#382a1e'),
  },
  {
    id: 'shades_hex_rose',
    name: 'Geometric Rose-Tint Hex',
    category: 'accessory',
    slot: 'glasses',
    tags: ['glam', 'girly'],
    unlock: { type: 'free' },
    asset: 'shades_hex_rose',
    variants: metalVariant('gold', 'gold'),
  },
  {
    id: 'shades_rimless_shield',
    name: 'Rimless Blush Shield',
    category: 'accessory',
    slot: 'glasses',
    tags: ['sporty', 'minimal'],
    unlock: { type: 'free' },
    asset: 'shades_rimless_shield',
    variants: colorVariant('signature', '#d97a96'),
  },

  // ---------- Earrings ----------
  {
    id: 'ear_gold_hoops',
    name: 'Sculpted Gold Hoops',
    category: 'accessory',
    slot: 'earrings',
    tags: ['casual', 'resort'],
    unlock: { type: 'free' },
    asset: 'ear_gold_hoops',
    variants: metalVariant('gold', 'gold'),
  },
  {
    id: 'ear_pearl_drops',
    name: 'Freshwater Pearl Drops',
    category: 'accessory',
    slot: 'earrings',
    tags: ['formal', 'romantic'],
    unlock: { type: 'free' },
    asset: 'ear_pearl_drops',
    variants: metalVariant('gold', 'gold'),
  },
  {
    id: 'ear_crystal_chandelier',
    name: 'Diamond Marquis Drops',
    category: 'accessory',
    slot: 'earrings',
    tags: ['evening', 'glam', 'formal'],
    unlock: { type: 'coins', cost: 30 },
    asset: 'ear_crystal_chandelier',
    variants: colorVariant('signature', '#d8f0ff'),
  },
  {
    id: 'ear_teardrop_studs',
    name: 'Molten Gold Teardrops',
    category: 'accessory',
    slot: 'earrings',
    tags: ['minimal', 'corporate'],
    unlock: { type: 'free' },
    asset: 'ear_teardrop_studs',
    variants: metalVariant('gold', 'gold'),
  },
  {
    id: 'ear_emerald_huggies',
    name: 'Emerald Baguette Huggies',
    category: 'accessory',
    slot: 'earrings',
    tags: ['evening', 'bold'],
    unlock: { type: 'free' },
    asset: 'ear_emerald_huggies',
    variants: colorVariant('signature', '#1e7a52'),
  },
  {
    id: 'ear_chain_links',
    name: 'Double-Link Chain Drops',
    category: 'accessory',
    slot: 'earrings',
    tags: ['casual', 'edgy'],
    unlock: { type: 'free' },
    asset: 'ear_chain_links',
    variants: metalVariant('gold', 'gold'),
  },
  {
    id: 'ear_celestial_stars',
    name: 'Celestial Star Drops',
    category: 'accessory',
    slot: 'earrings',
    tags: ['romantic', 'girly'],
    unlock: { type: 'free' },
    asset: 'ear_celestial_stars',
    variants: metalVariant('gold', 'gold'),
  },

  // ---------- Necklaces ----------
  {
    id: 'neck_pearl_strand',
    name: 'Classic Pearl Strand',
    category: 'accessory',
    slot: 'necklace',
    tags: ['formal', 'romantic'],
    unlock: { type: 'free' },
    asset: 'neck_pearl_strand',
    variants: metalVariant('gold', 'gold'),
  },
  {
    id: 'neck_layered_chains',
    name: 'Triple-Tier Gold Chains',
    category: 'accessory',
    slot: 'necklace',
    tags: ['casual', 'edgy'],
    unlock: { type: 'free' },
    asset: 'neck_layered_chains',
    variants: metalVariant('gold', 'gold'),
  },
  {
    id: 'neck_diamond_solitaire',
    name: 'Diamond Solitaire Pendant',
    category: 'accessory',
    slot: 'necklace',
    tags: ['formal', 'minimal', 'romantic'],
    unlock: { type: 'free' },
    asset: 'neck_diamond_solitaire',
    variants: metalVariant('silver', 'silver'),
  },
  {
    id: 'neck_velvet_choker',
    name: 'Velvet & Crystal Choker',
    category: 'accessory',
    slot: 'necklace',
    tags: ['edgy', 'evening', 'bold'],
    unlock: { type: 'free' },
    asset: 'neck_velvet_choker',
    variants: colorVariant('signature', '#1e1922'),
  },
  {
    id: 'neck_cuban_collar',
    name: 'Chunky Cuban Link Collar',
    category: 'accessory',
    slot: 'necklace',
    tags: ['edgy', 'bold'],
    unlock: { type: 'coins', cost: 30 },
    asset: 'neck_cuban_collar',
    variants: metalVariant('gold', 'gold'),
  },
  {
    id: 'neck_lariat_emerald',
    name: 'Emerald Y-Drop Lariat',
    category: 'accessory',
    slot: 'necklace',
    tags: ['evening', 'glam'],
    unlock: { type: 'free' },
    asset: 'neck_lariat_emerald',
    variants: metalVariant('gold', 'gold'),
  },
  {
    id: 'neck_heart_locket',
    name: 'Rose-Gold Heart Locket',
    category: 'accessory',
    slot: 'necklace',
    tags: ['romantic', 'girly'],
    unlock: { type: 'free' },
    asset: 'neck_heart_locket',
    variants: metalVariant('rose', 'rose'),
  },

  // ---------- Wristwatches ----------
  {
    id: 'watch_gold_classic',
    name: 'Champagne Dial Gold Watch',
    category: 'accessory',
    slot: 'watch',
    tags: ['corporate', 'minimal'],
    unlock: { type: 'free' },
    asset: 'watch_gold_classic',
    variants: colorVariant('signature', '#f7f1e3'),
  },
  {
    id: 'watch_silver_chrono',
    name: 'Navy Dial Steel Chronograph',
    category: 'accessory',
    slot: 'watch',
    tags: ['sporty', 'casual'],
    unlock: { type: 'free' },
    asset: 'watch_silver_chrono',
    variants: colorVariant('signature', '#1e2c44'),
  },
  {
    id: 'watch_rose_mesh',
    name: 'Rose-Gold Milanese Mesh',
    category: 'accessory',
    slot: 'watch',
    tags: ['girly', 'romantic'],
    unlock: { type: 'free' },
    asset: 'watch_rose_mesh',
    variants: colorVariant('signature', '#fff5f3'),
  },
  {
    id: 'watch_leather_tank',
    name: 'Espresso Leather Tank Watch',
    category: 'accessory',
    slot: 'watch',
    tags: ['corporate', 'casual'],
    unlock: { type: 'free' },
    asset: 'watch_leather_tank',
    variants: colorVariant('signature', '#3b2416'),
  },
  {
    id: 'watch_diamond_bezel',
    name: 'Pavé Diamond Bezel Watch',
    category: 'accessory',
    slot: 'watch',
    tags: ['formal', 'evening', 'glam'],
    unlock: { type: 'coins', cost: 35 },
    asset: 'watch_diamond_bezel',
    variants: colorVariant('signature', '#eef6fc'),
  },
  {
    id: 'watch_ceramic_sport',
    name: 'Ivory Ceramic Sport Watch',
    category: 'accessory',
    slot: 'watch',
    tags: ['sporty', 'minimal'],
    unlock: { type: 'free' },
    asset: 'watch_ceramic_sport',
    variants: colorVariant('signature', '#f2efe9'),
  },

  // ---------- Hats, Hair & Scarves ----------
  {
    id: 'acc_sun_hat',
    name: 'Wide-Brim Riviera Sun Hat',
    category: 'accessory',
    slot: 'hat',
    tags: ['beach', 'resort', 'summer'],
    unlock: { type: 'free' },
    asset: 'acc_sun_hat',
    variants: colorVariant('signature', '#dfd0ad', '#1e1b20'),
  },
  {
    id: 'acc_french_beret',
    name: 'Crimson Wool Beret',
    category: 'accessory',
    slot: 'hat',
    tags: ['edgy', 'winter', 'holiday'],
    unlock: { type: 'free' },
    asset: 'acc_french_beret',
    variants: colorVariant('signature', '#9e192d'),
  },
  {
    id: 'acc_satin_headband',
    name: 'Padded Satin Headband',
    category: 'accessory',
    slot: 'hairAccessory',
    tags: ['girly', 'romantic'],
    unlock: { type: 'free' },
    asset: 'acc_satin_headband',
    variants: colorVariant('signature', '#2e4e44'),
  },
  {
    id: 'acc_silk_scarf',
    name: 'Knotted Silk Neck Scarf',
    category: 'accessory',
    slot: 'scarf',
    tags: ['corporate', 'silk', 'resort'],
    unlock: { type: 'free' },
    asset: 'acc_silk_scarf',
    variants: colorVariant('signature', '#b83344', '#f5e8d0'),
  },

  // ---------- Belts ----------
  {
    id: 'acc_leather_belt',
    name: 'Gold-Buckle Waist Belt',
    category: 'accessory',
    slot: 'belt',
    tags: ['edgy', 'casual'],
    unlock: { type: 'free' },
    asset: 'acc_leather_belt',
    variants: colorVariant('signature', '#221c18'),
  },
  {
    id: 'acc_chain_belt',
    name: 'Gold Chain Waist Belt',
    category: 'accessory',
    slot: 'belt',
    tags: ['evening', 'glam', 'metallic'],
    unlock: { type: 'coins', cost: 25 },
    asset: 'acc_chain_belt',
    variants: metalVariant('gold', 'gold'),
  },

  // ---------- Hosiery & Gloves ----------
  {
    id: 'acc_sheer_tights',
    name: 'Sheer Noir Tights',
    category: 'accessory',
    slot: 'hosiery',
    tags: ['edgy', 'evening'],
    unlock: { type: 'free' },
    asset: 'acc_sheer_tights',
    variants: colorVariant('signature', '#1e1b22'),
  },
  {
    id: 'acc_opera_gloves',
    name: 'Satin Opera Evening Gloves',
    category: 'accessory',
    slot: 'gloves',
    tags: ['formal', 'evening', 'glam'],
    unlock: { type: 'coins', cost: 40 },
    asset: 'acc_opera_gloves',
    variants: colorVariant('signature', '#1e1920'),
  },

  // ---------- Legacy items (generators without a new counterpart) ----------
  {
    id: 'acc-flower-tropical',
    name: 'Tropical Hair Flower',
    category: 'accessory',
    slot: 'hairAccessory',
    tags: ['beach', 'romantic', 'bold'],
    unlock: { type: 'free' },
    asset: 'placeholder_acc_flower_tropical',
    variants: [{ id: 'hibiscus', name: 'Hibiscus', colors: { primary: '#e0607e' }, family: 'warm' }],
  },
  {
    id: 'acc-anklet-beads',
    name: 'Beaded Anklet',
    category: 'accessory',
    slot: 'anklet',
    tags: ['beach', 'boho'],
    unlock: { type: 'free' },
    asset: 'placeholder_acc_anklet_beads',
    variants: [{ id: 'turquoise', name: 'Turquoise', colors: { primary: '#5fa8a0' }, family: 'cool' }],
  },
];
