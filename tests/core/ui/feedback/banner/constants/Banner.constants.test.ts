/**
 * Banner Constants Tests
 *
 * Tests for Banner constants including:
 * - BANNER_INTENT_STYLES: All intents have styles
 * - BANNER_INTENT_ICON_STYLES: All intents have icon styles
 * - BANNER_ICON_PATHS: All intents have icon paths
 * - BANNER_BASE_CLASSES: Base classes are defined
 * - Type safety and completeness
 */

import {
	BANNER_BASE_CLASSES,
	BANNER_ICON_PATHS,
	BANNER_INTENT_ICON_STYLES,
	BANNER_INTENT_STYLES,
} from '@core/ui/feedback/banner/constants/Banner.constants';
import type { BannerIntent } from '@src-types/ui/feedback';
import { describe, expect, it } from 'vitest';

const BANNER_INTENTS: BannerIntent[] = ['info', 'success', 'warning', 'error'];

describe('BANNER_INTENT_STYLES', () => {
	it('should be defined', () => {
		expect(BANNER_INTENT_STYLES).toBeDefined();
		expect(typeof BANNER_INTENT_STYLES).toBe('object');
	});

	it('should have styles for all BannerIntent values', () => {
		for (const intent of BANNER_INTENTS) {
			expect(BANNER_INTENT_STYLES[intent]).toBeDefined();
			expect(BANNER_INTENT_STYLES[intent]).toBeTruthy();
		}
	});

	it('should return non-empty strings for all intents', () => {
		for (const intent of BANNER_INTENTS) {
			const styles = BANNER_INTENT_STYLES[intent];
			expect(typeof styles).toBe('string');
			expect(styles.length).toBeGreaterThan(0);
		}
	});

	it('should have different styles for different intents', () => {
		const infoStyles = BANNER_INTENT_STYLES.info;
		const successStyles = BANNER_INTENT_STYLES.success;
		const warningStyles = BANNER_INTENT_STYLES.warning;
		const errorStyles = BANNER_INTENT_STYLES.error;

		expect(infoStyles).not.toBe(successStyles);
		expect(infoStyles).not.toBe(warningStyles);
		expect(infoStyles).not.toBe(errorStyles);
		expect(successStyles).not.toBe(warningStyles);
		expect(successStyles).not.toBe(errorStyles);
		expect(warningStyles).not.toBe(errorStyles);
	});

	it('should include border classes for all intents', () => {
		for (const intent of BANNER_INTENTS) {
			const styles = BANNER_INTENT_STYLES[intent];
			expect(styles).toContain('border');
		}
	});

	it('should include background classes for all intents', () => {
		for (const intent of BANNER_INTENTS) {
			const styles = BANNER_INTENT_STYLES[intent];
			expect(styles).toContain('bg');
		}
	});

	it('should include text color classes for all intents', () => {
		for (const intent of BANNER_INTENTS) {
			const styles = BANNER_INTENT_STYLES[intent];
			expect(styles).toContain('text');
		}
	});

	it('should include dark mode classes for all intents', () => {
		for (const intent of BANNER_INTENTS) {
			const styles = BANNER_INTENT_STYLES[intent];
			expect(styles).toContain('dark:');
		}
	});

	it('should have correct intent-specific color tokens', () => {
		expect(BANNER_INTENT_STYLES.info).toContain('info');
		expect(BANNER_INTENT_STYLES.success).toContain('success');
		expect(BANNER_INTENT_STYLES.warning).toContain('warning');
		expect(BANNER_INTENT_STYLES.error).toContain('destructive');
	});
});

describe('BANNER_INTENT_ICON_STYLES', () => {
	it('should be defined', () => {
		expect(BANNER_INTENT_ICON_STYLES).toBeDefined();
		expect(typeof BANNER_INTENT_ICON_STYLES).toBe('object');
	});

	it('should have icon styles for all BannerIntent values', () => {
		for (const intent of BANNER_INTENTS) {
			expect(BANNER_INTENT_ICON_STYLES[intent]).toBeDefined();
			expect(BANNER_INTENT_ICON_STYLES[intent]).toBeTruthy();
		}
	});

	it('should return non-empty strings for all intents', () => {
		for (const intent of BANNER_INTENTS) {
			const styles = BANNER_INTENT_ICON_STYLES[intent];
			expect(typeof styles).toBe('string');
			expect(styles.length).toBeGreaterThan(0);
		}
	});

	it('should have different icon styles for different intents', () => {
		const infoStyles = BANNER_INTENT_ICON_STYLES.info;
		const successStyles = BANNER_INTENT_ICON_STYLES.success;
		const warningStyles = BANNER_INTENT_ICON_STYLES.warning;
		const errorStyles = BANNER_INTENT_ICON_STYLES.error;

		expect(infoStyles).not.toBe(successStyles);
		expect(infoStyles).not.toBe(warningStyles);
		expect(infoStyles).not.toBe(errorStyles);
		expect(successStyles).not.toBe(warningStyles);
		expect(successStyles).not.toBe(errorStyles);
		expect(warningStyles).not.toBe(errorStyles);
	});

	it('should include text color classes for all intents', () => {
		for (const intent of BANNER_INTENTS) {
			const styles = BANNER_INTENT_ICON_STYLES[intent];
			expect(styles).toContain('text');
		}
	});

	it('should include dark mode classes for all intents', () => {
		for (const intent of BANNER_INTENTS) {
			const styles = BANNER_INTENT_ICON_STYLES[intent];
			expect(styles).toContain('dark:');
		}
	});

	it('should have correct intent-specific color tokens', () => {
		expect(BANNER_INTENT_ICON_STYLES.info).toContain('info');
		expect(BANNER_INTENT_ICON_STYLES.success).toContain('success');
		expect(BANNER_INTENT_ICON_STYLES.warning).toContain('warning');
		expect(BANNER_INTENT_ICON_STYLES.error).toContain('destructive');
	});
});

