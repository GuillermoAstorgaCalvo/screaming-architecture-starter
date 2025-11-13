import Chip from '@core/ui/chip/Chip';
import { getOptionLabel } from '@core/ui/forms/multi-select/helpers/useMultiSelectHelpers';
import type { MultiSelectOption } from '@core/ui/forms/multi-select/MultiSelect';
import type { ReactElement } from 'react';

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
