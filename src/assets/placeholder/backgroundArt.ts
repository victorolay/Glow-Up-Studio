import { svgDataUri, toUri } from './primitives';

/** Scenes are authored on the legacy 1000×1600 canvas; scaled into 600×1280. */
const scene = (inner: string) => svgDataUri(600, 1280, `<g transform="scale(0.6,0.8)">${inner}</g>`);

/**
 * Photo backdrop placeholders (AGENT.md §5.8). Tagged scenes; replaced by
 * photoreal backgrounds later. Same 1000×1600 canvas as the character layers.
 */

export function sandyBeach(): string {
  return scene(
    `<defs>` +
      `<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">` +
      `<stop offset="0" stop-color="#ffd9a8"/><stop offset="1" stop-color="#9fc8e8"/>` +
      `</linearGradient>` +
      `<linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">` +
      `<stop offset="0" stop-color="#6fa8c9"/><stop offset="1" stop-color="#4d88ad"/>` +
      `</linearGradient>` +
      `<linearGradient id="sand" x1="0" y1="0" x2="0" y2="1">` +
      `<stop offset="0" stop-color="#f2dcba"/><stop offset="1" stop-color="#e6c696"/>` +
      `</linearGradient>` +
      `<radialGradient id="sunGlow"><stop offset="0" stop-color="#fff3c4" stop-opacity="0.9"/><stop offset="1" stop-color="#fff3c4" stop-opacity="0"/></radialGradient>` +
      `</defs>` +
      `<rect width="1000" height="640" fill="url(#sky)"/>` +
      `<circle cx="740" cy="300" r="120" fill="url(#sunGlow)"/>` +
      `<circle cx="740" cy="300" r="62" fill="#ffe9a0"/>` +
      `<rect y="600" width="1000" height="300" fill="url(#sea)"/>` +
      `<g stroke="#ffffff" stroke-width="4" opacity="0.5" fill="none" stroke-linecap="round">` +
      `<path d="M120,660 C240,652 360,652 480,660"/>` +
      `<path d="M560,700 C680,692 800,692 920,700"/>` +
      `<path d="M200,760 C320,752 440,752 560,760"/>` +
      `</g>` +
      `<path d="M0,880 C260,860 700,860 1000,884 L1000,1600 L0,1600 Z" fill="url(#sand)"/>` +
      `<path d="M0,884 C260,864 700,864 1000,888" stroke="#ffffff" stroke-width="8" fill="none" opacity="0.6"/>` +
      `<path d="M150,880 C158,700 150,610 140,540" stroke="#8a6844" stroke-width="16" fill="none" stroke-linecap="round"/>` +
      `<g fill="#5e8a5a">` +
      `<ellipse cx="100" cy="520" rx="70" ry="18" transform="rotate(-24 100 520)"/>` +
      `<ellipse cx="190" cy="512" rx="70" ry="18" transform="rotate(14 190 512)"/>` +
      `<ellipse cx="120" cy="570" rx="64" ry="16" transform="rotate(-46 120 570)"/>` +
      `<ellipse cx="180" cy="578" rx="64" ry="16" transform="rotate(40 180 578)"/>` +
      `</g>`,
  );
}

