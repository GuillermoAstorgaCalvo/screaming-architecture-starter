import Label from '@core/ui/label/Label';

// ============================================================================
// Label Component
// ============================================================================

interface SelectLabelProps {
	readonly id: string;
	readonly label: string;
	readonly required?: boolean | undefined;
}

export function SelectLabel({ id, label, required }: Readonly<SelectLabelProps>) {
	return (
		<Label htmlFor={id} required={required ?? false} size="sm">
			{label}
		</Label>
	);
}
