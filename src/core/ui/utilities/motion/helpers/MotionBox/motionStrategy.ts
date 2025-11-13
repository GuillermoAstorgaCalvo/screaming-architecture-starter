import { getInitialState } from '@core/ui/utilities/motion/helpers/motionStateHelpers';
import { getVariant } from '@core/ui/utilities/motion/helpers/motionVariantHelpers';
import type { useMotionConfig } from '@core/ui/utilities/motion/hooks/useMotionConfig';
import type { MotionBoxProps, MotionRepeat } from '@core/ui/utilities/motion/types/motionTypes';
import {
	REDUCED_FADE_VARIANTS,
	STATIC_VARIANTS,
	withInstantTransitions,
} from '@core/ui/utilities/motion/variants/reducedMotionVariants';

type MotionConfig = ReturnType<typeof useMotionConfig>;
export type EffectiveStrategy = ReturnType<MotionConfig['resolveReducedMotionStrategy']>;
export type TransitionFactory = MotionConfig['createTransition'];
export type MotionTransition = ReturnType<TransitionFactory>;

interface TransitionParams {
	strategy: EffectiveStrategy;
	duration: MotionBoxProps['duration'];
	ease: MotionBoxProps['ease'];
	delay: MotionBoxProps['delay'];
	createTransition: TransitionFactory;
}

export interface MotionStrategyResolution {
	variants: ReturnType<typeof getVariant>;
	initialState: ReturnType<typeof getInitialState>;
	transition: MotionTransition;
	repeat: MotionRepeat;
}

function selectBaseVariants(strategy: EffectiveStrategy, variant: MotionBoxProps['variant']) {
	if (strategy === 'skip') {
		return STATIC_VARIANTS;
	}

	if (strategy === 'fade') {
		return REDUCED_FADE_VARIANTS;
	}

	return getVariant(variant ?? 'fade');
}

function selectVariants(strategy: EffectiveStrategy, baseVariants: ReturnType<typeof getVariant>) {
	return strategy === 'static' ? withInstantTransitions(baseVariants) : baseVariants;
}

function selectInitialState(strategy: EffectiveStrategy, initial: MotionBoxProps['initial']) {
	return strategy === 'skip' ? 'visible' : getInitialState(initial ?? false);
}

function selectRepeat(strategy: EffectiveStrategy, repeat: MotionBoxProps['repeat']): MotionRepeat {
	return strategy === 'normal' ? (repeat ?? false) : false;
}

function resolveTransitionDuration(
	strategy: EffectiveStrategy,
	duration: MotionBoxProps['duration']
) {
	if (strategy === 'fade') {
		return 'micro';
	}

	if (strategy === 'static' || strategy === 'skip') {
		return 'instant';
	}

	return duration ?? 'normal';
}

function buildTransition({ strategy, duration, ease, delay, createTransition }: TransitionParams) {
	const resolvedDuration = resolveTransitionDuration(strategy, duration);
	const resolvedEase = strategy === 'fade' ? 'ease-out' : (ease ?? 'ease-out');
	const resolvedDelay = strategy === 'skip' || strategy === 'static' ? 0 : (delay ?? 0);

	return createTransition({
		duration: resolvedDuration,
		ease: resolvedEase,
		delay: resolvedDelay,
	});
}

export function resolveMotionStrategy(
	params: Readonly<{
		strategy: EffectiveStrategy;
		variant: MotionBoxProps['variant'];
		duration: MotionBoxProps['duration'];
		ease: MotionBoxProps['ease'];
		delay: MotionBoxProps['delay'];
		initial: MotionBoxProps['initial'];
		repeat: MotionBoxProps['repeat'];
		createTransition: TransitionFactory;
	}>
): MotionStrategyResolution {
	const { strategy, variant, duration, ease, delay, initial, repeat, createTransition } = params;

	const baseVariants = selectBaseVariants(strategy, variant);
	const variants = selectVariants(strategy, baseVariants);
	const initialState = selectInitialState(strategy, initial);
	const transition = buildTransition({
		strategy,
		duration,
		ease,
		delay,
		createTransition,
	});
	const resolvedRepeat = selectRepeat(strategy, repeat);

	return { variants, initialState, transition, repeat: resolvedRepeat };
}
