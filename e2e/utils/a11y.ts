/**
 * Accessibility testing utilities for Playwright E2E tests
 *
 * Provides helpers for running axe accessibility checks in E2E tests.
 * Uses @axe-core/playwright which integrates axe-core with Playwright.
 */

import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';

// Infer AxeResults type from AxeBuilder's analyze method
type AxeResults = Awaited<ReturnType<AxeBuilder['analyze']>>;

/**
 * Default axe configuration for E2E tests
 * Adjusts rules to match project requirements
 */
export const defaultAxeConfig = {
	rules: {
		// Disable color-contrast rule in E2E (design tokens handle this)
		// Enable if you want to test color contrast in full pages
		'color-contrast': { enabled: false },
	},
} as const;

/**
 * Run accessibility check on a page and assert no violations
 *
 * @param page - Playwright page object
 * @param config - Optional axe configuration overrides
 *
 * @example
 * ```ts
 * import { expectA11y } from '@e2e/utils/a11y';
 *
 * test('home page is accessible', async ({ page }) => {
 *   await page.goto('/');
 *   await expectA11y(page);
 * });
 * ```
 */
export async function expectA11y(page: Page, config?: typeof defaultAxeConfig): Promise<void> {
	const results = await new AxeBuilder({ page }).options(config ?? defaultAxeConfig).analyze();

	if (results.violations.length > 0) {
		throw new Error(
			`Accessibility violations found:\n${JSON.stringify(results.violations, null, 2)}`
		);
	}
}

/**
 * Get accessibility violations (for custom assertions)
 *
 * @param page - Playwright page object
 * @param config - Optional axe configuration overrides
 * @returns Promise that resolves with axe results
 *
 * @example
 * ```ts
 * import { getA11yViolations } from '@e2e/utils/a11y';
 *
 * test('page has specific violations', async ({ page }) => {
 *   await page.goto('/');
 *   const violations = await getA11yViolations(page);
 *   expect(violations).toHaveLength(0);
 * });
 * ```
 */
export async function getA11yViolations(
	page: Page,
	config?: typeof defaultAxeConfig
): Promise<AxeResults> {
	return new AxeBuilder({ page }).options(config ?? defaultAxeConfig).analyze();
}

/**
 * Run accessibility check on a specific element
 *
 * @param page - Playwright page object
 * @param selector - CSS selector for the element to test
 * @param config - Optional axe configuration overrides
 *
 * @example
 * ```ts
 * import { expectA11yElement } from '@e2e/utils/a11y';
 *
 * test('form is accessible', async ({ page }) => {
 *   await page.goto('/contact');
 *   await expectA11yElement(page, 'form');
 * });
 * ```
 */
export async function expectA11yElement(
	page: Page,
	selector: string,
	config?: typeof defaultAxeConfig
): Promise<void> {
	const results = await new AxeBuilder({ page })
		.include(selector)
		.options(config ?? defaultAxeConfig)
		.analyze();

	if (results.violations.length > 0) {
		throw new Error(
			`Accessibility violations found:\n${JSON.stringify(results.violations, null, 2)}`
		);
	}
}
