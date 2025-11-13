/**
 * Stagger animation variants
 * For animating children with staggered timing
 */

import { motionDurations, motionEasing } from '@core/ui/utilities/motion/constants/motionConstants';
import type { Variants } from 'framer-motion';

/**
 * Stagger container variants for animating children
 */
export const staggerContainerVariants: Variants = {
	hidden: {
		opacity: 0,
	},
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
			delayChildren: 0.1,
		},
	},
};

/**
 * Stagger item variants (used with staggerContainerVariants)
 */
export const staggerItemVariants: Variants = {
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
};
