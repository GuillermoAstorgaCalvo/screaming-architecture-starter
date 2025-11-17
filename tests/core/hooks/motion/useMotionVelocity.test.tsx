import { useMotionValue } from '@core/hooks/motion/useMotionValue';
import { useMotionVelocity } from '@core/hooks/motion/useMotionVelocity';
import { renderHook } from '@testing-library/react';
import type * as FramerMotion from 'framer-motion';
import { describe, expect, it, vi } from 'vitest';

type FramerMotionModule = typeof FramerMotion;

// Mock framer-motion's useVelocity
vi.mock('framer-motion', async () => {
	const actual = await vi.importActual<FramerMotionModule>('framer-motion');
	return {
		...actual,
		useVelocity: vi.fn((value: { get: () => number }) => {
			// Mock velocity calculation (simplified)
			let lastValue = value.get();
			let lastTime = Date.now();
			return {
				get: () => {
					const currentValue = value.get();
					const currentTime = Date.now();
					const deltaTime = currentTime - lastTime;
					const deltaValue = currentValue - lastValue;
					const velocity = deltaTime > 0 ? (deltaValue / deltaTime) * 1000 : 0;
					lastValue = currentValue;
					lastTime = currentTime;
					return velocity;
				},
				set: vi.fn(),
				on: vi.fn(),
				off: vi.fn(),
			};
		}),
	};
});

describe('useMotionVelocity - creation', () => {
	it('should return a motion value representing velocity', () => {
		const { result: sourceResult } = renderHook(() => useMotionValue(0));
		const source = sourceResult.current;

		const { result } = renderHook(() => useMotionVelocity(source));

		expect(result.current).toBeDefined();
		expect(result.current).toHaveProperty('get');
		expect(result.current).toHaveProperty('set');
	});

	it('should return motion value with event methods', () => {
		const { result: sourceResult } = renderHook(() => useMotionValue(0));
		const source = sourceResult.current;

		const { result } = renderHook(() => useMotionVelocity(source));

		expect(result.current.on).toBeDefined();
		expect(typeof result.current.on).toBe('function');

		expect(() => {
			result.current.on('change', vi.fn());
		}).not.toThrow();
	});
});

describe('useMotionVelocity - framer-motion integration', () => {
	it('should pass source motion value to useVelocity', async () => {
		const { useVelocity } = await import('framer-motion');
		const { result: sourceResult } = renderHook(() => useMotionValue(0));
		const source = sourceResult.current;

		renderHook(() => useMotionVelocity(source));

		expect(useVelocity).toHaveBeenCalledWith(source);
	});
});

describe('useMotionVelocity - velocity calculations', () => {
	it('should track velocity of motion value changes', () => {
		const { result: sourceResult } = renderHook(() => useMotionValue(0));
		const source = sourceResult.current;

		const { result } = renderHook(() => useMotionVelocity(source));

		// Initial velocity should be 0 or close to 0
		const initialVelocity = result.current.get();
		expect(typeof initialVelocity).toBe('number');

		// Change source value
		source.set(100);
		const velocity = result.current.get();
		expect(typeof velocity).toBe('number');
	});

	it('should handle zero velocity', () => {
		const { result: sourceResult } = renderHook(() => useMotionValue(0));
		const source = sourceResult.current;

		const { result } = renderHook(() => useMotionVelocity(source));

		// Set value and wait a bit
		source.set(0);
		const velocity = result.current.get();
		expect(typeof velocity).toBe('number');
	});

	it('should work with different source values', () => {
		const { result: sourceResult } = renderHook(() => useMotionValue(10));
		const source = sourceResult.current;

		const { result } = renderHook(() => useMotionVelocity(source));

		expect(result.current).toBeDefined();

		source.set(20);
		expect(result.current.get()).toBeDefined();

		source.set(30);
		expect(result.current.get()).toBeDefined();
	});

	it('should handle negative velocity', () => {
		const { result: sourceResult } = renderHook(() => useMotionValue(100));
		const source = sourceResult.current;

		const { result } = renderHook(() => useMotionVelocity(source));

		source.set(50); // Decreasing value
		const velocity = result.current.get();
		expect(typeof velocity).toBe('number');
	});
});
