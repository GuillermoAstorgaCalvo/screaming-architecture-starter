import type { StandardSize } from '@src-types/ui/base';
import type { RangeSliderProps } from '@src-types/ui/forms-advanced';
import { useId } from 'react';

import {
	generateRangeSliderId,
	getAriaDescribedBy,
	getRangeSliderActiveTrackClasses,
	getRangeSliderClasses,
	getRangeSliderThumbClasses,
	getRangeSliderTrackClasses,
} from './RangeSliderHelpers';
import type { RangeSliderContentProps, RangeSliderInputProps } from './RangeSliderTypes';

export interface UseRangeSliderPropsOptions {
	readonly props: Readonly<RangeSliderProps>;
}

export interface UseRangeSliderPropsReturn {
	readonly contentProps: Readonly<RangeSliderContentProps>;
}

interface UseRangeSliderStateOptions {
	readonly rangeSliderId?: string | undefined;
	readonly label?: string | undefined;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
	readonly size: StandardSize;
	readonly className?: string | undefined;
	readonly value?: [number, number] | undefined;
	readonly min?: number | undefined;
	readonly max?: number | undefined;
}

interface UseRangeSliderStateReturn {
	readonly finalId: string | undefined;
	readonly sliderClasses: string;
	readonly trackClasses: string;
	readonly activeTrackClasses: string;
	readonly thumbClasses: string;
	readonly ariaDescribedBy: string | undefined;
}

/**
 * Hook to compute range slider state (ID, ARIA attributes, and classes)
 */
function useRangeSliderState({
	rangeSliderId,
	label,
	error,
	helperText,
	size,
	className,
}: Readonly<UseRangeSliderStateOptions>): UseRangeSliderStateReturn {
	const generatedId = useId();
	const finalId = generateRangeSliderId(generatedId, rangeSliderId, label);
	const ariaDescribedBy = finalId ? getAriaDescribedBy(finalId, error, helperText) : undefined;

	const sliderClasses = getRangeSliderClasses({
		size,
		className,
	});
	const trackClasses = getRangeSliderTrackClasses({
		size,
	});
	const activeTrackClasses = getRangeSliderActiveTrackClasses({
		size,
	});
	const thumbClasses = getRangeSliderThumbClasses({
		size,
	});

	return {
		finalId,
		sliderClasses,
		trackClasses,
		activeTrackClasses,
		thumbClasses,
		ariaDescribedBy,
	};
}

interface BuildRangeSliderContentPropsOptions {
	readonly props: Readonly<RangeSliderProps>;
	readonly state: UseRangeSliderStateReturn;
	readonly fieldProps: Readonly<RangeSliderInputProps>;
	readonly onChange?: ((value: [number, number]) => void) | undefined;
}

function buildRangeSliderContentProps(
	options: Readonly<BuildRangeSliderContentPropsOptions>
): RangeSliderContentProps {
	const { props, state, fieldProps, onChange } = options;
	return {
		rangeSliderId: state.finalId,
		sliderClasses: state.sliderClasses,
		trackClasses: state.trackClasses,
		activeTrackClasses: state.activeTrackClasses,
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
		onChange,
		fieldProps,
	};
}

/**
 * Hook to process RangeSlider component props and return content props
 */
export function useRangeSliderProps({
	props,
}: Readonly<UseRangeSliderPropsOptions>): UseRangeSliderPropsReturn {
	const {
		label,
		error,
		helperText,
		size = 'md',
		rangeSliderId,
		className,
		onChange,
		...rest
	} = props;

	const state = useRangeSliderState({
		rangeSliderId,
		label,
		error,
		helperText,
		size,
		className,
	});

	const fieldProps: Readonly<RangeSliderInputProps> = rest;
	const contentProps = buildRangeSliderContentProps({ props, state, fieldProps, onChange });

	return { contentProps };
}
