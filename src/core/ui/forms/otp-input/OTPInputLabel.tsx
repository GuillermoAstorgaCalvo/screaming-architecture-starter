import Label from '@core/ui/label/Label';

import type { OTPInputLabelProps } from './OTPInputTypes';

export function OTPInputLabel({ id, label, required }: Readonly<OTPInputLabelProps>) {
	return (
		<Label htmlFor={id} required={required ?? false} size="sm">
			{label}
		</Label>
	);
}
