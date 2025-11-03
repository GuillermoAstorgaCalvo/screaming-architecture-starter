import { useCallback, useEffect, useState } from 'react';

/**
 * Type guard to check if window is available (SSR-safe)
 */
function isWindowAvailable(): boolean {
	return 'window' in globalThis;
}

/**
 * Options for useMediaQuery hook
 */
export interface UseMediaQueryOptions {
	/**
	 * Whether to use matchMedia().matches on initial render instead of false
	 * @default false
	 */
	defaultMatches?: boolean;
}

/**
 * Hook to track media query matches
 *
 * Monitors a CSS media query and returns whether it currently matches.
 * SSR-safe with configurable initial state.
 *
 * @example
 * ```tsx
 * const isMobile = useMediaQuery('(max-width: 768px)');
 *
 * return isMobile ? <MobileView /> : <DesktopView />;
 * ```
 *
 * @example
 * ```tsx
 * const prefersDark = useMediaQuery('(prefers-color-scheme: dark)', {
 *   defaultMatches: true
 * });
 * ```
 *
 * @param query - The media query string to match
 * @param options - Configuration options
 * @returns Whether the media query currently matches
 */
export function useMediaQuery(query: string, options: UseMediaQueryOptions = {}): boolean {
	const { defaultMatches = false } = options;

	const [matches, setMatches] = useState<boolean>(() => {
		// SSR-safe: return defaultMatches if window is not available
		if (!isWindowAvailable()) {
			return defaultMatches;
		}

		try {
			return globalThis.window.matchMedia(query).matches;
		} catch {
			return defaultMatches;
		}
	});

	const handleChange = useCallback((event: MediaQueryListEvent) => {
		setMatches(event.matches);
	}, []);

	useEffect(() => {
		// SSR guard
		if (!isWindowAvailable()) {
			return;
		}

		try {
			const mediaQuery = globalThis.window.matchMedia(query);
			mediaQuery.addEventListener('change', handleChange);
			const rafId = requestAnimationFrame(() => {
				const currentMatches = mediaQuery.matches;
				setMatches(prev => (prev === currentMatches ? prev : currentMatches));
			});

			return () => {
				cancelAnimationFrame(rafId);
				mediaQuery.removeEventListener('change', handleChange);
			};
		} catch {
			return undefined;
		}
	}, [query, handleChange]);

	return matches;
}
