import type { SearchInputLabelProps } from '@core/ui/forms/search-input/types/SearchInputTypes';
import Label from '@core/ui/label/Label';

export function SearchInputLabel({ id, label, required }: Readonly<SearchInputLabelProps>) {
	return (
		<Label htmlFor={id} required={required ?? false} size="sm">
			{label}
		</Label>
	);
}
