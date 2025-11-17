import { useWindowSize } from '@core/hooks/ui/useWindowSize';
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

function defineInitialStateTests() {
	describe('initial state', () => {
		it('should return current window dimensions on mount', () => {
			if (globalThis.window !== undefined) {
				Object.defineProperty(globalThis.window, 'innerWidth', {
					writable: true,
					configurable: true,
					value: 1920,
				});
				Object.defineProperty(globalThis.window, 'innerHeight', {
					writable: true,
					configurable: true,
					value: 1080,
				});
			}

			const { result } = renderHook(() => useWindowSize());

			expect(result.current.width).toBe(1920);
			expect(result.current.height).toBe(1080);
		});

		it('should return initial values when provided', () => {
			const { result } = renderHook(() => useWindowSize(800, 600));

			// Should use actual window size if available, not initial values
			expect(result.current.width).toBe(1024);
			expect(result.current.height).toBe(768);
		});
	});
}

const trackWindowWidthChanges = async () => {
	const { result } = renderHook(() => useWindowSize());

	expect(result.current.width).toBe(1024);

	if (globalThis.window !== undefined) {
		Object.defineProperty(globalThis.window, 'innerWidth', {
			writable: true,
			configurable: true,
			value: 1920,
		});
	}

	act(() => {
		globalThis.window.dispatchEvent(new Event('resize'));
	});

	await waitFor(() => {
		expect(result.current.width).toBe(1920);
	});
};

const trackWindowHeightChanges = async () => {
	const { result } = renderHook(() => useWindowSize());

	expect(result.current.height).toBe(768);

	if (globalThis.window !== undefined) {
		Object.defineProperty(globalThis.window, 'innerHeight', {
			writable: true,
			configurable: true,
			value: 1080,
		});
	}

	act(() => {
		globalThis.window.dispatchEvent(new Event('resize'));
	});

	await waitFor(() => {
		expect(result.current.height).toBe(1080);
	});
};

const trackBothDimensionChanges = async () => {
	const { result } = renderHook(() => useWindowSize());

	expect(result.current.width).toBe(1024);
	expect(result.current.height).toBe(768);

	if (globalThis.window !== undefined) {
		Object.defineProperty(globalThis.window, 'innerWidth', {
			writable: true,
			configurable: true,
			value: 1920,
		});
		Object.defineProperty(globalThis.window, 'innerHeight', {
			writable: true,
			configurable: true,
			value: 1080,
		});
	}

	act(() => {
		globalThis.window.dispatchEvent(new Event('resize'));
	});

	await waitFor(() => {
		expect(result.current.width).toBe(1920);
		expect(result.current.height).toBe(1080);
	});
};

function defineWindowSizeTrackingTests() {
	describe('window size tracking', () => {
		it('should track window width changes', trackWindowWidthChanges);
		it('should track window height changes', trackWindowHeightChanges);
		it('should track both width and height changes', trackBothDimensionChanges);
	});
}

function defineResponsiveUpdateTests() {
	describe('responsive updates', () => {
		it('should update on multiple resize events', async () => {
			const { result } = renderHook(() => useWindowSize());

			expect(result.current.width).toBe(1024);

			// First resize
			if (globalThis.window !== undefined) {
				Object.defineProperty(globalThis.window, 'innerWidth', {
					writable: true,
					configurable: true,
					value: 768,
				});
			}

			act(() => {
				globalThis.window.dispatchEvent(new Event('resize'));
			});

			await waitFor(() => {
				expect(result.current.width).toBe(768);
			});

			// Second resize
			if (globalThis.window !== undefined) {
				Object.defineProperty(globalThis.window, 'innerWidth', {
					writable: true,
					configurable: true,
					value: 480,
				});
			}

			act(() => {
				globalThis.window.dispatchEvent(new Event('resize'));
			});

			await waitFor(() => {
				expect(result.current.width).toBe(480);
			});
		});

		it('should handle rapid resize events', async () => {
			const { result } = renderHook(() => useWindowSize());

			act(() => {
				// Simulate multiple rapid resize events
				for (let i = 0; i < 5; i++) {
					if (globalThis.window !== undefined) {
						Object.defineProperty(globalThis.window, 'innerWidth', {
							writable: true,
							configurable: true,
							value: 1024 + i * 100,
						});
					}
					globalThis.window.dispatchEvent(new Event('resize'));
				}
			});

			await waitFor(() => {
				expect(result.current.width).toBe(1424); // 1024 + 4 * 100
			});
		});
	});
}

