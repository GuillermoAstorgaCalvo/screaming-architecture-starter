/**
 * Motion utility functions
 * Helper functions for working with Framer Motion animations
 */

import type { MotionDuration, MotionEasing, MotionVariant } from './motionTypes';
import { motionDurations, motionEasing } from './motionVariants';

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
export function createTransition(
	duration: MotionDuration = 'normal',
	easing: MotionEasing = 'ease-out',
	delay = 0
) {
	return {
		duration: getMotionDuration(duration),
		ease: getMotionEasing(easing),
		delay,
	};
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
