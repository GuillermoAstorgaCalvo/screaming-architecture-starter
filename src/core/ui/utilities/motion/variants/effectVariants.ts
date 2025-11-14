/**
 * Effect animation variants
 * Special effects like shake and blur
 */

import { motionDurations, motionEasing } from '@core/ui/utilities/motion/constants/motionConstants';
import type { Variants } from 'framer-motion';

/**
 * Shake animation keyframe values
 * Uses design tokens for customizable shake intensity
 */
const SHAKE_LARGE = 10; // Can be customized via CSS variable if needed
const SHAKE_SMALL = 5; // Can be customized via CSS variable if needed

/**
 * Filter blur value for animation effects
 * Uses CSS variable for full customization support
 * Falls back to design token value if CSS variable is not set
 */
const ANIMATION_BLUR = 'var(--filter-blur-animation, 10px)';
const NO_BLUR = 'var(--filter-blur-none, 0px)';

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
 * Uses CSS variables for customizable blur values
 */
export const blurVariants: Variants = {
	hidden: {
		opacity: 0,
		filter: `blur(${ANIMATION_BLUR})`,
	},
	visible: {
		opacity: 1,
		filter: `blur(${NO_BLUR})`,
		transition: {
			duration: motionDurations.normal,
			ease: motionEasing['ease-out'],
		},
	},
	exit: {
		opacity: 0,
		filter: `blur(${ANIMATION_BLUR})`,
		transition: {
			duration: motionDurations.fast,
			ease: motionEasing['ease-in'],
		},
	},
};
