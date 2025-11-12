/**
 * Rotate animation variants
 */

import type { Variants } from 'framer-motion';

import { motionDurations, motionEasing } from './motionConstants';

/**
 * Rotate animation variants
 */
export const rotateVariants: Variants = {
	hidden: {
		opacity: 0,
		rotate: -180,
	},
	visible: {
		opacity: 1,
		rotate: 0,
		transition: {
			duration: motionDurations.slow,
			ease: motionEasing['ease-out'],
		},
	},
	exit: {
		opacity: 0,
		rotate: 180,
		transition: {
			duration: motionDurations.fast,
			ease: motionEasing['ease-in'],
		},
	},
};
