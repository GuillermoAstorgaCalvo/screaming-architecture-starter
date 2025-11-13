import type { RangeSliderLabelProps } from '@core/ui/forms/range-slider/types/RangeSliderTypes';
import Label from '@core/ui/label/Label';

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
