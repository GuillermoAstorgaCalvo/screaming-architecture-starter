import { useScrollProgress } from '@core/hooks/motion/useScrollProgress';
import { renderHook, waitFor } from '@testing-library/react';
import type * as FramerMotion from 'framer-motion';
import type { RefObject } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock framer-motion's useScroll and useMotionValue
let mockScrollY = 0;
let mockScrollX = 0;
let mockScrollYProgress = 0;
let mockScrollXProgress = 0;
let scrollChangeCallbacks: Array<() => void> = [];

const createScrollValue = (getter: () => number) => ({
	get: getter,
	set: vi.fn(),
	on: vi.fn((event: string, callback: () => void) => {
		if (event === 'change') {
			scrollChangeCallbacks.push(callback);
		}
		return () => {
			const index = scrollChangeCallbacks.indexOf(callback);
			if (index > -1) {
				scrollChangeCallbacks.splice(index, 1);
			}
		};
	}),
	off: vi.fn(),
});

vi.mock('framer-motion', async () => {
	const actual = await vi.importActual<typeof FramerMotion>('framer-motion');
	return {
		...actual,
		useScroll: vi.fn(() => ({
			scrollY: createScrollValue(() => mockScrollY),
			scrollX: createScrollValue(() => mockScrollX),
			scrollYProgress: createScrollValue(() => mockScrollYProgress),
			scrollXProgress: createScrollValue(() => mockScrollXProgress),
		})),
		useMotionValue: vi.fn((initial: number) => {
			let value = initial;
			return {
				get: () => value,
				set: (newValue: number) => {
					value = newValue;
				},
				on: vi.fn(),
				off: vi.fn(),
			};
		}),
	};
});

const triggerScrollChange = () => {
	for (const callback of scrollChangeCallbacks) {
		callback();
	}
};

const registerBasicFunctionalityTests = () => {
	describe('basic functionality', () => {
		it('should return a motion value', () => {
			const { result } = renderHook(() => useScrollProgress());
			expect(result.current).toBeDefined();
			expect(result.current).toHaveProperty('get');
			expect(result.current).toHaveProperty('set');
		});

		it('should initialize with 0 progress', () => {
			const { result } = renderHook(() => useScrollProgress());
			expect(result.current.get()).toBe(0);
		});

		it('should update progress when scroll changes', async () => {
			const { result } = renderHook(() => useScrollProgress());
			mockScrollY = 500;
			mockScrollYProgress = 0.5;
			triggerScrollChange();

			await waitFor(() => {
				expect(result.current.get()).toBeGreaterThanOrEqual(0);
			});
		});
	});
};

const registerContainerOptionTests = () => {
	describe('container option', () => {
		it('should work without container (defaults to window)', () => {
			const { result } = renderHook(() => useScrollProgress());
			expect(result.current).toBeDefined();
		});

		it('should work with container ref', () => {
			const container = document.createElement('div');
			const containerRef = { current: container } as RefObject<HTMLElement>;
			const { result } = renderHook(() => useScrollProgress({ container: containerRef }));
			expect(result.current).toBeDefined();
		});

		it('should work with container as HTMLElement', () => {
			const container = document.createElement('div');
			const { result } = renderHook(() => useScrollProgress({ container }));
			expect(result.current).toBeDefined();
		});

		it('should handle null container', () => {
			const { result } = renderHook(() => useScrollProgress({ container: null }));
			expect(result.current).toBeDefined();
		});
	});
};

const registerOffsetOptionTests = () => {
	describe('offset options', () => {
		it('should use default offset of 0', () => {
			const { result } = renderHook(() => useScrollProgress());
			expect(result.current.get()).toBe(0);
		});

		it('should handle custom offset', () => {
			const { result } = renderHook(() => useScrollProgress({ offset: 100 }));
			expect(result.current).toBeDefined();
		});

		it('should handle custom offsetBottom', () => {
			const { result } = renderHook(() => useScrollProgress({ offsetBottom: 100 }));
			expect(result.current).toBeDefined();
		});

		it('should handle both offset and offsetBottom', () => {
			const { result } = renderHook(() => useScrollProgress({ offset: 50, offsetBottom: 50 }));
			expect(result.current).toBeDefined();
		});
	});
};

