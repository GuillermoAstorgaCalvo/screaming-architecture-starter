import type { PhoneInputLabelProps } from '@core/ui/forms/phone-input/types/PhoneInputTypes';
import Label from '@core/ui/label/Label';

export function PhoneInputLabel({ id, label, required }: Readonly<PhoneInputLabelProps>) {
	return (
		<Label htmlFor={id} required={required ?? false} size="sm">
			{label}
		</Label>
	);
}
