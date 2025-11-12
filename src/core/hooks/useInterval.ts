import { useEffect, useRef } from 'react';

/**
 * Options for useInterval hook
 */
export interface UseIntervalOptions {
	/**
	 * Whether the interval is currently active
	 * @default true
	 */
	active?: boolean;
	/**
	 * Whether to execute the callback immediately on mount (before first interval)
	 * @default false
	 */
	immediate?: boolean;
}

/**
 * Hook to run a callback at specified intervals
 *
 * Provides a declarative way to set up intervals that automatically
 * clean up on unmount or when dependencies change.
 *
 * @example
 * ```tsx
 * // Basic usage - run every second
 * useInterval(() => {
 *   console.log('Tick');
 * }, 1000);
 * ```
 *
 * @example
 * ```tsx
 * // With pause/resume control
 * const [isActive, setIsActive] = useState(true);
 *
 * useInterval(() => {
 *   updateCounter();
 * }, 1000, { active: isActive });
 *
 * <button onClick={() => setIsActive(!isActive)}>
 *   {isActive ? 'Pause' : 'Resume'}
 * </button>
 * ```
 *
 * @example
 * ```tsx
 * // Execute immediately, then every 5 seconds
 * useInterval(() => {
 *   fetchData();
 * }, 5000, { immediate: true });
 * ```
 *
 * @param callback - The function to execute at each interval
 * @param delay - The delay in milliseconds between executions (null to pause)
 * @param options - Configuration options
 */
export function useInterval(
	callback: () => void,
	delay: number | null,
	options: UseIntervalOptions = {}
): void {
	const { active = true, immediate = false } = options;
	const callbackRef = useRef(callback);

	// Keep callback ref up to date
	useEffect(() => {
		callbackRef.current = callback;
	}, [callback]);

	useEffect(() => {
		// Don't set up interval if delay is null or inactive
		if (delay === null || !active) {
			return;
		}

		// Execute immediately if requested
		if (immediate) {
			callbackRef.current();
		}

		// Set up interval
		const intervalId = setInterval(() => {
			callbackRef.current();
		}, delay);

		// Cleanup on unmount or when delay/active changes
		return () => {
			clearInterval(intervalId);
		};
	}, [delay, active, immediate]);
}
