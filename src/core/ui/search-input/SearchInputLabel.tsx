import Label from '@core/ui/label/Label';

import type { SearchInputLabelProps } from './SearchInputTypes';

export function SearchInputLabel({ id, label, required }: Readonly<SearchInputLabelProps>) {
	return (
		<Label htmlFor={id} required={required ?? false} size="sm">
			{label}
		</Label>
	);
}
