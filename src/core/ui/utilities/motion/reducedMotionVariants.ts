import type { Variants } from 'framer-motion';

import { createVariant } from './motionVariantFactory';

/**
 * Variants that resolve immediately without motion
 */
export const STATIC_VARIANTS = createVariant({
	hidden: {},
	visible: {},
	exit: {},
});

/**
 * Minimal fade variant for reduced motion scenarios
 */
export const REDUCED_FADE_VARIANTS = createVariant({
	hidden: { opacity: 0 },
	visible: { opacity: 1 },
	exit: { opacity: 0 },
	timing: {
		duration: 'micro',
		ease: 'ease-out',
	},
	exitTiming: {
		duration: 'micro',
		ease: 'ease-in',
	},
});

/**
 * Clone variants with instantaneous transitions
 */
export function withInstantTransitions(variants: Variants): Variants {
	const result: Variants = {};

	for (const [state, value] of Object.entries(variants)) {
		if (typeof value === 'function') {
			result[state] = value;
			continue;
		}

		const stateValue = value as NonNullable<typeof value>;
		const { transition, ...rest } = stateValue;
		result[state] = {
			...rest,
			transition: {
				...transition,
				duration: 0,
				delay: 0,
			},
		};
	}

	return result;
}
