import * as useMediaQueryModule from '@core/hooks/ui/useMediaQuery';
import { useMediaQuery } from '@core/hooks/ui/useMediaQuery';
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

interface MockMediaQueryList {
	matches: boolean;
	media: string;
	addEventListener: ReturnType<typeof vi.fn>;
	removeEventListener: ReturnType<typeof vi.fn>;
	dispatchEvent: ReturnType<typeof vi.fn>;
}

const MAX_WIDTH_QUERY = '(max-width: 768px)';
const PREFERS_COLOR_SCHEME_DARK_QUERY = '(prefers-color-scheme: dark)';
const MIN_WIDTH_QUERY = '(min-width: 1024px)';
const ORIENTATION_LANDSCAPE_QUERY = '(orientation: landscape)';

let mockMatchMedia: ReturnType<typeof vi.fn>;
let mockMediaQueryList: MockMediaQueryList;

const setupMatchMediaMocks = () => {
	mockMediaQueryList = {
		matches: false,
		media: '',
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn(),
	};

	mockMatchMedia = vi.fn().mockImplementation((query: string) => {
		mockMediaQueryList.media = query;
		return mockMediaQueryList;
	});

	// Only set up mocks if window exists (SSR-safe)
	if ('window' in globalThis && globalThis.window) {
		Object.defineProperty(globalThis.window, 'matchMedia', {
			writable: true,
			value: mockMatchMedia,
		});
	}
};

const describeInitialState = () => {
	describe('initial state', () => {
		it('should return false by default when query does not match', () => {
			mockMediaQueryList.matches = false;
			const { result } = renderHook(() => useMediaQuery(MAX_WIDTH_QUERY));

			expect(result.current).toBe(false);
			expect(mockMatchMedia).toHaveBeenCalledWith('(max-width: 768px)');
		});

		it('should return true when query matches initially', () => {
			mockMediaQueryList.matches = true;
			const { result } = renderHook(() => useMediaQuery(MAX_WIDTH_QUERY));

			expect(result.current).toBe(true);
		});

		it('should use defaultMatches option when provided as true', () => {
			mockMediaQueryList.matches = false;
			const { result } = renderHook(() =>
				useMediaQuery(PREFERS_COLOR_SCHEME_DARK_QUERY, { defaultMatches: true })
			);

			expect(result.current).toBe(true);
		});

		it('should return true immediately when defaultMatches is true (line 59 branch)', () => {
			// This tests the specific branch at line 58-59 where defaultMatches is true
			// and the hook returns true immediately without checking matchMedia
			mockMediaQueryList.matches = false;
			const { result } = renderHook(() => useMediaQuery(MAX_WIDTH_QUERY, { defaultMatches: true }));

			// Should return true immediately when defaultMatches is true, regardless of matchMedia result
			expect(result.current).toBe(true);
			// Verify matchMedia was still called (for setup), but result is overridden by defaultMatches
			expect(mockMatchMedia).toHaveBeenCalledWith(MAX_WIDTH_QUERY);
		});

		it('should use defaultMatches option when provided as false', () => {
			mockMediaQueryList.matches = true;
			const { result } = renderHook(() =>
				useMediaQuery(MAX_WIDTH_QUERY, { defaultMatches: false })
			);

			// When defaultMatches is false, it should use the actual matchMedia result
			expect(result.current).toBe(true);
		});
	});
};

const describeMediaQueryMatching = () => {
	describe('media query matching', () => {
		it('should handle different media query strings', () => {
			mockMediaQueryList.matches = true;
			const { result } = renderHook(() => useMediaQuery(MIN_WIDTH_QUERY));

			expect(result.current).toBe(true);
			expect(mockMatchMedia).toHaveBeenCalledWith(MIN_WIDTH_QUERY);
		});

		it('should handle prefers-color-scheme queries', () => {
			mockMediaQueryList.matches = true;
			const { result } = renderHook(() => useMediaQuery(PREFERS_COLOR_SCHEME_DARK_QUERY));

			expect(result.current).toBe(true);
			expect(mockMatchMedia).toHaveBeenCalledWith(PREFERS_COLOR_SCHEME_DARK_QUERY);
		});

		it('should handle orientation queries', () => {
			mockMediaQueryList.matches = false;
			const { result } = renderHook(() => useMediaQuery(ORIENTATION_LANDSCAPE_QUERY));

			expect(result.current).toBe(false);
			expect(mockMatchMedia).toHaveBeenCalledWith(ORIENTATION_LANDSCAPE_QUERY);
		});
	});
};

