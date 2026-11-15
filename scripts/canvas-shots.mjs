/* Focused canvas-element screenshots to verify figure/layer alignment. */
import { chromium } from '@playwright/test';

const OUT = '/tmp/glow-shots';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1000, height: 1000 } });
const issues = [];
page.on('console', (msg) => {
  if (msg.type() === 'error' || msg.type() === 'warning') issues.push(`${msg.type()}: ${msg.text()}`);
});
page.on('pageerror', (err) => issues.push(`pageerror: ${err.message}`));

await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
await page.getByTestId('challenge-card-sunny-beach-day').click();

// Skincare: bare face
await page.getByRole('button', { name: 'Start skin scan' }).click();
await page.waitForTimeout(1900);
await page.locator('[role="img"]').first().screenshot({ path: `${OUT}/f-01-bare-face.png` });
await page.getByRole('button', { name: 'Save scan results' }).click();

// Makeup preset
await page.getByTestId('stage-next').click();
await page.getByRole('tab', { name: 'Presets' }).click();
await page.getByRole('button', { name: 'Apply Soft Glam preset look' }).click();
await page.waitForTimeout(200);
await page.locator('[role="img"]').first().screenshot({ path: `${OUT}/f-02-makeup.png` });

// Hair braids + honey blonde
await page.getByTestId('stage-next').click();
await page.getByRole('button', { name: /Beach Braids/ }).click();
await page.getByRole('button', { name: 'Honey Blonde', exact: true }).click();
await page.waitForTimeout(200);
await page.locator('[role="img"]').first().screenshot({ path: `${OUT}/f-03-hair.png` });

// Sundress floral white
await page.getByTestId('stage-next').click();
await page.getByTestId('outfit-item-dress_aline_sundress').click();
await page.waitForTimeout(200);
await page.locator('[role="img"]').first().screenshot({ path: `${OUT}/f-04-sundress.png` });

// Accessories: hat + flower
await page.getByTestId('stage-next').click();
await page.getByRole('tab', { name: 'Hats' }).click();
await page.getByTestId('accessory-item-acc-hat-sun').click();
await page.getByRole('tab', { name: 'Hair' }).click();
await page.getByTestId('accessory-item-acc-flower-tropical').click();
await page.waitForTimeout(200);
await page.locator('[role="img"]').first().screenshot({ path: `${OUT}/f-05-accessories.png` });

// Photo studio full scene
await page.getByTestId('stage-next').click();
await page.getByRole('button', { name: 'Golden Hour' }).click();
await page.waitForTimeout(300);
await page.locator('[role="img"]').first().screenshot({ path: `${OUT}/f-06-photostudio.png` });

console.log('=== console issues ===');
console.log(issues.length === 0 ? 'none' : issues.join('\n'));
await browser.close();
