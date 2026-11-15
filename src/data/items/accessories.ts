import type { AccessoryItem, PaletteFamily, Variant } from '@/game/types';

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

function colorVariant(
  id: string,
  color: string,
  color2?: string,
  name = 'Signature',
): Variant {
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
  return {
    id,
    name,
    colors: color2 ? { primary: color, secondary: color2 } : { primary: color },
    family,
  };
}

function colorVariants(id: string, color: string, color2?: string): AccessoryItem['variants'] {
  return [colorVariant(id, color, color2)];
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
    variants: [
      colorVariant('cognac', '#7d492d', undefined, 'Cognac'),
      colorVariant('noir', '#221d24', undefined, 'Noir'),
      colorVariant('camel', '#b58d63', undefined, 'Camel'),
    ],
  },
  {
    id: 'bag_quilted_crossbody',
    name: 'Quilted Chain Crossbody',
    category: 'accessory',
    slot: 'bag',
    tags: ['formal', 'evening', 'glam'],
    unlock: { type: 'free' },
    asset: 'bag_quilted_crossbody',
    variants: [
      colorVariant('noir', '#1e1b22', undefined, 'Noir'),
      colorVariant('ivory', '#ece3d5', undefined, 'Pearl Ivory'),
      colorVariant('crimson', '#981f33', undefined, 'Crimson'),
    ],
  },
  {
    id: 'bag_mini_satchel',
    name: 'Mini Top-Handle Satchel',
    category: 'accessory',
    slot: 'bag',
    tags: ['corporate', 'girly'],
    unlock: { type: 'free' },
    asset: 'bag_mini_satchel',
    variants: [
      colorVariant('cherry', '#a83344', undefined, 'Cherry'),
      colorVariant('blush', '#deb2bc', undefined, 'Blush'),
      colorVariant('noir', '#221d24', undefined, 'Noir'),
    ],
  },
  {
    id: 'bag_beaded_clutch',
    name: 'Pearl-Clasp Evening Clutch',
    category: 'accessory',
    slot: 'bag',
    tags: ['evening', 'formal', 'romantic'],
    unlock: { type: 'free' },
    asset: 'bag_beaded_clutch',
    variants: [
      colorVariant('pearl', '#e6d8be', undefined, 'Champagne Pearl'),
      colorVariant('noir', '#242028', undefined, 'Obsidian'),
      colorVariant('rose', '#d9a4af', undefined, 'Rosewater'),
    ],
  },
  {
    id: 'bag_metallic_baguette',
    name: 'Silver Baguette Shoulder Bag',
    category: 'accessory',
    slot: 'bag',
    tags: ['evening', 'metallic', 'glam'],
    unlock: { type: 'free' },
    asset: 'bag_metallic_baguette',
    variants: [
      colorVariant('silver', '#c8cfd6', undefined, 'Chrome Silver'),
      colorVariant('gold', '#d4ad54', undefined, 'Molten Gold'),
      colorVariant('noir', '#26222c', undefined, 'Patent Noir'),
    ],
  },
  {
    id: 'bag_slouchy_hobo',
    name: 'Soft Suede Hobo Bag',
    category: 'accessory',
    slot: 'bag',
    tags: ['casual', 'boho'],
    unlock: { type: 'free' },
    asset: 'bag_slouchy_hobo',
    variants: [
      colorVariant('tobacco', '#8c6244', undefined, 'Tobacco Suede'),
      colorVariant('olive', '#58644f', undefined, 'Olive'),
      colorVariant('noir', '#272329', undefined, 'Noir'),
    ],
  },
  {
    id: 'bag_straw_tote',
    name: 'Woven Raffia Beach Tote',
    category: 'accessory',
    slot: 'bag',
    tags: ['beach', 'resort', 'summer'],
    unlock: { type: 'free' },
    asset: 'bag_straw_tote',
    variants: [
      colorVariant('navy', '#d8be8e', '#2f5a78', 'Natural & Navy'),
      colorVariant('terracotta', '#d8be8e', '#b5563c', 'Natural & Coral'),
    ],
  },
  {
    id: 'bag_bucket_bag',
    name: 'Drawstring Leather Bucket',
    category: 'accessory',
    slot: 'bag',
    tags: ['casual', 'boho'],
    unlock: { type: 'free' },
    asset: 'bag_bucket_bag',
    variants: [
      colorVariant('forest', '#3e4e44', undefined, 'Forest'),
      colorVariant('saddle', '#8a5534', undefined, 'Saddle'),
      colorVariant('noir', '#242026', undefined, 'Noir'),
    ],
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
    variants: colorVariants('signature', '#1e191e', '#261e28'),
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
    variants: colorVariants('signature', '#5a3520', '#3d2518'),
  },
  {
    id: 'shades_retro_oval',
    name: '90s Ivory Oval Shades',
    category: 'accessory',
    slot: 'glasses',
    tags: ['girly', 'casual', 'minimal'],
    unlock: { type: 'free' },
    asset: 'shades_retro_oval',
    variants: colorVariants('signature', '#f4efe6', '#222026'),
  },
  {
    id: 'shades_round_tortoise',
    name: 'Vintage Round Tortoiseshell',
    category: 'accessory',
    slot: 'glasses',
    tags: ['boho', 'romantic'],
    unlock: { type: 'free' },
    asset: 'shades_round_tortoise',
    variants: colorVariants('signature', '#6e3d1e', '#382a1e'),
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
    variants: colorVariants('signature', '#d97a96'),
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
    variants: [
      { id: 'gold', name: 'Gold', colors: { primary: 'gold' }, family: 'warm' },
      { id: 'silver', name: 'Silver', colors: { primary: 'silver' }, family: 'cool' },
      { id: 'rose', name: 'Rose', colors: { primary: 'rose' }, family: 'warm' },
    ],
  },
  {
    id: 'ear_pearl_drops',
    name: 'Freshwater Pearl Drops',
    category: 'accessory',
    slot: 'earrings',
    tags: ['formal', 'romantic'],
    unlock: { type: 'free' },
    asset: 'ear_pearl_drops',
    variants: [
      { id: 'gold', name: 'Gold', colors: { primary: 'gold' }, family: 'warm' },
      { id: 'silver', name: 'Silver', colors: { primary: 'silver' }, family: 'cool' },
    ],
  },
  {
    id: 'ear_crystal_chandelier',
    name: 'Diamond Marquis Drops',
    category: 'accessory',
    slot: 'earrings',
    tags: ['evening', 'glam', 'formal'],
    unlock: { type: 'free' },
    asset: 'ear_crystal_chandelier',
    variants: colorVariants('signature', '#d8f0ff'),
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
    variants: colorVariants('signature', '#1e7a52'),
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
    variants: colorVariants('signature', '#1e1922'),
  },
  {
    id: 'neck_cuban_collar',
    name: 'Chunky Cuban Link Collar',
    category: 'accessory',
    slot: 'necklace',
    tags: ['edgy', 'bold'],
    unlock: { type: 'free' },
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
  {
    id: 'neck_coral_beads',
    name: 'Edo Coral Bead Collar',
    category: 'accessory',
    slot: 'necklace',
    tags: ['nigerian', 'traditional', 'formal', 'bold'],
    unlock: { type: 'free' },
    asset: 'neck_coral_beads',
    variants: [
      colorVariant('coral', '#c83424', undefined, 'Royal Coral'),
      colorVariant('deep', '#8f1b18', undefined, 'Deep Oxblood'),
    ],
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
    variants: colorVariants('signature', '#f7f1e3'),
  },
  {
    id: 'watch_silver_chrono',
    name: 'Navy Dial Steel Chronograph',
    category: 'accessory',
    slot: 'watch',
    tags: ['sporty', 'casual'],
    unlock: { type: 'free' },
    asset: 'watch_silver_chrono',
    variants: colorVariants('signature', '#1e2c44'),
  },
  {
    id: 'watch_rose_mesh',
    name: 'Rose-Gold Milanese Mesh',
    category: 'accessory',
    slot: 'watch',
    tags: ['girly', 'romantic'],
    unlock: { type: 'free' },
    asset: 'watch_rose_mesh',
    variants: colorVariants('signature', '#fff5f3'),
  },
  {
    id: 'watch_leather_tank',
    name: 'Espresso Leather Tank Watch',
    category: 'accessory',
    slot: 'watch',
    tags: ['corporate', 'casual'],
    unlock: { type: 'free' },
    asset: 'watch_leather_tank',
    variants: colorVariants('signature', '#3b2416'),
  },
  {
    id: 'watch_diamond_bezel',
    name: 'Pavé Diamond Bezel Watch',
    category: 'accessory',
    slot: 'watch',
    tags: ['formal', 'evening', 'glam'],
    unlock: { type: 'free' },
    asset: 'watch_diamond_bezel',
    variants: colorVariants('signature', '#eef6fc'),
  },
  {
    id: 'watch_ceramic_sport',
    name: 'Ivory Ceramic Sport Watch',
    category: 'accessory',
    slot: 'watch',
    tags: ['sporty', 'minimal'],
    unlock: { type: 'free' },
    asset: 'watch_ceramic_sport',
    variants: colorVariants('signature', '#f2efe9'),
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
    variants: colorVariants('signature', '#dfd0ad', '#1e1b20'),
  },
  {
    id: 'acc_french_beret',
    name: 'Crimson Wool Beret',
    category: 'accessory',
    slot: 'hat',
    tags: ['edgy', 'winter', 'holiday'],
    unlock: { type: 'free' },
    asset: 'acc_french_beret',
    variants: [
      colorVariant('crimson', '#9e192d', undefined, 'Crimson'),
      colorVariant('noir', '#201c22', undefined, 'Noir'),
      colorVariant('camel', '#b8946a', undefined, 'Camel'),
    ],
  },
  {
    id: 'acc_gele_headtie',
    name: 'Sculpted Aso-Oke Gele',
    category: 'accessory',
    slot: 'hat',
    tags: ['nigerian', 'traditional', 'formal', 'glam'],
    unlock: { type: 'free' },
    asset: 'acc_gele_headtie',
    variants: [
      colorVariant('wine', '#8b1e2d', '#e6c35c', 'Wine & Gold'),
      colorVariant('emerald', '#155c44', '#e6c35c', 'Emerald & Gold'),
      colorVariant('royal', '#1d4488', '#e6c35c', 'Royal Blue & Gold'),
    ],
  },
  {
    id: 'acc_satin_headband',
    name: 'Padded Satin Headband',
    category: 'accessory',
    slot: 'hairAccessory',
    tags: ['girly', 'romantic'],
    unlock: { type: 'free' },
    asset: 'acc_satin_headband',
    variants: [
      colorVariant('emerald', '#2e4e44', undefined, 'Forest'),
      colorVariant('blush', '#dca4b2', undefined, 'Blush'),
      colorVariant('noir', '#221d24', undefined, 'Noir'),
    ],
  },
  {
    id: 'acc_silk_scarf',
    name: 'Knotted Silk Neck Scarf',
    category: 'accessory',
    slot: 'scarf',
    tags: ['corporate', 'silk', 'resort'],
    unlock: { type: 'free' },
    asset: 'acc_silk_scarf',
    variants: [
      colorVariant('crimson', '#b83344', '#f5e8d0', 'Crimson & Cream'),
      colorVariant('navy', '#243a68', '#f5e8d0', 'Navy & Cream'),
      colorVariant('emerald', '#1f5e4d', '#e8d090', 'Emerald & Gold'),
    ],
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
    variants: [
      colorVariant('noir', '#221c18', undefined, 'Noir'),
      colorVariant('cognac', '#7d492d', undefined, 'Cognac'),
      colorVariant('ivory', '#e8dfd1', undefined, 'Cream'),
    ],
  },
  {
    id: 'acc_chain_belt',
    name: 'Gold Chain Waist Belt',
    category: 'accessory',
    slot: 'belt',
    tags: ['evening', 'glam', 'metallic'],
    unlock: { type: 'free' },
    asset: 'acc_chain_belt',
    variants: [
      { id: 'gold', name: 'Gold', colors: { primary: 'gold' }, family: 'warm' },
      { id: 'silver', name: 'Silver', colors: { primary: 'silver' }, family: 'cool' },
    ],
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
    variants: [
      colorVariant('noir', '#1e1b22', undefined, 'Sheer Noir'),
      colorVariant('espresso', '#473026', undefined, 'Sheer Espresso'),
    ],
  },
  {
    id: 'acc_opera_gloves',
    name: 'Satin Opera Evening Gloves',
    category: 'accessory',
    slot: 'gloves',
    tags: ['formal', 'evening', 'glam'],
    unlock: { type: 'free' },
    asset: 'acc_opera_gloves',
    variants: [
      colorVariant('noir', '#1e1920', undefined, 'Satin Noir'),
      colorVariant('ivory', '#ece3d8', undefined, 'Ivory Silk'),
      colorVariant('crimson', '#8a1b2d', undefined, 'Crimson'),
    ],
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
