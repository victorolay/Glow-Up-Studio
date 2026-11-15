/** Small SVG + color helpers shared by the placeholder asset generators. */

export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')}`;
}

/** Lighten (t > 0) or darken (t < 0) a hex color by fraction t. */
export function shade(hex: string, t: number): string {
  const [r, g, b] = hexToRgb(hex);
  const target = t >= 0 ? 255 : 0;
  const f = Math.abs(t);
  return rgbToHex(r + (target - r) * f, g + (target - g) * f, b + (target - b) * f);
}

export function svgDataUri(width: number, height: number, inner: string): string {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" ` +
    `viewBox="0 0 ${width} ${height}">${inner}</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/** All placeholder layers share the same canvas so they align exactly (AGENT.md §6). */
export const CANVAS_W = 600;
export const CANVAS_H = 1280;

export const toUri = (inner: string) => svgDataUri(CANVAS_W, CANVAS_H, inner);

/** Mirror a shape group across the canvas center (x → 1000 - x). */
export const mirrored = (inner: string) =>
  `<g transform="translate(${CANVAS_W},0) scale(-1,1)">${inner}</g>`;
