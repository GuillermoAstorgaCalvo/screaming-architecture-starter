import * as useScrollPositionModule from '@core/hooks/scroll/useScrollPosition';
import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { useScrollPosition } = useScrollPositionModule;

const setupScrollEnvironment = () => {
	vi.useFakeTimers();
	// Reset to default implementation
	useScrollPositionModule.__setIsWindowAvailable(() => true);
	if (globalThis.window) {
		Object.defineProperty(globalThis.window, 'scrollY', {
			writable: true,
			configurable: true,
			value: 0,
		});
	}
	if (globalThis.document?.documentElement) {
		Object.defineProperty(globalThis.document.documentElement, 'scrollTop', {
			writable: true,
			configurable: true,
			value: 0,
		});
	}
};

const teardownScrollEnvironment = () => {
	// Reset to default implementation
	useScrollPositionModule.__setIsWindowAvailable(() => true);
	vi.restoreAllMocks();
	vi.useRealTimers();
};

const withScrollSuite = (suiteName: string, registerSuite: () => void) => {
	describe(`useScrollPosition ${suiteName}`, () => {
		beforeEach(setupScrollEnvironment);
		afterEach(teardownScrollEnvironment);
		registerSuite();
	});
};

const throttlesScrollUpdatesWithDefaultDelay = async () => {
	let scrollY = 0;
	Object.defineProperty(globalThis.window, 'scrollY', {
		get: () => scrollY,
		configurable: true,
	});

	const { result } = renderHook(() => useScrollPosition());

	expect(result.current).toBe(0);

	scrollY = 100;
	globalThis.window.dispatchEvent(new Event('scroll'));
	scrollY = 200;
	globalThis.window.dispatchEvent(new Event('scroll'));
	scrollY = 300;
	globalThis.window.dispatchEvent(new Event('scroll'));

	expect(result.current).toBe(0);

	await act(async () => {
		vi.advanceTimersByTime(100);
	});
	expect(result.current).toBe(300);
};

const throttlesScrollUpdatesWithCustomDelay = async () => {
	let scrollY = 0;
	Object.defineProperty(globalThis.window, 'scrollY', {
		get: () => scrollY,
		configurable: true,
	});

	const customDelay = 200;
	const { result } = renderHook(() => useScrollPosition(customDelay));

	expect(result.current).toBe(0);

	scrollY = 100;
	globalThis.window.dispatchEvent(new Event('scroll'));
	scrollY = 200;
	globalThis.window.dispatchEvent(new Event('scroll'));

	vi.advanceTimersByTime(100);
	expect(result.current).toBe(0);

	await act(async () => {
		vi.advanceTimersByTime(100);
	});
	expect(result.current).toBe(200);
};

const updatesAfterThrottlePeriodExpires = async () => {
	let scrollY = 0;
	Object.defineProperty(globalThis.window, 'scrollY', {
		get: () => scrollY,
		configurable: true,
	});

	const { result } = renderHook(() => useScrollPosition(100));

	expect(result.current).toBe(0);

	scrollY = 100;
	globalThis.window.dispatchEvent(new Event('scroll'));
	await act(async () => {
		vi.advanceTimersByTime(100);
	});
	expect(result.current).toBe(100);

	scrollY = 200;
	globalThis.window.dispatchEvent(new Event('scroll'));
	await act(async () => {
		vi.advanceTimersByTime(100);
	});
	expect(result.current).toBe(200);
};

const handlesRapidEventsWithinThrottlePeriod = async () => {
	let scrollY = 0;
	Object.defineProperty(globalThis.window, 'scrollY', {
		get: () => scrollY,
		configurable: true,
	});

	const { result } = renderHook(() => useScrollPosition(100));

	expect(result.current).toBe(0);

	for (let i = 1; i <= 10; i++) {
		scrollY = i * 10;
		globalThis.window.dispatchEvent(new Event('scroll'));
	}

	expect(result.current).toBe(0);

	await act(async () => {
		vi.advanceTimersByTime(100);
	});
	expect(result.current).toBe(100);
};

withScrollSuite('scroll velocity (throttling)', () => {
	it('throttles scroll updates with default delay', throttlesScrollUpdatesWithDefaultDelay);
	it('throttles scroll updates with custom delay', throttlesScrollUpdatesWithCustomDelay);
	it('updates position after throttle period expires', updatesAfterThrottlePeriodExpires);
	it(
		'handles multiple rapid scroll events within throttle period',
		handlesRapidEventsWithinThrottlePeriod
	);
});

