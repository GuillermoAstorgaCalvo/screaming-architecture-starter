import Label from '@core/ui/label/Label';

export interface ComboboxLabelProps {
	readonly id: string;
	readonly label: string;
	readonly required?: boolean;
}

export function ComboboxLabel({ id, label, required }: Readonly<ComboboxLabelProps>) {
	return (
		<Label htmlFor={id} {...(required !== undefined ? { required } : {})}>
			{label}
		</Label>
	);
}