export function beachCafe(): string {
  return scene(
    `<defs><linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">` +
      `<stop offset="0" stop-color="#f2d9c0"/><stop offset="1" stop-color="#e4c3a4"/>` +
      `</linearGradient></defs>` +
      `<rect width="1000" height="1600" fill="url(#wall)"/>` +
      `<g fill="#b98d64">` +
      `<rect x="0" y="0" width="1000" height="26" rx="6"/>` +
      `<rect x="40" y="54" width="120" height="18" rx="8" transform="rotate(3 40 54)"/>` +
      `<rect x="260" y="64" width="120" height="18" rx="8" transform="rotate(-2 260 64)"/>` +
      `<rect x="480" y="56" width="120" height="18" rx="8" transform="rotate(2 480 56)"/>` +
      `<rect x="700" y="66" width="120" height="18" rx="8" transform="rotate(-3 700 66)"/>` +
      `<rect x="880" y="56" width="110" height="18" rx="8" transform="rotate(2 880 56)"/>` +
      `</g>` +
      `<g fill="#f2c94c" opacity="0.9">` +
      `<circle cx="120" cy="128" r="10"/><circle cx="240" cy="140" r="10"/><circle cx="360" cy="132" r="10"/>` +
      `<circle cx="480" cy="142" r="10"/><circle cx="600" cy="132" r="10"/><circle cx="720" cy="142" r="10"/>` +
      `<circle cx="840" cy="130" r="10"/>` +
      `</g>` +
      `<rect y="1180" width="1000" height="420" fill="#d9b58c"/>` +
      `<g stroke="#c9a476" stroke-width="3" opacity="0.6">` +
      `<path d="M0,1300 L1000,1300"/><path d="M0,1440 L1000,1440"/>` +
      `<path d="M160,1180 L160,1600"/><path d="M420,1180 L420,1600"/><path d="M680,1180 L680,1600"/><path d="M880,1180 L880,1600"/>` +
      `</g>` +
      `<g fill="#7a5a3e">` +
      `<ellipse cx="500" cy="1180" rx="130" ry="18"/>` +
      `<rect x="486" y="1190" width="28" height="230"/>` +
      `<ellipse cx="500" cy="1424" rx="90" ry="14"/>` +
      `<rect x="330" y="1050" width="18" height="140" rx="8"/>` +
      `<rect x="652" y="1050" width="18" height="140" rx="8"/>` +
      `</g>` +
      `<g fill="#5e8a5a">` +
      `<ellipse cx="300" cy="1020" rx="60" ry="24"/>` +
      `<ellipse cx="700" cy="1020" rx="60" ry="24"/>` +
      `<rect x="290" y="1030" width="20" height="120" fill="#8a6844"/>` +
      `<rect x="690" y="1030" width="20" height="120" fill="#8a6844"/>` +
      `</g>`,
  );
}

export function goldenDunes(): string {
  return scene(
    `<defs><linearGradient id="gdSky" x1="0" y1="0" x2="0" y2="1">` +
      `<stop offset="0" stop-color="#ffb36b"/><stop offset="0.7" stop-color="#e88a6a"/><stop offset="1" stop-color="#c96a7e"/>` +
      `</linearGradient>` +
      `<radialGradient id="gdSun"><stop offset="0" stop-color="#ffe9b0"/><stop offset="1" stop-color="#ffc46b" stop-opacity="0"/></radialGradient>` +
      `</defs>` +
      `<rect width="1000" height="1000" fill="url(#gdSky)"/>` +
      `<circle cx="500" cy="520" r="180" fill="url(#gdSun)"/>` +
      `<circle cx="500" cy="520" r="104" fill="#ffe9b0"/>` +
      `<path d="M0,980 C240,900 480,920 1000,860 L1000,1600 L0,1600 Z" fill="#c98a5a"/>` +
      `<path d="M0,1140 C300,1040 620,1080 1000,1000 L1000,1600 L0,1600 Z" fill="#a86a48"/>` +
      `<path d="M0,1340 C260,1240 640,1280 1000,1200 L1000,1600 L0,1600 Z" fill="#7a4a38"/>` +
      `<g fill="#5e3a2e" opacity="0.5">` +
      `<ellipse cx="220" cy="1420" rx="6" ry="3"/><ellipse cx="260" cy="1450" rx="6" ry="3"/>` +
      `<ellipse cx="700" cy="1380" rx="6" ry="3"/><ellipse cx="740" cy="1410" rx="6" ry="3"/>` +
      `</g>`,
  );
}

export function softStudio(): string {
  return scene(
    `<defs><radialGradient id="studioG" cx="0.5" cy="0.36" r="0.9">` +
      `<stop offset="0" stop-color="#f7ecf1"/><stop offset="0.7" stop-color="#e9d4e0"/><stop offset="1" stop-color="#d6bccb"/>` +
      `</radialGradient></defs>` +
      `<rect width="1000" height="1600" fill="url(#studioG)"/>` +
      `<ellipse cx="500" cy="1450" rx="360" ry="90" fill="#c9a8bc" opacity="0.45"/>` +
      `<ellipse cx="500" cy="700" rx="420" ry="520" fill="#ffffff" opacity="0.18"/>`,
  );
}

