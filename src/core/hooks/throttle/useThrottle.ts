import { throttle, type ThrottledFunction } from '@core/utils/throttle/throttle';
import { useEffect, useMemo, useRef, useState } from 'react';

/**
 * Hook to throttle a value
 *
 * Returns a throttled version of the value that updates at most once
 * per specified delay period, regardless of how many times it changes.
 *
 * @example
 * ```tsx
 * const [scrollPosition, setScrollPosition] = useState(0);
 * const throttledPosition = useThrottle(scrollPosition, 100);
 *
 * useEffect(() => {
 *   updateUI(throttledPosition);
 * }, [throttledPosition]);
 * ```
 *
 * @param value - The value to throttle
 * @param delay - The delay in milliseconds between updates
 * @returns The throttled value
 */
export function useThrottle<T>(value: T, delay: number): T {
	const [throttledValue, setThrottledValue] = useState<T>(value);
	const throttledRef = useRef<ThrottledFunction<(newValue: unknown) => void> | null>(null);
	const previousValueRef = useRef<T>(value);
	const isInitialMountRef = useRef<boolean>(true);

	// Create throttled function only when delay changes
	useEffect(() => {
		// Cancel previous throttled function if it exists
		if (throttledRef.current) {
			throttledRef.current.cancel();
		}

		// Create new throttled function with leading edge enabled (default)
		// Leading edge ensures first call executes immediately
		const throttled = throttle((newValue: unknown) => {
			setThrottledValue(newValue as T);
		}, delay);

		throttledRef.current = throttled;
		isInitialMountRef.current = true;

		return () => {
			throttled.cancel();
			throttledRef.current = null;
		};
	}, [delay]);

	// Call throttled function when value changes
	useEffect(() => {
		if (!throttledRef.current || value === previousValueRef.current) {
			return;
		}

		// Mark that we've processed the first value change
		if (isInitialMountRef.current) {
			isInitialMountRef.current = false;
		}

		// Throttle's leading edge (enabled by default) will execute immediately
		// on first call since lastCallTime is undefined, triggering setState via callback
		throttledRef.current(value);
		previousValueRef.current = value;
	}, [value]);

	return throttledValue;
}

/**
 * Hook to throttle a callback function
 *
 * Returns a memoized throttled version of the callback that
 * will only execute at most once per delay period.
 *
 * @example
 * ```tsx
 * const throttledScroll = useThrottledCallback((event: Event) => {
 *   handleScroll(event);
 * }, 100);
 *
 * // Call multiple times, but only executes once every 100ms
 * window.addEventListener('scroll', throttledScroll);
 * ```
 *
 * @template T - The function type
 * @param callback - The function to throttle
 * @param delay - The delay in milliseconds
 * @returns A throttled version of the callback with cancel and flush methods
 */
export function useThrottledCallback<T extends (...args: unknown[]) => unknown>(
	callback: T,
	delay: number
): ThrottledFunction<T> {
	return useMemo(() => throttle(callback, delay), [callback, delay]);
}
