import type { CurrencyInputLabelProps } from '@core/ui/forms/currency-input/types/CurrencyInputTypes';
import Label from '@core/ui/label/Label';

export function CurrencyInputLabel({ id, label, required }: Readonly<CurrencyInputLabelProps>) {
	return (
		<Label htmlFor={id} required={required ?? false} size="sm">
			{label}
		</Label>
	);
}
