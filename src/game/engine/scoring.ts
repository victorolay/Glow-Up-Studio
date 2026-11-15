import { JUDGE_COMMENT_PRIORITY, JUDGE_COMMENT_TEMPLATES } from '@/data/config/judgeComments';
import {
  ALL_MAKEUP_SLOTS,
  SCORING_CONFIG,
  palettesCompatible,
} from '@/data/config/scoring';
import { STYLE_GROUP_REFINED, STYLE_GROUP_RELAXED, type StyleTag } from '@/data/config/tags';
import type { BackgroundDef, Challenge, FilterDef, PaletteFamily } from '@/game/types';
import { totalHintPenalty } from './hints';

/* ---------- Public types ---------- */

export type ScoreCategoryKey =
  | 'challengeFit'
  | 'cohesion'
  | 'beautyPrep'
  | 'stylingDetails'
  | 'photoBackground';

export interface ScoreReason {
  code: string;
  label: string;
  /** Contribution to the category raw score (negative = penalty). */
  points: number;
  /** Interpolation params for judge comment templates. */
  params?: Record<string, string>;
}

export interface CategoryScore {
  key: ScoreCategoryKey;
  title: string;
  raw: number;
  weighted: number;
  max: number;
  reasons: ScoreReason[];
}

export interface GradeResult {
  total: number;
  stars: 1 | 2 | 3 | 4 | 5;
  categories: CategoryScore[];
  hintPenalty: number;
  judgeComments: string[];
  coins: number;
}

export interface GradeInput {
  challenge: Challenge;
  /** Union of style tags from every worn item + variant. */
  wornTags: StyleTag[];
  /** Detail inputs for the styling category. */
  detail: {
    hairTags: StyleTag[];
    shoesTags: StyleTag[];
    /** One entry per worn accessory (its merged tags). */
    accessoryTagSets: StyleTag[][];
  };
  /** Palette family of each worn variant (incl. hair color and lip color). */
  palette: PaletteFamily[];
  /** Skin health meter, 0-100. */
  skinHealth: number;
  /** Number of distinct makeup slots in use. */
  makeupUsedSlots: number;
  background: BackgroundDef | undefined;
  filter: FilterDef | undefined;
  hintsUsed: readonly string[];
}

/* ---------- Helpers ---------- */

const round1 = (n: number) => Math.round(n * 10) / 10;
const clamp01to100 = (n: number) => Math.max(0, Math.min(100, n));

export function starsFor(total: number): 1 | 2 | 3 | 4 | 5 {
  const t = SCORING_CONFIG.starThresholds;
  for (let i = 0; i < t.length; i++) {
    if (total >= t[i]) return (5 - i) as 1 | 2 | 3 | 4 | 5;
  }
  return 1;
}

function fillTemplate(template: string, params: Record<string, string> | undefined): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => params?.[key] ?? key);
}

/* ---------- Category scorers (pure) ---------- */

function scoreChallengeFit(input: GradeInput): { raw: number; reasons: ScoreReason[] } {
  const C = SCORING_CONFIG;
  const reasons: ScoreReason[] = [];
  const worn = new Set(input.wornTags);
  const req = input.challenge.requiredTags;
  const bonus = input.challenge.bonusTags;

  if (req.length > 0) {
    const covered = req.filter((t) => worn.has(t));
    const missing = req.filter((t) => !worn.has(t));
    if (covered.length > 0) {
      reasons.push({
        code: 'required-covered',
        label: `Brief covered: ${covered.join(', ')}`,
        points: round1((covered.length / req.length) * C.requiredPool),
        params: { tags: covered.join(', ') },
      });
    }
    if (missing.length > 0) {
      reasons.push({
        code: 'required-missing',
        label: `Not yet in the look: ${missing.join(', ')}`,
        points: 0,
        params: { tags: missing.join(', ') },
      });
    }
  } else {
    reasons.push({ code: 'required-none', label: 'Open brief — any style works', points: C.requiredPool });
  }

  if (bonus.length > 0) {
    const coveredBonus = bonus.filter((t) => worn.has(t));
    if (coveredBonus.length > 0) {
      reasons.push({
        code: 'bonus-worn',
        label: `On-brief extras: ${coveredBonus.join(', ')}`,
        points: round1((coveredBonus.length / bonus.length) * C.bonusPool),
        params: { tags: coveredBonus.join(', ') },
      });
    } else {
      reasons.push({
        code: 'bonus-none',
        label: `Bonus directions still open: ${bonus.join(', ')}`,
        points: 0,
      });
    }
  }

  const penalties = input.challenge.penaltyTags.filter((t) => worn.has(t));
  if (penalties.length > 0) {
    reasons.push({
      code: 'penalty-worn',
      label: `Off-brief for this challenge: ${penalties.join(', ')}`,
      points: -C.penaltyPerHit * penalties.length,
      params: { tags: penalties.join(', ') },
    });
  }

  const raw = clamp01to100(reasons.reduce((sum, r) => sum + r.points, 0));
  return { raw, reasons };
}

