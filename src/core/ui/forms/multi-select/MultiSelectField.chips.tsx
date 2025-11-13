import Chip from '@core/ui/chip/Chip';
import type { ReactElement } from 'react';

import type { MultiSelectOption } from './MultiSelect';
import { getOptionLabel } from './useMultiSelectHelpers';

export function createChip(
	option: MultiSelectOption,
	onRemoveChip: (value: string) => void
): ReactElement {
	return (
		<Chip
			key={option.value}
			variant="default"
			size="sm"
			removable
			onRemove={() => onRemoveChip(option.value)}
		>
			{getOptionLabel(option)}
		</Chip>
	);
}

export function renderChips(
	selectedOptions: MultiSelectOption[],
	onRemoveChip: (value: string) => void
) {
	return selectedOptions.map(option => createChip(option, onRemoveChip));
}
