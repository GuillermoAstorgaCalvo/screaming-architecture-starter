import { buildMotionProps } from '@core/ui/utilities/motion/helpers/motionPropsHelpers';
import type { MotionBoxProps } from '@core/ui/utilities/motion/types/motionTypes';

import {
	type EffectiveStrategy,
	resolveMotionStrategy,
	type TransitionFactory,
} from './motionStrategy';

type MotionBoxInternalProps = Omit<
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
	| 'reducedMotionStrategy'
>;

export interface CreateMotionPropsParams {
	strategy: EffectiveStrategy;
	variant: MotionBoxProps['variant'];
	duration: MotionBoxProps['duration'];
	ease: MotionBoxProps['ease'];
	delay: MotionBoxProps['delay'];
	initial: MotionBoxProps['initial'];
	repeat: MotionBoxProps['repeat'];
	repeatType: MotionBoxProps['repeatType'];
	createTransition: TransitionFactory;
	props: MotionBoxInternalProps;
}

export type MotionBoxMotionProps = ReturnType<typeof buildMotionProps>;

export function createMotionProps(params: Readonly<CreateMotionPropsParams>) {
	const { strategy, repeatType, props, ...rest } = params;
	const { variants, initialState, transition, repeat } = resolveMotionStrategy({
		strategy,
		...rest,
	});

	return buildMotionProps({
		variants,
		initialState,
		customTransition: transition,
		repeat,
		repeatType: repeatType ?? 'loop',
		props,
	});
}