function scoreCohesion(input: GradeInput): { raw: number; reasons: ScoreReason[] } {
  const C = SCORING_CONFIG;
  const reasons: ScoreReason[] = [];
  let score = 100;

  const fams = input.palette;
  if (fams.length >= 2) {
    const clashFamilies = new Set<string>();
    for (let i = 0; i < fams.length; i++) {
      for (let j = i + 1; j < fams.length; j++) {
        if (!palettesCompatible(fams[i], fams[j])) {
          clashFamilies.add(`${fams[i]} × ${fams[j]}`);
        }
      }
    }
    if (clashFamilies.size > 0) {
      const afterClash = Math.max(C.paletteClashFloor, 100 - clashFamilies.size * C.paletteClashPenalty);
      const deduction = 100 - afterClash;
      score -= deduction;
      reasons.push({
        code: 'palette-clash',
        label: `Color families clash: ${[...clashFamilies].join(', ')}`,
        points: -deduction,
        params: { colors: [...clashFamilies].slice(0, 2).join(', ') },
      });
    } else {
      reasons.push({
        code: 'palette-harmony',
        label: 'Color families coordinate beautifully',
        points: 0,
      });
    }
  }

  const worn = new Set(input.wornTags);
  const hasRefined = STYLE_GROUP_REFINED.some((t) => worn.has(t));
  const hasRelaxed = STYLE_GROUP_RELAXED.some((t) => worn.has(t));
  if (hasRefined && hasRelaxed) {
    score -= C.styleMixPenalty;
    reasons.push({
      code: 'style-mix',
      label: 'Refined and relaxed pieces are mixed in one look',
      points: -C.styleMixPenalty,
    });
  }

  return { raw: clamp01to100(score), reasons };
}

function scoreBeautyPrep(input: GradeInput): { raw: number; reasons: ScoreReason[] } {
  const C = SCORING_CONFIG;
  const reasons: ScoreReason[] = [];
  const skin = clamp01to100(input.skinHealth);
  const makeup = (input.makeupUsedSlots / ALL_MAKEUP_SLOTS.length) * 100;

  reasons.push({
    code: 'skin-health',
    label: `Skin health: ${Math.round(skin)}/100`,
    points: round1(C.skinShare * skin),
  });
  reasons.push({
    code: 'makeup-completeness',
    label: `Makeup: ${input.makeupUsedSlots}/${ALL_MAKEUP_SLOTS.length} products applied`,
    points: round1(C.makeupShare * makeup),
  });
  if (skin >= 90) {
    reasons.push({
      code: 'skin-glow',
      label: 'Complete skincare routine — glowing skin',
      points: 0,
    });
  }

  const raw = C.skinShare * skin + C.makeupShare * makeup;
  return { raw: clamp01to100(raw), reasons };
}

function scoreStylingDetails(input: GradeInput): { raw: number; reasons: ScoreReason[] } {
  const C = SCORING_CONFIG;
  const reasons: ScoreReason[] = [];
  const target = new Set<StyleTag>([...input.challenge.requiredTags, ...input.challenge.bonusTags]);

  const hitsFor = (tags: StyleTag[]) => {
    if (target.size === 0) return 1;
    const hits = tags.filter((t) => target.has(t)).length;
    return Math.min(1, hits / C.detailTagHitsForFull);
  };

  const hairScore = hitsFor(input.detail.hairTags) * 100;
  const shoesScore = hitsFor(input.detail.shoesTags) * 100;

  let accScore: number;
  if (input.detail.accessoryTagSets.length === 0) {
    accScore = C.accessoryNoneWornScore;
    reasons.push({
      code: 'accessory-none',
      label: 'No accessories worn',
      points: 0,
    });
  } else {
    const per = input.detail.accessoryTagSets.map((tags) =>
      tags.some((t) => target.has(t)) ? C.accessoryOnBriefScore : C.accessoryOffBriefScore,
    );
    accScore = per.reduce((a, b) => a + b, 0) / per.length;
    if (per.some((p) => p === C.accessoryOffBriefScore)) {
      reasons.push({
        code: 'accessory-off-brief',
        label: 'Some accessories don’t echo the challenge setting',
        points: 0,
      });
    } else {
      reasons.push({
        code: 'accessory-fit',
        label: 'Accessories echo the brief',
        points: 0,
      });
    }
  }

  reasons.push({ code: 'hair-fit', label: `Hair fit to brief: ${Math.round(hairScore)}/100`, points: 0 });
  reasons.push({ code: 'shoes-fit', label: `Shoes fit to brief: ${Math.round(shoesScore)}/100`, points: 0 });

  const { hair, shoes, accessories } = C.stylingShares;
  const raw = hair * hairScore + shoes * shoesScore + accessories * accScore;
  return { raw: clamp01to100(raw), reasons };
}

