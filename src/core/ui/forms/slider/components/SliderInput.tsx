import { calculatePercentage } from '@core/ui/forms/slider/helpers/SliderHelpers';
import type { SliderInputProps } from '@core/ui/forms/slider/types/SliderTypes';
import { type RefObject, useEffect, useRef } from 'react';

interface SliderInputComponentProps {
	readonly id: string | undefined;
	readonly ariaDescribedBy: string | undefined;
	readonly required: boolean | undefined;
	readonly disabled: boolean | undefined;
	readonly min: number;
	readonly max: number;
	readonly step?: number | undefined;
	readonly value?: number | undefined;
	readonly defaultValue?: number | undefined;
	readonly thumbClasses: string;
	readonly inputProps: Readonly<SliderInputProps>;
}

function getThumbOffset(percentage: number): string {
	if (percentage === 0) return '0px';
	if (percentage === 100) return '100%';
	return '50%';
}

interface RangeInputProps {
	readonly inputRef: RefObject<HTMLInputElement | null>;
	readonly id: string | undefined;
	readonly ariaDescribedBy: string | undefined;
	readonly required: boolean | undefined;
	readonly disabled: boolean | undefined;
	readonly min: number;
	readonly max: number;
	readonly step?: number | undefined;
	readonly value?: number | undefined;
	readonly defaultValue?: number | undefined;
	readonly inputProps: Readonly<SliderInputProps>;
}

function RangeInput({
	inputRef,
	id,
	ariaDescribedBy,
	required,
	disabled,
	min,
	max,
	step,
	value,
	defaultValue,
	inputProps,
}: Readonly<RangeInputProps>) {
	return (
		<input
			ref={inputRef}
			id={id}
			type="range"
			min={min}
			max={max}
			step={step}
			value={value}
			defaultValue={defaultValue}
			disabled={disabled}
			required={required}
			aria-describedby={ariaDescribedBy}
			className="sr-only"
			{...inputProps}
		/>
	);
}

export function SliderInput(props: Readonly<SliderInputComponentProps>) {
	const inputRef = useRef<HTMLInputElement | null>(null);
	const currentValue = props.value ?? props.defaultValue ?? props.min;
	const percentage = calculatePercentage(currentValue, props.min, props.max);
	const thumbOffset = getThumbOffset(percentage);

	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.style.setProperty('--slider-progress', `${percentage}%`);
		}
	}, [percentage]);

	return (
		<>
			<RangeInput inputRef={inputRef} {...props} />
			<div
				className={props.thumbClasses}
				style={{ left: `calc(${percentage}% - ${thumbOffset})` }}
				aria-hidden="true"
			/>
		</>
	);
}
