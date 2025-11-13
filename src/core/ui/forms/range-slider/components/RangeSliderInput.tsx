import { RangeSliderElements } from '@core/ui/forms/range-slider/components/RangeSliderComponents';
import { useRangeSliderState } from '@core/ui/forms/range-slider/hooks/useRangeSliderState';
import type { RangeSliderInputProps } from '@core/ui/forms/range-slider/types/RangeSliderTypes';

interface RangeSliderInputComponentProps {
	readonly minId: string | undefined;
	readonly maxId: string | undefined;
	readonly ariaDescribedBy: string | undefined;
	readonly required: boolean | undefined;
	readonly disabled: boolean | undefined;
	readonly min: number;
	readonly max: number;
	readonly step?: number | undefined;
	readonly value?: [number, number] | undefined;
	readonly defaultValue?: [number, number] | undefined;
	readonly thumbClasses: string;
	readonly inputProps: Readonly<RangeSliderInputProps>;
	readonly onChange?: ((value: [number, number]) => void) | undefined;
}

export function RangeSliderInput(props: Readonly<RangeSliderInputComponentProps>) {
	const {
		minId,
		maxId,
		ariaDescribedBy,
		required,
		disabled,
		min,
		max,
		step,
		value,
		defaultValue,
		thumbClasses,
		inputProps,
		onChange,
	} = props;

	const state = useRangeSliderState({
		value,
		defaultValue,
		min,
		max,
		onChange,
	});

	return (
		<RangeSliderElements
			state={state}
			minId={minId}
			maxId={maxId}
			min={min}
			max={max}
			step={step}
			disabled={disabled}
			required={required}
			ariaDescribedBy={ariaDescribedBy}
			thumbClasses={thumbClasses}
			inputProps={inputProps}
		/>
	);
}
