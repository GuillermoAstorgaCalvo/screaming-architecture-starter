/**
 * Tests for motion state helpers
 *
 * Tests the motion state helper functions:
 * - getInitialState
 */

import { getInitialState } from '@core/ui/utilities/motion/helpers/motionStateHelpers';
import type { MotionInitialState } from '@core/ui/utilities/motion/types/motionTypes';
import { describe, expect, it } from 'vitest';

describe('getInitialState', () => {
	it('returns "visible" when initial is true', () => {
		const result = getInitialState(true);

		expect(result).toBe('visible');
	});

	it('returns "hidden" when initial is false', () => {
		const result = getInitialState(false);

		expect(result).toBe('hidden');
	});

	it('returns "hidden" when initial is "hidden"', () => {
		const result = getInitialState('hidden');

		expect(result).toBe('hidden');
	});

	it('returns "visible" when initial is "visible"', () => {
		const result = getInitialState('visible');

		expect(result).toBe('visible');
	});

	it('handles all valid initial state values', () => {
		const testCases: Array<{ input: MotionInitialState; expected: 'hidden' | 'visible' }> = [
			{ input: true, expected: 'visible' },
			{ input: false, expected: 'hidden' },
			{ input: 'hidden', expected: 'hidden' },
			{ input: 'visible', expected: 'visible' },
		];

		for (const { input, expected } of testCases) {
			expect(getInitialState(input)).toBe(expected);
		}
	});
});
