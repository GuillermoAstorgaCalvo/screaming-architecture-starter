/**
 * Scale transition helpers
 * Functions for building transition configuration for scale animations
 */

import { getMotionDuration, getMotionEasing } from '@core/ui/utilities/motion/helpers/motionUtils';
import type { MotionDuration, MotionEasing } from '@core/ui/utilities/motion/types/motionTypes';

/**
 * Transition configuration for scale animation
 */
export interface ScaleTransition {
	duration: number;
	ease: readonly [number, number, number, number];
	delay?: number;
}

/**
 * Build transition configuration for scale animation
 */
export function buildScaleTransition(config: {
	duration: MotionDuration | undefined;
	ease: MotionEasing | undefined;
	delay: number | undefined;
}): ScaleTransition {
	const { duration = 'normal', ease = 'ease-out', delay } = config;
	const transition: ScaleTransition = {
		duration: getMotionDuration(duration),
		ease: getMotionEasing(ease),
	};

	if (delay !== undefined) {
		transition.delay = delay;
	}

	return transition;
}
