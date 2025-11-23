/**
 * TimelineEvent Utils Tests
 *
 * Tests for TimelineEvent utility functions:
 * - getEventContentClasses: Returns correct classes for orientation and size combinations
 * - getEventContainerClasses: Returns correct classes for orientation
 * - getContentSpacing: Returns correct spacing classes for orientation
 */

import {
	getContentSpacing,
	getEventContainerClasses,
	getEventContentClasses,
} from '@core/ui/data-display/timeline/helpers/TimelineEvent.utils';
import type { StandardSize } from '@src-types/ui/base';
import type { TimelineOrientation } from '@src-types/ui/layout/timeline';
import { describe, expect, it } from 'vitest';

const SHOULD_BE_A_FUNCTION = 'should be a function';

describe('getEventContentClasses', () => {
	it(SHOULD_BE_A_FUNCTION, () => {
		expect(typeof getEventContentClasses).toBe('function');
	});

	it('should return classes for vertical orientation with all sizes', () => {
		const sizes: Array<StandardSize> = ['sm', 'md', 'lg'];
		const orientation: TimelineOrientation = 'vertical';

		for (const size of sizes) {
			const classes = getEventContentClasses(orientation, size);
			expect(typeof classes).toBe('string');
			expect(classes.length).toBeGreaterThan(0);
			expect(classes).toContain('flex');
			expect(classes).toContain('flex-col');
			expect(classes).not.toContain('items-center');
			expect(classes).not.toContain('text-center');
		}
	});

	it('should return classes for horizontal orientation with all sizes', () => {
		const sizes: Array<StandardSize> = ['sm', 'md', 'lg'];
		const orientation: TimelineOrientation = 'horizontal';

		for (const size of sizes) {
			const classes = getEventContentClasses(orientation, size);
			expect(typeof classes).toBe('string');
			expect(classes.length).toBeGreaterThan(0);
			expect(classes).toContain('flex');
			expect(classes).toContain('flex-col');
			expect(classes).toContain('items-center');
			expect(classes).toContain('text-center');
		}
	});

	it('should return different classes for different orientations with same size', () => {
		const size: StandardSize = 'md';
		const verticalClasses = getEventContentClasses('vertical', size);
		const horizontalClasses = getEventContentClasses('horizontal', size);

		expect(verticalClasses).not.toBe(horizontalClasses);
		expect(verticalClasses).not.toContain('items-center');
		expect(horizontalClasses).toContain('items-center');
	});

	it('should include size classes for all size variants', () => {
		const sizes: Array<StandardSize> = ['sm', 'md', 'lg'];
		const orientation: TimelineOrientation = 'vertical';

		for (const size of sizes) {
			const classes = getEventContentClasses(orientation, size);
			// Size classes should be present (they come from getTimelineEventSizeClasses)
			expect(classes.length).toBeGreaterThan(0);
		}
	});
});

describe('getEventContainerClasses', () => {
	it(SHOULD_BE_A_FUNCTION, () => {
		expect(typeof getEventContainerClasses).toBe('function');
	});

	it('should return correct classes for vertical orientation', () => {
		const classes = getEventContainerClasses('vertical');
		expect(typeof classes).toBe('string');
		expect(classes).toContain('flex');
		expect(classes).toContain('items-start');
		expect(classes).not.toContain('flex-col');
		expect(classes).not.toContain('items-center');
	});

	it('should return correct classes for horizontal orientation', () => {
		const classes = getEventContainerClasses('horizontal');
		expect(typeof classes).toBe('string');
		expect(classes).toContain('flex');
		expect(classes).toContain('flex-col');
		expect(classes).toContain('items-center');
		expect(classes).not.toContain('items-start');
	});

	it('should return different classes for different orientations', () => {
		const verticalClasses = getEventContainerClasses('vertical');
		const horizontalClasses = getEventContainerClasses('horizontal');

		expect(verticalClasses).not.toBe(horizontalClasses);
		expect(verticalClasses).toContain('items-start');
		expect(horizontalClasses).toContain('items-center');
		expect(horizontalClasses).toContain('flex-col');
	});
});

describe('getContentSpacing', () => {
	it(SHOULD_BE_A_FUNCTION, () => {
		expect(typeof getContentSpacing).toBe('function');
	});

	it('should return correct spacing for vertical orientation', () => {
		const spacing = getContentSpacing('vertical');
		expect(typeof spacing).toBe('string');
		expect(spacing).toBe('ml-4');
		expect(spacing).not.toBe('mt-4');
	});

	it('should return correct spacing for horizontal orientation', () => {
		const spacing = getContentSpacing('horizontal');
		expect(typeof spacing).toBe('string');
		expect(spacing).toBe('mt-4');
		expect(spacing).not.toBe('ml-4');
	});

	it('should return different spacing for different orientations', () => {
		const verticalSpacing = getContentSpacing('vertical');
		const horizontalSpacing = getContentSpacing('horizontal');

		expect(verticalSpacing).not.toBe(horizontalSpacing);
		expect(verticalSpacing).toBe('ml-4');
		expect(horizontalSpacing).toBe('mt-4');
	});
});
