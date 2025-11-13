/**
 * MotionRotate - Rotate animation component
 *
 * A specialized motion component for rotate animations.
 *
 * @example
 * ```tsx
 * <MotionRotate>
 *   <div>Content that rotates in</div>
 * </MotionRotate>
 * ```
 *
 * @example
 * ```tsx
 * <MotionRotate
 *   duration="slow"
 *   delay={0.2}
 *   initial={false}
 * >
 *   <div>Content with custom timing</div>
 * </MotionRotate>
 * ```
 */

import { motion, type Transition } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

import { buildGestureLayoutProps, type GestureLayoutProps } from './motionPropsHelpers';
import type { MotionRotateProps } from './motionTypes';
import { getMotionDuration, getMotionEasing } from './motionUtils';
import { rotateVariants } from './rotateVariants';

/**
 * Get initial state for rotate animation
 */
function getRotateInitialState(
	initial: boolean | 'hidden' | 'visible'
): 'hidden' | 'visible' | boolean {
	if (initial === true) return 'visible';
	if (initial === false) return 'hidden';
	return initial;
}

/**
 * Build transition configuration for rotate animation
 */
function getRotateTransition(
	duration: MotionRotateProps['duration'],
	ease: MotionRotateProps['ease'],
	delay: MotionRotateProps['delay']
): Transition {
	return {
		duration: getMotionDuration(duration ?? 'normal'),
		ease: getMotionEasing(ease ?? 'ease-out'),
		delay: delay ?? 0,
	};
}

/**
 * Extract gesture and layout props from component props
 */
function extractGestureLayoutProps(props: Readonly<MotionRotateProps>): GestureLayoutProps {
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
 * MotionRotate component
 */
export function MotionRotate(props: Readonly<MotionRotateProps>) {
	const {
		duration = 'normal',
		ease = 'ease-out',
		delay = 0,
		initial = false,
		className,
		children,
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

	return (
		<motion.div
			className={twMerge(className)}
			initial={getRotateInitialState(initial)}
			animate="visible"
			exit="exit"
			variants={rotateVariants}
			transition={getRotateTransition(duration, ease, delay)}
			{...buildGestureLayoutProps(gestureLayoutProps)}
			{...restProps}
		>
			{children}
		</motion.div>
	);
}
