/**
 * Tests for scaleState helper
 *
 * Tests the scale state functions:
 * - Initial state building
 * - Animate state building
 * - Exit state building
 */

import {
	buildScaleAnimateState,
	buildScaleExitState,
	getScaleInitialState,
} from '@core/ui/utilities/motion/helpers/MotionScale/scaleState';
import { describe, expect, it } from 'vitest';

describe('getScaleInitialState', () => {
	it('returns visible when initial is true', () => {
		const result = getScaleInitialState(true, 0.9);

		expect(result).toBe('visible');
	});

	it('returns scale state when initial is false', () => {
		const result = getScaleInitialState(false, 0.9);

		expect(result).toEqual({
			opacity: 0,
			scale: 0.9,
		});
	});

	it('returns scale state when initial is undefined', () => {
		const result = getScaleInitialState(undefined, 0.9);

		expect(result).toEqual({
			opacity: 0,
			scale: 0.9,
		});
	});

	it('returns custom initial state when initial is string', () => {
		const result = getScaleInitialState('hidden', 0.9);

		expect(result).toBe('hidden');
	});

	it('handles different initialScale values', () => {
		const result1 = getScaleInitialState(false, 0.8);
		const result2 = getScaleInitialState(false, 1);

		expect(result1).toEqual({
			opacity: 0,
			scale: 0.8,
		});
		expect(result2).toEqual({
			opacity: 0,
			scale: 1,
		});
	});
});

describe('buildScaleAnimateState', () => {
	it('builds animate state with final scale', () => {
		const result = buildScaleAnimateState(1);

		expect(result).toEqual({
			opacity: 1,
			scale: 1,
		});
	});

	it('handles different final scale values', () => {
		const result1 = buildScaleAnimateState(1.1);
		const result2 = buildScaleAnimateState(0.9);

		expect(result1).toEqual({
			opacity: 1,
			scale: 1.1,
		});
		expect(result2).toEqual({
			opacity: 1,
			scale: 0.9,
		});
	});

	it('handles scale of 0', () => {
		const result = buildScaleAnimateState(0);

		expect(result).toEqual({
			opacity: 1,
			scale: 0,
		});
	});
});

describe('buildScaleExitState', () => {
	it('builds exit state with initial scale', () => {
		const result = buildScaleExitState(0.9);

		expect(result).toEqual({
			opacity: 0,
			scale: 0.9,
		});
	});

	it('handles different initial scale values', () => {
		const result1 = buildScaleExitState(0.8);
		const result2 = buildScaleExitState(1);

		expect(result1).toEqual({
			opacity: 0,
			scale: 0.8,
		});
		expect(result2).toEqual({
			opacity: 0,
			scale: 1,
		});
	});

	it('handles scale of 0', () => {
		const result = buildScaleExitState(0);

		expect(result).toEqual({
			opacity: 0,
			scale: 0,
		});
	});
});
