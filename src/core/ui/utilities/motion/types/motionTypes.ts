/**
 * Motion component types
 * Type definitions for reusable motion components
 */

import type {
	MotionDurationToken,
	MotionEasingToken,
} from '@core/ui/utilities/motion/constants/motionConstants';
import type { HTMLMotionProps, MotionProps } from 'framer-motion';
import type { JSX, ReactNode } from 'react';

/**
 * Animation duration type
 */
export type MotionDuration = MotionDurationToken;

/**
 * Animation easing type
 */
export type MotionEasing = MotionEasingToken;

/**
 * Animation variant type
 */
export type MotionVariant =
	| 'fade'
	| 'slide'
	| 'slideRight'
	| 'slideTop'
	| 'slideBottom'
	| 'scale'
	| 'scaleUp'
	| 'rotate'
	| 'bounce'
	| 'shake'
	| 'blur'
	| 'height'
	| 'width';

/**
 * Initial state type
 */
export type MotionInitialState = boolean | 'hidden' | 'visible';

/**
 * Repeat type
 */
export type MotionRepeat = boolean | number;

/**
 * Repeat type option
 */
export type MotionRepeatType = 'loop' | 'reverse' | 'mirror';

/**
 * Reduced motion strategy options
 */
export type ReducedMotionStrategy = 'skip' | 'fade' | 'static';

/**
 * Base props for motion components
 */
export interface BaseMotionProps {
	/** Animation variant to use @default 'fade' */
	variant?: MotionVariant;
	/** Animation duration @default 'normal' */
	duration?: MotionDuration;
	/** Custom easing function */
	ease?: MotionEasing;
	/** Delay before animation starts (in seconds) */
	delay?: number;
	/** Whether to show the component initially @default false */
	initial?: MotionInitialState;
	/** Whether animation should repeat */
	repeat?: MotionRepeat;
	/** Animation repeat type */
	repeatType?: MotionRepeatType;
	/** Custom className */
	className?: string;
	/** Enable layout animations @default false */
	layout?: boolean | 'position' | 'size' | 'preserve-aspect';
	/** Layout ID for shared layout animations */
	layoutId?: string;
	/** Animation values when hovering */
	whileHover?: MotionProps['whileHover'];
	/** Animation values when tapping */
	whileTap?: MotionProps['whileTap'];
	/** Enable drag functionality */
	drag?: boolean | 'x' | 'y';
	/** Drag constraints */
	dragConstraints?: MotionProps['dragConstraints'];
	/** Drag elastic */
	dragElastic?: MotionProps['dragElastic'];
	/** Drag momentum */
	dragMomentum?: MotionProps['dragMomentum'];
	/** Drag transition */
	dragTransition?: MotionProps['dragTransition'];
	/** On drag start callback */
	onDragStart?: MotionProps['onDragStart'];
	/** On drag end callback */
	onDragEnd?: MotionProps['onDragEnd'];
	/** Strategy when reduced motion is requested @default 'fade' */
	reducedMotionStrategy?: ReducedMotionStrategy;
}

/**
 * HTML element type
 */
export type HTMLElementType = keyof JSX.IntrinsicElements;

/**
 * HTML motion props without animation control props
 */
type HTMLMotionPropsWithoutAnimation = Omit<
	HTMLMotionProps<'div'>,
	| 'initial'
	| 'animate'
	| 'exit'
	| 'children'
	| 'whileHover'
	| 'whileTap'
	| 'drag'
	| 'dragConstraints'
	| 'dragElastic'
	| 'dragMomentum'
	| 'dragTransition'
	| 'onDragStart'
	| 'onDragEnd'
	| 'layout'
	| 'layoutId'
>;

/**
 * Motion props without animation control props
 */
type MotionPropsWithoutAnimation = Omit<
	MotionProps,
	| 'initial'
	| 'animate'
	| 'exit'
	| 'children'
	| 'whileHover'
	| 'whileTap'
	| 'drag'
	| 'dragConstraints'
	| 'dragElastic'
	| 'dragMomentum'
	| 'dragTransition'
	| 'onDragStart'
	| 'onDragEnd'
	| 'layout'
	| 'layoutId'
>;

/**
 * HTML motion props without variants
 */
type HTMLMotionPropsWithoutVariants = Omit<
	HTMLMotionProps<'div'>,
	'initial' | 'animate' | 'variants'
>;

/**
 * Motion box props (extends motion.div)
 */
export interface MotionBoxProps extends BaseMotionProps, HTMLMotionPropsWithoutAnimation {
	/** HTML element to render as */
	as?: HTMLElementType;
	/** Children to animate */
	children?: ReactNode;
}

/**
 * Motion fade props
 */
export interface MotionFadeProps extends BaseMotionProps, MotionPropsWithoutAnimation {
	/** Children to animate */
	children?: ReactNode;
}

/**
 * Motion slide props
 */
export interface MotionSlideProps extends BaseMotionProps, MotionPropsWithoutAnimation {
	/** Direction to slide from */
	direction?: 'left' | 'right' | 'top' | 'bottom';
	/** Children to animate */
	children?: ReactNode;
}

/**
 * Motion scale props
 */
export interface MotionScaleProps extends BaseMotionProps, MotionPropsWithoutAnimation {
	/** Initial scale value @default 0.95 */
	initialScale?: number;
	/** Final scale value @default 1 */
	finalScale?: number;
	/** Children to animate */
	children?: ReactNode;
}

/**
 * Motion rotate props
 */
export interface MotionRotateProps extends BaseMotionProps, MotionPropsWithoutAnimation {
	/** Children to animate */
	children?: ReactNode;
}

/**
 * Motion blur props
 */
export interface MotionBlurProps extends BaseMotionProps, MotionPropsWithoutAnimation {
	/** Children to animate */
	children?: ReactNode;
}

/**
 * Motion shake props
 */
export interface MotionShakeProps extends BaseMotionProps, MotionPropsWithoutAnimation {
	/** Children to animate */
	children?: ReactNode;
}

/**
 * Motion stagger container props
 */
export interface MotionStaggerProps extends HTMLMotionPropsWithoutVariants {
	/** Stagger delay between children (in seconds) @default 0.1 */
	staggerDelay?: number;
	/** Delay before starting children animations (in seconds) @default 0.1 */
	delayChildren?: number;
	/** Children to animate with stagger effect */
	children: ReactNode;
	/** Custom className */
	className?: string;
	/** Strategy when reduced motion is requested @default 'static' */
	reducedMotionStrategy?: ReducedMotionStrategy;
}
