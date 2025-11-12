/**
 * useScrollMotionValue - Hook for tracking scroll position as a motion value
 *
 * Provides motion values for scroll position (x, y) and progress (0-1).
 * More direct access to framer-motion's useScroll hook with motion values.
 *
 * @example
 * ```tsx
 * const { scrollY, scrollYProgress } = useScrollMotionValue();
 * const opacity = useMotionTransform(scrollY, [0, 500], [1, 0]);
 *
 * return (
 *   <motion.div style={{ opacity }}>
 *     Fades as you scroll past 500px
 *   </motion.div>
 * );
 * ```
 *
 * @example
 * ```tsx
 * const containerRef = useRef<HTMLDivElement>(null);
 * const { scrollX, scrollXProgress } = useScrollMotionValue({
 *   container: containerRef,
 *   horizontal: true
 * });
 *
 * return (
 *   <div ref={containerRef} style={{ overflowX: 'auto' }}>
 *     <motion.div
 *       style={{ x: useMotionTransform(scrollX, (v) => -v) }}
 *     >
 *       Horizontal scroll content
 *     </motion.div>
 *   </div>
 * );
 * ```
 */

import { useScroll } from 'framer-motion';
import type { RefObject } from 'react';

/**
 * Options for scroll motion value tracking
 */
export interface UseScrollMotionValueOptions {
	/** Container element to track scroll for (defaults to window) */
	container?: RefObject<HTMLElement> | HTMLElement | null;
}

/**
 * Return type for scroll motion values
 */
export interface UseScrollMotionValueReturn {
	/** Motion value for vertical scroll position in pixels */
	scrollY: ReturnType<typeof useScroll>['scrollY'];
	/** Motion value for horizontal scroll position in pixels */
	scrollX: ReturnType<typeof useScroll>['scrollX'];
	/** Motion value for vertical scroll progress (0-1) */
	scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'];
	/** Motion value for horizontal scroll progress (0-1) */
	scrollXProgress: ReturnType<typeof useScroll>['scrollXProgress'];
}

/**
 * Tracks scroll position and progress as motion values
 *
 * @param options - Configuration options
 * @returns Motion values for scroll position and progress
 */
export function useScrollMotionValue(
	options: UseScrollMotionValueOptions = {}
): UseScrollMotionValueReturn {
	const { container } = options;

	// Resolve container to RefObject if needed
	let containerRef: RefObject<HTMLElement> | undefined;
	if (container) {
		containerRef = 'current' in container ? container : { current: container };
	}

	const scrollOptions = containerRef ? { container: containerRef } : {};
	const scroll = useScroll(scrollOptions);

	return {
		scrollX: scroll.scrollX,
		scrollY: scroll.scrollY,
		scrollXProgress: scroll.scrollXProgress,
		scrollYProgress: scroll.scrollYProgress,
	};
}
