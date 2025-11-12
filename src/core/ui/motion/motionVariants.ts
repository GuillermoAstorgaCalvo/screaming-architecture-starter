/**
 * Motion animation variants
 * Reusable Framer Motion animation variants aligned with design tokens
 *
 * This file serves as a barrel export for all motion variants,
 * maintaining backward compatibility with existing imports.
 *
 * @see motionConstants.ts - Duration, easing, and spring configuration
 * @see fadeVariants.ts - Fade animations
 * @see slideVariants.ts - Slide animations from all directions
 * @see scaleVariants.ts - Scale animations
 * @see rotateVariants.ts - Rotate animations
 * @see staggerVariants.ts - Stagger animations for children
 * @see springVariants.ts - Spring/bounce animations
 * @see effectVariants.ts - Effect animations (shake, blur)
 * @see sizeVariants.ts - Size animations (height, width)
 */

// Constants
export { motionDurations, motionEasing, springConfig } from './motionConstants';

// Fade variants
export { fadeVariants } from './fadeVariants';

// Slide variants
export {
	slideBottomVariants,
	slideRightVariants,
	slideTopVariants,
	slideVariants,
} from './slideVariants';

// Scale variants
export { scaleUpVariants, scaleVariants } from './scaleVariants';

// Rotate variants
export { rotateVariants } from './rotateVariants';

// Stagger variants
export { staggerContainerVariants, staggerItemVariants } from './staggerVariants';

// Spring variants
export { bounceVariants } from './springVariants';

// Effect variants
export { blurVariants, shakeVariants } from './effectVariants';

// Size variants
export { heightVariants, widthVariants } from './sizeVariants';