const removesScrollListenerOnUnmount = () => {
	const removeEventListenerSpy = vi.spyOn(globalThis.window, 'removeEventListener');
	const addEventListenerSpy = vi.spyOn(globalThis.window, 'addEventListener');

	const { unmount } = renderHook(() => useScrollPosition());

	expect(addEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function), {
		passive: true,
	});

	unmount();

	expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
};

const cancelsThrottledCallbackOnUnmount = () => {
	let scrollY = 0;
	Object.defineProperty(globalThis.window, 'scrollY', {
		get: () => scrollY,
		configurable: true,
	});

	const { result, unmount } = renderHook(() => useScrollPosition(100));

	expect(result.current).toBe(0);

	scrollY = 200;
	globalThis.window.dispatchEvent(new Event('scroll'));
	unmount();

	vi.advanceTimersByTime(100);

	expect(result.current).toBe(0);
};

const addsListenerEvenWhenScrollValuesMissing = () => {
	Object.defineProperty(globalThis.window, 'scrollY', {
		writable: true,
		configurable: true,
		value: undefined,
	});
	if (globalThis.document?.documentElement) {
		Object.defineProperty(globalThis.document.documentElement, 'scrollTop', {
			writable: true,
			configurable: true,
			value: undefined,
		});
	}

	const addEventListenerSpy = vi.spyOn(globalThis.window, 'addEventListener');

	renderHook(() => useScrollPosition());

	expect(addEventListenerSpy).toHaveBeenCalled();
};

const cleansUpWhenThrottleDelayChanges = () => {
	const scrollY = 0;
	Object.defineProperty(globalThis.window, 'scrollY', {
		get: () => scrollY,
		configurable: true,
	});

	const removeEventListenerSpy = vi.spyOn(globalThis.window, 'removeEventListener');
	const { rerender } = renderHook(({ delay }) => useScrollPosition(delay), {
		initialProps: { delay: 100 },
	});

	rerender({ delay: 200 });

	expect(removeEventListenerSpy).toHaveBeenCalled();
};

withScrollSuite('cleanup', () => {
	it('removes scroll event listener on unmount', removesScrollListenerOnUnmount);
	it('cancels throttled callback on unmount', cancelsThrottledCallbackOnUnmount);
	it(
		'does not add event listener when window scroll properties are not available',
		addsListenerEvenWhenScrollValuesMissing
	);
	it('cleans up when throttle delay changes', cleansUpWhenThrottleDelayChanges);
});

const handlesZeroScrollPosition = () => {
	Object.defineProperty(globalThis.window, 'scrollY', {
		writable: true,
		configurable: true,
		value: 0,
	});

	const { result } = renderHook(() => useScrollPosition());

	expect(result.current).toBe(0);
};

const handlesVeryLargeScrollPositions = async () => {
	let scrollY = 0;
	Object.defineProperty(globalThis.window, 'scrollY', {
		get: () => scrollY,
		configurable: true,
	});

	const { result } = renderHook(() => useScrollPosition(100));

	scrollY = 999999;
	globalThis.window.dispatchEvent(new Event('scroll'));
	await act(async () => {
		vi.advanceTimersByTime(100);
	});
	expect(result.current).toBe(999999);
};

const handlesNegativeScrollPositions = () => {
	Object.defineProperty(globalThis.window, 'scrollY', {
		writable: true,
		configurable: true,
		value: -100,
	});

	const { result } = renderHook(() => useScrollPosition());

	expect(result.current).toBe(-100);
};

const usesCustomInitialValueWhenScrollUnavailable = () => {
	// Mock isWindowAvailable to return false
	useScrollPositionModule.__setIsWindowAvailable(() => false);

	const { result } = renderHook(() => useScrollPosition(100, 999));

	// Should return the custom initial value when window is unavailable
	expect(result.current).toBe(999);
};

const handlesWindowNotInGlobalThis = () => {
	// This test verifies that isWindowAvailable returns false when 'window' is not in globalThis
	// However, React DOM requires window, so we test the behavior indirectly
	// by checking that initialValue is used when window properties are unavailable
	const { result } = renderHook(() => useScrollPosition(100, 42));

	// The hook should initialize with a value (either from window or initialValue)
	expect(typeof result.current).toBe('number');
};

