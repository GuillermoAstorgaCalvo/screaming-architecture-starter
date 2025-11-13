import type { PasswordInputLabelProps } from '@core/ui/forms/password-input/types/PasswordInputTypes';
import Label from '@core/ui/label/Label';

export function PasswordInputLabel({ id, label, required }: Readonly<PasswordInputLabelProps>) {
	return (
		<Label htmlFor={id} required={required ?? false} size="sm">
			{label}
		</Label>
	);
}
