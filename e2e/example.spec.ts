import { test, expect } from '@playwright/test';

test('the local Gesta page is accessible', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Gesta/);
});