export function cafeTerrace(): string {
  return scene(
    `<defs><linearGradient id="ctWall" x1="0" y1="0" x2="0" y2="1">` +
      `<stop offset="0" stop-color="#f5e3cf"/><stop offset="1" stop-color="#e8cfae"/>` +
      `</linearGradient></defs>` +
      `<rect width="1000" height="1180" fill="url(#ctWall)"/>` +
      `<rect y="1180" width="1000" height="420" fill="#c9a07a"/>` +
      `<g stroke="#b98a62" stroke-width="4" opacity="0.6"><path d="M0,1300 L1000,1300"/><path d="M0,1440 L1000,1440"/></g>` +
      `<rect x="120" y="220" width="330" height="520" rx="20" fill="#9fc8e8"/>` +
      `<rect x="120" y="220" width="330" height="520" rx="20" fill="none" stroke="#f8f4ec" stroke-width="18"/>` +
      `<path d="M285,220 L285,740 M120,480 L450,480" stroke="#f8f4ec" stroke-width="14"/>` +
      `<g fill="#5e8a5a">` +
      `<ellipse cx="720" cy="300" rx="90" ry="34"/><ellipse cx="850" cy="380" rx="80" ry="30"/>` +
      `<rect x="700" y="360" width="24" height="180" fill="#8a6844"/><rect x="826" y="430" width="22" height="150" fill="#8a6844"/>` +
      `</g>` +
      `<g fill="#8a5a3e">` +
      `<circle cx="420" cy="1180" r="90" opacity="0.9"/>` +
      `<rect x="408" y="1180" width="24" height="220"/>` +
      `<rect x="330" y="1380" width="180" height="16" rx="8"/>` +
      `</g>` +
      `<ellipse cx="620" cy="1260" rx="60" ry="14" fill="#8a5a3e"/><rect x="608" y="1260" width="24" height="180" fill="#7a4a30"/>`,
  );
}

export function cityStreet(): string {
  return scene(
    `<defs><linearGradient id="csSky" x1="0" y1="0" x2="0" y2="1">` +
      `<stop offset="0" stop-color="#ffd9a8"/><stop offset="1" stop-color="#9fb8d8"/>` +
      `</linearGradient></defs>` +
      `<rect width="1000" height="1000" fill="url(#csSky)"/>` +
      `<rect x="0" y="200" width="300" height="800" fill="#c96a5a"/>` +
      `<rect x="320" y="120" width="280" height="880" fill="#7a9ab8"/>` +
      `<rect x="620" y="240" width="380" height="760" fill="#e0b478"/>` +
      `<g fill="#f2e8d8" opacity="0.85">` +
      `<rect x="40" y="280" width="70" height="90"/><rect x="160" y="280" width="70" height="90"/>` +
      `<rect x="40" y="440" width="70" height="90"/><rect x="160" y="440" width="70" height="90"/>` +
      `<rect x="360" y="220" width="66" height="84"/><rect x="480" y="220" width="66" height="84"/>` +
      `<rect x="360" y="380" width="66" height="84"/><rect x="480" y="380" width="66" height="84"/>` +
      `<rect x="660" y="320" width="80" height="96"/><rect x="790" y="320" width="80" height="96"/>` +
      `<rect x="660" y="500" width="80" height="96"/><rect x="790" y="500" width="80" height="96"/>` +
      `</g>` +
      `<rect x="320" y="700" width="280" height="30" fill="#c94a6a"/>` +
      `<rect x="620" y="700" width="380" height="30" fill="#5e8a6a"/>` +
      `<rect y="1000" width="1000" height="600" fill="#8a8a92"/>` +
      `<g fill="#e8e8e8" opacity="0.8">` +
      `<rect x="80" y="1180" width="240" height="60" transform="skewX(-20)"/>` +
      `<rect x="440" y="1180" width="240" height="60" transform="skewX(-20)"/>` +
      `<rect x="800" y="1180" width="160" height="60" transform="skewX(-20)"/>` +
      `</g>`,
  );
}

