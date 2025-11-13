import type { SwitchLabelProps } from '@core/ui/forms/switch/types/SwitchTypes';
import Label from '@core/ui/label/Label';

export function SwitchLabel({ id, label, required, size = 'sm' }: Readonly<SwitchLabelProps>) {
	return (
		<Label htmlFor={id} required={required ?? false} size={size}>
			{label}
		</Label>
	);
}
