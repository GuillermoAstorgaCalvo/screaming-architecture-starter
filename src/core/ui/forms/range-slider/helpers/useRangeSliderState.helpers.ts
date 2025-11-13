import type { ChangeEvent, RefObject } from 'react';

import { clampValue } from './RangeSliderHelpers';
import type { UseRangeSliderStateReturn } from './useRangeSliderState';
import type { UseRangeCalculationsReturn, UseRangeValueReturn } from './useRangeSliderState.hooks';

export interface RangeSliderHandlers {
	readonly handleMinChange: (event: ChangeEvent<HTMLInputElement>) => void;
	readonly handleMaxChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

interface CreateMinChangeHandlerParams {
	readonly isControlled: boolean;
	readonly safeMaxValue: number;
	readonly min: number;
	readonly setInternalValue: (value: [number, number]) => void;
	readonly onChange?: ((value: [number, number]) => void) | undefined;
}

export function createMinChangeHandler({
	isControlled,
	safeMaxValue,
	min,
	setInternalValue,
	onChange,
}: Readonly<CreateMinChangeHandlerParams>) {
	return (event: ChangeEvent<HTMLInputElement>) => {
		const newMinValue = Number(event.target.value);
		const clampedMin = clampValue(newMinValue, min, safeMaxValue);
		const newValue: [number, number] = [clampedMin, safeMaxValue];

		if (isControlled) {
			onChange?.(newValue);
		} else {
			setInternalValue(newValue);
			onChange?.(newValue);
		}
	};
}

interface CreateMaxChangeHandlerParams {
	readonly isControlled: boolean;
	readonly safeMinValue: number;
	readonly max: number;
	readonly setInternalValue: (value: [number, number]) => void;
	readonly onChange?: ((value: [number, number]) => void) | undefined;
}

export function createMaxChangeHandler({
	isControlled,
	safeMinValue,
	max,
	setInternalValue,
	onChange,
}: Readonly<CreateMaxChangeHandlerParams>) {
	return (event: ChangeEvent<HTMLInputElement>) => {
		const newMaxValue = Number(event.target.value);
		const clampedMax = clampValue(newMaxValue, safeMinValue, max);
		const newValue: [number, number] = [safeMinValue, clampedMax];

		if (isControlled) {
			onChange?.(newValue);
		} else {
			setInternalValue(newValue);
			onChange?.(newValue);
		}
	};
}

export function useRangeChangeHandlers({
	isControlled,
	safeMinValue,
	safeMaxValue,
	min,
	max,
	setInternalValue,
	onChange,
}: Readonly<{
	isControlled: boolean;
	safeMinValue: number;
	safeMaxValue: number;
	min: number;
	max: number;
	setInternalValue: (value: [number, number]) => void;
	onChange?: ((value: [number, number]) => void) | undefined;
}>): RangeSliderHandlers {
	const handleMinChange = createMinChangeHandler({
		isControlled,
		safeMaxValue,
		min,
		setInternalValue,
		onChange,
	});

	const handleMaxChange = createMaxChangeHandler({
		isControlled,
		safeMinValue,
		max,
		setInternalValue,
		onChange,
	});

	return { handleMinChange, handleMaxChange };
}

export function useRangeHandlers({
	isControlled,
	safeMinValue,
	safeMaxValue,
	min,
	max,
	setInternalValue,
	onChange,
}: Readonly<{
	isControlled: boolean;
	safeMinValue: number;
	safeMaxValue: number;
	min: number;
	max: number;
	setInternalValue: (value: [number, number]) => void;
	onChange?: ((value: [number, number]) => void) | undefined;
}>): RangeSliderHandlers {
	return useRangeChangeHandlers({
		isControlled,
		safeMinValue,
		safeMaxValue,
		min,
		max,
		setInternalValue,
		onChange,
	});
}

export interface BuildRangeSliderStateReturnParams {
	readonly valueState: UseRangeValueReturn;
	readonly calculations: UseRangeCalculationsReturn;
	readonly handlers: RangeSliderHandlers;
	readonly minInputRef: RefObject<HTMLInputElement | null>;
	readonly maxInputRef: RefObject<HTMLInputElement | null>;
}

export function buildRangeSliderStateReturn(
	params: Readonly<BuildRangeSliderStateReturnParams>
): UseRangeSliderStateReturn {
	const { valueState, calculations, handlers, minInputRef, maxInputRef } = params;
	return {
		safeMinValue: valueState.safeMinValue,
		safeMaxValue: valueState.safeMaxValue,
		minPercentage: calculations.minPercentage,
		maxPercentage: calculations.maxPercentage,
		minThumbOffset: calculations.minThumbOffset,
		maxThumbOffset: calculations.maxThumbOffset,
		activeTrackLeft: calculations.activeTrackLeft,
		activeTrackWidth: calculations.activeTrackWidth,
		handleMinChange: handlers.handleMinChange,
		handleMaxChange: handlers.handleMaxChange,
		minInputRef,
		maxInputRef,
	};
}

export function composeRangeSliderState(
	params: Readonly<BuildRangeSliderStateReturnParams>
): UseRangeSliderStateReturn {
	return buildRangeSliderStateReturn(params);
}
