import type { ReactNode, RefObject } from 'react';

import type { ComboboxOption } from './Combobox';
import { ComboboxEmptyState } from './ComboboxEmptyState';
import { ComboboxOptionsList } from './ComboboxOptionsList';

interface ComboboxListboxProps {
	readonly isOpen: boolean;
	readonly filteredOptions: ComboboxOption[];
	readonly highlightedIndex: number;
	readonly optionRefs: RefObject<HTMLButtonElement | null>[];
	readonly handleSelect: (option: ComboboxOption) => void;
	readonly emptyState: ReactNode;
	readonly listboxRef: RefObject<HTMLUListElement | null>;
	readonly menuId: string;
	readonly maxHeight: number;
}

export function ComboboxListbox(props: Readonly<ComboboxListboxProps>) {
	const { isOpen, emptyState, filteredOptions } = props;

	if (!isOpen) {
		return null;
	}

	if (filteredOptions.length === 0) {
		return <ComboboxEmptyState emptyState={emptyState} />;
	}

	return <ComboboxOptionsList {...props} />;
}
