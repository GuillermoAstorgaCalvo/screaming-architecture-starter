/**
 * Tests for DrawerHelpers
 *
 * Tests the helper functions used by Drawer:
 * - getTransformClass: transform classes based on position and open state
 * - getDrawerClasses: combines base, position, size, and transform classes
 * - getOverlayClasses: overlay classes with visibility state
 */

import {
	getDrawerClasses,
	getOverlayClasses,
	getTransformClass,
} from '@core/ui/overlays/drawer/helpers/DrawerHelpers';
import type { DrawerPosition, DrawerSize } from '@src-types/ui/overlays/panels';
import { describe, expect, it } from 'vitest';

describe('DrawerHelpers - getTransformClass', () => {
	it('returns translate-x-0 translate-y-0 when drawer is open', () => {
		const positions: DrawerPosition[] = ['left', 'right', 'top', 'bottom'];
		for (const position of positions) {
			const result = getTransformClass(position, true);
			expect(result).toBe('translate-x-0 translate-y-0');
		}
	});

	it('returns -translate-x-full for left position when closed', () => {
		const result = getTransformClass('left', false);
		expect(result).toBe('-translate-x-full');
	});

	it('returns translate-x-full for right position when closed', () => {
		const result = getTransformClass('right', false);
		expect(result).toBe('translate-x-full');
	});

	it('returns -translate-y-full for top position when closed', () => {
		const result = getTransformClass('top', false);
		expect(result).toBe('-translate-y-full');
	});

	it('returns translate-y-full for bottom position when closed', () => {
		const result = getTransformClass('bottom', false);
		expect(result).toBe('translate-y-full');
	});
});

describe('DrawerHelpers - getDrawerClasses', () => {
	const positions: DrawerPosition[] = ['left', 'right', 'top', 'bottom'];
	const sizes: DrawerSize[] = ['sm', 'md', 'lg', 'xl', 'full'];

	it('combines base, position, size, and transform classes when open', () => {
		for (const position of positions) {
			for (const size of sizes) {
				const result = getDrawerClasses(position, size, true);
				expect(result).toContain('translate-x-0 translate-y-0');
				expect(result).toBeTruthy();
			}
		}
	});

	it('combines base, position, size, and transform classes when closed', () => {
		const result = getDrawerClasses('left', 'md', false);
		expect(result).toContain('-translate-x-full');
		expect(result).toBeTruthy();
	});

	it('includes correct transform for right position when closed', () => {
		const result = getDrawerClasses('right', 'md', false);
		expect(result).toContain('translate-x-full');
	});

	it('includes correct transform for top position when closed', () => {
		const result = getDrawerClasses('top', 'md', false);
		expect(result).toContain('-translate-y-full');
	});

	it('includes correct transform for bottom position when closed', () => {
		const result = getDrawerClasses('bottom', 'md', false);
		expect(result).toContain('translate-y-full');
	});

	it('handles all size variants', () => {
		for (const size of sizes) {
			const result = getDrawerClasses('left', size, true);
			expect(result).toBeTruthy();
		}
	});

	it('handles all position variants', () => {
		for (const position of positions) {
			const result = getDrawerClasses(position, 'md', true);
			expect(result).toBeTruthy();
		}
	});
});

describe('DrawerHelpers - getOverlayClasses', () => {
	it('returns opacity-100 when drawer is open', () => {
		const result = getOverlayClasses(true);
		expect(result).toContain('opacity-100');
		expect(result).not.toContain('opacity-0');
		expect(result).not.toContain('pointer-events-none');
	});

	it('returns opacity-0 pointer-events-none when drawer is closed', () => {
		const result = getOverlayClasses(false);
		expect(result).toContain('opacity-0');
		expect(result).toContain('pointer-events-none');
		expect(result).not.toContain('opacity-100');
	});

	it('includes custom className when provided', () => {
		const result = getOverlayClasses(true, 'custom-overlay');
		expect(result).toContain('custom-overlay');
		expect(result).toContain('opacity-100');
	});

	it('handles undefined className', () => {
		const result = getOverlayClasses(true, undefined);
		expect(result).toContain('opacity-100');
		expect(result).not.toContain('undefined');
	});

	it('handles empty string className', () => {
		const result = getOverlayClasses(false, '');
		expect(result).toContain('opacity-0');
		expect(result).toContain('pointer-events-none');
	});

	it('combines multiple class sources correctly', () => {
		const result = getOverlayClasses(true, 'custom-class another-class');
		expect(result).toContain('opacity-100');
		expect(result).toContain('custom-class');
		expect(result).toContain('another-class');
	});

	it('handles overlay classes with closed state and custom className', () => {
		const result = getOverlayClasses(false, 'my-custom-overlay');
		expect(result).toContain('opacity-0');
		expect(result).toContain('pointer-events-none');
		expect(result).toContain('my-custom-overlay');
	});
});
