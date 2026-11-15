/* Milestone 2 visual capture: office look + winter look through the new content. */
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const OUT = '/tmp/glow-shots';
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1000, height: 1000 } });
const issues = [];
page.on('console', (msg) => {
  if (msg.type() === 'error' || msg.type() === 'warning') issues.push(`${msg.type()}: ${msg.text()}`);
});
page.on('pageerror', (err) => issues.push(`pageerror: ${err.message}`));

await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
await page.screenshot({ path: `${OUT}/m2-01-challenges.png` });

// Office look
await page.getByTestId('challenge-card-first-day-office').click();
await page.getByTestId('skincare-step-sunscreen').click();
await page.getByTestId('stage-next').click();
await page.getByRole('tab', { name: 'Complexion' }).click();
await page.getByRole('button', { name: 'Apply Skin Tint' }).click();
await page.getByTestId('stage-next').click();
await page.getByRole('button', { name: /Sleek Bun/ }).click();
await page.getByTestId('stage-next').click();
await page.getByRole('tab', { name: 'Tops' }).click();
await page.getByTestId('outfit-item-out-blouse').click();
await page.getByRole('tab', { name: 'Bottoms' }).click();
await page.getByTestId('outfit-item-out-tailored-trousers').click();
await page.getByRole('tab', { name: 'Shoes' }).click();
await page.getByTestId('outfit-item-out-loafers').click();
await page.getByRole('tab', { name: 'Outerwear' }).click();
await page.getByTestId('outfit-item-out-blazer').click();
await page.waitForTimeout(200);
await page.screenshot({ path: `${OUT}/m2-02-office-outfit.png` });
await page.getByTestId('stage-next').click();
await page.getByRole('tab', { name: 'Glasses' }).click();
await page.getByTestId('accessory-item-acc-glasses-read').click();
await page.getByRole('tab', { name: 'Watches' }).click();
await page.getByTestId('accessory-item-acc-watch-minimal').click();
await page.getByRole('tab', { name: 'Necklaces' }).click();
await page.getByTestId('accessory-item-acc-necklace-pendant').click();
await page.waitForTimeout(200);
await page.screenshot({ path: `${OUT}/m2-03-office-accessories.png` });
await page.getByTestId('stage-next').click();
await page.getByRole('tab', { name: 'Modern Office' }).click();
await page.waitForTimeout(200);
await page.screenshot({ path: `${OUT}/m2-04-office-photo.png` });

// Winter look (new run — use a free challenge since stars are 0 in a fresh browser)
await page.getByRole('button', { name: 'Exit to challenge menu' }).click();
await page.getByTestId('challenge-card-street-style-saturday').click();
await page.getByTestId('skincare-step-sunscreen').click();
await page.getByTestId('stage-next').click();
await page.getByTestId('stage-next').click();
await page.getByRole('button', { name: /Elegant Updo/ }).click();
await page.getByTestId('stage-next').click();
// Winter-ish look with FREE items only (locked cards intentionally no-op):
// wrap dress + ankle boots + puffer + hoops + knit scarf.
await page.getByRole('tab', { name: 'Dresses' }).click();
await page.getByTestId('outfit-item-out-wrap-dress').click();
await page.getByRole('tab', { name: 'Shoes' }).click();
await page.getByTestId('outfit-item-out-ankle-boots').click();
await page.getByRole('tab', { name: 'Outerwear' }).click();
await page.getByTestId('outfit-item-out-puffer').click();
await page.waitForTimeout(200);
await page.screenshot({ path: `${OUT}/m2-05-winter-outfit.png` });
await page.getByTestId('stage-next').click();
await page.getByRole('tab', { name: 'Earrings' }).click();
await page.getByTestId('accessory-item-acc-earrings-hoops').click();
await page.getByRole('tab', { name: 'Scarves' }).click();
await page.getByTestId('accessory-item-acc-scarf-knit').click();
await page.waitForTimeout(200);
await page.screenshot({ path: `${OUT}/m2-06-winter-accessories.png` });
await page.getByTestId('stage-next').click();
await page.getByRole('tab', { name: 'Snowy Village' }).click();
await page.getByRole('button', { name: 'Golden Hour' }).click();
await page.waitForTimeout(200);
await page.screenshot({ path: `${OUT}/m2-07-winter-photo.png` });
await page.getByTestId('take-photo').click();
await page.waitForTimeout(1000);
await page.getByTestId('stage-next').click();
await page.getByTestId('results-stage').waitFor({ state: 'visible', timeout: 15000 });
await page.waitForTimeout(1400);
await page.screenshot({ path: `${OUT}/m2-08-winter-results.png` });

console.log('=== console issues ===');
console.log(issues.length === 0 ? 'none' : issues.join('\n'));
await browser.close();
