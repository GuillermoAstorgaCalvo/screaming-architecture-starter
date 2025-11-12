import Label from '@core/ui/label/Label';

import type { DatePickerLabelProps } from './DatePickerTypes';

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
