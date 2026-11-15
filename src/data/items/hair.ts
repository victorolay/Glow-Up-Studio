import type { HairItem, HairVariant } from '@/game/types';
import { HAIR_COLORS } from './customization';

const COLOR_VARIANTS: HairVariant[] = HAIR_COLORS.map((c) => ({
  id: c.id,
  name: c.name,
  colors: { primary: c.base },
  family: c.family,
}));

function hairStyle(
  id: string,
  name: string,
  tags: HairItem['tags'],
  asset: string,
): HairItem {
  return {
    id,
    name,
    tags,
    category: 'hair',
    unlock: { type: 'free' },
    asset,
    variants: COLOR_VARIANTS,
  };
}

/**
 * Hair & wig catalog (30 styles). Each style renders a hairBack + hairFront
 * layer pair from hairArt / hairArtExtra; colors come from HAIR_COLORS.
 */
export const HAIR_ITEMS: HairItem[] = [
  hairStyle('hair-long-waves', 'Long Waves', ['romantic', 'casual'], 'placeholder_hair_long_waves'),
  hairStyle('hair-beach-braids', 'Beach Braids', ['beach', 'boho', 'casual'], 'placeholder_hair_beach_braids'),
  hairStyle('hair-sleek-bun', 'Sleek Bun', ['corporate', 'formal', 'minimal'], 'placeholder_hair_sleek_bun'),
  hairStyle('hair-curly-bob', 'Curly Bob', ['casual', 'girly'], 'placeholder_hair_curly_bob'),
  hairStyle('hair-ponytail', 'High Ponytail', ['sporty', 'casual'], 'placeholder_hair_ponytail'),
  hairStyle('hair-short-crop', 'Pixie Crop', ['edgy', 'minimal', 'bold'], 'placeholder_hair_short_crop'),
  hairStyle('hair-elegant-updo', 'Elegant Updo', ['formal', 'evening', 'romantic', 'minimal'], 'placeholder_hair_elegant_updo'),
  hairStyle('hair-natural-afro', 'Natural Afro', ['natural', 'casual', 'bold'], 'placeholder_hair_natural_afro'),

  // 22 New Wigs & Hairstyles
  hairStyle('hair-silk-press', 'Silk Press Waist Wig', ['formal', 'evening', 'glam', 'silk'], 'placeholder_hair_silk_press'),
  hairStyle('hair-hollywood-waves', 'Old Hollywood Waves Wig', ['formal', 'evening', 'glam', 'romantic'], 'placeholder_hair_hollywood_waves'),
  hairStyle('hair-lacefront-bodywave', 'Body Wave Lace Front', ['glam', 'party', 'club', 'romantic'], 'placeholder_hair_lacefront_bodywave'),
  hairStyle('hair-butterfly-layers', 'Feathered Butterfly Layers', ['casual', 'romantic', 'glam'], 'placeholder_hair_butterfly_layers'),
  hairStyle('hair-blunt-glass-bob', 'Blunt Glass Bob Wig', ['corporate', 'minimal', 'club', 'edgy'], 'placeholder_hair_blunt_glass_bob'),
  hairStyle('hair-asym-lob', 'Asymmetric Chic Lob', ['edgy', 'corporate', 'bold'], 'placeholder_hair_asym_lob'),
  hairStyle('hair-french-bob-bangs', 'French Bob & Bangs', ['romantic', 'casual', 'girly'], 'placeholder_hair_french_bob_bangs'),
  hairStyle('hair-knotless-box-braids', 'Waist Knotless Box Braids', ['nigerian', 'traditional', 'casual', 'bold'], 'placeholder_hair_knotless_box_braids'),
  hairStyle('hair-fulani-braids', 'Fulani Beaded Braids', ['nigerian', 'traditional', 'boho', 'bold'], 'placeholder_hair_fulani_braids'),
  hairStyle('hair-goddess-locs', 'Goddess Boho Locs', ['boho', 'beach', 'nigerian', 'romantic'], 'placeholder_hair_goddess_locs'),
  hairStyle('hair-shuku-braids', 'Royal Shuku Crown Braids', ['nigerian', 'traditional', 'formal', 'glam'], 'placeholder_hair_shuku_braids'),
  hairStyle('hair-passion-twists', 'Springy Passion Twists', ['casual', 'resort', 'nigerian', 'romantic'], 'placeholder_hair_passion_twists'),
  hairStyle('hair-pineapple-curls', 'Pineapple Puff Updo', ['natural', 'casual', 'sporty', 'girly'], 'placeholder_hair_pineapple_curls'),
  hairStyle('hair-wash-go-ringlets', 'Defined Wash & Go Curls', ['natural', 'beach', 'romantic', 'boho'], 'placeholder_hair_wash_go_ringlets'),
  hairStyle('hair-finger-waves', '1920s Sculpted Finger Waves', ['formal', 'evening', 'glam', 'bold'], 'placeholder_hair_finger_waves'),
  hairStyle('hair-twin-space-buns', 'Playful Space Buns', ['party', 'club', 'girly', 'sporty'], 'placeholder_hair_twin_space_buns'),
  hairStyle('hair-half-up-cascade', 'Half-Up Ribbon Cascade', ['romantic', 'girly', 'cocktail', 'party'], 'placeholder_hair_half_up_cascade'),
  hairStyle('hair-braided-genie-pony', 'Braided Genie Ponytail', ['club', 'bold', 'glam', 'party'], 'placeholder_hair_braided_genie_pony'),
  hairStyle('hair-architectural-topknot', 'Architectural High Topknot', ['corporate', 'formal', 'minimal', 'edgy'], 'placeholder_hair_architectural_topknot'),
  hairStyle('hair-parisian-low-chignon', 'Parisian Low Chignon', ['formal', 'corporate', 'romantic', 'minimal'], 'placeholder_hair_parisian_low_chignon'),
  hairStyle('hair-wet-look-slick', 'Runway Wet-Look Slick', ['club', 'edgy', 'bold', 'glam'], 'placeholder_hair_wet_look_slick'),
  hairStyle('hair-tapered-curly-fade', 'Tapered Curly Fade', ['natural', 'edgy', 'bold', 'minimal'], 'placeholder_hair_tapered_curly_fade'),
];
