import { useMotionValue } from '@core/hooks/motion/useMotionValue';
import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

// Mock framer-motion's useMotionValue
vi.mock('framer-motion', async () => {
	const actual = await vi.importActual<Record<string, unknown>>('framer-motion');
	return {
		...actual,
		useMotionValue: vi.fn((initial: number | (() => number)) => {
			let value = typeof initial === 'function' ? initial() : initial;
			return {
				get: () => value,
				set: (newValue: number) => {
					value = newValue;
				},
				on: vi.fn(),
			};
		}),
	};
});

describe('useMotionValue creation', () => {
	it('should return a motion value', () => {
		const { result } = renderHook(() => useMotionValue(0));

		expect(result.current).toBeDefined();
		expect(result.current).toHaveProperty('get');
		expect(result.current).toHaveProperty('set');
	});

	it('should initialize with provided value', () => {
		const { result } = renderHook(() => useMotionValue(42));

		expect(result.current.get()).toBe(42);
	});

	it('should handle function initializer', () => {
		const { result } = renderHook(() => useMotionValue(() => 100));

		expect(result.current.get()).toBe(100);
	});

	it('should handle different initial value types', () => {
		const { result: numResult } = renderHook(() => useMotionValue(10));
		expect(numResult.current.get()).toBe(10);

		const { result: funcResult } = renderHook(() => useMotionValue(() => 20));
		expect(funcResult.current.get()).toBe(20);
	});

	it('should memoize function initializer result', () => {
		const initializer = vi.fn(() => 42);
		const { result, rerender } = renderHook(() => useMotionValue(initializer));

		expect(initializer).toHaveBeenCalledTimes(1);
		expect(result.current.get()).toBe(42);

		rerender();
		expect(initializer).toHaveBeenCalledTimes(1);
	});
});

describe('useMotionValue initial edge cases', () => {
	it('should handle zero as initial value', () => {
		const { result } = renderHook(() => useMotionValue(0));

		expect(result.current.get()).toBe(0);
	});

	it('should handle negative initial values', () => {
		const { result } = renderHook(() => useMotionValue(-10));

		expect(result.current.get()).toBe(-10);
	});

	it('should handle decimal initial values', () => {
		const { result } = renderHook(() => useMotionValue(3.14));

		expect(result.current.get()).toBe(3.14);
	});
});

describe('useMotionValue updates', () => {
	it('should allow setting new values', () => {
		const { result } = renderHook(() => useMotionValue(0));

		result.current.set(50);
		expect(result.current.get()).toBe(50);

		result.current.set(100);
		expect(result.current.get()).toBe(100);
	});

	it('should handle changing initial value on rerender', () => {
		const { result, rerender } = renderHook(({ initial }) => useMotionValue(initial), {
			initialProps: { initial: 0 },
		});

		expect(result.current.get()).toBe(0);

		rerender({ initial: 100 });
		expect(result.current).toBeDefined();
	});
});

describe('useMotionValue methods', () => {
	it('should expose motion value methods', () => {
		const { result } = renderHook(() => useMotionValue(0));

		expect(result.current.on).toBeDefined();
		expect(typeof result.current.on).toBe('function');
	});
});
