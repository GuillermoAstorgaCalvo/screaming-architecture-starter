import Label from '@core/ui/label/Label';

import type { ColorInputLabelProps } from './ColorInputTypes';

export function ColorInputLabel({ id, label, required }: Readonly<ColorInputLabelProps>) {
	return (
		<Label htmlFor={id} required={required ?? false} size="sm">
			{label}
		</Label>
	);
}
