import Label from '@core/ui/label/Label';

import type { InputLabelProps } from './InputTypes';

export function InputLabel({ id, label, required }: Readonly<InputLabelProps>) {
	return (
		<Label htmlFor={id} required={required ?? false} size="sm">
			{label}
		</Label>
	);
}
