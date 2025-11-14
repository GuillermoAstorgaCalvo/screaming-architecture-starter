import { useCallback, useEffect, useState } from 'react';

/**
 * Type guard to check if window is available (SSR-safe)
 */
function isWindowAvailable(): boolean {
	return 'window' in globalThis;
}

/**
 * Window size dimensions
 */
export interface WindowSize {
	/**
	 * Window width in pixels
	 */
	width: number;
	/**
	 * Window height in pixels
	 */
	height: number;
}

/**
 * Hook to track window size
 *
 * Provides responsive window dimensions that update on window resize.
 * SSR-safe with initial fallback values.
 *
 * @example
 * ```tsx
 * const { width, height } = useWindowSize();
 *
 * return (
 *   <div>
 *     Window is {width}x{height}px
 *   </div>
 * );
 * ```
 *
 * @example
 * ```tsx
 * import { breakpoints } from '@core/constants/breakpoints';
 * const { width } = useWindowSize();
 * const isMobile = width < breakpoints.md;
 * ```
 *
 * @param initialWidth - Initial width value (default: 0, for SSR)
 * @param initialHeight - Initial height value (default: 0, for SSR)
 * @returns Window dimensions with width and height
 */
export function useWindowSize(initialWidth = 0, initialHeight = 0): WindowSize {
	const [windowSize, setWindowSize] = useState<WindowSize>(() => {
		// SSR-safe: return initial values if window is not available
		if (!isWindowAvailable()) {
			return { width: initialWidth, height: initialHeight };
		}
		return {
			width: globalThis.window.innerWidth,
			height: globalThis.window.innerHeight,
		};
	});

	const handleResize = useCallback(() => {
		if (!isWindowAvailable()) {
			return;
		}
		setWindowSize({
			width: globalThis.window.innerWidth,
			height: globalThis.window.innerHeight,
		});
	}, []);

	useEffect(() => {
		// SSR guard
		if (!isWindowAvailable()) {
			return;
		}

		globalThis.window.addEventListener('resize', handleResize);

		return () => {
			globalThis.window.removeEventListener('resize', handleResize);
		};
	}, [handleResize]);

	return windowSize;
}
