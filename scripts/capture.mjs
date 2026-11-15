/* Visual capture + console-error sweep for the vertical slice. */
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const OUT = '/tmp/glow-shots';
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();

async function capture(viewport, tag) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  const issues = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error' || msg.type() === 'warning') issues.push(`[${tag}] ${msg.type()}: ${msg.text()}`);
  });
  page.on('pageerror', (err) => issues.push(`[${tag}] pageerror: ${err.message}`));

  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page.screenshot({ path: `${OUT}/${tag}-01-challenges.png`, fullPage: false });

  await page.getByTestId('challenge-card-sunny-beach-day').click();

  // Skincare: do the scan
  await page.getByRole('button', { name: 'Start skin scan' }).click();
  await page.waitForTimeout(1800);
  await page.getByRole('button', { name: 'Save scan results' }).click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUT}/${tag}-02-skincare.png` });

  // Makeup: apply a preset
  await page.getByTestId('stage-next').click();
  await page.getByRole('tab', { name: 'Presets' }).click();
  await page.getByRole('button', { name: 'Apply Soft Glam preset look' }).click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUT}/${tag}-03-makeup.png` });

  // Hair
  await page.getByTestId('stage-next').click();
  await page.getByRole('button', { name: /Beach Braids/ }).click();
  await page.getByRole('button', { name: 'Honey Blonde', exact: true }).click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUT}/${tag}-04-hair.png` });

  // Outfit: sundress floral
  await page.getByTestId('stage-next').click();
  await page.getByTestId('outfit-item-dress_aline_sundress').click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUT}/${tag}-05-outfit.png` });

  // Accessories: hat + flower
  await page.getByTestId('stage-next').click();
  await page.getByRole('tab', { name: 'Hats' }).click();
  await page.getByTestId('accessory-item-acc-hat-sun').click();
  await page.getByRole('tab', { name: 'Hair' }).click();
  await page.getByTestId('accessory-item-acc-flower-tropical').click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUT}/${tag}-06-accessories.png` });

  // Photo studio: golden filter + take photo
  await page.getByTestId('stage-next').click();
  await page.getByRole('button', { name: 'Golden Hour' }).click();
  await page.getByRole('button', { name: 'Hand on hip' }).click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUT}/${tag}-07-photostudio.png` });
  await page.getByTestId('take-photo').click();
  await page.waitForTimeout(1200);
  await page.getByTestId('stage-next').click();

  // Results
  await page.getByTestId('results-stage').waitFor({ state: 'visible', timeout: 15000 });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${OUT}/${tag}-08-results.png` });

  await context.close();
  return issues;
}

const desktopIssues = await capture({ width: 1000, height: 1000 }, 'desktop');
const mobileIssues = await capture({ width: 390, height: 844 }, 'mobile');

console.log('=== console issues ===');
console.log(desktopIssues.length + mobileIssues.length === 0 ? 'none' : [...desktopIssues, ...mobileIssues].join('\n'));
await browser.close();
