/**
 * Effect animation variants
 * Special effects like shake and blur
 */

import type { Variants } from 'framer-motion';

import { motionDurations, motionEasing } from './motionConstants';

/**
 * Shake animation keyframe values
 */
const SHAKE_LARGE = 10;
const SHAKE_SMALL = 5;

/**
 * Shake animation variants
 * For form validation errors or invalid actions
 */
export const shakeVariants: Variants = {
	hidden: {
		x: 0,
	},
	visible: {
		x: [0, -SHAKE_LARGE, SHAKE_LARGE, -SHAKE_LARGE, SHAKE_LARGE, -SHAKE_SMALL, SHAKE_SMALL, 0],
		transition: {
			duration: motionDurations.normal,
			ease: motionEasing.ease,
		},
	},
	exit: {
		x: 0,
	},
};

/**
 * Blur animation variants
 * For focus effects or loading states
 */
export const blurVariants: Variants = {
	hidden: {
		opacity: 0,
		filter: 'blur(10px)',
	},
	visible: {
		opacity: 1,
		filter: 'blur(0px)',
		transition: {
			duration: motionDurations.normal,
			ease: motionEasing['ease-out'],
		},
	},
	exit: {
		opacity: 0,
		filter: 'blur(10px)',
		transition: {
			duration: motionDurations.fast,
			ease: motionEasing['ease-in'],
		},
	},
};
