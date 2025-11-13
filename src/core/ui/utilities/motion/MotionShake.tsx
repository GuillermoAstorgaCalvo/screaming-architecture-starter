/**
 * MotionShake - Shake animation component
 *
 * A specialized motion component for shake animations.
 * Useful for form validation errors or invalid actions.
 *
 * @example
 * ```tsx
 * <MotionShake>
 *   <div>Content that shakes</div>
 * </MotionShake>
 * ```
 *
 * @example
 * ```tsx
 * <MotionShake
 *   duration="normal"
 *   delay={0}
 *   initial={false}
 * >
 *   <div>Content with custom timing</div>
 * </MotionShake>
 * ```
 */

import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

import { shakeVariants } from './effectVariants';
import { buildGestureLayoutProps } from './motionPropsHelpers';
import type { MotionShakeProps } from './motionTypes';
import { getMotionDuration, getMotionEasing } from './motionUtils';

/**
 * Get initial state for shake animation
 */
function getShakeInitialState(
	initial: boolean | 'hidden' | 'visible'
): 'hidden' | 'visible' | boolean {
	if (initial === true) return 'visible';
	if (initial === false) return 'hidden';
	return initial;
}

/**
 * Build transition configuration for shake animation
 */
function buildShakeTransition(
	duration: MotionShakeProps['duration'],
	ease: MotionShakeProps['ease'],
	delay: MotionShakeProps['delay']
) {
	const transition: {
		duration: number;
		ease: readonly [number, number, number, number];
		delay?: number;
	} = {
		duration: getMotionDuration(duration),
		ease: getMotionEasing(ease),
	};

	if (delay !== undefined) {
		transition.delay = delay;
	}

	return transition;
}

/**
 * Extract gesture and layout props from component props
 */
function extractGestureLayoutProps(props: Readonly<MotionShakeProps>) {
	const {
		layout,
		layoutId,
		whileHover,
		whileTap,
		drag,
		dragConstraints,
		dragElastic,
		dragMomentum,
		dragTransition,
		onDragStart,
		onDragEnd,
	} = props;

	return {
		layout,
		layoutId,
		whileHover,
		whileTap,
		drag,
		dragConstraints,
		dragElastic,
		dragMomentum,
		dragTransition,
		onDragStart,
		onDragEnd,
	};
}

/**
 * Motion configuration for shake animation
 */
interface ShakeMotionConfig {
	initial: MotionShakeProps['initial'];
	duration: MotionShakeProps['duration'];
	ease: MotionShakeProps['ease'];
	delay: MotionShakeProps['delay'];
}

/**
 * Build motion props for shake animation
 */
function buildShakeMotionProps(config: ShakeMotionConfig) {
	const { initial = false, duration, ease, delay } = config;
	return {
		initial: getShakeInitialState(initial),
		animate: 'visible' as const,
		exit: 'exit' as const,
		variants: shakeVariants,
		transition: buildShakeTransition(duration, ease, delay),
	};
}

/**
 * MotionShake component
 */
export function MotionShake(props: Readonly<MotionShakeProps>) {
	const {
		duration = 'normal',
		ease = 'ease',
		delay = 0,
		initial = false,
		className,
		children,
		// Exclude gesture/layout props from restProps to avoid type conflicts
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
		...restProps
	} = props;

	const gestureLayoutProps = extractGestureLayoutProps(props);
	const motionProps = buildShakeMotionProps({ initial, duration, ease, delay });

	return (
		<motion.div
			className={twMerge(className)}
			{...motionProps}
			{...buildGestureLayoutProps(gestureLayoutProps)}
			{...restProps}
		>
			{children}
		</motion.div>
	);
}
