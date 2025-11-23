/**
 * Tests for motion utility functions
 *
 * Tests the motion utility functions:
 * - getMotionDuration (lines 16-18)
 * - getMotionEasing (lines 23-27)
 * - getSlideVariant (lines 32-50)
 * - createTransition (lines 55-63)
 * - createSpringTransition (lines 87-96)
 */

import {
	createSpringTransition,
	createTransition,
	getMotionDuration,
	getMotionEasing,
	getSlideVariant,
	type MotionTransitionOptions,
	type SpringTransitionConfig,
} from '@core/ui/utilities/motion/helpers/motionUtils';
import { describe, expect, it } from 'vitest';

/**
 * Default normal duration in seconds
 */
const DEFAULT_NORMAL_DURATION = 0.2;

/**
 * Ease-in-out easing constant
 */
const EASE_IN_OUT = 'ease-in-out';

/**
 * Helper to create expected spring transition result
 */
function expectSpringTransition(
	result: ReturnType<typeof createSpringTransition>,
	expected: {
		stiffness: number;
		damping: number;
		mass: number;
		delay: number;
	}
) {
	expect(result).toEqual({
		type: 'spring',
		...expected,
	});
}

describe('getMotionDuration', () => {
	it('returns default duration for "normal" when no argument provided', () => {
		const result = getMotionDuration();

		expect(typeof result).toBe('number');
		expect(result).toBeGreaterThan(0);
	});

	it('returns correct duration for "instant"', () => {
		const result = getMotionDuration('instant');

		expect(result).toBe(0);
	});

	it('returns correct duration for "micro"', () => {
		const result = getMotionDuration('micro');

		expect(result).toBe(0.1);
	});

	it('returns correct duration for "fast"', () => {
		const result = getMotionDuration('fast');

		expect(result).toBe(0.15);
	});

	it('returns correct duration for "normal"', () => {
		const result = getMotionDuration('normal');

		expect(result).toBe(0.2);
	});

	it('returns correct duration for "slow"', () => {
		const result = getMotionDuration('slow');

		expect(result).toBe(0.3);
	});

	it('returns correct duration for "slower"', () => {
		const result = getMotionDuration('slower');

		expect(result).toBe(0.5);
	});

	it('returns correct duration for "lazy"', () => {
		const result = getMotionDuration('lazy');

		expect(result).toBe(0.7);
	});

	it('returns correct duration for "extended"', () => {
		const result = getMotionDuration('extended');

		expect(result).toBe(1);
	});
});

describe('getMotionEasing', () => {
	it('returns default easing for "ease-out" when no argument provided', () => {
		const result = getMotionEasing();

		expect(Array.isArray(result)).toBe(true);
		expect(result).toHaveLength(4);
		expect(result[0]).toBe(0);
		expect(result[1]).toBe(0);
		expect(result[2]).toBe(0.58);
		expect(result[3]).toBe(1);
	});

	it('returns correct easing for "ease"', () => {
		const result = getMotionEasing('ease');

		expect(Array.isArray(result)).toBe(true);
		expect(result).toHaveLength(4);
		expect(result).toEqual([0.25, 0.1, 0.25, 1]);
	});

	it('returns correct easing for "ease-in"', () => {
		const result = getMotionEasing('ease-in');

		expect(Array.isArray(result)).toBe(true);
		expect(result).toHaveLength(4);
		expect(result).toEqual([0.42, 0, 1, 1]);
	});

	it('returns correct easing for "ease-out"', () => {
		const result = getMotionEasing('ease-out');

		expect(Array.isArray(result)).toBe(true);
		expect(result).toHaveLength(4);
		expect(result).toEqual([0, 0, 0.58, 1]);
	});

	it('returns correct easing for "ease-in-out"', () => {
		const result = getMotionEasing(EASE_IN_OUT);

		expect(Array.isArray(result)).toBe(true);
		expect(result).toHaveLength(4);
		expect(result).toEqual([0.42, 0, 0.58, 1]);
	});
});

