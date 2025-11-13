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

import { getSlideVariant } from '@core/ui/utilities/motion/helpers/motionUtils';
import { MotionBox } from '@core/ui/utilities/motion/MotionBox';
import type { MotionSlideProps } from '@core/ui/utilities/motion/types/motionTypes';

/**
 * MotionSlide component
 */
export function MotionSlide({ direction = 'left', variant, ...props }: Readonly<MotionSlideProps>) {
	const slideVariant = variant ?? getSlideVariant(direction);
	return <MotionBox variant={slideVariant} {...props} />;
}