describe('BANNER_ICON_PATHS', () => {
	it('should be defined', () => {
		expect(BANNER_ICON_PATHS).toBeDefined();
		expect(typeof BANNER_ICON_PATHS).toBe('object');
	});

	it('should have icon paths for all BannerIntent values', () => {
		for (const intent of BANNER_INTENTS) {
			expect(BANNER_ICON_PATHS[intent]).toBeDefined();
			expect(BANNER_ICON_PATHS[intent]).toBeTruthy();
		}
	});

	it('should return ReactNode for all intents', () => {
		for (const intent of BANNER_INTENTS) {
			const iconPath = BANNER_ICON_PATHS[intent];
			// ReactNode can be various types, but should be truthy
			expect(iconPath).toBeTruthy();
		}
	});

	it('should have different icon paths for different intents', () => {
		const infoIcon = BANNER_ICON_PATHS.info;
		const successIcon = BANNER_ICON_PATHS.success;
		const warningIcon = BANNER_ICON_PATHS.warning;
		const errorIcon = BANNER_ICON_PATHS.error;

		// Icon paths should be different objects/elements
		expect(infoIcon).not.toBe(successIcon);
		expect(infoIcon).not.toBe(warningIcon);
		expect(infoIcon).not.toBe(errorIcon);
		expect(successIcon).not.toBe(warningIcon);
		expect(successIcon).not.toBe(errorIcon);
		expect(warningIcon).not.toBe(errorIcon);
	});
});

describe('BANNER_BASE_CLASSES', () => {
	it('should be defined', () => {
		expect(BANNER_BASE_CLASSES).toBeDefined();
	});

	it('should be a non-empty string', () => {
		expect(typeof BANNER_BASE_CLASSES).toBe('string');
		expect(BANNER_BASE_CLASSES.length).toBeGreaterThan(0);
	});

	it('should include flex layout classes', () => {
		expect(BANNER_BASE_CLASSES).toContain('flex');
	});

	it('should include width class', () => {
		expect(BANNER_BASE_CLASSES).toContain('w-full');
	});

	it('should include alignment classes', () => {
		expect(BANNER_BASE_CLASSES).toContain('items-start');
	});

	it('should include spacing classes', () => {
		expect(BANNER_BASE_CLASSES).toContain('gap-md');
	});

	it('should include border radius class', () => {
		expect(BANNER_BASE_CLASSES).toContain('rounded-lg');
	});

	it('should include border class', () => {
		expect(BANNER_BASE_CLASSES).toContain('border');
	});

	it('should include padding classes', () => {
		expect(BANNER_BASE_CLASSES).toContain('px-md');
		expect(BANNER_BASE_CLASSES).toContain('py-md');
	});

	it('should include shadow class', () => {
		expect(BANNER_BASE_CLASSES).toContain('shadow-sm');
	});
});

describe('Banner Constants - Type Safety', () => {
	it('should have matching keys across all intent-based constants', () => {
		const intentStylesKeys = Object.keys(BANNER_INTENT_STYLES).sort();
		const iconStylesKeys = Object.keys(BANNER_INTENT_ICON_STYLES).sort();
		const iconPathsKeys = Object.keys(BANNER_ICON_PATHS).sort();

		expect(intentStylesKeys).toEqual(BANNER_INTENTS.sort());
		expect(iconStylesKeys).toEqual(BANNER_INTENTS.sort());
		expect(iconPathsKeys).toEqual(BANNER_INTENTS.sort());
		expect(intentStylesKeys).toEqual(iconStylesKeys);
		expect(iconStylesKeys).toEqual(iconPathsKeys);
	});

	it('should have no extra keys in intent-based constants', () => {
		const intentStylesKeys = Object.keys(BANNER_INTENT_STYLES);
		const iconStylesKeys = Object.keys(BANNER_INTENT_ICON_STYLES);
		const iconPathsKeys = Object.keys(BANNER_ICON_PATHS);

		expect(intentStylesKeys.length).toBe(BANNER_INTENTS.length);
		expect(iconStylesKeys.length).toBe(BANNER_INTENTS.length);
		expect(iconPathsKeys.length).toBe(BANNER_INTENTS.length);
	});
});
