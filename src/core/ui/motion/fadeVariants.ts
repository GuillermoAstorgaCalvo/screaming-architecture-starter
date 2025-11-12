/**
 * Fade animation variants
 * Common fade in/out animations
 */

import type { Variants } from 'framer-motion';

import { motionDurations, motionEasing } from './motionConstants';

/**
 * Fade animation variants
 * Common fade in/out animations
 */
export const fadeVariants: Variants = {
	hidden: {
		opacity: 0,
	},
	visible: {
		opacity: 1,
		transition: {
			duration: motionDurations.normal,
			ease: motionEasing['ease-out'],
		},
	},
	exit: {
		opacity: 0,
		transition: {
			duration: motionDurations.fast,
			ease: motionEasing['ease-in'],
		},
	},
};
