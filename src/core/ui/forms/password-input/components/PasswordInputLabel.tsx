import Label from '@core/ui/label/Label';

import type { PasswordInputLabelProps } from './PasswordInputTypes';

export function PasswordInputLabel({ id, label, required }: Readonly<PasswordInputLabelProps>) {
	return (
		<Label htmlFor={id} required={required ?? false} size="sm">
			{label}
		</Label>
	);
}
