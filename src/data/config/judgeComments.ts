/**
 * Judge comment templates keyed by score reason code. Tokens ({tags}, {title},
 * {bg}, {colors}) are interpolated by the scoring engine. Tone is always
 * encouraging and never comments on the body itself (AGENT.md §10).
 */
export const JUDGE_COMMENT_TEMPLATES: Record<string, string> = {
  'required-covered': 'You hit the brief perfectly — {tags} is exactly the energy.',
  'required-missing': 'A touch of {tags} would make this look sing for {title}.',
  'penalty-worn': 'The {tags} piece pulls against the {title} mood — worth a swap.',
  'style-mix':
    'Parts of this look are dressed up while others are totally laid-back — commit to one direction and it will shine.',
  'palette-clash': '{colors} sit a little far apart — easing toward one color family would harmonize everything.',
  'palette-harmony': 'The color story is beautifully coordinated.',
  'background-match': 'The {bg} backdrop frames this look beautifully.',
  'skin-glow': 'That post-skincare glow is carrying the whole look — gorgeous.',
  'bonus-worn': 'The {tags} details are exactly right for {title}.',
  'accessory-off-brief': 'Fun accessories — try ones that echo the {title} setting for extra polish.',
};

/** Order of preference when choosing which reasons become judge comments. */
export const JUDGE_COMMENT_PRIORITY = [
  'penalty-worn',
  'required-missing',
  'style-mix',
  'palette-clash',
  'required-covered',
  'bonus-worn',
  'background-match',
  'skin-glow',
  'accessory-off-brief',
  'palette-harmony',
];

/** Star rating blurb shown next to the stars on the results screen. */
export const STAR_BLURBS: Record<number, string> = {
  5: 'A flawless, editorial-worthy look!',
  4: 'Stunning — just a polish away from perfect.',
  3: 'Lovely work! A few tweaks would elevate it.',
  2: 'A good start — the brief wants a bit more from you.',
  1: 'Every stylist has off days. Try the hints and go again!',
};
