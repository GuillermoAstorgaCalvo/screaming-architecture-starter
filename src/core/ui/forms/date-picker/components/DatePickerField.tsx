import { DatePickerInput } from './DatePickerInput';
import type { DatePickerFieldProps } from './DatePickerTypes';

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
