import {
	breakpoints,
	type BreakpointValue,
	createMaxWidthQuery,
	createMinWidthQuery,
	createRangeQuery,
	getBreakpoint,
} from '@core/constants/breakpoints';
import { designTokens } from '@core/constants/designTokens';
import type { BreakpointSize } from '@src-types/layout';
import { describe, expect, expectTypeOf, it } from 'vitest';

describe('breakpoints constants', () => {
	it('map design token values to numeric pixel values', () => {
		const expected = Object.entries(designTokens.breakpoint).reduce(
			(acc, [size, value]) => ({
				...acc,
				[size]: Number.parseInt(value as string, 10),
			}),
			{} as Record<BreakpointSize, number>
		);

		expect(breakpoints).toEqual(expected);
	});

	it('provides numeric values for every breakpoint size', () => {
		for (const size of Object.keys(designTokens.breakpoint) as BreakpointSize[]) {
			expect(getBreakpoint(size)).toBe(breakpoints[size]);
		}
	});
});

describe('breakpoint utilities', () => {
	it('creates a min-width media query from a breakpoint size', () => {
		expect(createMinWidthQuery('md')).toBe(`(min-width: ${breakpoints.md}px)`);
	});

	it('creates a max-width media query that excludes the breakpoint itself', () => {
		expect(createMaxWidthQuery('lg')).toBe(`(max-width: ${breakpoints.lg - 1}px)`);
	});

	it('creates a range query between two breakpoints', () => {
		expect(createRangeQuery('sm', 'xl')).toBe(
			`(min-width: ${breakpoints.sm}px) and (max-width: ${breakpoints.xl - 1}px)`
		);
	});
});

describe('breakpoint typing', () => {
	it('exposes typed breakpoint keys', () => {
		expectTypeOf<BreakpointValue>().toEqualTypeOf<BreakpointSize>();
	});
});
