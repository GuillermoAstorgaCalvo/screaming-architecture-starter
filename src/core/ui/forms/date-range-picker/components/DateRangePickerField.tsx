import { DateRangePickerInput } from '@core/ui/forms/date-range-picker/components/DateRangePickerInput';
import type { DateRangePickerFieldProps } from '@core/ui/forms/date-range-picker/types/DateRangePickerTypes';

export function DateRangePickerField(props: Readonly<DateRangePickerFieldProps>) {
	const {
		id,
		datePickerClasses,
		ariaDescribedBy,
		disabled,
		required,
		props: inputProps,
		label,
	} = props;

	return (
		<div className="flex flex-col gap-1">
			{label && id ? (
				<label htmlFor={id} className="text-sm font-medium text-foreground">
					{label}
				</label>
			) : null}
			<DateRangePickerInput
				id={id}
				datePickerClasses={datePickerClasses}
				ariaDescribedBy={ariaDescribedBy}
				required={required}
				disabled={disabled}
				inputProps={inputProps}
			/>
		</div>
	);
}
