import { useMotionTransform } from '@core/hooks/motion/useMotionTransform';
import { useMotionValue } from '@core/hooks/motion/useMotionValue';
import { renderHook } from '@testing-library/react';
import type * as FramerMotion from 'framer-motion';
import { describe, expect, it, vi } from 'vitest';

// Mock framer-motion's useTransform
vi.mock('framer-motion', async () => {
	const actual = await vi.importActual<typeof FramerMotion>('framer-motion');
	return {
		...actual,
		useTransform: vi.fn((valueOrValues, inputOrTransform, output) => {
			// Return a mock motion value
			return {
				get: () => {
					if (Array.isArray(valueOrValues)) {
						const values = valueOrValues.map(v => v.get());
						if (typeof inputOrTransform === 'function') {
							return inputOrTransform(...values);
						}
						return values;
					}
					const val = valueOrValues.get();
					if (typeof inputOrTransform === 'function') {
						return inputOrTransform(val);
					}
					if (Array.isArray(inputOrTransform) && Array.isArray(output)) {
						// Simple linear interpolation
						const [inMin, inMax] = inputOrTransform;
						const [outMin, outMax] = output;
						const ratio = (val - inMin) / (inMax - inMin);
						return outMin + ratio * (outMax - outMin);
					}
					return val;
				},
				set: vi.fn(),
				on: vi.fn(),
				off: vi.fn(),
			};
		}),
	};
});

describe('useMotionTransform input/output ranges', () => {
	it('should transform value using input/output ranges', async () => {
		const { useTransform } = await import('framer-motion');
		const { result: sourceResult } = renderHook(() => useMotionValue(50));
		const source = sourceResult.current;

		const { result } = renderHook(() => useMotionTransform(source, [0, 100], [0, 1]));

		expect(result.current).toBeDefined();
		expect(useTransform).toHaveBeenCalledWith(source, [0, 100], [0, 1]);
	});

	it('should correctly map values between ranges', () => {
		const { result: sourceResult } = renderHook(() => useMotionValue(50));
		const source = sourceResult.current;

		const { result } = renderHook(() => useMotionTransform(source, [0, 100], [0, 1]));

		// 50 is halfway between 0 and 100, so should map to 0.5
		expect(result.current.get()).toBeCloseTo(0.5);
	});

	it('should handle different range mappings', () => {
		const { result: sourceResult } = renderHook(() => useMotionValue(25));
		const source = sourceResult.current;

		const { result } = renderHook(() => useMotionTransform(source, [0, 100], [0, 10]));

		// 25 is 25% of 100, so should map to 2.5
		expect(result.current.get()).toBeCloseTo(2.5);
	});
});

describe('useMotionTransform transform function', () => {
	it('should transform value using custom function', async () => {
		const { useTransform } = await import('framer-motion');
		const { result: sourceResult } = renderHook(() => useMotionValue(5));
		const source = sourceResult.current;
		const transform = (value: number) => value * 2;

		const { result } = renderHook(() => useMotionTransform(source, transform));

		expect(result.current).toBeDefined();
		expect(useTransform).toHaveBeenCalledWith(source, transform, undefined);
	});

	it('should apply transform function correctly', () => {
		const { result: sourceResult } = renderHook(() => useMotionValue(10));
		const source = sourceResult.current;
		const transform = (value: number) => value * 3;

		const { result } = renderHook(() => useMotionTransform(source, transform));

		expect(result.current.get()).toBe(30);
	});

	it('should handle complex transform functions', () => {
		const { result: sourceResult } = renderHook(() => useMotionValue(2));
		const source = sourceResult.current;
		const transform = (value: number) => value ** 2 + value;

		const { result } = renderHook(() => useMotionTransform(source, transform));

		expect(result.current.get()).toBe(6); // 2^2 + 2 = 6
	});
});

describe('useMotionTransform multiple sources', () => {
	it('should transform multiple motion values', async () => {
		const { useTransform } = await import('framer-motion');
		const { result: xResult } = renderHook(() => useMotionValue(10));
		const { result: yResult } = renderHook(() => useMotionValue(20));
		const x = xResult.current;
		const y = yResult.current;

		const transform = (xVal: number, yVal: number) => xVal + yVal;

		const { result } = renderHook(() => useMotionTransform([x, y], transform));

		expect(result.current).toBeDefined();
		expect(useTransform).toHaveBeenCalledWith([x, y], transform, undefined);
	});

	it('should apply transform function to multiple values', () => {
		const { result: xResult } = renderHook(() => useMotionValue(5));
		const { result: yResult } = renderHook(() => useMotionValue(10));
		const x = xResult.current;
		const y = yResult.current;

		const transform = (xVal: number, yVal: number) => xVal * yVal;

		const { result } = renderHook(() => useMotionTransform([x, y], transform));

		expect(result.current.get()).toBe(50); // 5 * 10
	});
});

describe('useMotionTransform edge cases', () => {
	it('should handle zero values', () => {
		const { result: sourceResult } = renderHook(() => useMotionValue(0));
		const source = sourceResult.current;

		const { result } = renderHook(() => useMotionTransform(source, [0, 100], [0, 1]));

		expect(result.current.get()).toBe(0);
	});

	it('should handle negative values', () => {
		const { result: sourceResult } = renderHook(() => useMotionValue(-50));
		const source = sourceResult.current;

		const { result } = renderHook(() => useMotionTransform(source, [-100, 0], [0, 1]));

		expect(result.current.get()).toBeCloseTo(0.5);
	});

	it('should handle string output types', () => {
		const { result: sourceResult } = renderHook(() => useMotionValue(50));
		const source = sourceResult.current;

		const { result } = renderHook(() => useMotionTransform(source, [0, 100], ['0%', '100%']));

		expect(result.current).toBeDefined();
	});

	it('should handle boolean output types', () => {
		const { result: sourceResult } = renderHook(() => useMotionValue(50));
		const source = sourceResult.current;

		const transform = (value: number) => value > 25;

		const { result } = renderHook(() => useMotionTransform(source, transform));

		expect(result.current.get()).toBe(true);
	});
});
