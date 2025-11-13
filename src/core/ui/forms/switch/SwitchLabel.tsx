import Label from '@core/ui/label/Label';

import type { SwitchLabelProps } from './SwitchTypes';

export function SwitchLabel({ id, label, required, size = 'sm' }: Readonly<SwitchLabelProps>) {
	return (
		<Label htmlFor={id} required={required ?? false} size={size}>
			{label}
		</Label>
	);
}
