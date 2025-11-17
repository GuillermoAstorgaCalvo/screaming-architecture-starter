import { useMotionSpring } from '@core/hooks/motion/useMotionSpring';
import { useMotionValue } from '@core/hooks/motion/useMotionValue';
import { renderHook } from '@testing-library/react';
import type { MotionValue, SpringOptions } from 'framer-motion';
import { describe, expect, it, vi } from 'vitest';

// Mock framer-motion's useSpring
vi.mock('framer-motion', async () => {
	const actual = await vi.importActual('framer-motion');
	return {
		...actual,
		useSpring: vi.fn((source: MotionValue<number>, _config?: SpringOptions) => {
			// Return a mock motion value that tracks the source
			return {
				get: () => source.get(),
				set: (value: number) => source.set(value),
				on: vi.fn(),
				off: vi.fn(),
			};
		}),
	};
});

describe('useMotionSpring', () => {
	it('should return a motion value', () => {
		const { result: sourceResult } = renderHook(() => useMotionValue(0));
		const source = sourceResult.current;

		const { result } = renderHook(() => useMotionSpring(source));

		expect(result.current).toBeDefined();
		expect(result.current).toHaveProperty('get');
		expect(result.current).toHaveProperty('set');
	});

	it('should pass source motion value to useSpring', async () => {
		const { useSpring } = await import('framer-motion');
		const { result: sourceResult } = renderHook(() => useMotionValue(10));
		const source = sourceResult.current;

		renderHook(() => useMotionSpring(source));

		expect(useSpring).toHaveBeenCalledWith(source, undefined);
	});

	it('should pass spring config to useSpring', async () => {
		const { useSpring } = await import('framer-motion');
		const { result: sourceResult } = renderHook(() => useMotionValue(0));
		const source = sourceResult.current;
		const config = { stiffness: 100, damping: 10 };

		renderHook(() => useMotionSpring(source, config));

		expect(useSpring).toHaveBeenCalledWith(source, config);
	});

	it('should work with different spring configurations', () => {
		const { result: sourceResult } = renderHook(() => useMotionValue(0));
		const source = sourceResult.current;

		const config1 = { stiffness: 100, damping: 10 };
		const { result: result1 } = renderHook(() => useMotionSpring(source, config1));
		expect(result1.current).toBeDefined();

		const config2 = { stiffness: 200, damping: 20, mass: 1 };
		const { result: result2 } = renderHook(() => useMotionSpring(source, config2));
		expect(result2.current).toBeDefined();
	});

	it('should handle undefined config', () => {
		const { result: sourceResult } = renderHook(() => useMotionValue(0));
		const source = sourceResult.current;

		const { result } = renderHook(() => useMotionSpring(source));

		expect(result.current).toBeDefined();
	});

	it('should return motion value that reflects source changes', () => {
		const { result: sourceResult } = renderHook(() => useMotionValue(0));
		const source = sourceResult.current;

		const { result } = renderHook(() => useMotionSpring(source));

		expect(result.current.get()).toBe(0);

		source.set(100);
		expect(result.current.get()).toBe(100);
	});
});