describe('getSlideVariant', () => {
	it('returns "slide" for "left" direction', () => {
		const result = getSlideVariant('left');

		expect(result).toBe('slide');
	});

	it('returns "slideRight" for "right" direction', () => {
		const result = getSlideVariant('right');

		expect(result).toBe('slideRight');
	});

	it('returns "slideTop" for "top" direction', () => {
		const result = getSlideVariant('top');

		expect(result).toBe('slideTop');
	});

	it('returns "slideBottom" for "bottom" direction', () => {
		const result = getSlideVariant('bottom');

		expect(result).toBe('slideBottom');
	});

	it('handles all direction values correctly', () => {
		const testCases: Array<{ direction: 'left' | 'right' | 'top' | 'bottom'; expected: string }> = [
			{ direction: 'left', expected: 'slide' },
			{ direction: 'right', expected: 'slideRight' },
			{ direction: 'top', expected: 'slideTop' },
			{ direction: 'bottom', expected: 'slideBottom' },
		];

		for (const { direction, expected } of testCases) {
			expect(getSlideVariant(direction)).toBe(expected);
		}
	});

	it('returns "slide" for default case (unreachable in normal usage)', () => {
		// Test the default case by using a value that doesn't match any case
		// This tests line 47 which is the default case in the switch statement
		// We use 'as any' to bypass TypeScript's type checking for this edge case test
		const invalidDirection = 'invalid' as any;
		const result = getSlideVariant(invalidDirection);

		expect(result).toBe('slide');
	});
});

describe('createTransition - defaults', () => {
	it('creates transition with default values', () => {
		const result = createTransition();

		expect(result).toHaveProperty('duration');
		expect(result).toHaveProperty('ease');
		expect(result).toHaveProperty('delay');
		expect(result.duration).toBe(DEFAULT_NORMAL_DURATION);
		expect(Array.isArray(result.ease)).toBe(true);
		expect(result.ease).toHaveLength(4);
		expect(result.delay).toBe(0);
	});

	it('creates transition with empty options object', () => {
		const options: MotionTransitionOptions = {};
		const result = createTransition(options);

		expect(result).toHaveProperty('duration');
		expect(result).toHaveProperty('ease');
		expect(result).toHaveProperty('delay');
		expect(result.duration).toBe(DEFAULT_NORMAL_DURATION);
		expect(result.delay).toBe(0);
	});
});

describe('createTransition - duration options', () => {
	it('creates transition with duration token', () => {
		const options: MotionTransitionOptions = {
			duration: 'fast',
		};
		const result = createTransition(options);

		expect(result.duration).toBe(0.15);
		expect(result.delay).toBe(0);
	});

	it('creates transition with numeric duration', () => {
		const options: MotionTransitionOptions = {
			duration: 0.5,
		};
		const result = createTransition(options);

		expect(result.duration).toBe(0.5);
		expect(result.delay).toBe(0);
	});
});

describe('createTransition - easing and delay', () => {
	it('creates transition with custom easing', () => {
		const options: MotionTransitionOptions = {
			ease: 'ease-in',
		};
		const result = createTransition(options);

		expect(result.duration).toBe(DEFAULT_NORMAL_DURATION);
		expect(result.ease).toEqual([0.42, 0, 1, 1]);
		expect(result.delay).toBe(0);
	});

	it('creates transition with custom delay', () => {
		const options: MotionTransitionOptions = {
			delay: 0.3,
		};
		const result = createTransition(options);

		expect(result.duration).toBe(DEFAULT_NORMAL_DURATION);
		expect(result.delay).toBe(0.3);
	});

	it('creates transition with zero delay', () => {
		const options: MotionTransitionOptions = {
			delay: 0,
		};
		const result = createTransition(options);

		expect(result.delay).toBe(0);
	});
});

describe('createTransition - combined options', () => {
	it('creates transition with all options (duration token)', () => {
		const options: MotionTransitionOptions = {
			duration: 'slow',
			ease: EASE_IN_OUT,
			delay: 0.2,
		};
		const result = createTransition(options);

		expect(result.duration).toBe(0.3);
		expect(result.ease).toEqual([0.42, 0, 0.58, 1]);
		expect(result.delay).toBe(0.2);
	});

	it('creates transition with all options (numeric duration)', () => {
		const options: MotionTransitionOptions = {
			duration: 0.8,
			ease: 'ease',
			delay: 0.1,
		};
		const result = createTransition(options);

		expect(result.duration).toBe(0.8);
		expect(result.ease).toEqual([0.25, 0.1, 0.25, 1]);
		expect(result.delay).toBe(0.1);
	});
});