export function rooftop(): string {
  return scene(
    `<defs><linearGradient id="rtSky" x1="0" y1="0" x2="0" y2="1">` +
      `<stop offset="0" stop-color="#e88a6a"/><stop offset="0.6" stop-color="#c96a8a"/><stop offset="1" stop-color="#7a4a6e"/>` +
      `</linearGradient></defs>` +
      `<rect width="1000" height="1150" fill="url(#rtSky)"/>` +
      `<circle cx="500" cy="420" r="90" fill="#ffdf9a" opacity="0.9"/>` +
      `<g fill="#3a2e48">` +
      `<rect x="0" y="620" width="180" height="530"/><rect x="220" y="540" width="150" height="610"/>` +
      `<rect x="660" y="580" width="160" height="570"/><rect x="860" y="500" width="140" height="650"/>` +
      `<rect x="420" y="660" width="160" height="490"/>` +
      `</g>` +
      `<g fill="#f2c94c" opacity="0.8">` +
      `<rect x="250" y="600" width="26" height="30"/><rect x="310" y="600" width="26" height="30"/>` +
      `<rect x="690" y="640" width="26" height="30"/><rect x="760" y="640" width="26" height="30"/>` +
      `<rect x="890" y="560" width="26" height="30"/>` +
      `</g>` +
      `<rect y="1150" width="1000" height="450" fill="#4e4060"/>` +
      `<path d="M60,980 C260,1060 740,1060 940,980" stroke="#c9b48e" stroke-width="6" fill="none"/>` +
      `<g fill="#ffe9a0"><circle cx="120" cy="1000" r="10"/><circle cx="300" cy="1042" r="10"/><circle cx="500" cy="1058" r="10"/><circle cx="700" cy="1042" r="10"/><circle cx="880" cy="1000" r="10"/></g>` +
      `<g fill="#5e8a5a"><ellipse cx="150" cy="880" rx="70" ry="26"/><rect x="136" y="890" width="26" height="120" fill="#6a5240"/></g>`,
  );
}

export function office(): string {
  return scene(
    `<rect width="1000" height="1600" fill="#eef0f2"/>` +
      `<rect x="80" y="180" width="420" height="560" fill="#cfe0ea"/>` +
      `<g stroke="#8a9aa4" stroke-width="6">${[0, 1, 2, 3, 4].map((i) => `<path d="M${80 + i * 88},180 L${80 + i * 88},740"/>`).join('')}</g>` +
      `<rect x="80" y="180" width="420" height="560" fill="none" stroke="#a8b4bc" stroke-width="12"/>` +
      `<rect y="1180" width="1000" height="420" fill="#c8ccd2"/>` +
      `<rect x="380" y="1060" width="480" height="26" rx="10" fill="#9a8a78"/>` +
      `<rect x="410" y="1086" width="22" height="160" fill="#7a6e62"/><rect x="800" y="1086" width="22" height="160" fill="#7a6e62"/>` +
      `<rect x="470" y="930" width="150" height="110" rx="8" fill="#3a3a44"/>` +
      `<rect x="482" y="942" width="126" height="86" rx="4" fill="#8ab4c8"/>` +
      `<rect x="540" y="1040" width="14" height="22" fill="#5a5a64"/>` +
      `<g><ellipse cx="750" cy="960" rx="52" ry="18" fill="#5e8a5a"/><ellipse cx="720" cy="920" rx="40" ry="15" fill="#5e8a5a"/><rect x="736" y="972" width="30" height="90" fill="#c96a5a"/></g>`,
  );
}

