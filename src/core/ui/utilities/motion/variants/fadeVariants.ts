/**
 * Fade animation variants
 * Common fade in/out animations
 */

import type { Variants } from 'framer-motion';

import { createVariant } from './motionVariantFactory';

/**
 * Fade animation variants
 * Common fade in/out animations
 */
export const fadeVariants: Variants = createVariant({
	hidden: {
		opacity: 0,
	},
	visible: {
		opacity: 1,
	},
	exit: {
		opacity: 0,
	},
	timing: {
		duration: 'normal',
		ease: 'ease-out',
	},
	exitTiming: {
		duration: 'fast',
		ease: 'ease-in',
	},
});
