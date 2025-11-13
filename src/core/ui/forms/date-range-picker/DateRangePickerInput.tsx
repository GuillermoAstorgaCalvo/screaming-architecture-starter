import type { DateRangePickerInputProps } from './DateRangePickerTypes';

interface DateRangePickerInputComponentProps {
	readonly id: string | undefined;
	readonly datePickerClasses: string;
	readonly ariaDescribedBy: string | undefined;
	readonly required: boolean | undefined;
	readonly disabled: boolean | undefined;
	readonly inputProps: Readonly<DateRangePickerInputProps>;
	readonly label?: string | undefined;
}

export function DateRangePickerInput({
	id,
	datePickerClasses,
	ariaDescribedBy,
	required,
	disabled,
	inputProps,
}: Readonly<DateRangePickerInputComponentProps>) {
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
