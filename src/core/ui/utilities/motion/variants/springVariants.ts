/**
 * Spring animation variants
 * Bouncy, attention-grabbing animations using spring physics
 */

import {
	motionDurations,
	motionEasing,
	springConfig,
} from '@core/ui/utilities/motion/constants/motionConstants';
import type { Variants } from 'framer-motion';

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
