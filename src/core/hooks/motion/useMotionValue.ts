/**
 * useMotionValue - Hook for creating motion values
 *
 * Wraps framer-motion's useMotionValue with additional utilities.
 * Motion values are reactive values that can be used to drive animations
 * and can be transformed, animated, and synchronized.
 *
 * @example
 * ```tsx
 * const x = useMotionValue(0);
 * const y = useMotionValue(0);
 *
 * return (
 *   <motion.div
 *     style={{ x, y }}
 *     drag
 *   />
 * );
 * ```
 *
 * @example
 * ```tsx
 * const scale = useMotionValue(1);
 *
 * return (
 *   <motion.div
 *     style={{ scale }}
 *     whileHover={{ scale: 1.2 }}
 *   />
 * );
 * ```
 */

import { type MotionValue, useMotionValue as useFramerMotionValue } from 'framer-motion';
import { useMemo } from 'react';

/**
 * Creates a motion value that can be used to drive animations
 *
 * @param initial - Initial value for the motion value
 * @returns A motion value instance
 */
export function useMotionValue<T = number>(initial: T | (() => T)): MotionValue<T> {
	const resolvedInitial = useMemo(() => {
		return typeof initial === 'function' ? (initial as () => T)() : initial;
	}, [initial]);

	return useFramerMotionValue(resolvedInitial);
}
