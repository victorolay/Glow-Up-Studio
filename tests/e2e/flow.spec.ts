import { expect, test } from '@playwright/test';

test.describe('core flow smoke test', () => {
  test('challenge → styling → photo → results', async ({ page }) => {
    await page.goto('/');

    // Challenge select
    await expect(page.getByRole('heading', { name: 'Glow Up Studio' })).toBeVisible();
    await page.getByTestId('challenge-card-sunny-beach-day').click();

    // Skincare
    await expect(page.getByTestId('skincare-step-scan')).toBeVisible();
    await page.getByTestId('skincare-step-cleanse').click();
    await page.getByTestId('stage-next').click();

    // Makeup
    await expect(page.getByTestId('makeup-panel-base')).toBeVisible();
    await page.getByTestId('stage-next').click();

    // Hair — pick a style
    await expect(page.getByTestId('hair-styles')).toBeVisible();
    await page.getByRole('button', { name: /Beach Braids/ }).click();
    await page.getByTestId('stage-next').click();

    // Outfit — pick the sundress
    await expect(page.getByTestId('outfit-grid')).toBeVisible();
    await page.getByTestId('outfit-item-dress_aline_sundress').click();
    await page.getByTestId('stage-next').click();

    // Accessories
    await expect(page.getByTestId('accessory-none-glasses')).toBeVisible();
    await page.getByTestId('stage-next').click();

    // Photo shoot — take a photo
    await expect(page.getByTestId('take-photo')).toBeVisible();
    await page.getByTestId('take-photo').click();

    // Continue to results
    const next = page.getByTestId('stage-next');
    await expect(next).toBeEnabled({ timeout: 15000 });
    await next.click();

    // Results
    await expect(page.getByTestId('results-stage')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'The Verdict' })).toBeVisible();
    await expect(page.getByText(/coins earned/)).toBeVisible();
  });

  test('free play has no grading', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('challenge-card-free-play').click();
    await expect(page.getByTestId('skincare-step-scan')).toBeVisible();
    // No hint panel in free play
    await expect(page.getByText('💡 Hints')).toHaveCount(0);
  });
});
