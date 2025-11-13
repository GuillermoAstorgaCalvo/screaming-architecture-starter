import type { OTPInputLabelProps } from '@core/ui/forms/otp-input/types/OTPInputTypes';
import Label from '@core/ui/label/Label';

export function OTPInputLabel({ id, label, required }: Readonly<OTPInputLabelProps>) {
	return (
		<Label htmlFor={id} required={required ?? false} size="sm">
			{label}
		</Label>
	);
}
