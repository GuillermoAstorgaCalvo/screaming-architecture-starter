import Label from '@core/ui/label/Label';

import type { CheckboxLabelProps } from './CheckboxTypes';

export function CheckboxLabel({ id, label, required, size = 'sm' }: Readonly<CheckboxLabelProps>) {
	return (
		<Label htmlFor={id} required={required ?? false} size={size}>
			{label}
		</Label>
	);
}
