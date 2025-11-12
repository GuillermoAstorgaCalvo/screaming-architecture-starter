import { RangeSliderInput } from './RangeSliderInput';
import type { RangeSliderFieldProps } from './RangeSliderTypes';

export interface RangeSliderFieldPropsWithOnChange extends RangeSliderFieldProps {
	readonly onChange?: ((value: [number, number]) => void) | undefined;
}

export function RangeSliderField(props: Readonly<RangeSliderFieldPropsWithOnChange>) {
	const {
		minId,
		maxId,
		sliderClasses,
		trackClasses,
		thumbClasses,
		ariaDescribedBy,
		disabled,
		required,
		min,
		max,
		step,
		value,
		defaultValue,
		onChange,
		props: inputProps,
	} = props;

	return (
		<div className={sliderClasses}>
			<div className={trackClasses} />
			<RangeSliderInput
				minId={minId}
				maxId={maxId}
				ariaDescribedBy={ariaDescribedBy}
				required={required}
				disabled={disabled}
				min={min}
				max={max}
				step={step}
				value={value}
				defaultValue={defaultValue}
				thumbClasses={thumbClasses}
				inputProps={inputProps}
				onChange={onChange ?? undefined}
			/>
		</div>
	);
}