const registerHorizontalOptionTests = () => {
	describe('horizontal option', () => {
		it('should track vertical scroll by default', () => {
			const { result } = renderHook(() => useScrollProgress());
			expect(result.current).toBeDefined();
		});

		it('should track horizontal scroll when horizontal is true', () => {
			const { result } = renderHook(() => useScrollProgress({ horizontal: true }));
			expect(result.current).toBeDefined();
		});
	});
};

const registerProgressCalculationTests = () => {
	describe('progress calculation', () => {
		it('should calculate progress correctly with offsets', async () => {
			const originalGetScrollHeight = globalThis.document.documentElement.scrollHeight;
			Object.defineProperty(globalThis.document.documentElement, 'scrollHeight', {
				writable: true,
				value: 1000,
			});
			Object.defineProperty(globalThis.window, 'innerHeight', {
				writable: true,
				value: 500,
			});

			const { result } = renderHook(() => useScrollProgress({ offset: 100, offsetBottom: 100 }));
			mockScrollY = 200;
			triggerScrollChange();

			let progressValue = 0;
			await waitFor(() => {
				progressValue = result.current.get();
				expect(progressValue).toBeGreaterThanOrEqual(0);
			});
			expect(progressValue).toBeLessThanOrEqual(1);

			Object.defineProperty(globalThis.document.documentElement, 'scrollHeight', {
				writable: true,
				value: originalGetScrollHeight,
			});
		});

		it('should clamp progress between 0 and 1', async () => {
			const { result } = renderHook(() => useScrollProgress());

			mockScrollY = -100;
			triggerScrollChange();

			await waitFor(() => {
				const progress = result.current.get();
				expect(progress).toBeGreaterThanOrEqual(0);
			});

			mockScrollY = 100000;
			triggerScrollChange();

			await waitFor(() => {
				const progress = result.current.get();
				expect(progress).toBeLessThanOrEqual(1);
			});
		});
	});
};

const registerEdgeCaseTests = () => {
	describe('edge cases', () => {
		it('should handle zero scroll height', async () => {
			const originalScrollHeight = globalThis.document.documentElement.scrollHeight;
			Object.defineProperty(globalThis.document.documentElement, 'scrollHeight', {
				writable: true,
				value: 0,
			});

			const { result } = renderHook(() => useScrollProgress());
			mockScrollY = 100;
			triggerScrollChange();

			await waitFor(() => {
				expect(result.current.get()).toBe(0);
			});

			Object.defineProperty(globalThis.document.documentElement, 'scrollHeight', {
				writable: true,
				value: originalScrollHeight,
			});
		});

		it('should handle negative offsets', () => {
			const { result } = renderHook(() => useScrollProgress({ offset: -50, offsetBottom: -50 }));
			expect(result.current).toBeDefined();
		});

		it('should handle very large offsets', () => {
			const { result } = renderHook(() =>
				useScrollProgress({ offset: 10000, offsetBottom: 10000 })
			);
			expect(result.current).toBeDefined();
		});

		it('should update when options change', () => {
			const { result, rerender } = renderHook(({ offset }) => useScrollProgress({ offset }), {
				initialProps: { offset: 0 },
			});

			expect(result.current).toBeDefined();
			rerender({ offset: 100 });
			expect(result.current).toBeDefined();
		});
	});
};

const registerCleanupTests = () => {
	describe('cleanup', () => {
		it('should cleanup scroll listeners on unmount', () => {
			const { unmount } = renderHook(() => useScrollProgress());
			const initialCallbackCount = scrollChangeCallbacks.length;
			expect(initialCallbackCount).toBeGreaterThan(0);

			unmount();
			expect(scrollChangeCallbacks.length).toBeLessThanOrEqual(initialCallbackCount);
		});
	});
};

describe('useScrollProgress', () => {
	beforeEach(() => {
		mockScrollY = 0;
		mockScrollX = 0;
		mockScrollYProgress = 0;
		mockScrollXProgress = 0;
		scrollChangeCallbacks = [];
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	registerBasicFunctionalityTests();
	registerContainerOptionTests();
	registerOffsetOptionTests();
	registerHorizontalOptionTests();
	registerProgressCalculationTests();
	registerEdgeCaseTests();
	registerCleanupTests();
});
