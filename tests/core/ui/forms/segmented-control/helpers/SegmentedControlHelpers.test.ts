/**
 * SegmentedControlHelpers Tests
 *
 * Tests for SegmentedControl helper functions:
 * - useSegmentedControlId
 * - getContainerClasses
 */

import {
	getContainerClasses,
	useSegmentedControlId,
} from '@core/ui/forms/segmented-control/helpers/SegmentedControlHelpers';
import type { SegmentedControlProps } from '@src-types/ui/navigation/segmentedControl';
import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('useSegmentedControlId', () => {
	it('returns provided segmentedControlId', () => {
		const { result } = renderHook(() => useSegmentedControlId('custom-id'));

		expect(result.current).toBe('custom-id');
	});

	it('generates ID when segmentedControlId is not provided', () => {
		const { result } = renderHook(() => useSegmentedControlId(undefined));

		expect(result.current).toBeDefined();
		expect(result.current).toContain('segmented-control-');
		expect(typeof result.current).toBe('string');
	});

	it('generates unique IDs for multiple instances', () => {
		const { result: result1 } = renderHook(() => useSegmentedControlId(undefined));
		const { result: result2 } = renderHook(() => useSegmentedControlId(undefined));

		expect(result1.current).toBeDefined();
		expect(result2.current).toBeDefined();
		expect(result1.current).not.toBe(result2.current);
	});

	it('handles empty string segmentedControlId', () => {
		const { result } = renderHook(() => useSegmentedControlId(''));

		expect(result.current).toBe('');
	});

	it('prefers provided ID over generated one', () => {
		const { result } = renderHook(() => useSegmentedControlId('explicit-id'));

		expect(result.current).toBe('explicit-id');
		expect(result.current).not.toContain('segmented-control-');
	});
});

describe('getContainerClasses', () => {
	it('returns classes for default variant', () => {
		const classes = getContainerClasses('default');

		expect(classes).toBeDefined();
		expect(typeof classes).toBe('string');
	});

	it('returns classes for pills variant', () => {
		const classes = getContainerClasses('pills');

		expect(classes).toBeDefined();
		expect(typeof classes).toBe('string');
	});

	it('returns classes for outline variant', () => {
		const classes = getContainerClasses('outline');

		expect(classes).toBeDefined();
		expect(typeof classes).toBe('string');
	});

	it('uses default variant when variant is undefined', () => {
		const classes = getContainerClasses(undefined);

		expect(classes).toBeDefined();
		expect(typeof classes).toBe('string');
	});

	it('merges custom className', () => {
		const classes = getContainerClasses('default', 'custom-class');

		expect(classes).toBeDefined();
		expect(classes).toContain('custom-class');
	});

	it('handles undefined className', () => {
		const classes = getContainerClasses('default', undefined);

		expect(classes).toBeDefined();
		expect(typeof classes).toBe('string');
	});

	it('handles empty string className', () => {
		const classes = getContainerClasses('default', '');

		expect(classes).toBeDefined();
		expect(typeof classes).toBe('string');
	});

	it('combines variant classes with custom className', () => {
		const classes = getContainerClasses('pills', 'my-custom-class');

		expect(classes).toBeDefined();
		expect(classes).toContain('my-custom-class');
	});

	it('handles all variant types', () => {
		const variants: Array<SegmentedControlProps['variant']> = ['default', 'pills', 'outline'];

		for (const variant of variants) {
			const classes = getContainerClasses(variant);
			expect(classes).toBeDefined();
			expect(typeof classes).toBe('string');
		}
	});
});
