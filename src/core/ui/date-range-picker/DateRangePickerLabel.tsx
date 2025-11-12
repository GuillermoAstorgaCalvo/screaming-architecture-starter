import Label from '@core/ui/label/Label';

import type { DateRangePickerLabelProps } from './DateRangePickerTypes';

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
