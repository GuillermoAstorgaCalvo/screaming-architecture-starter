import Input from '@core/ui/input/Input';
import type { InputProps } from '@src-types/ui/forms';
import type { ChangeEvent } from 'react';

type DateLike = string | Date | null | undefined;

const ISO_DATE_LENGTH = 10;

function transformDate(value: DateLike): string | undefined {
	if (!value) {
		return undefined;
	}

	if (value instanceof Date && !Number.isNaN(value.getTime())) {
		return value.toISOString().slice(0, ISO_DATE_LENGTH);
	}

	if (typeof value === 'string' && value.trim().length > 0) {
		return value.slice(0, ISO_DATE_LENGTH);
	}

	return undefined;
}

export interface DatePickerProps
	extends Omit<InputProps, 'type' | 'value' | 'onChange' | 'min' | 'max' | 'rightIcon'> {
	readonly value?: string;
	readonly onChange?: (value: string) => void;
	readonly onDateChange?: (value: Date | null) => void;
	readonly minDate?: DateLike;
	readonly maxDate?: DateLike;
	readonly allowManualInput?: boolean;
	readonly inputOnChange?: InputProps['onChange'];
}

export default function DatePicker({
	value,
	onChange,
	onDateChange,
	minDate,
	maxDate,
	allowManualInput = true,
	inputOnChange,
	disabled,
	...rest
}: Readonly<DatePickerProps>) {
	const minValue = transformDate(minDate);
	const maxValue = transformDate(maxDate);
	const inputValue = transformDate(value) ?? '';

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		const nextValue = event.target.value;
		onChange?.(nextValue);

		if (onDateChange) {
			onDateChange(nextValue ? new Date(`${nextValue}T00:00:00`) : null);
		}

		inputOnChange?.(event);
	};

	return (
		<Input
			{...rest}
			type="date"
			value={inputValue}
			onChange={handleChange}
			min={minValue}
			max={maxValue}
			inputMode={allowManualInput ? 'numeric' : undefined}
			pattern={allowManualInput ? String.raw`\d{4}-\d{2}-\d{2}` : undefined}
			disabled={disabled}
		/>
	);
}
