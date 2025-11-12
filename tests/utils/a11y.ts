/**
 * Accessibility testing utilities for Vitest
 *
 * Provides helpers for running axe accessibility checks in unit/integration tests.
 * Uses vitest-axe which wraps axe-core for Vitest.
 */

import 'vitest-axe/extend-expect';

import { expect } from 'vitest';
import { axe, type AxeCore } from 'vitest-axe';

/**
 * Default axe configuration for tests
 * Adjusts rules to match project requirements
 */
export const defaultAxeConfig = {
	rules: {
		// Disable color-contrast rule in tests (design tokens handle this)
		// Enable if you want to test color contrast in components
		'color-contrast': { enabled: false },
		// Disable page-has-heading-one rule (may not apply to component tests)
		'page-has-heading-one': { enabled: false },
	},
} as const;

/**
 * Run accessibility check on a container element
 *
 * @param container - The container element to test (from Testing Library)
 * @param config - Optional axe configuration overrides
 * @returns Promise that resolves when check completes
 *
 * @example
 * ```ts
 * import { renderWithProviders } from '@tests/utils/testUtils';
 * import { expectA11y } from '@tests/utils/a11y';
 *
 * test('component is accessible', async () => {
 *   const { container } = renderWithProviders(<MyComponent />);
 *   await expectA11y(container);
 * });
 * ```
 */
export async function expectA11y(
	container: HTMLElement,
	config?: typeof defaultAxeConfig
): Promise<void> {
	const results = await axe(container, config ?? defaultAxeConfig);
	// @ts-expect-error - vitest-axe extends expect types but TypeScript doesn't always recognize it
	await expect(results).toHaveNoViolations();
}

/**
 * Get accessibility violations (for custom assertions)
 *
 * @param container - The container element to test
 * @param config - Optional axe configuration overrides
 * @returns Promise that resolves with axe results
 *
 * @example
 * ```ts
 * import { getA11yViolations } from '@tests/utils/a11y';
 *
 * test('component has specific violations', async () => {
 *   const { container } = renderWithProviders(<MyComponent />);
 *   const violations = await getA11yViolations(container);
 *   expect(violations).toHaveLength(0);
 * });
 * ```
 */
export async function getA11yViolations(
	container: HTMLElement,
	config?: typeof defaultAxeConfig
): Promise<AxeCore.AxeResults> {
	return axe(container, config ?? defaultAxeConfig);
}
