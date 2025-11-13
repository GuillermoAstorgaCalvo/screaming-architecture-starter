/**
 * Slide animation variants
 * Slide from different directions
 */

import { motionDurations, motionEasing } from '@core/ui/utilities/motion/constants/motionConstants';
import type { Variants } from 'framer-motion';

/**
 * Slide animation variants
 * Slide from left
 */
export const slideVariants: Variants = {
	hidden: {
		opacity: 0,
		x: -20,
	},
	visible: {
		opacity: 1,
		x: 0,
		transition: {
			duration: motionDurations.normal,
			ease: motionEasing['ease-out'],
		},
	},
	exit: {
		opacity: 0,
		x: -20,
		transition: {
			duration: motionDurations.fast,
			ease: motionEasing['ease-in'],
		},
	},
};

/**
 * Slide from right animation variants
 */
export const slideRightVariants: Variants = {
	hidden: {
		opacity: 0,
		x: 20,
	},
	visible: {
		opacity: 1,
		x: 0,
		transition: {
			duration: motionDurations.normal,
			ease: motionEasing['ease-out'],
		},
	},
	exit: {
		opacity: 0,
		x: 20,
		transition: {
			duration: motionDurations.fast,
			ease: motionEasing['ease-in'],
		},
	},
};

/**
 * Slide from top animation variants
 */
export const slideTopVariants: Variants = {
	hidden: {
		opacity: 0,
		y: -20,
	},
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: motionDurations.normal,
			ease: motionEasing['ease-out'],
		},
	},
	exit: {
		opacity: 0,
		y: -20,
		transition: {
			duration: motionDurations.fast,
			ease: motionEasing['ease-in'],
		},
	},
};

/**
 * Slide from bottom animation variants
 */
export const slideBottomVariants: Variants = {
	hidden: {
		opacity: 0,
		y: 20,
	},
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: motionDurations.normal,
			ease: motionEasing['ease-out'],
		},
	},
	exit: {
		opacity: 0,
		y: 20,
		transition: {
			duration: motionDurations.fast,
			ease: motionEasing['ease-in'],
		},
	},
};
