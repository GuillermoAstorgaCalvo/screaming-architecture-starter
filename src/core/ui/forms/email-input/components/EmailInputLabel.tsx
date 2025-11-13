import type { EmailInputLabelProps } from '@core/ui/forms/email-input/types/EmailInputTypes';
import Label from '@core/ui/label/Label';

export function EmailInputLabel({ id, label, required }: Readonly<EmailInputLabelProps>) {
	return (
		<Label htmlFor={id} required={required ?? false} size="sm">
			{label}
		</Label>
	);
}
