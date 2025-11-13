import type { ReactNode } from 'react';

import type { AutocompleteListboxProps } from './AutocompleteContentHelpers';
import { AutocompleteEmptyState } from './AutocompleteEmptyState';
import { AutocompleteOptionsList } from './AutocompleteOptionsList';

interface AutocompleteListboxPropsWithEmptyState extends AutocompleteListboxProps {
	readonly emptyState: ReactNode;
}

export function AutocompleteListbox({
	isOpen,
	emptyState,
	filteredOptions,
	...props
}: Readonly<AutocompleteListboxPropsWithEmptyState>) {
	if (!isOpen) {
		return null;
	}

	if (filteredOptions.length === 0) {
		return <AutocompleteEmptyState emptyState={emptyState} />;
	}

	return (
		<AutocompleteOptionsList
			{...props}
			isOpen={isOpen}
			emptyState={emptyState}
			filteredOptions={filteredOptions}
		/>
	);
}
