import { TimePickerInput } from './TimePickerInput';
import type { TimePickerFieldProps } from './TimePickerTypes';

export function TimePickerField(props: Readonly<TimePickerFieldProps>) {
	const { id, timePickerClasses, ariaDescribedBy, disabled, required, props: inputProps } = props;

	return (
		<TimePickerInput
			id={id}
			timePickerClasses={timePickerClasses}
			ariaDescribedBy={ariaDescribedBy}
			required={required}
			disabled={disabled}
			inputProps={inputProps}
		/>
	);
}
