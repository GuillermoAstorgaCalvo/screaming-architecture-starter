import Label from '@core/ui/label/Label';

import type { EmailInputLabelProps } from './EmailInputTypes';

export function EmailInputLabel({ id, label, required }: Readonly<EmailInputLabelProps>) {
	return (
		<Label htmlFor={id} required={required ?? false} size="sm">
			{label}
		</Label>
	);
}
