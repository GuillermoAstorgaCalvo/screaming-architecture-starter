import { MotionAnimationFrameShowcase } from '@domains/landing/components/categories/hooks/showcases/motion/MotionAnimationFrameShowcase';
import { MotionSpringShowcase } from '@domains/landing/components/categories/hooks/showcases/motion/MotionSpringShowcase';
import { MotionTransformShowcase } from '@domains/landing/components/categories/hooks/showcases/motion/MotionTransformShowcase';
import { MotionValueShowcase } from '@domains/landing/components/categories/hooks/showcases/motion/MotionValueShowcase';
import { MotionVelocityShowcase } from '@domains/landing/components/categories/hooks/showcases/motion/MotionVelocityShowcase';
import { ScrollMotionValueShowcase } from '@domains/landing/components/categories/hooks/showcases/motion/ScrollMotionValueShowcase';

/**
 * MotionHooksShowcase - Showcase group for motion/animation hooks
 */
export function MotionHooksShowcase() {
	return (
		<>
			<MotionValueShowcase />

			<MotionSpringShowcase />

			<MotionTransformShowcase />

			<MotionVelocityShowcase />

			<MotionAnimationFrameShowcase />

			<ScrollMotionValueShowcase />
		</>
	);
}
