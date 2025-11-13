import Label from '@core/ui/label/Label';

import type { SliderLabelProps } from './SliderTypes';

export function SliderLabel({ id, label, required, size = 'sm' }: Readonly<SliderLabelProps>) {
	return (
		<Label htmlFor={id} required={required ?? false} size={size}>
			{label}
		</Label>
	);
}
