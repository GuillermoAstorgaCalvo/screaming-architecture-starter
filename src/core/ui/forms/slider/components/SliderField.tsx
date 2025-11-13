import { SliderInput } from '@core/ui/forms/slider/components/SliderInput';
import type { SliderFieldProps } from '@core/ui/forms/slider/types/SliderTypes';

export function SliderField(props: Readonly<SliderFieldProps>) {
	const {
		id,
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
		props: inputProps,
	} = props;

	return (
		<div className={sliderClasses}>
			<div className={trackClasses} />
			<SliderInput
				id={id}
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
			/>
		</div>
	);
}
