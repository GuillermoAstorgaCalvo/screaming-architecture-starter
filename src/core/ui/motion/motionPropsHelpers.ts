/**
 * Motion props helpers
 * Functions for building motion props configuration
 */

import type { HTMLMotionProps, MotionProps, Variants } from 'framer-motion';

import type { InitialState } from './motionStateHelpers';
import type { BaseMotionProps, MotionBoxProps } from './motionTypes';

/**
 * Motion props configuration
 */
export interface MotionPropsConfig {
	variants: Variants;
	initialState: InitialState;
	customTransition: {
		duration: number;
		ease: readonly [number, number, number, number];
		delay: number;
	};
	repeat: boolean | number;
	repeatType: 'loop' | 'reverse' | 'mirror';
	props: Omit<
		MotionBoxProps,
		| 'variant'
		| 'duration'
		| 'ease'
		| 'delay'
		| 'initial'
		| 'repeat'
		| 'repeatType'
		| 'className'
		| 'children'
		| 'as'
	>;
}

/**
 * Gesture and layout props configuration
 */
export interface GestureLayoutProps {
	layout?: BaseMotionProps['layout'];
	layoutId?: BaseMotionProps['layoutId'];
	whileHover?: BaseMotionProps['whileHover'];
	whileTap?: BaseMotionProps['whileTap'];
	drag?: BaseMotionProps['drag'];
	dragConstraints?: BaseMotionProps['dragConstraints'];
	dragElastic?: BaseMotionProps['dragElastic'];
	dragMomentum?: BaseMotionProps['dragMomentum'];
	dragTransition?: BaseMotionProps['dragTransition'];
	onDragStart?: BaseMotionProps['onDragStart'];
	onDragEnd?: BaseMotionProps['onDragEnd'];
}

/**
 * Get all gesture and layout prop keys
 */
function getGestureLayoutKeys(): Array<keyof GestureLayoutProps> {
	return [
		'layout',
		'layoutId',
		'whileHover',
		'whileTap',
		'drag',
		'dragConstraints',
		'dragElastic',
		'dragMomentum',
		'dragTransition',
		'onDragStart',
		'onDragEnd',
	];
}

/**
 * Filter defined properties from an object
 */
function filterDefinedProps<T>(obj: T, keys: Array<keyof T>): Partial<T> {
	const result: Partial<T> = {};

	for (const key of keys) {
		if (obj[key] !== undefined) {
			result[key] = obj[key];
		}
	}

	return result;
}

/**
 * Build gesture and layout props
 */
export function buildGestureLayoutProps(
	props: GestureLayoutProps
): Partial<
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
> {
	const keys = getGestureLayoutKeys();
	return filterDefinedProps(props, keys) as Partial<
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
 * Build motion props configuration
 */
export function buildMotionProps(config: MotionPropsConfig): HTMLMotionProps<'div'> {
	const { variants, initialState, customTransition, repeat, repeatType, props } = config;
	return {
		initial: initialState,
		animate: 'visible',
		exit: 'exit',
		variants,
		transition: customTransition,
		...(repeat && {
			repeat: typeof repeat === 'number' ? repeat : Infinity,
			repeatType,
		}),
		...props,
	} as HTMLMotionProps<'div'>;
}
