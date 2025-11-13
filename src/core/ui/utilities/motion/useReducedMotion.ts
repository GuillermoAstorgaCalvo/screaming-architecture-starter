/**
 * useReducedMotion - Shared hook for reduced motion preference
 *
 * Wraps Framer Motion's useReducedMotion with SSR-friendly defaults and the
 * ability to provide a default/fallback value when the preference is unknown.
 */

import { useReducedMotion as useFramerReducedMotion } from 'framer-motion';

/**
 * Options for useReducedMotion hook
 */
export interface UseReducedMotionOptions {
	/**
	 * Default value while preference is unknown (SSR / no matchMedia support)
	 * @default false
	 */
	defaultValue?: boolean;
}

/**
 * Determine whether the user prefers reduced motion.
 *
 * Falls back to `defaultValue` when running in environments where the media
 * query is unavailable (SSR) or prior to hydration.
 */
export function useReducedMotion(options: UseReducedMotionOptions = {}): boolean {
	const { defaultValue = false } = options;
	const mediaQueryValue = useFramerReducedMotion();
	return typeof mediaQueryValue === 'boolean' ? mediaQueryValue : defaultValue;
}
