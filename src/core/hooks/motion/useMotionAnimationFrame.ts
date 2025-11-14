/**
 * useMotionAnimationFrame - Hook for animation frame-based motion value updates
 *
 * Provides a way to update motion values on every animation frame.
 * Useful for custom animations that need frame-by-frame control.
 *
 * @example
 * ```tsx
 * const x = useMotionValue(0);
 *
 * useMotionAnimationFrame((time, delta) => {
 *   x.set(x.get() + delta * 0.01);
 * });
 *
 * return (
 *   <motion.div style={{ x }}>
 *     Continuously moving element
 *   </motion.div>
 * );
 * ```
 *
 * @example
 * ```tsx
 * const rotation = useMotionValue(0);
 *
 * useMotionAnimationFrame((time) => {
 *   rotation.set(time * 0.001); // Rotate based on time
 * });
 *
 * return (
 *   <motion.div
 *     style={{ rotate: rotation }}
 *   >
 *     Rotating element
 *   </motion.div>
 * );
 * ```
 */

import { useEffect, useRef } from 'react';

/**
 * Options for animation frame callback
 */
export interface UseMotionAnimationFrameOptions {
	/** Whether the animation frame loop is active @default true */
	enabled?: boolean;
}

/**
 * Animation frame callback function
 *
 * @param time - Current time in milliseconds
 * @param delta - Time delta since last frame in milliseconds
 */
export type MotionAnimationFrameCallback = (time: number, delta: number) => void;

/**
 * Runs a callback on every animation frame
 *
 * @param callback - Function to call on each frame
 * @param options - Configuration options
 */
export function useMotionAnimationFrame(
	callback: MotionAnimationFrameCallback,
	options: UseMotionAnimationFrameOptions = {}
): void {
	const { enabled = true } = options;
	const callbackRef = useRef(callback);
	const lastTimeRef = useRef<number | null>(null);
	const rafIdRef = useRef<number | null>(null);

	// Keep callback ref up to date
	useEffect(() => {
		callbackRef.current = callback;
	}, [callback]);

	useEffect(() => {
		if (!enabled) {
			// Cancel any pending animation frame
			if (rafIdRef.current !== null) {
				cancelAnimationFrame(rafIdRef.current);
				rafIdRef.current = null;
			}
			lastTimeRef.current = null;
			return;
		}

		const animate = (time: number) => {
			lastTimeRef.current ??= time;

			const delta = time - lastTimeRef.current;
			callbackRef.current(time, delta);
			lastTimeRef.current = time;

			rafIdRef.current = requestAnimationFrame(animate);
		};

		rafIdRef.current = requestAnimationFrame(animate);

		return () => {
			if (rafIdRef.current !== null) {
				cancelAnimationFrame(rafIdRef.current);
				rafIdRef.current = null;
			}
			lastTimeRef.current = null;
		};
	}, [enabled]);
}
