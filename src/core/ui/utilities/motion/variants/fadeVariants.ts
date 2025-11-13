/**
 * Fade animation variants
 * Common fade in/out animations
 */

import { createVariant } from '@core/ui/utilities/motion/helpers/motionVariantFactory';
import type { Variants } from 'framer-motion';

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
