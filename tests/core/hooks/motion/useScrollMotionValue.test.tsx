import { useScrollMotionValue } from '@core/hooks/motion/useScrollMotionValue';
import { renderHook } from '@testing-library/react';
import type { RefObject } from 'react';
import { describe, expect, it, vi } from 'vitest';

// Mock framer-motion's useScroll
vi.mock('framer-motion', async () => {
	const actual = await vi.importActual('framer-motion');
	const typedActual: Record<string, unknown> = actual;
	return {
		...typedActual,
		useScroll: vi.fn((_options?: { container?: { current: HTMLElement | null } }) => {
			const mockScrollY = {
				get: () => 0,
				set: vi.fn(),
				on: vi.fn(),
				off: vi.fn(),
			};
			const mockScrollX = {
				get: () => 0,
				set: vi.fn(),
				on: vi.fn(),
				off: vi.fn(),
			};
			const mockScrollYProgress = {
				get: () => 0,
				set: vi.fn(),
				on: vi.fn(),
				off: vi.fn(),
			};
			const mockScrollXProgress = {
				get: () => 0,
				set: vi.fn(),
				on: vi.fn(),
				off: vi.fn(),
			};

			return {
				scrollY: mockScrollY,
				scrollX: mockScrollX,
				scrollYProgress: mockScrollYProgress,
				scrollXProgress: mockScrollXProgress,
			};
		}),
	};
});

describe('useScrollMotionValue returns', () => {
	it('should return scroll motion values', () => {
		const { result } = renderHook(() => useScrollMotionValue());

		expect(result.current).toHaveProperty('scrollY');
		expect(result.current).toHaveProperty('scrollX');
		expect(result.current).toHaveProperty('scrollYProgress');
		expect(result.current).toHaveProperty('scrollXProgress');
	});

	it('should return motion values with get method', () => {
		const { result } = renderHook(() => useScrollMotionValue());

		expect(result.current.scrollY).toHaveProperty('get');
		expect(result.current.scrollX).toHaveProperty('get');
		expect(result.current.scrollYProgress).toHaveProperty('get');
		expect(result.current.scrollXProgress).toHaveProperty('get');
	});

	it('should return scrollY motion value', () => {
		const { result } = renderHook(() => useScrollMotionValue());

		expect(result.current.scrollY).toBeDefined();
		expect(typeof result.current.scrollY.get).toBe('function');
		expect(result.current.scrollY.get()).toBe(0);
	});

	it('should return scrollX motion value', () => {
		const { result } = renderHook(() => useScrollMotionValue());

		expect(result.current.scrollX).toBeDefined();
		expect(typeof result.current.scrollX.get).toBe('function');
		expect(result.current.scrollX.get()).toBe(0);
	});

	it('should return scrollYProgress motion value', () => {
		const { result } = renderHook(() => useScrollMotionValue());

		expect(result.current.scrollYProgress).toBeDefined();
		expect(typeof result.current.scrollYProgress.get).toBe('function');
		expect(result.current.scrollYProgress.get()).toBe(0);
	});

	it('should return scrollXProgress motion value', () => {
		const { result } = renderHook(() => useScrollMotionValue());

		expect(result.current.scrollXProgress).toBeDefined();
		expect(typeof result.current.scrollXProgress.get).toBe('function');
		expect(result.current.scrollXProgress.get()).toBe(0);
	});
});

describe('useScrollMotionValue containers', () => {
	it('should call useScroll with no options by default', async () => {
		const { useScroll } = await import('framer-motion');
		renderHook(() => useScrollMotionValue());

		expect(useScroll).toHaveBeenCalledWith({});
	});

	it('should pass container ref to useScroll', async () => {
		const { useScroll } = await import('framer-motion');
		const container = document.createElement('div');
		const containerRef: RefObject<HTMLElement> = { current: container };

		renderHook(() => useScrollMotionValue({ container: containerRef }));

		expect(useScroll).toHaveBeenCalledWith({ container: containerRef });
	});

	it('should handle container as HTMLElement directly', async () => {
		const { useScroll } = await import('framer-motion');
		const container = document.createElement('div');

		renderHook(() => useScrollMotionValue({ container }));

		expect(useScroll).toHaveBeenCalledWith({ container: { current: container } });
	});

	it('should handle null container', async () => {
		const { useScroll } = await import('framer-motion');

		renderHook(() => useScrollMotionValue({ container: null }));

		expect(useScroll).toHaveBeenCalledWith({});
	});

	it('should handle container ref with null current', async () => {
		const { useScroll } = await import('framer-motion');
		const containerRef = { current: null } as unknown as RefObject<HTMLElement>;

		renderHook(() => useScrollMotionValue({ container: containerRef }));

		expect(useScroll).toHaveBeenCalledWith({ container: containerRef });
	});

	it('should work with different container elements', () => {
		const container1 = document.createElement('div');
		const container2 = document.createElement('section');

		const { result: result1 } = renderHook(() => useScrollMotionValue({ container: container1 }));
		expect(result1.current).toBeDefined();

		const { result: result2 } = renderHook(() => useScrollMotionValue({ container: container2 }));
		expect(result2.current).toBeDefined();
	});
});

describe('useScrollMotionValue motion values', () => {
	it('should return motion values that can be used with transforms', () => {
		const { result } = renderHook(() => useScrollMotionValue());

		// Motion values should have on/off methods for subscriptions
		expect(result.current.scrollY).toHaveProperty('on');
		expect(result.current.scrollY).toHaveProperty('off');
		expect(result.current.scrollX).toHaveProperty('on');
		expect(result.current.scrollX).toHaveProperty('off');
		expect(result.current.scrollYProgress).toHaveProperty('on');
		expect(result.current.scrollYProgress).toHaveProperty('off');
		expect(result.current.scrollXProgress).toHaveProperty('on');
		expect(result.current.scrollXProgress).toHaveProperty('off');
	});
});
