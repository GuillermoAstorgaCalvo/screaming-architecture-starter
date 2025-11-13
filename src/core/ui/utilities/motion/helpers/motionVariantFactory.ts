/**
 * createVariant - Declarative variant factory
 *
 * Allows describing variants using token-driven duration and easing values
 * while preserving any transition overrides defined on individual states.
 */

import { getMotionDuration, getMotionEasing } from '@core/ui/utilities/motion/helpers/motionUtils';
import type { MotionDuration, MotionEasing } from '@core/ui/utilities/motion/types/motionTypes';
import type { TargetAndTransition, Transition, Variants } from 'framer-motion';

/**
 * Timing configuration for a variant state
 */
export interface VariantTiming {
	duration?: MotionDuration | number;
	ease?: MotionEasing;
	delay?: number;
}

/**
 * Options for createVariant factory
 */
export interface CreateVariantOptions {
	hidden: TargetAndTransition;
	visible: TargetAndTransition;
	exit?: TargetAndTransition;
	/**
	 * Base timing applied to all states when specific overrides are not provided
	 */
	timing?: VariantTiming;
	/**
	 * Timing override for the hidden state
	 */
	hiddenTiming?: VariantTiming;
	/**
	 * Timing override for the visible state
	 */
	visibleTiming?: VariantTiming;
	/**
	 * Timing override for the exit state
	 */
	exitTiming?: VariantTiming;
}

/**
 * Create a Framer Motion variants object with token-driven timing.
 */
export function createVariant(options: CreateVariantOptions): Variants {
	const { hidden, visible, exit, timing, hiddenTiming, visibleTiming, exitTiming } = options;

	const hiddenState = applyTiming({ ...hidden }, hiddenTiming ?? timing);
	const visibleState = applyTiming({ ...visible }, visibleTiming ?? timing);
	const exitState = applyTiming({ ...(exit ?? hidden) }, exitTiming ?? timing);

	return {
		hidden: hiddenState,
		visible: visibleState,
		exit: exitState,
	};
}

/**
 * Apply timing configuration to a target state
 */
function applyTiming(state: TargetAndTransition, timing?: VariantTiming): TargetAndTransition {
	const timingConfig = resolveTiming(timing);

	if (!timingConfig) {
		return state;
	}

	const existingTransition = state.transition;
	return {
		...state,
		transition: existingTransition ? { ...timingConfig, ...existingTransition } : timingConfig,
	};
}

/**
 * Resolve duration value to a number
 */
function resolveDuration(duration: MotionDuration | number): number {
	return typeof duration === 'number' ? duration : getMotionDuration(duration);
}

/**
 * Resolve timing configuration to a Transition object
 */
function resolveTiming(timing?: VariantTiming): Transition | undefined {
	if (!timing) {
		return undefined;
	}

	const { duration, ease, delay } = timing;
	const resolved: Transition = {};

	if (duration !== undefined) {
		resolved.duration = resolveDuration(duration);
	}

	if (ease) {
		resolved.ease = getMotionEasing(ease);
	}

	if (delay !== undefined) {
		resolved.delay = delay;
	}

	return Object.keys(resolved).length > 0 ? resolved : undefined;
}
