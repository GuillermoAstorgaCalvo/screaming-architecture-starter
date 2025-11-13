/**
 * Motion animation constants
 * Duration, easing, and spring configuration constants
 *
 * These constants provide the foundation for all motion variants,
 * ensuring consistent timing and easing across the application.
 */

import { designTokens } from '@core/constants/designTokens';

/**
 * Re-export design token durations for motion usage
 */
export const motionDurationTokens = designTokens.transition.duration;
export type MotionDurationToken = keyof typeof motionDurationTokens;

/**
 * Re-export design token easing tokens for motion usage
 */
export const motionEasingTokens = designTokens.transition.timing;
export type MotionEasingToken = keyof typeof motionEasing;

/**
 * Convert design token duration (e.g., "150ms") to seconds for Framer Motion
 */
function durationToSeconds(duration: string): number {
	return Number.parseFloat(duration.replace('ms', '')) / 1000;
}

/**
 * Animation duration variants based on design tokens
 */
export const motionDurations = Object.fromEntries(
	Object.entries(motionDurationTokens).map(([key, value]) => [key, durationToSeconds(value)])
) as {
	[K in keyof typeof motionDurationTokens]: number;
};

/**
 * Easing function constants
 * Standard cubic bezier values for easing functions
 */
const EASE_P1 = 0.25;
const EASE_P2 = 0.1;
const EASE_P3 = 0.25;
const EASE_IN_P1 = 0.42;
const EASE_OUT_P3 = 0.58;
const EASE_IN_OUT_P3 = 0.58;
const EASE_START = 0;
const EASE_END = 1;

/**
 * Easing functions based on design tokens
 */
export const motionEasing = {
	ease: [EASE_P1, EASE_P2, EASE_P3, EASE_END] as const,
	'ease-in': [EASE_IN_P1, EASE_START, EASE_END, EASE_END] as const,
	'ease-out': [EASE_START, EASE_START, EASE_OUT_P3, EASE_END] as const,
	'ease-in-out': [EASE_IN_P1, EASE_START, EASE_IN_OUT_P3, EASE_END] as const,
} as const;

/**
 * Spring animation configuration
 * Natural, bouncy animations
 */
export const springConfig = {
	stiff: { stiffness: 300, damping: 30 },
	normal: { stiffness: 200, damping: 25 },
	gentle: { stiffness: 100, damping: 20 },
} as const;
