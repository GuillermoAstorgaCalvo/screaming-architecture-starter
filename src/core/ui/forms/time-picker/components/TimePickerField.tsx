import { TimePickerInput } from '@core/ui/forms/time-picker/components/TimePickerInput';
import type { TimePickerFieldProps } from '@core/ui/forms/time-picker/types/TimePickerTypes';

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
