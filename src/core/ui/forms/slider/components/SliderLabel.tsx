import type { SliderLabelProps } from '@core/ui/forms/slider/types/SliderTypes';
import Label from '@core/ui/label/Label';

export function SliderLabel({ id, label, required, size = 'sm' }: Readonly<SliderLabelProps>) {
	return (
		<Label htmlFor={id} required={required ?? false} size={size}>
			{label}
		</Label>
	);
}
