import type { DatePickerLabelProps } from '@core/ui/forms/date-picker/types/DatePickerTypes';
import Label from '@core/ui/label/Label';

export function DatePickerLabel({
	id,
	label,
	required,
	size = 'sm',
}: Readonly<DatePickerLabelProps>) {
	return (
		<Label htmlFor={id} required={required ?? false} size={size}>
			{label}
		</Label>
	);
}
