/**
 * Tests for timeline variants
 *
 * Tests timeline variant functions, class generation, and type safety
 */

import {
	getTimelineConnectorSizeClasses,
	getTimelineEventSizeClasses,
	getTimelineMarkerIconSizeClasses,
	getTimelineMarkerSizeClasses,
	getTimelineVariantClasses,
	type TimelineVariants,
	timelineVariants,
} from '@core/ui/variants/timeline';
import { describe, expect, it } from 'vitest';

const SHOULD_BE_A_FUNCTION = 'should be a function';
const SHOULD_RETURN_CLASSES_FOR_ALL_SIZES = 'should return classes for all sizes';

type TimelineSize = 'sm' | 'md' | 'lg';

describe('timelineVariants', () => {
	it(SHOULD_BE_A_FUNCTION, () => {
		expect(typeof timelineVariants).toBe('function');
	});

	it('should return default classes when called with no arguments', () => {
		const classes = timelineVariants();
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should return classes for all orientations', () => {
		const orientations: Array<'vertical' | 'horizontal'> = ['vertical', 'horizontal'];

		for (const orientation of orientations) {
			const classes = timelineVariants({ orientation });
			expect(typeof classes).toBe('string');
			expect(classes.length).toBeGreaterThan(0);
		}
	});

	it('should return different classes for different orientations', () => {
		const verticalClasses = timelineVariants({ orientation: 'vertical' });
		const horizontalClasses = timelineVariants({ orientation: 'horizontal' });

		expect(verticalClasses).not.toBe(horizontalClasses);
	});
});

describe('getTimelineVariantClasses', () => {
	it(SHOULD_BE_A_FUNCTION, () => {
		expect(typeof getTimelineVariantClasses).toBe('function');
	});

	it('should return classes with default variants', () => {
		const classes = getTimelineVariantClasses({});
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should merge className prop', () => {
		const customClass = 'custom-timeline-class';
		const classes = getTimelineVariantClasses({ className: customClass });
		expect(classes).toContain(customClass);
	});
});

describe('getTimelineEventSizeClasses', () => {
	it(SHOULD_BE_A_FUNCTION, () => {
		expect(typeof getTimelineEventSizeClasses).toBe('function');
	});

	it(SHOULD_RETURN_CLASSES_FOR_ALL_SIZES, () => {
		const sizes: Array<TimelineSize> = ['sm', 'md', 'lg'];

		for (const size of sizes) {
			const classes = getTimelineEventSizeClasses(size);
			expect(typeof classes).toBe('string');
			expect(classes.length).toBeGreaterThan(0);
		}
	});
});

describe('getTimelineMarkerSizeClasses', () => {
	it(SHOULD_BE_A_FUNCTION, () => {
		expect(typeof getTimelineMarkerSizeClasses).toBe('function');
	});

	it(SHOULD_RETURN_CLASSES_FOR_ALL_SIZES, () => {
		const sizes: Array<TimelineSize> = ['sm', 'md', 'lg'];

		for (const size of sizes) {
			const classes = getTimelineMarkerSizeClasses(size);
			expect(typeof classes).toBe('string');
			expect(classes.length).toBeGreaterThan(0);
		}
	});
});

describe('getTimelineMarkerIconSizeClasses', () => {
	it(SHOULD_BE_A_FUNCTION, () => {
		expect(typeof getTimelineMarkerIconSizeClasses).toBe('function');
	});

	it(SHOULD_RETURN_CLASSES_FOR_ALL_SIZES, () => {
		const sizes: Array<TimelineSize> = ['sm', 'md', 'lg'];

		for (const size of sizes) {
			const classes = getTimelineMarkerIconSizeClasses(size);
			expect(typeof classes).toBe('string');
			expect(classes.length).toBeGreaterThan(0);
		}
	});
});

describe('getTimelineConnectorSizeClasses', () => {
	it(SHOULD_BE_A_FUNCTION, () => {
		expect(typeof getTimelineConnectorSizeClasses).toBe('function');
	});

	it(SHOULD_RETURN_CLASSES_FOR_ALL_SIZES, () => {
		const sizes: Array<TimelineSize> = ['sm', 'md', 'lg'];

		for (const size of sizes) {
			const classes = getTimelineConnectorSizeClasses(size);
			expect(typeof classes).toBe('string');
			expect(classes.length).toBeGreaterThan(0);
		}
	});
});

describe('TimelineVariants type', () => {
	it('should export TimelineVariants type', () => {
		// Type check: This will fail at compile time if type doesn't exist
		const _test: TimelineVariants = { orientation: 'vertical' };
		expect(_test).toBeDefined();
	});
});