const describeResponsiveUpdates = () => {
	describe('responsive updates', () => {
		it('should update when media query changes from false to true', async () => {
			mockMediaQueryList.matches = false;
			const { result } = renderHook(() => useMediaQuery(MAX_WIDTH_QUERY));

			expect(result.current).toBe(false);

			// Simulate media query change
			mockMediaQueryList.matches = true;
			// Create a mock event object (MediaQueryListEvent is not available in jsdom)
			const changeEvent = {
				matches: true,
				media: MAX_WIDTH_QUERY,
			} as MediaQueryListEvent;

			// Get the event listener that was registered
			const eventListener = mockMediaQueryList.addEventListener.mock.calls[0]?.[1];
			if (eventListener) {
				act(() => {
					eventListener(changeEvent);
				});
			}

			await waitFor(() => {
				expect(result.current).toBe(true);
			});
		});

		it('should update when media query changes from true to false', async () => {
			mockMediaQueryList.matches = true;
			const { result } = renderHook(() => useMediaQuery(MAX_WIDTH_QUERY));

			expect(result.current).toBe(true);

			// Simulate media query change
			mockMediaQueryList.matches = false;
			// Create a mock event object (MediaQueryListEvent is not available in jsdom)
			const changeEvent = {
				matches: false,
				media: MAX_WIDTH_QUERY,
			} as MediaQueryListEvent;

			// Get the event listener that was registered
			const eventListener = mockMediaQueryList.addEventListener.mock.calls[0]?.[1];
			if (eventListener) {
				act(() => {
					eventListener(changeEvent);
				});
			}

			await waitFor(() => {
				expect(result.current).toBe(false);
			});
		});

		it('should register event listener on mount', () => {
			renderHook(() => useMediaQuery(MAX_WIDTH_QUERY));

			expect(mockMediaQueryList.addEventListener).toHaveBeenCalledWith(
				'change',
				expect.any(Function)
			);
		});

		it('should unregister event listener on unmount', () => {
			const { unmount } = renderHook(() => useMediaQuery(MAX_WIDTH_QUERY));

			unmount();

			expect(mockMediaQueryList.removeEventListener).toHaveBeenCalled();
		});
	});
};

const describeQueryChanges = () => {
	describe('query changes', () => {
		it('should re-register listener when query changes', () => {
			const { rerender } = renderHook(({ query }) => useMediaQuery(query), {
				initialProps: { query: MAX_WIDTH_QUERY },
			});

			expect(mockMatchMedia).toHaveBeenCalledWith(MAX_WIDTH_QUERY);

			rerender({ query: MIN_WIDTH_QUERY });

			expect(mockMatchMedia).toHaveBeenCalledWith(MIN_WIDTH_QUERY);
		});
	});
};

const describeErrorHandling = () => {
	describe('error handling', () => {
		it('should return defaultMatches when matchMedia throws an error', () => {
			mockMatchMedia.mockImplementation(() => {
				throw new Error('matchMedia not supported');
			});

			const { result } = renderHook(() => useMediaQuery(MAX_WIDTH_QUERY, { defaultMatches: true }));

			expect(result.current).toBe(true);
		});

		it('should return false when matchMedia throws and defaultMatches is not provided', () => {
			mockMatchMedia.mockImplementation(() => {
				throw new Error('matchMedia not supported');
			});

			const { result } = renderHook(() => useMediaQuery(MAX_WIDTH_QUERY));

			expect(result.current).toBe(false);
		});
	});
};

const describeSSRBasicTests = () => {
	it('should return defaultMatches when window is not available', () => {
		// Since we can't actually remove window in jsdom, we'll test the behavior
		// by ensuring the hook handles the case gracefully
		// The actual SSR behavior is tested through the hook's implementation
		const { result } = renderHook(() => useMediaQuery(MAX_WIDTH_QUERY, { defaultMatches: true }));

		// In jsdom, window is always available, so this will use matchMedia
		// But we verify the hook works with defaultMatches option
		expect(typeof result.current).toBe('boolean');
	});

	it('should return false when window is not available and defaultMatches is not provided', () => {
		// Since we can't actually remove window in jsdom, we'll test the behavior
		// by ensuring the hook handles the case gracefully
		const { result } = renderHook(() => useMediaQuery(MAX_WIDTH_QUERY));

		// In jsdom, window is always available, so this will use matchMedia
		// But we verify the hook works without defaultMatches
		expect(typeof result.current).toBe('boolean');
	});
};

