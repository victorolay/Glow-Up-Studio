import test from 'node:test';
import assert from 'node:assert/strict';
import {
  countMatchingClothesForChallenge,
  difficultyLabel,
  editorialRankForStars,
  filterChallenges,
  isBackAngle,
  normalizeAngle,
  starsRemainingForChallenge,
  summarizeLookCounts,
} from './studioHelpers';
import type { Challenge, OutfitItem } from '../types';

const SAMPLE: Challenge[] = [
  {
    id: 'a',
    title: 'Beach',
    category: 'Vacation',
    description: 'Sun',
    difficulty: 1,
    requiredTags: [],
    bonusTags: [],
    penaltyTags: [],
    idealBackgrounds: [],
    hints: ['', '', ''],
    unlock: { type: 'free' },
  },
  {
    id: 'b',
    title: 'Gala',
    category: 'Formal',
    description: 'Silk',
    difficulty: 3,
    requiredTags: [],
    bonusTags: [],
    penaltyTags: [],
    idealBackgrounds: [],
    hints: ['', '', ''],
    unlock: { type: 'stars', cost: 6 },
  },
];

test('filterChallenges returns all or matching category', () => {
  assert.equal(filterChallenges(SAMPLE, 'All').length, 2);
  assert.equal(filterChallenges(SAMPLE, 'Vacation').map((c) => c.id).join(','), 'a');
  assert.equal(filterChallenges(SAMPLE, 'Work').length, 0);
});

test('starsRemainingForChallenge computes remaining stars accurately', () => {
  assert.equal(starsRemainingForChallenge(SAMPLE[0], 0), 0);
  assert.equal(starsRemainingForChallenge(SAMPLE[1], 2), 4);
  assert.equal(starsRemainingForChallenge(SAMPLE[1], 6), 0);
  assert.equal(starsRemainingForChallenge(SAMPLE[1], 10), 0);
});

test('difficultyLabel maps 1-3 to editorial labels', () => {
  assert.equal(difficultyLabel(1), 'Breezy');
  assert.equal(difficultyLabel(2), 'Curated');
  assert.equal(difficultyLabel(3), 'Editorial');
});

test('summarizeLookCounts formats clean middot-separated telemetry', () => {
  assert.equal(
    summarizeLookCounts({ skinHealth: 42.6, makeupCount: 2, outfitCount: 1, accessoryCount: 0 }),
    'Skin 43% · 2 makeup · 1 outfit',
  );
});

test('editorialRankForStars maps lifetime stars to studio rank tiers', () => {
  assert.equal(editorialRankForStars(0), 'Rising Stylist');
  assert.equal(editorialRankForStars(5), 'Atelier Stylist');
  assert.equal(editorialRankForStars(12), 'Lead Stylist');
  assert.equal(editorialRankForStars(22), 'Runway Icon');
  assert.equal(editorialRankForStars(40), 'Creative Director');
});

test('normalizeAngle and isBackAngle classify 360 turntable views accurately', () => {
  assert.equal(normalizeAngle(375), 15);
  assert.equal(normalizeAngle(-90), 270);
  assert.equal(isBackAngle(0), false);
  assert.equal(isBackAngle(90), false);
  assert.equal(isBackAngle(180), true);
  assert.equal(isBackAngle(265), true);
  assert.equal(isBackAngle(270), false);
});

test('countMatchingClothesForChallenge excludes shoes and penalty conflicts', () => {
  const brief: Challenge = {
    ...SAMPLE[0],
    requiredTags: ['beach'],
    penaltyTags: ['formal'],
  };
  const items: OutfitItem[] = [
    {
      id: 'd1',
      name: 'Beach Dress',
      category: 'dress',
      layer: 'dress',
      occludes: [],
      tags: ['beach'],
      unlock: { type: 'free' },
      asset: 'd1',
      variants: [],
    },
    {
      id: 'd2',
      name: 'Formal Beach',
      category: 'dress',
      layer: 'dress',
      occludes: [],
      tags: ['beach', 'formal'],
      unlock: { type: 'free' },
      asset: 'd2',
      variants: [],
    },
    {
      id: 's1',
      name: 'Sandals',
      category: 'shoes',
      layer: 'shoes',
      occludes: [],
      tags: ['beach'],
      unlock: { type: 'free' },
      asset: 's1',
      variants: [],
    },
  ];
  assert.equal(countMatchingClothesForChallenge(brief, items), 1);
});
