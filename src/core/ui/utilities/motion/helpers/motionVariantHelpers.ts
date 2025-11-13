/**
 * Motion variant helpers
 * Functions for working with motion variants
 */

import type { MotionVariant } from '@core/ui/utilities/motion/types/motionTypes';
import { blurVariants, shakeVariants } from '@core/ui/utilities/motion/variants/effectVariants';
import { fadeVariants } from '@core/ui/utilities/motion/variants/fadeVariants';
import { rotateVariants } from '@core/ui/utilities/motion/variants/rotateVariants';
import { scaleUpVariants, scaleVariants } from '@core/ui/utilities/motion/variants/scaleVariants';
import { heightVariants, widthVariants } from '@core/ui/utilities/motion/variants/sizeVariants';
import {
	slideBottomVariants,
	slideRightVariants,
	slideTopVariants,
	slideVariants,
} from '@core/ui/utilities/motion/variants/slideVariants';
import { bounceVariants } from '@core/ui/utilities/motion/variants/springVariants';
import type { Variants } from 'framer-motion';

/**
 * Map of variant names to their variant objects
 */
const variantMap: Record<MotionVariant, Variants> = {
	fade: fadeVariants,
	slide: slideVariants,
	slideRight: slideRightVariants,
	slideTop: slideTopVariants,
	slideBottom: slideBottomVariants,
	scale: scaleVariants,
	scaleUp: scaleUpVariants,
	rotate: rotateVariants,
	bounce: bounceVariants,
	shake: shakeVariants,
	blur: blurVariants,
	height: heightVariants,
	width: widthVariants,
};

/**
 * Get fade variant
 */
export function getFadeVariant(): Variants {
	return fadeVariants;
}

/**
 * Get slide variant
 */
export function getSlideVariant(): Variants {
	return slideVariants;
}

/**
 * Get slide right variant
 */
export function getSlideRightVariant(): Variants {
	return slideRightVariants;
}

/**
 * Get slide top variant
 */
export function getSlideTopVariant(): Variants {
	return slideTopVariants;
}

/**
 * Get slide bottom variant
 */
export function getSlideBottomVariant(): Variants {
	return slideBottomVariants;
}

/**
 * Get scale variant
 */
export function getScaleVariant(): Variants {
	return scaleVariants;
}

/**
 * Get scale up variant
 */
export function getScaleUpVariant(): Variants {
	return scaleUpVariants;
}

/**
 * Get rotate variant
 */
export function getRotateVariant(): Variants {
	return rotateVariants;
}

/**
 * Get bounce variant
 */
export function getBounceVariant(): Variants {
	return bounceVariants;
}

/**
 * Get shake variant
 */
export function getShakeVariant(): Variants {
	return shakeVariants;
}

/**
 * Get blur variant
 */
export function getBlurVariant(): Variants {
	return blurVariants;
}

/**
 * Get height variant
 */
export function getHeightVariant(): Variants {
	return heightVariants;
}

/**
 * Get width variant
 */
export function getWidthVariant(): Variants {
	return widthVariants;
}

/**
 * Get variant object based on variant name
 */
export function getVariant(variant: MotionVariant): Variants {
	return variantMap[variant];
}