function scorePhotoBackground(input: GradeInput): { raw: number; reasons: ScoreReason[] } {
  const C = SCORING_CONFIG;
  const reasons: ScoreReason[] = [];
  const bg = input.background;

  if (!bg) {
    reasons.push({ code: 'no-background', label: 'No backdrop selected', points: 0 });
    return { raw: 0, reasons };
  }

  if (input.challenge.idealBackgrounds.includes(bg.id)) {
    reasons.push({
      code: 'background-match',
      label: `Ideal backdrop: ${bg.name}`,
      points: C.backgroundMatchScore,
      params: { bg: bg.name },
    });
  } else {
    const target = new Set<StyleTag>([...input.challenge.requiredTags, ...input.challenge.bonusTags]);
    const overlap = bg.tags.filter((t) => target.has(t));
    const raw = overlap.length > 0 ? C.backgroundTagScore : 25;
    reasons.push({
      code: 'background-partial',
      label: overlap.length > 0 ? `${bg.name} loosely fits the scene` : `${bg.name} doesn’t match the scene`,
      points: raw,
    });
  }

  let raw = reasons[0].points;
  const filter = input.filter;
  if (filter && filter.id !== 'none') {
    const target = new Set<StyleTag>([...input.challenge.requiredTags, ...input.challenge.bonusTags]);
    if (filter.tags.some((t) => target.has(t))) {
      raw = Math.min(100, raw + C.filterBonus);
      reasons.push({
        code: 'filter-bonus',
        label: `${filter.name} filter suits the mood`,
        points: C.filterBonus,
      });
    }
  }

  return { raw: clamp01to100(raw), reasons };
}

/* ---------- Judge comments ---------- */

function buildJudgeComments(categories: readonly CategoryScore[], challengeTitle: string): string[] {
  const allReasons = categories.flatMap((c) => c.reasons);
  const comments: string[] = [];
  for (const code of JUDGE_COMMENT_PRIORITY) {
    if (comments.length >= SCORING_CONFIG.maxJudgeComments) break;
    const reason = allReasons.find((r) => r.code === code);
    const template = JUDGE_COMMENT_TEMPLATES[code];
    if (!reason || !template) continue;
    // Every template can rely on {title}; the params carry the rest.
    const params = { title: challengeTitle, ...(reason.params ?? {}) };
    if (reason.code === 'required-missing' || reason.code === 'penalty-worn') {
      // Only comment on misses when something else went well or a real penalty exists.
      if (reason.points !== 0 && reason.code === 'penalty-worn') {
        comments.push(fillTemplate(template, params));
      } else if (reason.code === 'required-missing') {
        comments.push(fillTemplate(template, params));
      }
      continue;
    }
    comments.push(fillTemplate(template, params));
  }
  if (comments.length === 0) {
    comments.push('A gorgeous effort — every look teaches you something new.');
  }
  return comments;
}

/* ---------- Main entry ---------- */

/**
 * Grade a look deterministically and explainably: every point maps to a reason
 * (AGENT.md §5.9). Pure — same input always yields the same result.
 */
export function grade(input: GradeInput): GradeResult {
  const C = SCORING_CONFIG;
  const definitions: Array<{
    key: ScoreCategoryKey;
    title: string;
    score: () => { raw: number; reasons: ScoreReason[] };
  }> = [
    { key: 'challengeFit', title: 'Challenge Fit', score: () => scoreChallengeFit(input) },
    { key: 'cohesion', title: 'Cohesion & Color', score: () => scoreCohesion(input) },
    { key: 'beautyPrep', title: 'Beauty Prep', score: () => scoreBeautyPrep(input) },
    { key: 'stylingDetails', title: 'Styling Details', score: () => scoreStylingDetails(input) },
    { key: 'photoBackground', title: 'Photo & Background', score: () => scorePhotoBackground(input) },
  ];

  const categories: CategoryScore[] = definitions.map(({ key, title, score }) => {
    const { raw, reasons } = score();
    const weight = C.weights[key];
    return {
      key,
      title,
      raw: round1(raw),
      weighted: round1((raw * weight) / 100),
      max: weight,
      reasons,
    };
  });

  const hintPenalty = totalHintPenalty(input.hintsUsed as readonly ('vibe' | 'category' | 'spoiler')[]);
  const weightedTotal = categories.reduce((sum, c) => sum + c.weighted, 0);
  const total = Math.round(Math.max(0, Math.min(100, weightedTotal - hintPenalty)));
  const stars = starsFor(total);

  const coins =
    C.coins.base + stars * C.coins.perStar + (total >= C.coins.highScoreAt ? C.coins.highScoreBonus : 0);

  return {
    total,
    stars,
    categories,
    hintPenalty,
    judgeComments: buildJudgeComments(categories, input.challenge.title),
    coins,
  };
}
