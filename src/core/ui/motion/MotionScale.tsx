/**
 * MotionScale - Scale animation component
 *
 * A specialized motion component for scale animations.
 *
 * @example
 * ```tsx
 * <MotionScale>
 *   <div>Content that scales in</div>
 * </MotionScale>
 * ```
 *
 * @example
 * ```tsx
 * <MotionScale
 *   initialScale={0.8}
 *   finalScale={1}
 *   duration="slow"
 * >
 *   <div>Content with custom scale values</div>
 * </MotionScale>
 * ```
 */

import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

import { buildGestureLayoutProps } from './motionPropsHelpers';
import type { MotionScaleProps } from './motionTypes';
import { getMotionDuration, getMotionEasing } from './motionUtils';

/**
 * Get initial state for scale animation
 */
function getScaleInitialState(
	initial: boolean | 'hidden' | 'visible',
	initialScale: number
): 'hidden' | 'visible' | boolean | { opacity: number; scale: number } {
	if (initial === true) {
		return 'visible';
	}
	if (initial === false) {
		return {
			opacity: 0,
			scale: initialScale,
		};
	}
	return initial;
}

/**
 * Extract scale animation config from props
 */
function extractScaleConfig(props: Readonly<MotionScaleProps>) {
	const {
		initialScale = 0.95,
		finalScale = 1,
		duration = 'normal',
		ease = 'ease-out',
		delay = 0,
		initial = false,
	} = props;
	return { initialScale, finalScale, duration, ease, delay, initial };
}

/**
 * Extract gesture and layout props from component props
 */
function extractGestureLayoutProps(props: Readonly<MotionScaleProps>) {
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
 * Build transition configuration for scale animation
 */
function buildScaleTransition(config: {
	duration: MotionScaleProps['duration'];
	ease: MotionScaleProps['ease'];
	delay: MotionScaleProps['delay'];
}) {
	const { duration, ease, delay } = config;
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
 * Build animate state for scale animation
 */
function buildScaleAnimateState(finalScale: number) {
	return {
		opacity: 1,
		scale: finalScale,
	};
}

/**
 * Build exit state for scale animation
 */
function buildScaleExitState(initialScale: number) {
	return {
		opacity: 0,
		scale: initialScale,
	};
}

/**
 * Build motion props for scale animation
 */
function buildScaleMotionProps(config: {
	initialState: ReturnType<typeof getScaleInitialState>;
	finalScale: number;
	initialScale: number;
	duration: MotionScaleProps['duration'];
	ease: MotionScaleProps['ease'];
	delay: MotionScaleProps['delay'];
}) {
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
 * Extract render-specific props (className and children)
 */
function extractRenderProps(props: Readonly<MotionScaleProps>) {
	const { className, children } = props;
	return { className, children };
}

/**
 * Extract rest props (excluding scale, gesture, and render props)
 */
function extractRestProps(props: Readonly<MotionScaleProps>) {
	const {
		className: _className,
		children: _children,
		initialScale: _initialScale,
		finalScale: _finalScale,
		duration: _duration,
		ease: _ease,
		delay: _delay,
		initial: _initial,
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
	return restProps;
}

/**
 * Build all motion-related props for the component
 */
function buildAllMotionProps(props: Readonly<MotionScaleProps>) {
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

/**
 * MotionScale component
 */
export function MotionScale(props: Readonly<MotionScaleProps>) {
	const renderProps = extractRenderProps(props);
	const restProps = extractRestProps(props);
	const { motionProps, gestureProps } = buildAllMotionProps(props);

	return (
		<motion.div
			className={twMerge(renderProps.className)}
			{...motionProps}
			{...gestureProps}
			{...restProps}
		>
			{renderProps.children}
		</motion.div>
	);
}
