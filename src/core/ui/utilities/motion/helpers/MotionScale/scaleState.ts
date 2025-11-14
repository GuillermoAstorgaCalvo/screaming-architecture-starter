/**
 * Scale state helpers
 * Functions for building initial, animate, and exit states for scale animations
 */

import type { MotionInitialState } from '@core/ui/utilities/motion/types/motionTypes';
import type { TargetAndTransition } from 'framer-motion';

/**
 * Scale animation state
 */
export interface ScaleState extends TargetAndTransition {
	opacity: number;
	scale: number;
}

/**
 * Get initial state for scale animation
 */
export function getScaleInitialState(
	initial: MotionInitialState | undefined,
	initialScale: number
): 'hidden' | 'visible' | boolean | ScaleState {
	if (initial === true) {
		return 'visible';
	}
	if (initial === false || initial === undefined) {
		return {
			opacity: 0,
			scale: initialScale,
		};
	}
	return initial;
}

/**
 * Build animate state for scale animation
 */
export function buildScaleAnimateState(finalScale: number): ScaleState {
	return {
		opacity: 1,
		scale: finalScale,
	};
}

/**
 * Build exit state for scale animation
 */
export function buildScaleExitState(initialScale: number): ScaleState {
	return {
		opacity: 0,
		scale: initialScale,
	};
}
