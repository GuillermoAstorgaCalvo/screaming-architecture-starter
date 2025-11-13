import type { DatePickerInputProps } from '@core/ui/forms/date-picker/types/DatePickerTypes';

interface DatePickerInputComponentProps {
	readonly id: string | undefined;
	readonly datePickerClasses: string;
	readonly ariaDescribedBy: string | undefined;
	readonly required: boolean | undefined;
	readonly disabled: boolean | undefined;
	readonly inputProps: Readonly<DatePickerInputProps>;
}

export function DatePickerInput({
	id,
	datePickerClasses,
	ariaDescribedBy,
	required,
	disabled,
	inputProps,
}: Readonly<DatePickerInputComponentProps>) {
	return (
		<input
			id={id}
			type="date"
			className={datePickerClasses}
			disabled={disabled}
			required={required}
			aria-describedby={ariaDescribedBy}
			{...inputProps}
		/>
	);
}
