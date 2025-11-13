import type { ChangeEvent, RefObject } from 'react';

import type { RangeSliderInputProps } from './RangeSliderTypes';
import type { UseRangeSliderStateReturn } from './useRangeSliderState';

interface ActiveTrackProps {
	readonly left: number;
	readonly width: number;
}

export function ActiveTrack({ left, width }: Readonly<ActiveTrackProps>) {
	return (
		<div
			className="absolute top-1/2 -translate-y-1/2 rounded-full bg-blue-600 dark:bg-blue-500"
			style={{
				left: `${left}%`,
				width: `${width}%`,
				height: 'inherit',
			}}
			aria-hidden="true"
		/>
	);
}

interface RangeThumbProps {
	readonly percentage: number;
	readonly offset: string;
	readonly thumbClasses: string;
}

export function RangeThumb({ percentage, offset, thumbClasses }: Readonly<RangeThumbProps>) {
	return (
		<div
			className={thumbClasses}
			style={{ left: `calc(${percentage}% - ${offset})` }}
			aria-hidden="true"
		/>
	);
}

interface RangeInputElementProps {
	readonly inputRef: RefObject<HTMLInputElement | null>;
	readonly id: string | undefined;
	readonly value: number;
	readonly min: number;
	readonly max: number;
	readonly step?: number | undefined;
	readonly disabled: boolean | undefined;
	readonly required: boolean | undefined;
	readonly ariaDescribedBy: string | undefined;
	readonly onChange: (event: ChangeEvent<HTMLInputElement>) => void;
	readonly zIndex: number;
	readonly inputProps: Readonly<RangeSliderInputProps>;
}

export function RangeInputElement({
	inputRef,
	id,
	value,
	min,
	max,
	step,
	disabled,
	required,
	ariaDescribedBy,
	onChange,
	zIndex,
	inputProps,
}: Readonly<RangeInputElementProps>) {
	return (
		<input
			ref={inputRef}
			id={id}
			type="range"
			min={min}
			max={max}
			step={step}
			value={value}
			onChange={onChange}
			disabled={disabled}
			required={required}
			aria-describedby={ariaDescribedBy}
			aria-valuemin={min}
			aria-valuemax={max}
			aria-valuenow={value}
			className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
			style={{ pointerEvents: 'auto', zIndex }}
			{...(inputProps as Omit<typeof inputProps, 'value' | 'defaultValue'>)}
		/>
	);
}

interface RangeSliderInputsProps {
	readonly state: UseRangeSliderStateReturn;
	readonly minId: string | undefined;
	readonly maxId: string | undefined;
	readonly min: number;
	readonly max: number;
	readonly step?: number | undefined;
	readonly disabled: boolean | undefined;
	readonly required: boolean | undefined;
	readonly ariaDescribedBy: string | undefined;
	readonly inputProps: Readonly<RangeSliderInputProps>;
}

function RangeSliderInputs({
	state,
	minId,
	maxId,
	min,
	max,
	step,
	disabled,
	required,
	ariaDescribedBy,
	inputProps,
}: Readonly<RangeSliderInputsProps>) {
	const commonProps = { min, max, step, disabled, required, ariaDescribedBy, inputProps };

	return (
		<>
			<RangeInputElement
				{...commonProps}
				inputRef={state.minInputRef}
				id={minId}
				value={state.safeMinValue}
				onChange={state.handleMinChange}
				zIndex={20}
			/>
			<RangeInputElement
				{...commonProps}
				inputRef={state.maxInputRef}
				id={maxId}
				value={state.safeMaxValue}
				onChange={state.handleMaxChange}
				zIndex={30}
			/>
		</>
	);
}

interface RangeSliderElementsProps {
	readonly state: UseRangeSliderStateReturn;
	readonly minId: string | undefined;
	readonly maxId: string | undefined;
	readonly min: number;
	readonly max: number;
	readonly step?: number | undefined;
	readonly disabled: boolean | undefined;
	readonly required: boolean | undefined;
	readonly ariaDescribedBy: string | undefined;
	readonly thumbClasses: string;
	readonly inputProps: Readonly<RangeSliderInputProps>;
}

export function RangeSliderElements(props: Readonly<RangeSliderElementsProps>) {
	const { state, thumbClasses, ...sliderInputsProps } = props;

	return (
		<>
			<ActiveTrack left={state.activeTrackLeft} width={state.activeTrackWidth} />
			<RangeThumb
				percentage={state.minPercentage}
				offset={state.minThumbOffset}
				thumbClasses={thumbClasses}
			/>
			<RangeThumb
				percentage={state.maxPercentage}
				offset={state.maxThumbOffset}
				thumbClasses={thumbClasses}
			/>
			<RangeSliderInputs state={state} {...sliderInputsProps} />
		</>
	);
}
