/**
 * MotionSlide - Slide animation component
 *
 * A specialized motion component for slide animations from different directions.
 *
 * @example
 * ```tsx
 * <MotionSlide direction="left">
 *   <div>Content that slides in from left</div>
 * </MotionSlide>
 * ```
 *
 * @example
 * ```tsx
 * <MotionSlide direction="bottom" duration="slow">
 *   <div>Content that slides up from bottom</div>
 * </MotionSlide>
 * ```
 */

import { MotionBox } from './MotionBox';
import type { MotionSlideProps } from './motionTypes';
import { getSlideVariant } from './motionUtils';

/**
 * MotionSlide component
 */
export function MotionSlide({ direction = 'left', variant, ...props }: Readonly<MotionSlideProps>) {
	const slideVariant = variant ?? getSlideVariant(direction);
	return <MotionBox variant={slideVariant} {...props} />;
}