export function ballroom(): string {
  const chandelier = (cx: number, cy: number) =>
    `<path d="M${cx},0 L${cx},${cy - 60}" stroke="#d4a853" stroke-width="3"/>` +
    `<ellipse cx="${cx}" cy="${cy}" rx="90" ry="18" fill="none" stroke="#d4a853" stroke-width="5"/>` +
    `<ellipse cx="${cx}" cy="${cy - 30}" rx="55" ry="14" fill="none" stroke="#d4a853" stroke-width="4"/>` +
    `<g fill="#ffe9a0">` +
    `<circle cx="${cx - 60}" cy="${cy - 8}" r="7"/><circle cx="${cx - 30}" cy="${cy + 4}" r="7"/>` +
    `<circle cx="${cx}" cy="${cy - 12}" r="7"/><circle cx="${cx + 30}" cy="${cy + 4}" r="7"/>` +
    `<circle cx="${cx + 60}" cy="${cy - 8}" r="7"/>` +
    `</g>`;
  return scene(
    `<defs><linearGradient id="brWall" x1="0" y1="0" x2="0" y2="1">` +
      `<stop offset="0" stop-color="#3a2840"/><stop offset="1" stop-color="#5e3a58"/>` +
      `</linearGradient></defs>` +
      `<rect width="1000" height="1200" fill="url(#brWall)"/>` +
      `<path d="M0,0 L260,0 L120,1200 L0,1200 Z" fill="#6e2a4e" opacity="0.85"/>` +
      `<path d="M1000,0 L740,0 L880,1200 L1000,1200 Z" fill="#6e2a4e" opacity="0.85"/>` +
      chandelier(260, 260) +
      chandelier(740, 260) +
      `<rect y="1200" width="1000" height="400" fill="#c9a8bc"/>` +
      `<ellipse cx="500" cy="1400" rx="460" ry="90" fill="#e2cfda" opacity="0.5"/>` +
      `<g fill="#f2e2ea" opacity="0.6"><circle cx="180" cy="500" r="4"/><circle cx="360" cy="420" r="4"/><circle cx="640" cy="420" r="4"/><circle cx="820" cy="500" r="4"/></g>`,
  );
}

export function pumpkinPatch(): string {
  const pumpkin = (cx: number, cy: number, r: number) =>
    `<ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${r * 0.72}" fill="#e08a3a"/>` +
    `<ellipse cx="${cx}" cy="${cy}" rx="${r * 0.55}" ry="${r * 0.72}" fill="#d97a2e"/>` +
    `<rect x="${cx - 3}" y="${cy - r * 0.9}" width="6" height="${r * 0.4}" fill="#5e7a3e"/>`;
  return scene(
    `<defs><linearGradient id="ppSky" x1="0" y1="0" x2="0" y2="1">` +
      `<stop offset="0" stop-color="#ffcf8a"/><stop offset="1" stop-color="#e8987a"/>` +
      `</linearGradient></defs>` +
      `<rect width="1000" height="900" fill="url(#ppSky)"/>` +
      `<circle cx="500" cy="380" r="90" fill="#ffe9b0" opacity="0.9"/>` +
      `<path d="M0,760 C300,700 700,700 1000,760 L1000,1600 L0,1600 Z" fill="#c9a45e"/>` +
      `<path d="M0,900 C300,840 700,840 1000,900 L1000,1600 L0,1600 Z" fill="#b8924e"/>` +
      `<g>${pumpkin(160, 1150, 70)}${pumpkin(380, 1240, 90)}${pumpkin(640, 1160, 74)}${pumpkin(850, 1280, 95)}${pumpkin(240, 1420, 100)}${pumpkin(560, 1440, 96)}${pumpkin(800, 1480, 110)}</g>` +
      `<g stroke="#8a6844" stroke-width="10">` +
      `<path d="M60,980 L940,980"/>` +
      `<path d="M140,930 L120,1030 M340,920 L330,1030 M540,920 L545,1030 M740,920 L760,1030 M900,930 L920,1030"/>` +
      `</g>` +
      `<rect x="330" y="920" width="220" height="70" rx="10" fill="#d9bc82"/>`,
  );
}

