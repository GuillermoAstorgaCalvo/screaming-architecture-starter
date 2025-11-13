import type { DateRangePickerLabelProps } from '@core/ui/forms/date-range-picker/types/DateRangePickerTypes';
import Label from '@core/ui/label/Label';

export function DateRangePickerLabel({
	id,
	label,
	required,
	size = 'sm',
}: Readonly<DateRangePickerLabelProps>) {
	return (
		<Label htmlFor={id} required={required ?? false} size={size}>
			{label}
		</Label>
	);
}