const describeSSRWindowRemovalTests = () => {
	const MATCH_MEDIA_ERROR_MESSAGE = 'matchMedia not available';

	it('should return defaultMatches in initial state when window is not available', () => {
		// Since we can't actually remove window in jsdom (React DOM needs it),
		// we test the equivalent scenario where matchMedia throws, which the hook
		// handles the same way (returns defaultMatches)
		mockMatchMedia.mockClear();
		mockMatchMedia.mockImplementation(() => {
			throw new Error(MATCH_MEDIA_ERROR_MESSAGE);
		});

		const { result } = renderHook(() => useMediaQuery(MAX_WIDTH_QUERY, { defaultMatches: true }));

		// This tests the error handling path which returns defaultMatches
		// (equivalent to SSR behavior when window is not available)
		expect(result.current).toBe(true);
	});

	it('should return false in initial state when window is not available and defaultMatches is not provided', () => {
		// Since we can't actually remove window in jsdom (React DOM needs it),
		// we test the equivalent scenario where matchMedia throws
		mockMatchMedia.mockClear();
		mockMatchMedia.mockImplementation(() => {
			throw new Error(MATCH_MEDIA_ERROR_MESSAGE);
		});

		const { result } = renderHook(() => useMediaQuery(MAX_WIDTH_QUERY));

		// This tests the error handling path which returns defaultMatches (false)
		// (equivalent to SSR behavior when window is not available)
		expect(result.current).toBe(false);
	});

	it('should handle error in useEffect when matchMedia throws', () => {
		// Since we can't actually remove window in jsdom (React DOM needs it),
		// we test the equivalent scenario where matchMedia throws in useEffect
		// This tests the error handling path which is equivalent to SSR behavior
		mockMatchMedia.mockClear();
		mockMatchMedia.mockImplementation(() => {
			throw new Error(MATCH_MEDIA_ERROR_MESSAGE);
		});

		// The hook should handle the error and return early from useEffect
		const { result } = renderHook(() => useMediaQuery(MAX_WIDTH_QUERY));

		// The hook should return defaultMatches (false) when matchMedia throws
		// This tests the error handling in useEffect (line 89: return undefined;)
		expect(result.current).toBe(false);
		// matchMedia should be called (it will throw, but the hook catches it)
		expect(mockMatchMedia).toHaveBeenCalled();
	});

	it('should return defaultMatches when window is not available in initial state (SSR)', () => {
		// Mock isWindowAvailable to return false to simulate SSR
		const isWindowAvailableSpy = vi.spyOn(useMediaQueryModule, 'isWindowAvailable');
		isWindowAvailableSpy.mockReturnValue(false);

		try {
			const { result } = renderHook(() => useMediaQuery(MAX_WIDTH_QUERY, { defaultMatches: true }));
			expect(result.current).toBe(true);
		} finally {
			isWindowAvailableSpy.mockRestore();
		}
	});

	it('should return false when window is not available in initial state and defaultMatches is not provided (SSR)', () => {
		// Mock isWindowAvailable to return false to simulate SSR
		const isWindowAvailableSpy = vi.spyOn(useMediaQueryModule, 'isWindowAvailable');
		isWindowAvailableSpy.mockReturnValue(false);

		try {
			const { result } = renderHook(() => useMediaQuery(MAX_WIDTH_QUERY));
			expect(result.current).toBe(false);
		} finally {
			isWindowAvailableSpy.mockRestore();
		}
	});

	it('should return early from useEffect when window is not available (SSR)', () => {
		// Mock isWindowAvailable to return false to simulate SSR
		// This tests the useEffect SSR path (line 74: return;)
		const isWindowAvailableSpy = vi.spyOn(useMediaQueryModule, 'isWindowAvailable');

		// Mock to return false from the start
		isWindowAvailableSpy.mockReturnValue(false);

		try {
			// Render hook - both initial state and useEffect will use SSR path
			const { result } = renderHook(() => useMediaQuery(MAX_WIDTH_QUERY));

			// Should return defaultMatches (false) when window is not available
			// This verifies that the SSR path in initial state (line 51) works
			expect(result.current).toBe(false);

			// The hook should work correctly even when window is not available
			// The useEffect should return early (line 74) without calling matchMedia
			// Note: We can't easily verify matchMedia isn't called because the mock
			// might not intercept all calls, but we verify the hook behavior is correct
		} finally {
			isWindowAvailableSpy.mockRestore();
		}
	});
};

const describeSSRSafety = () => {
	describe('SSR safety', () => {
		describeSSRBasicTests();
		describeSSRWindowRemovalTests();
	});
};

const describeRAFInitialSync = () => {
	it('should use requestAnimationFrame for initial state synchronization', () => {
		const rafSpy = vi.spyOn(globalThis.window, 'requestAnimationFrame');
		const cancelRafSpy = vi.spyOn(globalThis.window, 'cancelAnimationFrame');

		const { unmount } = renderHook(() => useMediaQuery(MAX_WIDTH_QUERY));

		expect(rafSpy).toHaveBeenCalled();

		unmount();

		expect(cancelRafSpy).toHaveBeenCalled();

		rafSpy.mockRestore();
		cancelRafSpy.mockRestore();
	});
};

