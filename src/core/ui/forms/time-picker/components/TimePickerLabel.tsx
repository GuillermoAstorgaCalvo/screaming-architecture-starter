import type { TimePickerLabelProps } from '@core/ui/forms/time-picker/types/TimePickerTypes';
import Label from '@core/ui/label/Label';

export function TimePickerLabel({
	id,
	label,
	required,
	size = 'sm',
}: Readonly<TimePickerLabelProps>) {
	return (
		<Label htmlFor={id} required={required ?? false} size={size}>
			{label}
		</Label>
	);
}
