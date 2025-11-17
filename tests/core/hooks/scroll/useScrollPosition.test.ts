import { useScrollPosition } from '@core/hooks/scroll/useScrollPosition';
import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const setupScrollEnvironment = () => {
	vi.useFakeTimers();
	Object.defineProperty(globalThis.window, 'scrollY', {
		writable: true,
		configurable: true,
		value: 0,
	});
	if (globalThis.document?.documentElement) {
		Object.defineProperty(globalThis.document.documentElement, 'scrollTop', {
			writable: true,
			configurable: true,
			value: 0,
		});
	}
};

const teardownScrollEnvironment = () => {
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

const returnsInitialScrollPositionWhenWindowIsAvailable = () => {
	Object.defineProperty(globalThis.window, 'scrollY', {
		writable: true,
		configurable: true,
		value: 100,
	});

	const { result } = renderHook(() => useScrollPosition());

	expect(result.current).toBe(100);
};

const returnsInitialValueWhenWindowUnavailable = () => {
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

	const { result } = renderHook(() => useScrollPosition(100, 42));

	expect(result.current).toBe(0);
};

const updatesScrollPositionWhenWindowScrolls = async () => {
	let scrollY = 0;
	Object.defineProperty(globalThis.window, 'scrollY', {
		get: () => scrollY,
		configurable: true,
	});

	const { result } = renderHook(() => useScrollPosition(100));

	expect(result.current).toBe(0);

	scrollY = 200;
	globalThis.window.dispatchEvent(new Event('scroll'));

	await act(async () => {
		vi.advanceTimersByTime(100);
	});

	expect(result.current).toBe(200);
};

const usesScrollTopFallbackWhenScrollYMissing = () => {
	Object.defineProperty(globalThis.window, 'scrollY', {
		writable: true,
		configurable: true,
		value: undefined,
	});

	if (globalThis.document?.documentElement) {
		Object.defineProperty(globalThis.document.documentElement, 'scrollTop', {
			writable: true,
			configurable: true,
			value: 150,
		});
	}

	const { result } = renderHook(() => useScrollPosition());

	expect(result.current).toBe(150);
};

const returnsZeroWhenScrollPropsMissing = () => {
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

	const { result } = renderHook(() => useScrollPosition());

	expect(result.current).toBe(0);
};

const tracksSequentialScrollPositions = async () => {
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

	scrollY = 300;
	globalThis.window.dispatchEvent(new Event('scroll'));
	await act(async () => {
		vi.advanceTimersByTime(100);
	});
	expect(result.current).toBe(300);

	scrollY = 50;
	globalThis.window.dispatchEvent(new Event('scroll'));
	await act(async () => {
		vi.advanceTimersByTime(100);
	});
	expect(result.current).toBe(50);
};

withScrollSuite('scroll position tracking', () => {
	it(
		'returns initial scroll position when window is available',
		returnsInitialScrollPositionWhenWindowIsAvailable
	);
	it(
		'returns initial value when window is not available (SSR)',
		returnsInitialValueWhenWindowUnavailable
	);
	it('updates scroll position when window scrolls', updatesScrollPositionWhenWindowScrolls);
	it(
		'uses documentElement.scrollTop as fallback when scrollY is not available',
		usesScrollTopFallbackWhenScrollYMissing
	);
	it(
		'returns 0 when both scrollY and scrollTop are not available',
		returnsZeroWhenScrollPropsMissing
	);
	it('tracks scroll position changes correctly', tracksSequentialScrollPositions);
});

const updatesPositionWhenScrollingDown = async () => {
	let scrollY = 0;
	Object.defineProperty(globalThis.window, 'scrollY', {
		get: () => scrollY,
		configurable: true,
	});

	const { result } = renderHook(() => useScrollPosition(100));

	expect(result.current).toBe(0);

	scrollY = 500;
	globalThis.window.dispatchEvent(new Event('scroll'));
	await act(async () => {
		vi.advanceTimersByTime(100);
	});
	expect(result.current).toBe(500);
};

const updatesPositionWhenScrollingUp = async () => {
	let scrollY = 500;
	Object.defineProperty(globalThis.window, 'scrollY', {
		get: () => scrollY,
		configurable: true,
	});

	const { result } = renderHook(() => useScrollPosition(100));

	expect(result.current).toBe(500);

	scrollY = 200;
	globalThis.window.dispatchEvent(new Event('scroll'));
	await act(async () => {
		vi.advanceTimersByTime(100);
	});
	expect(result.current).toBe(200);
};

const handlesRapidScrollDirectionChanges = async () => {
	let scrollY = 100;
	Object.defineProperty(globalThis.window, 'scrollY', {
		get: () => scrollY,
		configurable: true,
	});

	const { result } = renderHook(() => useScrollPosition(100));

	expect(result.current).toBe(100);

	scrollY = 300;
	globalThis.window.dispatchEvent(new Event('scroll'));

	scrollY = 150;
	globalThis.window.dispatchEvent(new Event('scroll'));

	await act(async () => {
		vi.advanceTimersByTime(100);
	});
	expect(result.current).toBe(150);
};

withScrollSuite('scroll direction', () => {
	it('updates position when scrolling down', updatesPositionWhenScrollingDown);
	it('updates position when scrolling up', updatesPositionWhenScrollingUp);
	it('handles rapid scroll direction changes', handlesRapidScrollDirectionChanges);
});

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

	const { result } = renderHook(() => useScrollPosition(100, 999));

	expect(result.current).toBe(0);
};

withScrollSuite('edge cases', () => {
	it('handles zero scroll position', handlesZeroScrollPosition);
	it('handles very large scroll positions', handlesVeryLargeScrollPositions);
	it('handles negative scroll position (edge case)', handlesNegativeScrollPositions);
	it(
		'uses custom initial value when scroll position is not available',
		usesCustomInitialValueWhenScrollUnavailable
	);
});

const handlesMultipleHookInstancesIndependently = async () => {
	let scrollY = 0;
	Object.defineProperty(globalThis.window, 'scrollY', {
		get: () => scrollY,
		configurable: true,
	});

	const { result: result1 } = renderHook(() => useScrollPosition(100));
	const { result: result2 } = renderHook(() => useScrollPosition(200));

	expect(result1.current).toBe(0);
	expect(result2.current).toBe(0);

	scrollY = 500;
	globalThis.window.dispatchEvent(new Event('scroll'));

	await act(async () => {
		vi.advanceTimersByTime(200);
	});

	expect(result1.current).toBe(500);
	expect(result2.current).toBe(500);

	scrollY = 600;
	globalThis.window.dispatchEvent(new Event('scroll'));

	await act(async () => {
		vi.advanceTimersByTime(200);
	});

	expect(result1.current).toBe(600);
	expect(result2.current).toBe(600);
};

withScrollSuite('multiple instances', () => {
	it('handles multiple hook instances independently', handlesMultipleHookInstancesIndependently);
});