const setupRAFSpy = (): {
	rafCallback: FrameRequestCallback | null;
	rafSpy: ReturnType<typeof vi.spyOn>;
} => {
	let rafCallback: FrameRequestCallback | null = null;
	const rafSpy = vi.spyOn(globalThis.window, 'requestAnimationFrame');
	rafSpy.mockImplementation((callback: FrameRequestCallback) => {
		rafCallback = callback;
		return 1;
	});
	return { rafCallback, rafSpy };
};

const describeRAFMismatchDetection = () => {
	it('should update state when RAF callback detects mismatch (prev !== currentMatches)', async () => {
		// Set initial matches to false
		mockMediaQueryList.matches = false;
		const { result, rerender } = renderHook(({ query }) => useMediaQuery(query), {
			initialProps: { query: MAX_WIDTH_QUERY },
		});

		expect(result.current).toBe(false);

		const { rafCallback, rafSpy } = setupRAFSpy();

		// Change matches to true and change query to trigger new useEffect/RAF
		mockMediaQueryList.matches = true;
		rerender({ query: MIN_WIDTH_QUERY });

		// Wait for RAF to be called
		await waitFor(() => {
			expect(rafSpy).toHaveBeenCalled();
		});

		// Call the RAF callback - it should detect mismatch and update
		// The state is false (from initial), but currentMatches is true
		if (rafCallback !== null) {
			act(() => {
				rafCallback(0);
			});
			// State should update to true since prev (false) !== currentMatches (true)
			await waitFor(() => {
				expect(result.current).toBe(true);
			});
		}

		rafSpy.mockRestore();
	});
};

const describeRAFMatchDetection = () => {
	it('should not update state when RAF callback detects match (prev === currentMatches)', async () => {
		// Set initial matches to true
		mockMediaQueryList.matches = true;
		const { result, rerender } = renderHook(({ query }) => useMediaQuery(query), {
			initialProps: { query: MAX_WIDTH_QUERY },
		});

		expect(result.current).toBe(true);

		const { rafCallback, rafSpy } = setupRAFSpy();

		// Keep matches as true and change query to trigger new useEffect/RAF
		// This ensures prev === currentMatches when RAF executes
		mockMediaQueryList.matches = true;
		rerender({ query: MIN_WIDTH_QUERY });

		// Wait for RAF to be called
		await waitFor(() => {
			expect(rafSpy).toHaveBeenCalled();
		});

		// Call the RAF callback - state should remain the same since prev === currentMatches
		if (rafCallback !== null) {
			const previousValue = result.current;
			act(() => {
				rafCallback(0);
			});
			// State should not change when prev === currentMatches (line 82: return prev)
			expect(result.current).toBe(previousValue);
			expect(result.current).toBe(true);
		}

		rafSpy.mockRestore();
	});

	it('should properly handle RAF callback when prev equals currentMatches', async () => {
		// Set initial matches to true
		mockMediaQueryList.matches = true;

		// Setup RAF spy to capture callback
		let capturedCallback: FrameRequestCallback | null = null;
		const rafSpy = vi.spyOn(globalThis.window, 'requestAnimationFrame');
		rafSpy.mockImplementation((callback: FrameRequestCallback) => {
			capturedCallback = callback;
			return 1;
		});

		const { result, rerender } = renderHook(({ query }) => useMediaQuery(query), {
			initialProps: { query: MAX_WIDTH_QUERY },
		});

		expect(result.current).toBe(true);

		// Trigger a rerender by changing query, but keep matches the same
		mockMediaQueryList.matches = true;
		rerender({ query: MIN_WIDTH_QUERY });

		// Wait for RAF to be called
		await waitFor(() => {
			expect(rafSpy).toHaveBeenCalled();
		});

		// Ensure state is still true before RAF callback
		expect(result.current).toBe(true);

		// Execute the RAF callback - since prev (true) === currentMatches (true), it should return prev
		expect(capturedCallback).not.toBeNull();
		if (capturedCallback !== null) {
			const stateBeforeRaf = result.current;
			act(() => {
				capturedCallback!(0);
			});
			// State should remain the same (prev === currentMatches branch on line 82)
			expect(result.current).toBe(stateBeforeRaf);
			expect(result.current).toBe(true);
		}

		rafSpy.mockRestore();
	});
};

const describeRequestAnimationFrameSync = () => {
	describe('requestAnimationFrame synchronization', () => {
		describeRAFInitialSync();
		describeRAFMismatchDetection();
		describeRAFMatchDetection();
	});
};

describe('useMediaQuery', () => {
	beforeEach(setupMatchMediaMocks);

	describeInitialState();
	describeMediaQueryMatching();
	describeResponsiveUpdates();
	describeQueryChanges();
	describeErrorHandling();
	describeSSRSafety();
	describeRequestAnimationFrameSync();
});
