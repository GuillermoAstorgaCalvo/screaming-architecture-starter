/**
 * Motion utility functions
 * Helper functions for working with Framer Motion animations
 */

import { motionDurations, motionEasing } from './motionConstants';
import type { MotionDuration, MotionEasing, MotionVariant } from './motionTypes';

/**
 * Get animation duration in seconds from duration token
 */
export function getMotionDuration(duration: MotionDuration = 'normal'): number {
	return motionDurations[duration];
}

/**
 * Get easing array from easing token
 */
export function getMotionEasing(
	easing: MotionEasing = 'ease-out'
): readonly [number, number, number, number] {
	return motionEasing[easing];
}

/**
 * Get variant name based on direction for slide animations
 */
export function getSlideVariant(direction: 'left' | 'right' | 'top' | 'bottom'): MotionVariant {
	switch (direction) {
		case 'left': {
			return 'slide';
		}
		case 'right': {
			return 'slideRight';
		}
		case 'top': {
			return 'slideTop';
		}
		case 'bottom': {
			return 'slideBottom';
		}
		default: {
			return 'slide';
		}
	}
}

/**
 * Create custom transition object
 */
export function createTransition(options: MotionTransitionOptions = {}) {
	const { duration = 'normal', ease: easing = 'ease-out', delay = 0 } = options;

	return {
		duration: typeof duration === 'number' ? duration : getMotionDuration(duration),
		ease: getMotionEasing(easing),
		delay,
	};
}

/**
 * Options for createTransition helper
 */
export interface MotionTransitionOptions {
	duration?: MotionDuration | number;
	ease?: MotionEasing;
	delay?: number;
}

/**
 * Spring transition configuration
 */
export interface SpringTransitionConfig {
	stiffness?: number;
	damping?: number;
	mass?: number;
	delay?: number;
}

/**
 * Create spring transition
 */
export function createSpringTransition(config: SpringTransitionConfig = {}) {
	const { stiffness = 200, damping = 25, mass = 1, delay = 0 } = config;
	return {
		type: 'spring' as const,
		stiffness,
		damping,
		mass,
		delay,
	};
}
