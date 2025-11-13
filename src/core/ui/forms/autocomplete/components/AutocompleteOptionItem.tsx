import type { AutocompleteOption } from '@core/ui/forms/autocomplete/Autocomplete';
import {
	createOptionHandlers,
	getOptionClassName,
	renderHighlightedLabel,
} from '@core/ui/forms/autocomplete/helpers/AutocompleteContentHelpers';
import type { RefObject } from 'react';

interface AutocompleteOptionItemProps {
	readonly option: AutocompleteOption;
	readonly index: number;
	readonly highlightedIndex: number;
	readonly optionRef: RefObject<HTMLButtonElement | null>;
	readonly onSelect: (option: AutocompleteOption) => void;
	readonly searchQuery: string;
	readonly highlightMatches: boolean;
}

export function AutocompleteOptionItem({
	option,
	index,
	highlightedIndex,
	optionRef,
	onSelect,
	searchQuery,
	highlightMatches,
}: Readonly<AutocompleteOptionItemProps>) {
	const isHighlighted = index === highlightedIndex;
	const isDisabled = option.disabled ?? false;
	const { handleClick, handleKeyDown } = createOptionHandlers(option, isDisabled, onSelect);

	// Note: Using role="option" on button is correct for custom autocomplete per ARIA spec
	// Native <option> doesn't support filtering/search functionality
	// Suppresses accessibility warnings for custom autocomplete pattern
	return (
		<li>
			<button
				type="button"
				ref={optionRef}
				role="option"
				aria-selected={isHighlighted}
				aria-disabled={isDisabled}
				disabled={isDisabled}
				className={getOptionClassName(isHighlighted, isDisabled)}
				onClick={handleClick}
				onKeyDown={handleKeyDown}
			>
				{renderHighlightedLabel(option, searchQuery, highlightMatches)}
			</button>
		</li>
	);
}
