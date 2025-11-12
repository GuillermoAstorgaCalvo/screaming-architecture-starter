/**
 * useMotionSpring - Hook for creating spring-based motion values
 *
 * Wraps framer-motion's useSpring to create spring-animated motion values.
 * Springs provide natural, physics-based animations.
 *
 * @example
 * ```tsx
 * const x = useMotionValue(0);
 * const springX = useMotionSpring(x, { stiffness: 100, damping: 10 });
 *
 * return (
 *   <motion.div style={{ x: springX }}>
 *     Smooth spring animation
 *   </motion.div>
 * );
 * ```
 *
 * @example
 * ```tsx
 * const scale = useMotionValue(1);
 * const springScale = useMotionSpring(scale, {
 *   stiffness: 200,
 *   damping: 20,
 *   mass: 1
 * });
 *
 * return (
 *   <motion.div
 *     style={{ scale: springScale }}
 *     whileHover={{ scale: 1.2 }}
 *   />
 * );
 * ```
 */

import { type MotionValue, type SpringOptions, useSpring } from 'framer-motion';

/**
 * Creates a spring-animated motion value
 *
 * @param source - The source motion value to spring from
 * @param config - Spring configuration options
 * @returns A spring-animated motion value
 */
export function useMotionSpring(
	source: MotionValue<number>,
	config?: SpringOptions
): MotionValue<number> {
	return useSpring(source, config);
}