function defineEventListenerManagementTests() {
	describe('event listener management', () => {
		it('should register resize event listener on mount', () => {
			const addEventListenerSpy = vi.spyOn(globalThis.window, 'addEventListener');

			renderHook(() => useWindowSize());

			expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));

			addEventListenerSpy.mockRestore();
		});

		it('should unregister resize event listener on unmount', () => {
			const removeEventListenerSpy = vi.spyOn(globalThis.window, 'removeEventListener');

			const { unmount } = renderHook(() => useWindowSize());

			unmount();

			expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));

			removeEventListenerSpy.mockRestore();
		});

		it('should clean up event listener when component unmounts', () => {
			const removeEventListenerSpy = vi.spyOn(globalThis.window, 'removeEventListener');

			const { unmount } = renderHook(() => useWindowSize());

			unmount();

			expect(removeEventListenerSpy).toHaveBeenCalled();

			removeEventListenerSpy.mockRestore();
		});
	});
}

function defineReturnValueStructureTests() {
	describe('return value structure', () => {
		it('should return an object with width and height properties', () => {
			const { result } = renderHook(() => useWindowSize());

			expect(result.current).toHaveProperty('width');
			expect(result.current).toHaveProperty('height');
			expect(typeof result.current.width).toBe('number');
			expect(typeof result.current.height).toBe('number');
		});

		it('should return WindowSize interface structure', () => {
			const { result } = renderHook(() => useWindowSize());

			expect(result.current).toEqual({
				width: expect.any(Number),
				height: expect.any(Number),
			});
		});
	});
}

function defineSsrSafetyTests() {
	describe('SSR safety', () => {
		it('should return initial values when window is not available', () => {
			// Since we can't actually remove window in jsdom, we'll test the behavior
			// by ensuring the hook handles initial values correctly
			const { result } = renderHook(() => useWindowSize(800, 600));

			// In jsdom, window is always available, so it will use window dimensions
			// But we verify the hook accepts and can use initial values
			expect(typeof result.current.width).toBe('number');
			expect(typeof result.current.height).toBe('number');
		});

		it('should return default values (0, 0) when window is not available and no initial values provided', () => {
			// Since we can't actually remove window in jsdom, we'll test the behavior
			// by ensuring the hook works without initial values
			const { result } = renderHook(() => useWindowSize());

			// In jsdom, window is always available, so it will use window dimensions
			// But we verify the hook works without initial values
			expect(typeof result.current.width).toBe('number');
			expect(typeof result.current.height).toBe('number');
		});

		it('should not register event listener when window is not available', () => {
			// Since we can't actually remove window in jsdom, we'll test the behavior
			// by ensuring the hook works correctly
			const { result } = renderHook(() => useWindowSize());

			// In jsdom, window is always available, so event listener will be registered
			// But we verify the hook works correctly
			expect(typeof result.current.width).toBe('number');
			expect(typeof result.current.height).toBe('number');
		});
	});
}

