import type { RefObject } from 'react';

import type { AutocompleteOption } from './Autocomplete';
import { type AutocompleteListboxProps, getListboxStyles } from './AutocompleteContentHelpers';
import { AutocompleteOptionItem } from './AutocompleteOptionItem';

function renderOptionItem({
	option,
	index,
	highlightedIndex,
	optionRef,
	handleSelect,
	searchQuery,
	highlightMatches,
}: {
	option: AutocompleteOption;
	index: number;
	highlightedIndex: number;
	optionRef: RefObject<HTMLButtonElement | null>;
	handleSelect: (option: AutocompleteOption) => void;
	searchQuery: string;
	highlightMatches: boolean;
}) {
	return (
		<AutocompleteOptionItem
			key={option.value}
			option={option}
			index={index}
			highlightedIndex={highlightedIndex}
			optionRef={optionRef}
			onSelect={handleSelect}
			searchQuery={searchQuery}
			highlightMatches={highlightMatches}
		/>
	);
}

function renderOptions({
	filteredOptions,
	highlightedIndex,
	optionRefs,
	handleSelect,
	searchQuery,
	highlightMatches,
}: {
	filteredOptions: AutocompleteOption[];
	highlightedIndex: number;
	optionRefs: RefObject<HTMLButtonElement | null>[];
	handleSelect: (option: AutocompleteOption) => void;
	searchQuery: string;
	highlightMatches: boolean;
}) {
	return filteredOptions.map((option, index) =>
		renderOptionItem({
			option,
			index,
			highlightedIndex,
			optionRef: optionRefs[index] ?? { current: null },
			handleSelect,
			searchQuery,
			highlightMatches,
		})
	);
}

export function AutocompleteOptionsList({
	filteredOptions,
	highlightedIndex,
	optionRefs,
	handleSelect,
	listboxRef,
	menuId,
	maxHeight,
	searchQuery,
	highlightMatches,
}: Readonly<AutocompleteListboxProps>) {
	const { className, style } = getListboxStyles(maxHeight);

	// Note: Using role="listbox" on ul is correct for custom autocomplete per ARIA spec
	// Native <select> doesn't support filtering/search functionality
	// Suppresses accessibility warnings for custom autocomplete pattern
	return (
		<ul ref={listboxRef} id={menuId} role="listbox" className={className} style={style}>
			{renderOptions({
				filteredOptions,
				highlightedIndex,
				optionRefs,
				handleSelect,
				searchQuery,
				highlightMatches,
			})}
		</ul>
	);
}
