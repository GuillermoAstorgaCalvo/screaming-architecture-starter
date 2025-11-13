import {
	calculatePercentage,
	getThumbOffset,
} from '@core/ui/forms/range-slider/helpers/RangeSliderHelpers';
import { type RefObject, useEffect, useRef, useState } from 'react';

export interface UseRangeValueReturn {
	readonly isControlled: boolean;
	readonly safeMinValue: number;
	readonly safeMaxValue: number;
	readonly setInternalValue: (value: [number, number]) => void;
}

export function useRangeValue({
	value,
	defaultValue,
	min,
	max,
}: Readonly<{
	value?: [number, number] | undefined;
	defaultValue?: [number, number] | undefined;
	min: number;
	max: number;
}>): UseRangeValueReturn {
	const isControlled = value !== undefined;
	const [internalValue, setInternalValue] = useState<[number, number]>(defaultValue ?? [min, max]);

	const currentValue = isControlled ? value : internalValue;
	const [minValue, maxValue] = currentValue;

	const safeMinValue = Math.min(minValue, maxValue);
	const safeMaxValue = Math.max(minValue, maxValue);

	return {
		isControlled,
		safeMinValue,
		safeMaxValue,
		setInternalValue,
	};
}

export interface UseRangeCalculationsReturn {
	readonly minPercentage: number;
	readonly maxPercentage: number;
	readonly minThumbOffset: string;
	readonly maxThumbOffset: string;
	readonly activeTrackLeft: number;
	readonly activeTrackWidth: number;
}

export function useRangeCalculations({
	safeMinValue,
	safeMaxValue,
	min,
	max,
}: Readonly<{
	safeMinValue: number;
	safeMaxValue: number;
	min: number;
	max: number;
}>): UseRangeCalculationsReturn {
	const minPercentage = calculatePercentage(safeMinValue, min, max);
	const maxPercentage = calculatePercentage(safeMaxValue, min, max);

	const minThumbOffset = getThumbOffset(minPercentage);
	const maxThumbOffset = getThumbOffset(maxPercentage);

	const activeTrackLeft = minPercentage;
	const activeTrackWidth = maxPercentage - minPercentage;

	return {
		minPercentage,
		maxPercentage,
		minThumbOffset,
		maxThumbOffset,
		activeTrackLeft,
		activeTrackWidth,
	};
}

export function useRangeInputRefs(
	minPercentage: number,
	maxPercentage: number
): [RefObject<HTMLInputElement | null>, RefObject<HTMLInputElement | null>] {
	const minInputRef = useRef<HTMLInputElement | null>(null);
	const maxInputRef = useRef<HTMLInputElement | null>(null);

	useEffect(() => {
		if (minInputRef.current) {
			minInputRef.current.style.setProperty('--slider-progress', `${minPercentage}%`);
		}
		if (maxInputRef.current) {
			maxInputRef.current.style.setProperty('--slider-progress', `${maxPercentage}%`);
		}
	}, [minPercentage, maxPercentage]);

	return [minInputRef, maxInputRef];
}

interface UseRangeValueStateParams {
	readonly value?: [number, number] | undefined;
	readonly defaultValue?: [number, number] | undefined;
	readonly min: number;
	readonly max: number;
}

export function useRangeValueState({
	value,
	defaultValue,
	min,
	max,
}: Readonly<UseRangeValueStateParams>): UseRangeValueReturn {
	return useRangeValue({ value, defaultValue, min, max });
}

interface UseRangeDerivedStateParams {
	readonly safeMinValue: number;
	readonly safeMaxValue: number;
	readonly min: number;
	readonly max: number;
}

export interface UseRangeDerivedStateReturn {
	readonly calculations: UseRangeCalculationsReturn;
	readonly minInputRef: RefObject<HTMLInputElement | null>;
	readonly maxInputRef: RefObject<HTMLInputElement | null>;
}

export function useRangeDerivedState({
	safeMinValue,
	safeMaxValue,
	min,
	max,
}: Readonly<UseRangeDerivedStateParams>): UseRangeDerivedStateReturn {
	const calculations = useRangeCalculations({
		safeMinValue,
		safeMaxValue,
		min,
		max,
	});
	const [minInputRef, maxInputRef] = useRangeInputRefs(
		calculations.minPercentage,
		calculations.maxPercentage
	);

	return {
		calculations,
		minInputRef,
		maxInputRef,
	};
}
