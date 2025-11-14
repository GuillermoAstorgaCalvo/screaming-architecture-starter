/**
 * Prop extractors for MotionScale
 * Functions for extracting render-specific and rest props
 */

import type { MotionScaleProps } from '@core/ui/utilities/motion/types/motionTypes';

type RenderPropKeys = 'className' | 'children';
type ScalePropKeys = 'initialScale' | 'finalScale' | 'duration' | 'ease' | 'delay';
type GesturePropKeys =
	| 'initial'
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
	| 'onDragEnd';

type WithoutRenderProps = Omit<MotionScaleProps, RenderPropKeys>;
type WithoutScaleProps = Omit<WithoutRenderProps, ScalePropKeys>;
type WithoutGestureProps = Omit<WithoutScaleProps, GesturePropKeys>;

function removeRenderProps(props: Readonly<MotionScaleProps>): WithoutRenderProps {
	const { className: _className, children: _children, ...rest } = props;
	return rest;
}

function removeScaleProps(props: WithoutRenderProps): WithoutScaleProps {
	const {
		initialScale: _initialScale,
		finalScale: _finalScale,
		duration: _duration,
		ease: _ease,
		delay: _delay,
		...rest
	} = props;
	return rest;
}

function removeGestureProps(props: WithoutScaleProps): WithoutGestureProps {
	const {
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
		...rest
	} = props;
	return rest;
}

/**
 * Render-specific props (className and children)
 */
export interface RenderProps {
	className?: string | undefined;
	children?: MotionScaleProps['children'] | undefined;
}

/**
 * Extract render-specific props (className and children)
 */
export function extractRenderProps(props: Readonly<MotionScaleProps>): RenderProps {
	const { className, children } = props;
	return { className, children };
}

/**
 * Extract rest props (excluding scale, gesture, and render props)
 */

export function extractRestProps(props: Readonly<MotionScaleProps>): WithoutGestureProps {
	const propsWithoutRender = removeRenderProps(props);
	const propsWithoutScale = removeScaleProps(propsWithoutRender);
	return removeGestureProps(propsWithoutScale);
}
