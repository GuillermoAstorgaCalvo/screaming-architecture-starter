import {
	generateSliderId,
	getAriaDescribedBy,
	getSliderClasses,
	getSliderThumbClasses,
	getSliderTrackClasses,
} from '@core/ui/forms/slider/helpers/SliderHelpers';
import type { SliderContentProps, SliderInputProps } from '@core/ui/forms/slider/types/SliderTypes';
import type { StandardSize } from '@src-types/ui/base';
import type { SliderProps } from '@src-types/ui/forms-advanced';
import { useId } from 'react';

export interface UseSliderPropsOptions {
	readonly props: Readonly<SliderProps>;
}

export interface UseSliderPropsReturn {
	readonly contentProps: Readonly<SliderContentProps>;
}

interface UseSliderStateOptions {
	readonly sliderId?: string | undefined;
	readonly label?: string | undefined;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
	readonly size: StandardSize;
	readonly className?: string | undefined;
	readonly value?: number | undefined;
	readonly min?: number | undefined;
	readonly max?: number | undefined;
}

interface UseSliderStateReturn {
	readonly finalId: string | undefined;
	readonly sliderClasses: string;
	readonly trackClasses: string;
	readonly thumbClasses: string;
	readonly ariaDescribedBy: string | undefined;
}

/**
 * Hook to compute slider state (ID, ARIA attributes, and classes)
 */
function useSliderState({
	sliderId,
	label,
	error,
	helperText,
	size,
	className,
	value,
	min,
	max,
}: Readonly<UseSliderStateOptions>): UseSliderStateReturn {
	const generatedId = useId();
	const finalId = generateSliderId(generatedId, sliderId, label);
	const ariaDescribedBy = finalId ? getAriaDescribedBy(finalId, error, helperText) : undefined;

	const sliderClasses = getSliderClasses({
		size,
		className,
	});
	const trackClasses = getSliderTrackClasses({
		size,
	});
	const thumbClasses = getSliderThumbClasses({
		size,
		value,
		min,
		max,
	});

	return { finalId, sliderClasses, trackClasses, thumbClasses, ariaDescribedBy };
}

interface BuildSliderContentPropsOptions {
	readonly props: Readonly<SliderProps>;
	readonly state: UseSliderStateReturn;
	readonly fieldProps: Readonly<SliderInputProps>;
}

function buildSliderContentProps(
	options: Readonly<BuildSliderContentPropsOptions>
): SliderContentProps {
	const { props, state, fieldProps } = options;
	return {
		sliderId: state.finalId,
		sliderClasses: state.sliderClasses,
		trackClasses: state.trackClasses,
		thumbClasses: state.thumbClasses,
		ariaDescribedBy: state.ariaDescribedBy,
		label: props.label,
		error: props.error,
		helperText: props.helperText,
		required: props.required,
		fullWidth: props.fullWidth ?? false,
		disabled: props.disabled,
		min: props.min ?? 0,
		max: props.max ?? 100,
		step: props.step,
		value: props.value,
		defaultValue: props.defaultValue,
		fieldProps,
	};
}

/**
 * Hook to process Slider component props and return content props
 */
export function useSliderProps({ props }: Readonly<UseSliderPropsOptions>): UseSliderPropsReturn {
	const {
		label,
		error,
		helperText,
		size = 'md',
		sliderId,
		className,
		value,
		min,
		max,
		...rest
	} = props;

	const state = useSliderState({
		sliderId,
		label,
		error,
		helperText,
		size,
		className,
		value,
		min,
		max,
	});

	const fieldProps: Readonly<SliderInputProps> = rest;
	const contentProps = buildSliderContentProps({ props, state, fieldProps });

	return { contentProps };
}
