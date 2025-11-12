import Label from '@core/ui/label/Label';

export interface MultiSelectLabelProps {
	readonly id: string;
	readonly label: string;
	readonly required?: boolean;
}

export function MultiSelectLabel({ id, label, required }: Readonly<MultiSelectLabelProps>) {
	if (required !== undefined) {
		return (
			<Label htmlFor={id} required={required}>
				{label}
			</Label>
		);
	}
	return <Label htmlFor={id}>{label}</Label>;
}
