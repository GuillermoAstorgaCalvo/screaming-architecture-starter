import { useThrottledCallback } from '@core/hooks/useThrottle';
import { useEffect, useState } from 'react';

/**
 * Type guard to check if window is available (SSR-safe)
 */
function isWindowAvailable(): boolean {
	return 'window' in globalThis;
}

/**
 * Gets current scroll position from window
 */
function getScrollPosition(): number {
	if (!isWindowAvailable()) {
		return 0;
	}
	return globalThis.window.scrollY || globalThis.document.documentElement.scrollTop || 0;
}

/**
 * Hook to track window scroll position
 *
 * Provides the current scroll position that updates on scroll events.
 * SSR-safe with initial fallback value.
 * Throttled by default to improve performance.
 *
 * @example
 * ```tsx
 * const scrollY = useScrollPosition();
 *
 * return (
 *   <div>
 *     Scrolled {scrollY}px from top
 *   </div>
 * );
 * ```
 *
 * @example
 * ```tsx
 * const scrollY = useScrollPosition(100); // Throttle to 100ms
 * const isScrolled = scrollY > 300;
 *
 * return isScrolled ? <ScrollToTop /> : null;
 * ```
 *
 * @param throttleDelay - Throttle delay in milliseconds (default: 100)
 * @param initialValue - Initial scroll value (default: 0, for SSR)
 * @returns Current scroll position in pixels
 */
export function useScrollPosition(throttleDelay = 100, initialValue = 0): number {
	const [scrollPosition, setScrollPosition] = useState<number>(() => {
		if (!isWindowAvailable()) {
			return initialValue;
		}
		return getScrollPosition();
	});

	const updateScrollPosition = useThrottledCallback(() => {
		setScrollPosition(getScrollPosition());
	}, throttleDelay);

	useEffect(() => {
		if (!isWindowAvailable()) {
			return;
		}

		globalThis.window.addEventListener('scroll', updateScrollPosition, { passive: true });

		return () => {
			globalThis.window.removeEventListener('scroll', updateScrollPosition);
			updateScrollPosition.cancel();
		};
	}, [updateScrollPosition]);

	return scrollPosition;
}
