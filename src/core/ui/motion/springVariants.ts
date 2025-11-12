/**
 * Spring animation variants
 * Bouncy, attention-grabbing animations using spring physics
 */

import type { Variants } from 'framer-motion';

import { motionDurations, motionEasing, springConfig } from './motionConstants';

/**
 * Bounce animation variants
 * Bouncy, attention-grabbing animations using spring physics
 */
export const bounceVariants: Variants = {
	hidden: {
		opacity: 0,
		scale: 0.3,
	},
	visible: {
		opacity: 1,
		scale: 1,
		transition: {
			type: 'spring',
			stiffness: springConfig.normal.stiffness,
			damping: springConfig.normal.damping,
		},
	},
	exit: {
		opacity: 0,
		scale: 0.3,
		transition: {
			duration: motionDurations.fast,
			ease: motionEasing['ease-in'],
		},
	},
};
