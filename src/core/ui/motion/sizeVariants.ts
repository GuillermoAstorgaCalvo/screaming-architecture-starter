/**
 * Size animation variants
 * For smooth expand/collapse animations (height and width)
 */

import type { Variants } from 'framer-motion';

import { motionDurations, motionEasing } from './motionConstants';

/**
 * Height animation variants
 * For smooth expand/collapse animations (accordion, collapsible)
 * Uses height: "auto" for smooth transitions
 */
export const heightVariants: Variants = {
	hidden: {
		opacity: 0,
		height: 0,
		transition: {
			duration: motionDurations.normal,
			ease: motionEasing['ease-in-out'],
		},
	},
	visible: {
		opacity: 1,
		height: 'auto',
		transition: {
			duration: motionDurations.normal,
			ease: motionEasing['ease-in-out'],
		},
	},
	exit: {
		opacity: 0,
		height: 0,
		transition: {
			duration: motionDurations.normal,
			ease: motionEasing['ease-in-out'],
		},
	},
};

/**
 * Width animation variants
 * For smooth width expand/collapse animations
 */
export const widthVariants: Variants = {
	hidden: {
		opacity: 0,
		width: 0,
		transition: {
			duration: motionDurations.normal,
			ease: motionEasing['ease-in-out'],
		},
	},
	visible: {
		opacity: 1,
		width: 'auto',
		transition: {
			duration: motionDurations.normal,
			ease: motionEasing['ease-in-out'],
		},
	},
	exit: {
		opacity: 0,
		width: 0,
		transition: {
			duration: motionDurations.normal,
			ease: motionEasing['ease-in-out'],
		},
	},
};
