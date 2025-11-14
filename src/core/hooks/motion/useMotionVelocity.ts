/**
 * useMotionVelocity - Hook for tracking velocity of motion values
 *
 * Wraps framer-motion's useVelocity to track the rate of change
 * of a motion value. Useful for creating momentum-based animations.
 *
 * @example
 * ```tsx
 * const x = useMotionValue(0);
 * const velocityX = useMotionVelocity(x);
 *
 * useEffect(() => {
 *   const unsubscribe = velocityX.on('change', (v) => {
 *     console.log('Velocity:', v);
 *   });
 *   return unsubscribe;
 * }, [velocityX]);
 *
 * return (
 *   <motion.div
 *     style={{ x }}
 *     drag="x"
 *   />
 * );
 * ```
 *
 * @example
 * ```tsx
 * const scrollY = useMotionValue(0);
 * const scrollVelocity = useMotionVelocity(scrollY);
 * const isScrollingFast = useMotionTransform(
 *   scrollVelocity,
 *   (v) => Math.abs(v) > 100
 * );
 *
 * return (
 *   <motion.div
 *     style={{ opacity: isScrollingFast ? 0.5 : 1 }}
 *   >
 *     Content
 *   </motion.div>
 * );
 * ```
 */

import { type MotionValue, useVelocity } from 'framer-motion';

/**
 * Tracks the velocity of a motion value
 *
 * @param value - The motion value to track velocity for
 * @returns A motion value representing the velocity
 */
export function useMotionVelocity(value: MotionValue<number>): MotionValue<number> {
	return useVelocity(value);
}
