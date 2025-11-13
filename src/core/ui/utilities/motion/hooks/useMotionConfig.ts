/**
 * useMotionConfig - Centralized motion configuration hook
 *
 * Exposes design token-driven duration/easing values, the reduced motion flag,
 * and handy helpers for creating token-aware transitions and resolving reduced
 * motion strategies.
 */

import {
	motionDurations,
	type MotionDurationToken,
	motionDurationTokens,
	motionEasing,
	type MotionEasingToken,
	motionEasingTokens,
} from '@core/ui/utilities/motion/constants/motionConstants';
import {
	createTransition,
	type MotionTransitionOptions,
} from '@core/ui/utilities/motion/helpers/motionUtils';
import { useReducedMotion } from '@core/ui/utilities/motion/hooks/useReducedMotion';
import type { ReducedMotionStrategy } from '@core/ui/utilities/motion/types/motionTypes';
import { useCallback, useMemo } from 'react';

/**
 * Effective reduced motion strategy values
 */
export type EffectiveMotionStrategy = ReducedMotionStrategy | 'normal';

/**
 * Shape returned by useMotionConfig
 */
export interface MotionConfig {
	/** Whether the user prefers reduced motion */
	reducedMotion: boolean;
	/** Duration tokens (ms strings) sourced from design tokens */
	durationTokens: typeof motionDurationTokens;
	/** Duration values in seconds for Framer Motion consumption */
	durations: typeof motionDurations;
	/** Easing token strings sourced from design tokens */
	easingTokens: typeof motionEasingTokens;
	/** Easing cubic-bezier tuples */
	easings: typeof motionEasing;
	/** Build a transition using duration/easing tokens */
	createTransition: (options?: MotionTransitionOptions) => MotionTransitionOptionsReturn;
	/** Determine the effective reduced-motion strategy */
	resolveReducedMotionStrategy: (strategy?: ReducedMotionStrategy) => EffectiveMotionStrategy;
}

/**
 * Return type for createTransition helper
 */
export type MotionTransitionOptionsReturn = ReturnType<typeof createTransition>;

/**
 * Hook providing motion configuration
 */
export function useMotionConfig(): MotionConfig {
	const reducedMotion = useReducedMotion();

	const resolveReducedMotionStrategy = useCallback(
		(strategy: ReducedMotionStrategy = 'fade'): EffectiveMotionStrategy => {
			if (!reducedMotion) {
				return 'normal';
			}
			return strategy;
		},
		[reducedMotion]
	);

	const createTransitionWithTokens = useCallback(
		(options?: MotionTransitionOptions) => createTransition(options),
		[]
	);

	return useMemo(
		() => ({
			reducedMotion,
			durationTokens: motionDurationTokens,
			durations: motionDurations,
			easingTokens: motionEasingTokens,
			easings: motionEasing,
			createTransition: createTransitionWithTokens,
			resolveReducedMotionStrategy,
		}),
		[createTransitionWithTokens, reducedMotion, resolveReducedMotionStrategy]
	);
}

/**
 * Extract union type for duration tokens
 */
export type MotionDurationTokens = MotionDurationToken;

/**
 * Extract union type for easing tokens
 */
export type MotionEasingTokens = MotionEasingToken;
