import Label from '@core/ui/label/Label';

import type { CurrencyInputLabelProps } from './CurrencyInputTypes';

export function CurrencyInputLabel({ id, label, required }: Readonly<CurrencyInputLabelProps>) {
	return (
		<Label htmlFor={id} required={required ?? false} size="sm">
			{label}
		</Label>
	);
}
