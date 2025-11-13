/**
 * MotionBlur - Blur animation component
 *
 * A specialized motion component for blur animations.
 * Useful for focus effects or loading states.
 *
 * @example
 * ```tsx
 * <MotionBlur>
 *   <div>Content that blurs in</div>
 * </MotionBlur>
 * ```
 *
 * @example
 * ```tsx
 * <MotionBlur
 *   duration="slow"
 *   delay={0.2}
 *   initial={false}
 * >
 *   <div>Content with custom timing</div>
 * </MotionBlur>
 * ```
 */

import { buildGestureLayoutProps } from '@core/ui/utilities/motion/helpers/motionPropsHelpers';
import { getMotionDuration, getMotionEasing } from '@core/ui/utilities/motion/helpers/motionUtils';
import type { MotionBlurProps } from '@core/ui/utilities/motion/types/motionTypes';
import { blurVariants } from '@core/ui/utilities/motion/variants/effectVariants';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

/**
 * Get initial state for blur animation
 */
function getBlurInitialState(
	initial: boolean | 'hidden' | 'visible'
): 'hidden' | 'visible' | boolean {
	if (initial === true) return 'visible';
	if (initial === false) return 'hidden';
	return initial;
}

/**
 * Build transition configuration for blur animation
 */
function buildBlurTransition(
	duration: MotionBlurProps['duration'],
	ease: MotionBlurProps['ease'],
	delay: MotionBlurProps['delay']
) {
	return {
		duration: getMotionDuration(duration ?? 'normal'),
		ease: getMotionEasing(ease ?? 'ease-out'),
		delay: delay ?? 0,
	};
}

/**
 * Animation configuration for blur motion
 */
interface BlurAnimationConfig {
	initial: MotionBlurProps['initial'];
	duration: MotionBlurProps['duration'];
	ease: MotionBlurProps['ease'];
	delay: MotionBlurProps['delay'];
}

/**
 * Build motion props for blur animation
 */
function buildBlurMotionProps(config: BlurAnimationConfig) {
	return {
		initial: getBlurInitialState(config.initial ?? false),
		animate: 'visible' as const,
		exit: 'exit' as const,
		variants: blurVariants,
		transition: buildBlurTransition(config.duration, config.ease, config.delay),
	};
}

/**
 * Extract gesture and layout props for blur component
 */
function extractBlurGestureProps(props: Readonly<MotionBlurProps>) {
	return buildGestureLayoutProps({
		layout: props.layout,
		layoutId: props.layoutId,
		whileHover: props.whileHover,
		whileTap: props.whileTap,
		drag: props.drag,
		dragConstraints: props.dragConstraints,
		dragElastic: props.dragElastic,
		dragMomentum: props.dragMomentum,
		dragTransition: props.dragTransition,
		onDragStart: props.onDragStart,
		onDragEnd: props.onDragEnd,
	});
}

/**
 * Exclude gesture and layout props from motion props
 */
function excludeGestureProps(props: Readonly<MotionBlurProps>) {
	const {
		layout: _layout,
		layoutId: _layoutId,
		whileHover: _whileHover,
		whileTap: _whileTap,
		drag: _drag,
		dragConstraints: _dragConstraints,
		dragElastic: _dragElastic,
		dragMomentum: _dragMomentum,
		dragTransition: _dragTransition,
		onDragStart: _onDragStart,
		onDragEnd: _onDragEnd,
		...rest
	} = props;
	return rest;
}

/**
 * MotionBlur component
 */
export function MotionBlur({
	duration = 'normal',
	ease = 'ease-out',
	delay = 0,
	initial = false,
	className,
	children,
	...props
}: Readonly<MotionBlurProps>) {
	const motionProps = buildBlurMotionProps({ initial, duration, ease, delay });
	const gestureLayoutProps = extractBlurGestureProps(props);
	const remainingProps = excludeGestureProps(props);
	return (
		<motion.div
			className={twMerge(className)}
			{...motionProps}
			{...gestureLayoutProps}
			{...remainingProps}
		>
			{children}
		</motion.div>
	);
}