export function snowyVillage(): string {
  const pine = (cx: number, base: number, h: number) =>
    `<path d="M${cx},${base - h} L${cx - h * 0.42},${base} L${cx + h * 0.42},${base} Z" fill="#3e5e48"/>` +
    `<path d="M${cx},${base - h * 1.3} L${cx - h * 0.3},${base - h * 0.45} L${cx + h * 0.3},${base - h * 0.45} Z" fill="#3e5e48"/>` +
    `<path d="M${cx},${base - h} L${cx - h * 0.2},${base - h * 0.62} L${cx + h * 0.2},${base - h * 0.62} Z" fill="#e8eef2"/>`;
  const snow = Array.from({ length: 30 }, (_, i) => {
    const x = (i * 137) % 1000;
    const y = 120 + ((i * 211) % 1200);
    return `<circle cx="${x}" cy="${y}" r="${3 + (i % 3)}" fill="#ffffff" opacity="0.8"/>`;
  }).join('');
  return scene(
    `<defs><linearGradient id="svSky" x1="0" y1="0" x2="0" y2="1">` +
      `<stop offset="0" stop-color="#2e3a5e"/><stop offset="1" stop-color="#7a8ab0"/>` +
      `</linearGradient></defs>` +
      `<rect width="1000" height="1200" fill="url(#svSky)"/>` +
      snow +
      `<circle cx="800" cy="200" r="60" fill="#f2ead8" opacity="0.9"/>` +
      `<g>${pine(120, 1200, 180)}${pine(300, 1180, 140)}${pine(860, 1200, 170)}${pine(700, 1160, 120)}</g>` +
      `<g>` +
      `<rect x="380" y="980" width="280" height="220" fill="#6a5240"/>` +
      `<path d="M360,980 L520,860 L680,980 Z" fill="#e8eef2"/>` +
      `<rect x="430" y="1040" width="70" height="90" rx="8" fill="#ffd98a"/>` +
      `<rect x="550" y="1040" width="70" height="70" rx="8" fill="#ffd98a"/>` +
      `</g>` +
      `<path d="M0,1200 C300,1160 700,1160 1000,1200 L1000,1600 L0,1600 Z" fill="#e8eef2"/>` +
      `<path d="M0,1320 C300,1280 700,1280 1000,1320 L1000,1600 L0,1600 Z" fill="#f6fafc"/>`,
  );
}

export function cozyDen(): string {
  return scene(
    `<rect width="1000" height="1600" fill="#e2d0bc"/>` +
      `<rect x="90" y="200" width="360" height="480" rx="16" fill="#8ab4c8"/>` +
      `<rect x="90" y="200" width="360" height="480" rx="16" fill="none" stroke="#f2e8d8" stroke-width="16"/>` +
      `<path d="M270,200 L270,680 M90,440 L450,440" stroke="#f2e8d8" stroke-width="12"/>` +
      `<g fill="#c9885e"><path d="M60,150 C60,100 110,90 120,130 C140,80 190,100 180,150 Z" opacity="0.7"/><path d="M820,150 C820,100 870,90 880,130 C900,80 950,100 940,150 Z" opacity="0.7"/></g>` +
      `<rect y="1120" width="1000" height="480" fill="#b98a62"/>` +
      `<g fill="#8a5a3e">` +
      `<rect x="280" y="880" width="440" height="200" rx="24"/>` +
      `<rect x="240" y="820" width="120" height="260" rx="20"/>` +
      `<rect x="640" y="820" width="120" height="260" rx="20"/>` +
      `</g>` +
      `<g fill="#a4724e"><rect x="300" y="920" width="400" height="60" rx="16"/></g>` +
      `<g><rect x="760" y="620" width="16" height="420" fill="#5a4a3e"/><path d="M716,560 L820,560 L800,660 L736,660 Z" fill="#f2d98a"/><circle cx="768" cy="614" r="44" fill="#ffdf9a" opacity="0.7"/></g>`,
  );
}

export const BACKGROUND_GENERATORS: Record<string, () => string> = {
  placeholder_bg_sandy_beach: sandyBeach,
  placeholder_bg_beach_cafe: beachCafe,
  placeholder_bg_golden_dunes: goldenDunes,
  placeholder_bg_soft_studio: softStudio,
  placeholder_bg_cafe_terrace: cafeTerrace,
  placeholder_bg_city_street: cityStreet,
  placeholder_bg_rooftop: rooftop,
  placeholder_bg_office: office,
  placeholder_bg_ballroom: ballroom,
  placeholder_bg_pumpkin_patch: pumpkinPatch,
  placeholder_bg_snowy_village: snowyVillage,
  placeholder_bg_cozy_den: cozyDen,
};

export function backgroundAsset(assetId: string): string {
  const fn = BACKGROUND_GENERATORS[assetId];
  return fn ? fn() : toUri('');
}
