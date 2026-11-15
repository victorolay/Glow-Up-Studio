import type { Challenge, ChallengeCategory, OutfitItem } from '@/game/types';

export type ChallengeFilter = 'All' | ChallengeCategory;

export const CHALLENGE_FILTERS: ChallengeFilter[] = [
  'All',
  'Vacation',
  'Dates',
  'Formal',
  'Casual',
  'Seasonal/Holiday',
  'Work',
];

export const STAGE_LABELS: Record<string, string> = {
  skincare: 'Skincare',
  makeup: 'Makeup',
  hair: 'Hair',
  outfit: 'Outfit',
  accessories: 'Accessories',
  photoShoot: 'Photo Studio',
  results: 'Verdict',
};

/** Filter challenges by category while keeping Free Play visible under All or Casual. */
export function filterChallenges(challenges: Challenge[], filter: ChallengeFilter): Challenge[] {
  if (filter === 'All') return challenges;
  return challenges.filter((c) => c.category === filter);
}

/** Remaining stars needed to unlock a star-gated challenge (0 when unlockable or free). */
export function starsRemainingForChallenge(challenge: Challenge, lifetimeStars: number): number {
  if (challenge.unlock.type !== 'stars') return 0;
  const cost = challenge.unlock.cost ?? 0;
  return Math.max(0, cost - lifetimeStars);
}

/** Format a compact difficulty label without decorative emoji noise. */
export function difficultyLabel(level: 1 | 2 | 3): string {
  if (level === 1) return 'Breezy';
  if (level === 2) return 'Curated';
  return 'Editorial';
}

/** Summarize equipped styling count for the vanity mirror readout. */
export function summarizeLookCounts(params: {
  skinHealth: number;
  makeupCount: number;
  outfitCount: number;
  accessoryCount: number;
}): string {
  const parts: string[] = [`Skin ${Math.round(params.skinHealth)}%`];
  if (params.makeupCount > 0) parts.push(`${params.makeupCount} makeup`);
  if (params.outfitCount > 0) parts.push(`${params.outfitCount} outfit`);
  if (params.accessoryCount > 0) parts.push(`${params.accessoryCount} acc`);
  return parts.join(' · ');
}

/** Map cumulative lifetime stars to a studio Editorial Rank. */
export function editorialRankForStars(lifetimeStars: number): string {
  if (lifetimeStars >= 35) return 'Creative Director';
  if (lifetimeStars >= 20) return 'Runway Icon';
  if (lifetimeStars >= 10) return 'Lead Stylist';
  if (lifetimeStars >= 4) return 'Atelier Stylist';
  return 'Rising Stylist';
}

/** Normalize any degree value into [0, 360). */
export function normalizeAngle(deg: number): number {
  const mod = deg % 360;
  return mod < 0 ? mod + 360 : mod;
}

/** True when a 360 turntable angle faces away from camera (back silhouette). */
export function isBackAngle(deg: number): boolean {
  const norm = normalizeAngle(deg);
  return norm >= 95 && norm <= 265;
}

/** Count non-shoe clothing items matching a brief's required tags without penalty conflicts. */
export function countMatchingClothesForChallenge(
  challenge: Challenge,
  outfits: readonly OutfitItem[],
): number {
  return outfits.filter((item) => {
    if (item.category === 'shoes') return false;
    const itemTags = new Set<string>([
      ...item.tags,
      ...item.variants.flatMap((v) => v.tags ?? []),
    ]);
    const hasRequired =
      challenge.requiredTags.length === 0 ||
      challenge.requiredTags.some((rt) => itemTags.has(rt));
    const hasPenalty = challenge.penaltyTags.some((pt) => itemTags.has(pt));
    return hasRequired && !hasPenalty;
  }).length;
}
