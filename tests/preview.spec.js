import { test, expect } from '@playwright/test';

test('landing page loads and has correct SEO title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Fargo Flooring Professionals | Expert Hardwood & Tile Installation');
  const getEstimateButton = page.locator('text=Get a Free Estimate').first();
  await expect(getEstimateButton).toBeVisible();
});

test('generator app loads and shows AI wands', async ({ page }) => {
  await page.goto('/generator');
  await expect(page.locator('text=Fargo Generator')).toBeVisible();
  
  // Verify AI wand buttons exist
  const aiButtons = page.locator('.ai-wand-btn');
  expect(await aiButtons.count()).toBeGreaterThan(0);
});
