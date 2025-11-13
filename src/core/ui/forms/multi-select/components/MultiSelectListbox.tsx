import { MultiSelectEmptyState } from '@core/ui/forms/multi-select/components/MultiSelectEmptyState';
import { MultiSelectOptionsList } from '@core/ui/forms/multi-select/components/MultiSelectOptionsList';
import type { MultiSelectListboxProps } from '@core/ui/forms/multi-select/helpers/MultiSelectContentHelpers';

export function MultiSelectListbox(props: Readonly<MultiSelectListboxProps>) {
	const { isOpen, emptyState, filteredOptions } = props;

	if (!isOpen) {
		return null;
	}

	if (filteredOptions.length === 0) {
		return <MultiSelectEmptyState emptyState={emptyState} />;
	}

	return <MultiSelectOptionsList {...props} />;
}
