/**
 * Scale props helpers
 * Functions for building motion props for scale animations
 */

import { buildGestureLayoutProps } from '@core/ui/utilities/motion/helpers/motionPropsHelpers';
import type { MotionScaleProps } from '@core/ui/utilities/motion/types/motionTypes';
import type { MotionProps } from 'framer-motion';

import { extractScaleConfig } from './scaleConfig';
import { buildScaleAnimateState, buildScaleExitState, getScaleInitialState } from './scaleState';
import { buildScaleTransition } from './scaleTransition';

/**
 * Gesture and layout props extracted from component props
 */
export interface GestureLayoutProps {
	layout?: MotionScaleProps['layout'];
	layoutId?: MotionScaleProps['layoutId'];
	whileHover?: MotionScaleProps['whileHover'];
	whileTap?: MotionScaleProps['whileTap'];
	drag?: MotionScaleProps['drag'];
	dragConstraints?: MotionScaleProps['dragConstraints'];
	dragElastic?: MotionScaleProps['dragElastic'];
	dragMomentum?: MotionScaleProps['dragMomentum'];
	dragTransition?: MotionScaleProps['dragTransition'];
	onDragStart?: MotionScaleProps['onDragStart'];
	onDragEnd?: MotionScaleProps['onDragEnd'];
}

/**
 * Motion props for scale animation
 */
export interface ScaleMotionProps {
	initial: ReturnType<typeof getScaleInitialState>;
	animate: ReturnType<typeof buildScaleAnimateState>;
	exit: ReturnType<typeof buildScaleExitState>;
	transition: ReturnType<typeof buildScaleTransition>;
}

/**
 * All motion-related props for the component
 */
export interface AllMotionProps {
	motionProps: ScaleMotionProps;
	gestureProps: Partial<
		Pick<
			MotionProps,
			| 'layout'
			| 'layoutId'
			| 'whileHover'
			| 'whileTap'
			| 'drag'
			| 'dragConstraints'
			| 'dragElastic'
			| 'dragMomentum'
			| 'dragTransition'
			| 'onDragStart'
			| 'onDragEnd'
		>
	>;
}

/**
 * Extract gesture and layout props from component props
 */
export function extractGestureLayoutProps(props: Readonly<MotionScaleProps>): GestureLayoutProps {
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
 * Build motion props for scale animation
 */
export function buildScaleMotionProps(config: {
	initialState: ReturnType<typeof getScaleInitialState>;
	finalScale: number;
	initialScale: number;
	duration: MotionScaleProps['duration'];
	ease: MotionScaleProps['ease'];
	delay: MotionScaleProps['delay'];
}): ScaleMotionProps {
	const { initialState, finalScale, initialScale, duration, ease, delay } = config;

	const transition = buildScaleTransition({ duration, ease, delay });
	const animate = buildScaleAnimateState(finalScale);
	const exit = buildScaleExitState(initialScale);

	return {
		initial: initialState,
		animate,
		exit,
		transition,
	};
}

/**
 * Build all motion-related props for the component
 */
export function buildAllMotionProps(props: Readonly<MotionScaleProps>): AllMotionProps {
	const config = extractScaleConfig(props);
	const { initialScale, finalScale, duration, ease, delay, initial } = config;

	const initialState = getScaleInitialState(initial, initialScale);
	const gestureLayoutProps = extractGestureLayoutProps(props);

	const motionProps = buildScaleMotionProps({
		initialState,
		finalScale,
		initialScale,
		duration,
		ease,
		delay,
	});

	const gestureProps = buildGestureLayoutProps(gestureLayoutProps);

	return {
		motionProps,
		gestureProps,
	};
}
