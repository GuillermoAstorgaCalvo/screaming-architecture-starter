import Label from '@core/ui/label/Label';

import type { NumberInputLabelProps } from './NumberInputTypes';

export function NumberInputLabel({ id, label, required }: Readonly<NumberInputLabelProps>) {
	return (
		<Label htmlFor={id} required={required ?? false} size="sm">
			{label}
		</Label>
	);
}
