import type { HairColorDef, SkinTone } from '@/game/types';

/** Inclusive skin tone range (AGENT.md §5.3, §10). */
export const SKIN_TONES: SkinTone[] = [
  { id: 'porcelain', name: 'Porcelain', base: '#f6ddd0', shadow: '#d9b3a0' },
  { id: 'ivory', name: 'Ivory', base: '#f0d0b8', shadow: '#cfa890' },
  { id: 'honey', name: 'Honey', base: '#e3b491', shadow: '#bd8e6c' },
  { id: 'golden', name: 'Golden', base: '#d29e78', shadow: '#a97853' },
  { id: 'amber', name: 'Amber', base: '#b9855b', shadow: '#92603e' },
  { id: 'caramel', name: 'Caramel', base: '#9c6b45', shadow: '#7a4e2f' },
  { id: 'bronze', name: 'Bronze', base: '#7d5334', shadow: '#5e3a20' },
  { id: 'espresso', name: 'Espresso', base: '#5d3b26', shadow: '#412617' },
];

/** Natural + fantasy hair color presets. Custom colors score as 'neutral'. */
export const HAIR_COLORS: HairColorDef[] = [
  { id: 'jet', name: 'Jet Black', base: '#241d24', family: 'cool' },
  { id: 'espresso-hair', name: 'Espresso', base: '#3b2a24', family: 'warm' },
  { id: 'chestnut', name: 'Chestnut', base: '#6b4230', family: 'warm' },
  { id: 'honey-blonde', name: 'Honey Blonde', base: '#a97b4a', family: 'warm' },
  { id: 'auburn', name: 'Auburn', base: '#8a4a32', family: 'warm' },
  { id: 'lilac', name: 'Fantasy Lilac', base: '#b48fd9', family: 'pastel' },
];

export const DEFAULT_SKIN_TONE_ID = 'honey';
export const DEFAULT_HAIR_COLOR_ID = 'chestnut';

/** Eye color presets (AGENT.md §5.3). */
export const EYE_COLORS: Array<{ id: string; name: string; hex: string }> = [
  { id: 'brown', name: 'Brown', hex: '#6b4a35' },
  { id: 'hazel', name: 'Hazel', hex: '#8a7a4a' },
  { id: 'green', name: 'Green', hex: '#5e8a6b' },
  { id: 'blue', name: 'Blue', hex: '#5a7ba6' },
  { id: 'violet', name: 'Violet', hex: '#8a6aa0' },
];

export const DEFAULT_EYE_COLOR_ID = 'brown';
