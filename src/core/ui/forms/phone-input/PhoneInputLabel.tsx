import Label from '@core/ui/label/Label';

import type { PhoneInputLabelProps } from './PhoneInputTypes';

export function PhoneInputLabel({ id, label, required }: Readonly<PhoneInputLabelProps>) {
	return (
		<Label htmlFor={id} required={required ?? false} size="sm">
			{label}
		</Label>
	);
}
