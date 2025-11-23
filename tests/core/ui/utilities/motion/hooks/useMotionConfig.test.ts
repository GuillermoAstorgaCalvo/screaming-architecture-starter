/**
 * Tests for useMotionConfig hook
 *
 * Tests the motion configuration hook:
 * - Configuration values
 * - Duration tokens
 * - Easing tokens
 * - Transition creation
 * - Reduced motion strategy resolution
 */

import {
	motionDurations,
	motionDurationTokens,
	motionEasing,
	motionEasingTokens,
} from '@core/ui/utilities/motion/constants/motionConstants';
import { useMotionConfig } from '@core/ui/utilities/motion/hooks/useMotionConfig';
import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

// Mock useReducedMotion
const mockUseReducedMotion = vi.fn(() => false);
vi.mock('@core/ui/utilities/motion/hooks/useReducedMotion', () => ({
	useReducedMotion: () => mockUseReducedMotion(),
}));

describe('useMotionConfig - Configuration values', () => {
	it('returns motion configuration object', () => {
		const { result } = renderHook(() => useMotionConfig());

		expect(result.current).toBeDefined();
		expect(result.current).toHaveProperty('reducedMotion');
		expect(result.current).toHaveProperty('durationTokens');
		expect(result.current).toHaveProperty('durations');
		expect(result.current).toHaveProperty('easingTokens');
		expect(result.current).toHaveProperty('easings');
		expect(result.current).toHaveProperty('createTransition');
		expect(result.current).toHaveProperty('resolveReducedMotionStrategy');
	});

	it('returns correct duration tokens', () => {
		const { result } = renderHook(() => useMotionConfig());

		expect(result.current.durationTokens).toBe(motionDurationTokens);
	});

	it('returns correct duration values', () => {
		const { result } = renderHook(() => useMotionConfig());

		expect(result.current.durations).toBe(motionDurations);
	});

	it('returns correct easing tokens', () => {
		const { result } = renderHook(() => useMotionConfig());

		expect(result.current.easingTokens).toBe(motionEasingTokens);
	});

	it('returns correct easing values', () => {
		const { result } = renderHook(() => useMotionConfig());

		expect(result.current.easings).toBe(motionEasing);
	});
});

describe('useMotionConfig - Reduced motion', () => {
	it('returns false when reduced motion is not preferred', () => {
		mockUseReducedMotion.mockReturnValue(false);

		const { result } = renderHook(() => useMotionConfig());

		expect(result.current.reducedMotion).toBe(false);
	});

	it('returns true when reduced motion is preferred', () => {
		mockUseReducedMotion.mockReturnValue(true);

		const { result } = renderHook(() => useMotionConfig());

		expect(result.current.reducedMotion).toBe(true);
	});
});

describe('useMotionConfig - resolveReducedMotionStrategy', () => {
	it('returns "normal" when reduced motion is not preferred', () => {
		mockUseReducedMotion.mockReturnValue(false);

		const { result } = renderHook(() => useMotionConfig());

		expect(result.current.resolveReducedMotionStrategy('fade')).toBe('normal');
		expect(result.current.resolveReducedMotionStrategy('static')).toBe('normal');
		expect(result.current.resolveReducedMotionStrategy('skip')).toBe('normal');
	});

	it('returns strategy when reduced motion is preferred', () => {
		mockUseReducedMotion.mockReturnValue(true);

		const { result } = renderHook(() => useMotionConfig());

		expect(result.current.resolveReducedMotionStrategy('fade')).toBe('fade');
		expect(result.current.resolveReducedMotionStrategy('static')).toBe('static');
		expect(result.current.resolveReducedMotionStrategy('skip')).toBe('skip');
	});

	it('defaults to "fade" strategy when not provided', () => {
		mockUseReducedMotion.mockReturnValue(true);

		const { result } = renderHook(() => useMotionConfig());

		expect(result.current.resolveReducedMotionStrategy()).toBe('fade');
	});
});

describe('useMotionConfig - createTransition', () => {
	it('creates transition with default values', () => {
		const { result } = renderHook(() => useMotionConfig());

		const transition = result.current.createTransition();

		expect(transition).toBeDefined();
		expect(transition).toHaveProperty('duration');
		expect(transition).toHaveProperty('ease');
		expect(transition).toHaveProperty('delay');
	});

	it('creates transition with custom duration', () => {
		const { result } = renderHook(() => useMotionConfig());

		const transition = result.current.createTransition({ duration: 'fast' });

		expect(transition.duration).toBe(motionDurations.fast);
	});

	it('creates transition with custom easing', () => {
		const { result } = renderHook(() => useMotionConfig());

		const transition = result.current.createTransition({ ease: 'ease-in' });

		expect(transition.ease).toEqual(motionEasing['ease-in']);
	});

	it('creates transition with custom delay', () => {
		const { result } = renderHook(() => useMotionConfig());

		const transition = result.current.createTransition({ delay: 0.5 });

		expect(transition.delay).toBe(0.5);
	});

	it('creates transition with all custom options', () => {
		const { result } = renderHook(() => useMotionConfig());

		const transition = result.current.createTransition({
			duration: 'slow',
			ease: 'ease-in-out',
			delay: 0.3,
		});

		expect(transition.duration).toBe(motionDurations.slow);
		expect(transition.ease).toEqual(motionEasing['ease-in-out']);
		expect(transition.delay).toBe(0.3);
	});

	it('creates transition with numeric duration', () => {
		const { result } = renderHook(() => useMotionConfig());

		const transition = result.current.createTransition({ duration: 0.5 });

		expect(transition.duration).toBe(0.5);
	});
});

describe('useMotionConfig - Memoization', () => {
	it('memoizes configuration object', () => {
		const { result, rerender } = renderHook(() => useMotionConfig());

		const firstResult = result.current;
		rerender();
		const secondResult = result.current;

		// Should be the same object reference when dependencies don't change
		expect(firstResult).toBe(secondResult);
	});

	it('updates when reduced motion preference changes', () => {
		mockUseReducedMotion.mockReturnValue(false);

		const { result, rerender } = renderHook(() => useMotionConfig());

		const firstReducedMotion = result.current.reducedMotion;
		expect(firstReducedMotion).toBe(false);

		mockUseReducedMotion.mockReturnValue(true);
		rerender();

		expect(result.current.reducedMotion).toBe(true);
	});
});
