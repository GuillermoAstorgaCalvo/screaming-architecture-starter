import Label from '@core/ui/label/Label';

import type { RangeSliderLabelProps } from './RangeSliderTypes';

export function RangeSliderLabel({
	id,
	label,
	required,
	size = 'sm',
}: Readonly<RangeSliderLabelProps>) {
	return (
		<Label htmlFor={id} required={required ?? false} size={size}>
			{label}
		</Label>
	);
}
