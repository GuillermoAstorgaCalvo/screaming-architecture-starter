import { expect, test } from '@playwright/test';

test.describe('Home Page', () => {
	test('should load the home page', async ({ page }) => {
		await page.goto('/');
		await expect(page).toHaveTitle(/./);
	});

	test('should navigate without errors', async ({ page }) => {
		await page.goto('/');
		// Wait for page to be fully loaded
		await page.waitForLoadState('networkidle');
		// Basic check that page loaded
		await expect(page.locator('body')).toBeVisible();
	});
});
