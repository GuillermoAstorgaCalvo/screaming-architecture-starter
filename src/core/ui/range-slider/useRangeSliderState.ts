import type { ChangeEvent, RefObject } from 'react';

import { composeRangeSliderState, useRangeHandlers } from './useRangeSliderState.helpers';
import { useRangeDerivedState, useRangeValueState } from './useRangeSliderState.hooks';

export interface UseRangeSliderStateReturn {
	readonly safeMinValue: number;
	readonly safeMaxValue: number;
	readonly minPercentage: number;
	readonly maxPercentage: number;
	readonly minThumbOffset: string;
	readonly maxThumbOffset: string;
	readonly activeTrackLeft: number;
	readonly activeTrackWidth: number;
	readonly handleMinChange: (event: ChangeEvent<HTMLInputElement>) => void;
	readonly handleMaxChange: (event: ChangeEvent<HTMLInputElement>) => void;
	readonly minInputRef: RefObject<HTMLInputElement | null>;
	readonly maxInputRef: RefObject<HTMLInputElement | null>;
}

export function useRangeSliderState({
	value,
	defaultValue,
	min,
	max,
	onChange,
}: Readonly<{
	value?: [number, number] | undefined;
	defaultValue?: [number, number] | undefined;
	min: number;
	max: number;
	onChange?: ((value: [number, number]) => void) | undefined;
}>): UseRangeSliderStateReturn {
	const valueState = useRangeValueState({ value, defaultValue, min, max });

	const { calculations, minInputRef, maxInputRef } = useRangeDerivedState({
		safeMinValue: valueState.safeMinValue,
		safeMaxValue: valueState.safeMaxValue,
		min,
		max,
	});

	const handlers = useRangeHandlers({
		isControlled: valueState.isControlled,
		safeMinValue: valueState.safeMinValue,
		safeMaxValue: valueState.safeMaxValue,
		min,
		max,
		setInternalValue: valueState.setInternalValue,
		onChange,
	});

	return composeRangeSliderState({
		valueState,
		calculations,
		handlers,
		minInputRef,
		maxInputRef,
	});
}
