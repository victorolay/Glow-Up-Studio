/**
 * Asset budget policy (AGENT.md §9). Photorealistic assets are heavy; these are
 * the per-stage ceilings the art pipeline must respect when real WebP/AVIF
 * assets replace the procedural placeholders.
 *
 * Budgets are per stage visit (initial paint), excluding lazy-loaded variants.
 */
export const ASSET_BUDGETS = {
  challengeSelect: { maxKb: 150, maxRequests: 12 },
  skincare: { maxKb: 250, maxRequests: 10 },
  makeup: { maxKb: 300, maxRequests: 24 },
  hair: { maxKb: 250, maxRequests: 14 },
  outfit: { maxKb: 350, maxRequests: 30 },
  accessories: { maxKb: 250, maxRequests: 20 },
  photoShoot: { maxKb: 400, maxRequests: 20 },
  results: { maxKb: 150, maxRequests: 6 },
} as const;

/**
 * Delivery tiers (AGENT.md §6 formats & fallback): 1x / 2x WebP with alpha plus
 * a blur placeholder. The procedural placeholder pipeline renders SVG directly,
 * so these tiers apply to the future photoreal asset drop.
 */
export const ASSET_TIERS = {
  full: { scale: 2, format: 'avif,webp' },
  low: { scale: 1, format: 'webp' },
  placeholder: { blur: 8 },
} as const;
