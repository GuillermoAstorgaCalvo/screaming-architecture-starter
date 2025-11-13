/**
 * Scale animation variants
 * Scale in/out animations
 */

import { motionDurations, motionEasing } from '@core/ui/utilities/motion/constants/motionConstants';
import type { Variants } from 'framer-motion';

/**
 * Scale animation variants
 * Scale in/out animations
 */
export const scaleVariants: Variants = {
	hidden: {
		opacity: 0,
		scale: 0.95,
	},
	visible: {
		opacity: 1,
		scale: 1,
		transition: {
			duration: motionDurations.normal,
			ease: motionEasing['ease-out'],
		},
	},
	exit: {
		opacity: 0,
		scale: 0.95,
		transition: {
			duration: motionDurations.fast,
			ease: motionEasing['ease-in'],
		},
	},
};

/**
 * Scale up animation variants (for modals, popovers)
 */
export const scaleUpVariants: Variants = {
	hidden: {
		opacity: 0,
		scale: 0.8,
	},
	visible: {
		opacity: 1,
		scale: 1,
		transition: {
			duration: motionDurations.slow,
			ease: motionEasing['ease-out'],
		},
	},
	exit: {
		opacity: 0,
		scale: 0.8,
		transition: {
			duration: motionDurations.fast,
			ease: motionEasing['ease-in'],
		},
	},
};
