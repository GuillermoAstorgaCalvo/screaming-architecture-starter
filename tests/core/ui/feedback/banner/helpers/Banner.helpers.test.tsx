/**
 * Tests for Banner helper functions
 *
 * Tests helper functions:
 * - getDefaultIcon
 */

import { BANNER_ICON_PATHS } from '@core/ui/feedback/banner/constants/Banner.constants';
import { getDefaultIcon } from '@core/ui/feedback/banner/helpers/Banner.helpers';
import type { BannerIntent } from '@src-types/ui/feedback';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('Banner.helpers - getDefaultIcon', () => {
	it('returns icon for info intent', () => {
		const icon = getDefaultIcon('info');
		expect(icon).toBeDefined();
		expect(icon).toBe(BANNER_ICON_PATHS.info);
	});

	it('returns icon for success intent', () => {
		const icon = getDefaultIcon('success');
		expect(icon).toBeDefined();
		expect(icon).toBe(BANNER_ICON_PATHS.success);
	});

	it('returns icon for warning intent', () => {
		const icon = getDefaultIcon('warning');
		expect(icon).toBeDefined();
		expect(icon).toBe(BANNER_ICON_PATHS.warning);
	});

	it('returns icon for error intent', () => {
		const icon = getDefaultIcon('error');
		expect(icon).toBeDefined();
		expect(icon).toBe(BANNER_ICON_PATHS.error);
	});

	it('returns different icons for different intents', () => {
		const infoIcon = getDefaultIcon('info');
		const successIcon = getDefaultIcon('success');
		const warningIcon = getDefaultIcon('warning');
		const errorIcon = getDefaultIcon('error');

		expect(infoIcon).not.toBe(successIcon);
		expect(infoIcon).not.toBe(warningIcon);
		expect(infoIcon).not.toBe(errorIcon);
		expect(successIcon).not.toBe(warningIcon);
		expect(successIcon).not.toBe(errorIcon);
		expect(warningIcon).not.toBe(errorIcon);
	});

	it('handles all valid BannerIntent values', () => {
		const intents: BannerIntent[] = ['info', 'success', 'warning', 'error'];

		for (const intent of intents) {
			const icon = getDefaultIcon(intent);
			expect(icon).toBeDefined();
			expect(icon).toBe(BANNER_ICON_PATHS[intent]);
		}
	});

	it('returns a valid ReactNode that can be rendered', () => {
		const icon = getDefaultIcon('info');
		expect(icon).toBeDefined();

		// Render the icon to ensure it's a valid ReactNode
		const { container } = render(<svg>{icon}</svg>);
		expect(container.firstChild).toBeInTheDocument();
	});

	it('returns ReactNode for all intents that can be rendered', () => {
		const intents: BannerIntent[] = ['info', 'success', 'warning', 'error'];

		for (const intent of intents) {
			const icon = getDefaultIcon(intent);
			expect(icon).toBeDefined();

			const { container } = render(<svg>{icon}</svg>);
			expect(container.firstChild).toBeInTheDocument();
		}
	});
});