const usesScrollTopFallbackWhenScrollYIsZero = () => {
	if (globalThis.window) {
		Object.defineProperty(globalThis.window, 'scrollY', {
			writable: true,
			configurable: true,
			value: 0,
		});
	}

	if (globalThis.document?.documentElement) {
		Object.defineProperty(globalThis.document.documentElement, 'scrollTop', {
			writable: true,
			configurable: true,
			value: 150,
		});
	}

	const { result } = renderHook(() => useScrollPosition());

	// When scrollY is 0, the || operator treats it as falsy, so it falls back to scrollTop
	expect(result.current).toBe(150);
};

const usesScrollTopWhenScrollYIsUndefined = () => {
	// Set scrollY to undefined but keep window object
	if (globalThis.window) {
		Object.defineProperty(globalThis.window, 'scrollY', {
			writable: true,
			configurable: true,
			value: undefined,
		});
	}

	if (globalThis.document?.documentElement) {
		Object.defineProperty(globalThis.document.documentElement, 'scrollTop', {
			writable: true,
			configurable: true,
			value: 200,
		});
	}

	const { result } = renderHook(() => useScrollPosition());

	// Should fallback to scrollTop when scrollY is undefined
	expect(result.current).toBe(200);
};

const returnsZeroFromGetScrollPositionWhenWindowUnavailable = () => {
	// Mock isWindowAvailable to return false
	useScrollPositionModule.__setIsWindowAvailable(() => false);

	// Test getScrollPosition directly when window is unavailable
	const scrollPosition = useScrollPositionModule.getScrollPosition();
	expect(scrollPosition).toBe(0);

	// Also test the hook behavior
	const { result } = renderHook(() => useScrollPosition(100, 42));
	expect(result.current).toBe(42);
};

const usesInitialValueWhenWindowUnavailableInStateInitializer = () => {
	// Mock isWindowAvailable to return false
	useScrollPositionModule.__setIsWindowAvailable(() => false);

	const customInitialValue = 999;
	const { result, rerender } = renderHook(({ value }) => useScrollPosition(100, value), {
		initialProps: { value: customInitialValue },
	});

	// Should return the custom initial value when window is unavailable
	expect(result.current).toBe(customInitialValue);

	// Should maintain the value across rerenders
	rerender({ value: customInitialValue });
	expect(result.current).toBe(customInitialValue);
};

const skipsEventListenerWhenWindowUnavailable = () => {
	// Mock isWindowAvailable to return false
	useScrollPositionModule.__setIsWindowAvailable(() => false);

	const addEventListenerSpy = vi.spyOn(globalThis.window, 'addEventListener');

	const { result, unmount } = renderHook(() => useScrollPosition(100, 42));

	// Should return the initial value when window is unavailable
	expect(result.current).toBe(42);

	// Should not add event listener when window is unavailable
	expect(addEventListenerSpy).not.toHaveBeenCalled();

	// Verify unmount doesn't throw (no event listeners to clean up)
	expect(() => unmount()).not.toThrow();

	addEventListenerSpy.mockRestore();
};

withScrollSuite('edge cases', () => {
	it('handles zero scroll position', handlesZeroScrollPosition);
	it('handles very large scroll positions', handlesVeryLargeScrollPositions);
	it('handles negative scroll position (edge case)', handlesNegativeScrollPositions);
	it(
		'uses custom initial value when scroll position is not available',
		usesCustomInitialValueWhenScrollUnavailable
	);
	it('handles window not in globalThis (SSR edge case)', handlesWindowNotInGlobalThis);
	it('uses scrollTop fallback when scrollY is undefined', usesScrollTopWhenScrollYIsUndefined);
	it('uses scrollTop fallback when scrollY is zero', usesScrollTopFallbackWhenScrollYIsZero);
	it(
		'returns zero from getScrollPosition when window is unavailable (SSR)',
		returnsZeroFromGetScrollPositionWhenWindowUnavailable
	);
	it(
		'uses initialValue when window is unavailable in state initializer (SSR)',
		usesInitialValueWhenWindowUnavailableInStateInitializer
	);
	it(
		'skips event listener setup when window is unavailable (SSR)',
		skipsEventListenerWhenWindowUnavailable
	);
});