describe('createTransition - duration tokens', () => {
	it('creates transition with different duration tokens', () => {
		const testCases: Array<{
			duration: NonNullable<MotionTransitionOptions['duration']>;
			expected: number;
		}> = [
			{ duration: 'instant', expected: 0 },
			{ duration: 'micro', expected: 0.1 },
			{ duration: 'fast', expected: 0.15 },
			{ duration: 'normal', expected: 0.2 },
			{ duration: 'slow', expected: 0.3 },
			{ duration: 'slower', expected: 0.5 },
			{ duration: 'lazy', expected: 0.7 },
			{ duration: 'extended', expected: 1 },
		];

		for (const { duration, expected } of testCases) {
			const result = createTransition({ duration });
			expect(result.duration).toBe(expected);
		}
	});
});

describe('createTransition - easing values', () => {
	it('creates transition with different easing values', () => {
		const testCases: Array<{
			ease: NonNullable<MotionTransitionOptions['ease']>;
			expected: readonly [number, number, number, number];
		}> = [
			{ ease: 'ease', expected: [0.25, 0.1, 0.25, 1] },
			{ ease: 'ease-in', expected: [0.42, 0, 1, 1] },
			{ ease: 'ease-out', expected: [0, 0, 0.58, 1] },
			{ ease: EASE_IN_OUT, expected: [0.42, 0, 0.58, 1] },
		];

		for (const { ease, expected } of testCases) {
			const result = createTransition({ ease });
			expect(result.ease).toEqual(expected);
		}
	});
});

describe('createSpringTransition - default values', () => {
	it('creates spring transition with default values', () => {
		const result = createSpringTransition();

		expectSpringTransition(result, {
			stiffness: 200,
			damping: 25,
			mass: 1,
			delay: 0,
		});
	});

	it('creates spring transition with empty config object', () => {
		const config: SpringTransitionConfig = {};
		const result = createSpringTransition(config);

		expectSpringTransition(result, {
			stiffness: 200,
			damping: 25,
			mass: 1,
			delay: 0,
		});
	});
});

describe('createSpringTransition - individual property overrides', () => {
	it('creates spring transition with custom stiffness', () => {
		const config: SpringTransitionConfig = {
			stiffness: 300,
		};
		const result = createSpringTransition(config);

		expectSpringTransition(result, {
			stiffness: 300,
			damping: 25,
			mass: 1,
			delay: 0,
		});
	});

	it('creates spring transition with custom damping', () => {
		const config: SpringTransitionConfig = {
			damping: 30,
		};
		const result = createSpringTransition(config);

		expectSpringTransition(result, {
			stiffness: 200,
			damping: 30,
			mass: 1,
			delay: 0,
		});
	});

	it('creates spring transition with custom mass', () => {
		const config: SpringTransitionConfig = {
			mass: 2,
		};
		const result = createSpringTransition(config);

		expectSpringTransition(result, {
			stiffness: 200,
			damping: 25,
			mass: 2,
			delay: 0,
		});
	});

	it('creates spring transition with custom delay', () => {
		const config: SpringTransitionConfig = {
			delay: 0.5,
		};
		const result = createSpringTransition(config);

		expectSpringTransition(result, {
			stiffness: 200,
			damping: 25,
			mass: 1,
			delay: 0.5,
		});
	});
});

describe('createSpringTransition - combined values', () => {
	it('creates spring transition with all custom values', () => {
		const config: SpringTransitionConfig = {
			stiffness: 150,
			damping: 20,
			mass: 1.5,
			delay: 0.2,
		};
		const result = createSpringTransition(config);

		expectSpringTransition(result, {
			stiffness: 150,
			damping: 20,
			mass: 1.5,
			delay: 0.2,
		});
	});

	it('handles partial config correctly', () => {
		const config: SpringTransitionConfig = {
			stiffness: 250,
			delay: 0.1,
		};
		const result = createSpringTransition(config);

		expectSpringTransition(result, {
			stiffness: 250,
			damping: 25,
			mass: 1,
			delay: 0.1,
		});
	});
});

describe('createSpringTransition - edge cases', () => {
	it('handles zero values correctly', () => {
		const config: SpringTransitionConfig = {
			stiffness: 0,
			damping: 0,
			mass: 0,
			delay: 0,
		};
		const result = createSpringTransition(config);

		expectSpringTransition(result, {
			stiffness: 0,
			damping: 0,
			mass: 0,
			delay: 0,
		});
	});
});
