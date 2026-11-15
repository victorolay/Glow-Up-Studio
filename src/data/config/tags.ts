/**
 * Style tag registry. The single source of truth for the tag vocabulary used by
 * items, challenges, and scoring. Adding a new tag means adding it here — items
 * and challenges then reference it without any code changes.
 */
export const STYLE_TAGS = [
  // Occasion / mood
  'formal',
  'evening',
  'cocktail',
  'corporate',
  'casual',
  'beach',
  'resort',
  'summer',
  'winter',
  'holiday',
  'cozy',
  'sporty',
  'boho',
  'romantic',
  'girly',
  'minimal',
  'edgy',
  // Fabric & material
  'light-fabric',
  'heavy-fabric',
  'silk',
  'linen',
  'denim',
  'sequin',
  'lace',
  'knit',
  'velvet',
  'metallic',
  'plaid',
  // Pattern & motif
  'floral',
  'stripes',
  'polka',
  // Color mood
  'pastel',
  'bright',
  'neutral',
  // Beauty mood
  'natural',
  'glam',
  'bold',
  // Wear style
  'barefoot',
] as const;

export type StyleTag = (typeof STYLE_TAGS)[number];

/** Refined / dressed-up family — clashes with the relaxed family in cohesion scoring. */
export const STYLE_GROUP_REFINED = ['formal', 'evening', 'cocktail', 'corporate', 'silk', 'sequin'] as const;

/** Relaxed / easy-going family — clashes with the refined family in cohesion scoring. */
export const STYLE_GROUP_RELAXED = ['casual', 'beach', 'resort', 'sporty', 'boho'] as const;
