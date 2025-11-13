/**
 * MotionFade - Fade in/out animation component
 *
 * A specialized motion component for fade animations.
 * Convenience wrapper around MotionBox with fade variant.
 *
 * @example
 * ```tsx
 * <MotionFade>
 *   <div>Content that fades in</div>
 * </MotionFade>
 * ```
 *
 * @example
 * ```tsx
 * <MotionFade duration="slow" delay={0.3}>
 *   <div>Content with custom timing</div>
 * </MotionFade>
 * ```
 */

import { MotionBox } from './MotionBox';
import type { MotionFadeProps } from './motionTypes';

/**
 * MotionFade component
 */
export function MotionFade({ variant = 'fade', ...props }: Readonly<MotionFadeProps>) {
	return <MotionBox variant={variant} {...props} />;
}
