import Label from '@core/ui/label/Label';

export interface AutocompleteLabelProps {
	readonly id: string;
	readonly label: string;
	readonly required?: boolean;
}

export function AutocompleteLabel({ id, label, required }: Readonly<AutocompleteLabelProps>) {
	if (required !== undefined) {
		return (
			<Label htmlFor={id} required={required}>
				{label}
			</Label>
		);
	}
	return <Label htmlFor={id}>{label}</Label>;
}
