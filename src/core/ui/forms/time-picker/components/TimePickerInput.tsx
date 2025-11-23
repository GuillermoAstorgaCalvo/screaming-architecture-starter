import type { TimePickerInputProps } from '@core/ui/forms/time-picker/types/TimePickerTypes';

interface TimePickerInputComponentProps {
	readonly id: string | undefined;
	readonly timePickerClasses: string;
	readonly ariaDescribedBy: string | undefined;
	readonly required: boolean | undefined;
	readonly disabled: boolean | undefined;
	readonly error?: string | undefined;
	readonly inputProps: Readonly<TimePickerInputProps>;
}

export function TimePickerInput({
	id,
	timePickerClasses,
	ariaDescribedBy,
	required,
	disabled,
	error,
	inputProps,
}: Readonly<TimePickerInputComponentProps>) {
	return (
		<input
			id={id}
			type="time"
			className={timePickerClasses}
			disabled={disabled}
			required={required}
			aria-describedby={ariaDescribedBy}
			aria-invalid={error ? 'true' : undefined}
			{...inputProps}
		/>
	);
}
