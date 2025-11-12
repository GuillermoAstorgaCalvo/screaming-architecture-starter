/**
 * Motion state helpers
 * Functions for determining initial animation state
 */

import type { MotionInitialState } from './motionTypes';

/**
 * Initial state type
 */
export type InitialState = 'hidden' | 'visible' | boolean;

/**
 * Determine initial animation state
 */
export function getInitialState(initial: MotionInitialState): InitialState {
	if (initial === true) {
		return 'visible';
	}
	if (initial === false) {
		return 'hidden';
	}
	return initial;
}
