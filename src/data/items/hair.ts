import type { HairItem } from '@/game/types';
import { HAIR_COLORS } from './customization';

/**
 * Hair style catalog. Each style renders a hairBack + hairFront layer pair from
 * one asset generator; colors come from the shared HAIR_COLORS registry.
 */
export const HAIR_ITEMS: HairItem[] = [
  {
    id: 'hair-long-waves',
    name: 'Long Waves',
    tags: ['romantic', 'casual'],
    category: 'hair',
    unlock: { type: 'free' },
    asset: 'placeholder_hair_long_waves',
    variants: HAIR_COLORS.map((c) => ({
      id: c.id,
      name: c.name,
      colors: { primary: c.base },
      family: c.family,
    })),
  },
  {
    id: 'hair-beach-braids',
    name: 'Beach Braids',
    tags: ['beach', 'boho', 'casual'],
    category: 'hair',
    unlock: { type: 'free' },
    asset: 'placeholder_hair_beach_braids',
    variants: HAIR_COLORS.map((c) => ({
      id: c.id,
      name: c.name,
      colors: { primary: c.base },
      family: c.family,
    })),
  },
  {
    id: 'hair-sleek-bun',
    name: 'Sleek Bun',
    tags: ['corporate', 'formal', 'minimal'],
    category: 'hair',
    unlock: { type: 'free' },
    asset: 'placeholder_hair_sleek_bun',
    variants: HAIR_COLORS.map((c) => ({
      id: c.id,
      name: c.name,
      colors: { primary: c.base },
      family: c.family,
    })),
  },
  {
    id: 'hair-curly-bob',
    name: 'Curly Bob',
    tags: ['casual', 'girly'],
    category: 'hair',
    unlock: { type: 'free' },
    asset: 'placeholder_hair_curly_bob',
    variants: HAIR_COLORS.map((c) => ({
      id: c.id,
      name: c.name,
      colors: { primary: c.base },
      family: c.family,
    })),
  },
  {
    id: 'hair-ponytail',
    name: 'High Ponytail',
    tags: ['sporty', 'casual'],
    category: 'hair',
    unlock: { type: 'free' },
    asset: 'placeholder_hair_ponytail',
    variants: HAIR_COLORS.map((c) => ({
      id: c.id,
      name: c.name,
      colors: { primary: c.base },
      family: c.family,
    })),
  },
  {
    id: 'hair-short-crop',
    name: 'Pixie Crop',
    tags: ['edgy', 'minimal', 'bold'],
    category: 'hair',
    unlock: { type: 'free' },
    asset: 'placeholder_hair_short_crop',
    variants: HAIR_COLORS.map((c) => ({
      id: c.id,
      name: c.name,
      colors: { primary: c.base },
      family: c.family,
    })),
  },
  {
    id: 'hair-elegant-updo',
    name: 'Elegant Updo',
    tags: ['formal', 'evening', 'romantic', 'minimal'],
    category: 'hair',
    unlock: { type: 'free' },
    asset: 'placeholder_hair_elegant_updo',
    variants: HAIR_COLORS.map((c) => ({
      id: c.id,
      name: c.name,
      colors: { primary: c.base },
      family: c.family,
    })),
  },
  {
    id: 'hair-natural-afro',
    name: 'Natural Afro',
    tags: ['natural', 'casual', 'bold'],
    category: 'hair',
    unlock: { type: 'free' },
    asset: 'placeholder_hair_natural_afro',
    variants: HAIR_COLORS.map((c) => ({
      id: c.id,
      name: c.name,
      colors: { primary: c.base },
      family: c.family,
    })),
  },
];
