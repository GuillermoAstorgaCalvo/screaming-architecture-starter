/**
 * useScrollProgress - Hook for tracking scroll progress as a motion value
 *
 * Provides a motion value that represents scroll progress (0-1) for a container.
 * Can be used with useMotionTransform to create scroll-based animations.
 *
 * @example
 * ```tsx
 * const scrollProgress = useScrollProgress();
 * const opacity = useMotionTransform(scrollProgress, [0, 0.5], [1, 0]);
 *
 * return (
 *   <motion.div style={{ opacity }}>
 *     Fades out as you scroll
 *   </motion.div>
 * );
 * ```
 *
 * @example
 * ```tsx
 * const containerRef = useRef<HTMLDivElement>(null);
 * const scrollProgress = useScrollProgress({ container: containerRef });
 * const scale = useMotionTransform(scrollProgress, [0, 1], [0.8, 1.2]);
 *
 * return (
 *   <div ref={containerRef} style={{ height: '200vh' }}>
 *     <motion.div style={{ scale }}>
 *       Scales based on container scroll
 *     </motion.div>
 *   </div>
 * );
 * ```
 */

import { useMotionValue, useScroll } from 'framer-motion';
import { type RefObject, useEffect, useRef } from 'react';

/**
 * Options for scroll progress tracking
 */
export interface UseScrollProgressOptions {
	/** Container element to track scroll for (defaults to window) */
	container?: RefObject<HTMLElement> | HTMLElement | null;
	/** Offset from top where progress starts (in pixels) @default 0 */
	offset?: number;
	/** Offset from bottom where progress ends (in pixels) @default 0 */
	offsetBottom?: number;
	/** Whether to track horizontal scroll instead of vertical @default false */
	horizontal?: boolean;
}

/**
 * Calculate adjusted progress with offsets
 */
interface CalculateProgressParams {
	scrollValue: number;
	horizontal: boolean;
	offset: number;
	offsetBottom: number;
	scrollHeight: number;
}

function calculateProgress(params: CalculateProgressParams): number {
	const { scrollValue, scrollHeight, offset, offsetBottom } = params;

	if (scrollHeight <= 0) {
		return 0;
	}

	const startPoint = offset;
	const endPoint = scrollHeight - offsetBottom;
	const range = endPoint - startPoint;

	if (range <= 0) {
		return 0;
	}

	return Math.max(0, Math.min(1, (scrollValue - startPoint) / range));
}

function getScrollHeight(container: HTMLElement | null, horizontal: boolean): number {
	if (container) {
		return horizontal
			? container.scrollWidth - container.clientWidth
			: container.scrollHeight - container.clientHeight;
	}

	return horizontal
		? document.documentElement.scrollWidth - globalThis.window.innerWidth
		: document.documentElement.scrollHeight - globalThis.window.innerHeight;
}

/**
 * Tracks scroll progress as a motion value (0-1)
 *
 * @param options - Configuration options
 * @returns A motion value representing scroll progress (0-1)
 */
export function useScrollProgress(
	options: UseScrollProgressOptions = {}
): ReturnType<typeof useMotionValue<number>> {
	const { container, offset = 0, offsetBottom = 0, horizontal = false } = options;

	const progress = useMotionValue(0);
	const containerRef = useRef<HTMLElement | null>(null);

	// Resolve container element
	useEffect(() => {
		if (!container) {
			containerRef.current = null;
			return;
		}

		containerRef.current = 'current' in container ? container.current : container;
	}, [container]);

	const { scrollX, scrollY, scrollXProgress, scrollYProgress } = useScroll({
		container: containerRef,
	});

	useEffect(() => {
		const scrollProgress = horizontal ? scrollXProgress : scrollYProgress;
		const scrollValue = horizontal ? scrollX : scrollY;

		return scrollProgress.on('change', () => {
			const currentScroll = scrollValue.get();
			const scrollHeight = getScrollHeight(containerRef.current, horizontal);

			const adjustedProgress = calculateProgress({
				scrollValue: currentScroll,
				horizontal,
				offset,
				offsetBottom,
				scrollHeight,
			});

			progress.set(adjustedProgress);
		});
	}, [
		scrollXProgress,
		scrollYProgress,
		scrollX,
		scrollY,
		horizontal,
		offset,
		offsetBottom,
		progress,
	]);

	return progress;
}
