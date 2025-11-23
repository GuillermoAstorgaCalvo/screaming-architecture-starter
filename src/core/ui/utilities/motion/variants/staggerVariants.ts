/**
 * Stagger animation variants
 * For animating children with staggered timing
 */

import { motionDurations, motionEasing } from '@core/ui/utilities/motion/constants/motionConstants';
import { stagger, type Variants } from 'framer-motion';

/**
 * Stagger delay constants
 */
const STAGGER_DELAY = motionDurations.micro; // 0.1s
const STAGGER_START_DELAY = motionDurations.micro; // 0.1s

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
			delayChildren: stagger(STAGGER_DELAY, { startDelay: STAGGER_START_DELAY }),
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
