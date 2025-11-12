import type { MultiSelectListboxProps } from './MultiSelectContentHelpers';
import { MultiSelectEmptyState } from './MultiSelectEmptyState';
import { MultiSelectOptionsList } from './MultiSelectOptionsList';

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
