import Label from '@core/ui/label/Label';

import type { TimePickerLabelProps } from './TimePickerTypes';

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
