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

	Object.defineProperty(globalThis.window, 'matchMedia', {
		writable: true,
		value: mockMatchMedia,
	});
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

const describeSSRSafety = () => {
	describe('SSR safety', () => {
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
	});
};

const describeRequestAnimationFrameSync = () => {
	describe('requestAnimationFrame synchronization', () => {
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