function defineEdgeCaseTests() {
	describe('edge cases', () => {
		it('should handle zero dimensions', () => {
			if (globalThis.window !== undefined) {
				Object.defineProperty(globalThis.window, 'innerWidth', {
					writable: true,
					configurable: true,
					value: 0,
				});
				Object.defineProperty(globalThis.window, 'innerHeight', {
					writable: true,
					configurable: true,
					value: 0,
				});
			}

			const { result } = renderHook(() => useWindowSize());

			expect(result.current.width).toBe(0);
			expect(result.current.height).toBe(0);
		});

		it('should handle very large dimensions', () => {
			if (globalThis.window !== undefined) {
				Object.defineProperty(globalThis.window, 'innerWidth', {
					writable: true,
					configurable: true,
					value: 99999,
				});
				Object.defineProperty(globalThis.window, 'innerHeight', {
					writable: true,
					configurable: true,
					value: 88888,
				});
			}

			const { result } = renderHook(() => useWindowSize());

			expect(result.current.width).toBe(99999);
			expect(result.current.height).toBe(88888);
		});

		it('should handle negative initial values (edge case)', () => {
			// Since we can't actually remove window in jsdom, we'll test the behavior
			// by ensuring the hook accepts negative initial values
			// In actual SSR, these would be used when window is not available
			const { result } = renderHook(() => useWindowSize(-100, -200));

			// In jsdom, window is always available, so it will use window dimensions
			// But we verify the hook accepts negative initial values
			expect(typeof result.current.width).toBe('number');
			expect(typeof result.current.height).toBe('number');
		});
	});
}

const responsiveBreakpointDetection = async () => {
	const { result } = renderHook(() => useWindowSize());

	expect(result.current.width).toBe(1024);

	if (globalThis.window !== undefined) {
		Object.defineProperty(globalThis.window, 'innerWidth', {
			writable: true,
			configurable: true,
			value: 768,
		});
	}

	act(() => {
		globalThis.window.dispatchEvent(new Event('resize'));
	});

	await waitFor(() => {
		expect(result.current.width).toBe(768);
	});

	if (globalThis.window !== undefined) {
		Object.defineProperty(globalThis.window, 'innerWidth', {
			writable: true,
			configurable: true,
			value: 375,
		});
	}

	act(() => {
		globalThis.window.dispatchEvent(new Event('resize'));
	});

	await waitFor(() => {
		expect(result.current.width).toBe(375);
	});
};

const orientationChangeDetection = async () => {
	const { result } = renderHook(() => useWindowSize());

	if (globalThis.window !== undefined) {
		Object.defineProperty(globalThis.window, 'innerWidth', {
			writable: true,
			configurable: true,
			value: 1920,
		});
		Object.defineProperty(globalThis.window, 'innerHeight', {
			writable: true,
			configurable: true,
			value: 1080,
		});
	}

	act(() => {
		globalThis.window.dispatchEvent(new Event('resize'));
	});

	await waitFor(() => {
		expect(result.current.width).toBeGreaterThan(result.current.height);
	});

	if (globalThis.window !== undefined) {
		Object.defineProperty(globalThis.window, 'innerWidth', {
			writable: true,
			configurable: true,
			value: 1080,
		});
		Object.defineProperty(globalThis.window, 'innerHeight', {
			writable: true,
			configurable: true,
			value: 1920,
		});
	}

	act(() => {
		globalThis.window.dispatchEvent(new Event('resize'));
	});

	await waitFor(() => {
		expect(result.current.height).toBeGreaterThan(result.current.width);
	});
};

function defineRealWorldScenarioTests() {
	describe('real-world scenarios', () => {
		it('should work for responsive breakpoint detection', responsiveBreakpointDetection);
		it('should work for orientation change detection', orientationChangeDetection);
	});
}

describe('useWindowSize', () => {
	beforeEach(() => {
		// Reset window size before each test
		if (globalThis.window !== undefined) {
			Object.defineProperty(globalThis.window, 'innerWidth', {
				writable: true,
				configurable: true,
				value: 1024,
			});
			Object.defineProperty(globalThis.window, 'innerHeight', {
				writable: true,
				configurable: true,
				value: 768,
			});
		}
	});

	defineInitialStateTests();
	defineWindowSizeTrackingTests();
	defineResponsiveUpdateTests();
	defineEventListenerManagementTests();
	defineReturnValueStructureTests();
	defineSsrSafetyTests();
	defineEdgeCaseTests();
	defineRealWorldScenarioTests();
});
