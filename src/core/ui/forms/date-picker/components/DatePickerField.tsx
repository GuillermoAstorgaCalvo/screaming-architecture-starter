import { DatePickerInput } from '@core/ui/forms/date-picker/components/DatePickerInput';
import type { DatePickerFieldProps } from '@core/ui/forms/date-picker/types/DatePickerTypes';

export function DatePickerField(props: Readonly<DatePickerFieldProps>) {
	const { id, datePickerClasses, ariaDescribedBy, disabled, required, props: inputProps } = props;

	return (
		<DatePickerInput
			id={id}
			datePickerClasses={datePickerClasses}
			ariaDescribedBy={ariaDescribedBy}
			required={required}
			disabled={disabled}
			inputProps={inputProps}
		/>
	);
}
