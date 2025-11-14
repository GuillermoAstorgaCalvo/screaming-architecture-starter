import type { AutocompleteOption } from '@core/ui/forms/autocomplete/Autocomplete';
import { highlightMatches as highlightMatchesFn } from '@core/ui/forms/autocomplete/helpers/AutocompleteHelpers';
import type { AutocompleteContentProps } from '@core/ui/forms/autocomplete/types/AutocompleteTypes';
import type { KeyboardEvent, MouseEvent, ReactNode, RefObject } from 'react';

import { MENU_STYLES } from './AutocompleteMenuStyles';

export function createOptionHandlers(
	option: AutocompleteOption,
	isDisabled: boolean,
	onSelect: (option: AutocompleteOption) => void
) {
	const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		if (!isDisabled) {
			onSelect(option);
		}
	};

	const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			if (!isDisabled) {
				onSelect(option);
			}
		}
	};

	return { handleClick, handleKeyDown };
}

export interface OptionItemData {
	readonly option: AutocompleteOption;
	readonly index: number;
	readonly highlightedIndex: number;
	readonly optionRef: RefObject<HTMLButtonElement | null>;
	readonly handleSelect: (option: AutocompleteOption) => void;
	readonly searchQuery: string;
	readonly highlightMatches: boolean;
}

export interface RenderOptionsParams {
	readonly filteredOptions: AutocompleteOption[];
	readonly highlightedIndex: number;
	readonly optionRefs: RefObject<HTMLButtonElement | null>[];
	readonly handleSelect: (option: AutocompleteOption) => void;
	readonly searchQuery: string;
	readonly highlightMatches: boolean;
}

export function prepareLabelProps(
	label: string | undefined,
	finalId: string | undefined,
	required: boolean | undefined
) {
	return !label || !finalId
		? null
		: { id: finalId, label, ...(required !== undefined && { required }) };
}

export function prepareMessagesProps(
	finalId: string | undefined,
	error: string | undefined,
	helperText: string | undefined
) {
	if (!finalId) return null;
	return {
		autocompleteId: finalId,
		...(error !== undefined && { error }),
		...(helperText !== undefined && { helperText }),
	};
}

export type AutocompleteListboxProps = Pick<
	AutocompleteContentProps,
	| 'filteredOptions'
	| 'highlightedIndex'
	| 'optionRefs'
	| 'handleSelect'
	| 'emptyState'
	| 'listboxRef'
	| 'menuId'
	| 'maxHeight'
	| 'isOpen'
	| 'searchQuery'
> & { highlightMatches: boolean };

export function buildListboxProps(
	props: Readonly<AutocompleteContentProps>,
	highlightMatches: boolean
): AutocompleteListboxProps {
	const {
		filteredOptions,
		highlightedIndex,
		optionRefs,
		handleSelect,
		emptyState,
		listboxRef,
		menuId,
		maxHeight,
		isOpen,
		searchQuery,
	} = props;
	return {
		filteredOptions,
		highlightedIndex,
		optionRefs,
		handleSelect,
		emptyState,
		listboxRef,
		menuId,
		maxHeight,
		isOpen,
		searchQuery,
		highlightMatches,
	};
}

/**
 * Renders highlighted text from an option label
 */
const KEY_PREFIX_LENGTH = 10;

export function renderHighlightedLabel(
	option: AutocompleteOption,
	searchQuery: string,
	shouldHighlight: boolean
): ReactNode {
	if (!shouldHighlight || !searchQuery.trim()) {
		return option.label;
	}

	let labelStr = '';
	if (typeof option.label === 'string') {
		labelStr = option.label;
	} else if (typeof option.label === 'number' || typeof option.label === 'boolean') {
		labelStr = String(option.label);
	}
	const parts = highlightMatchesFn(labelStr, searchQuery);

	return (
		<span>
			{parts.map((part, idx) => {
				const keySuffix = part.text.slice(0, KEY_PREFIX_LENGTH);
				const key = part.isMatch ? `match-${idx}-${keySuffix}` : `text-${idx}-${keySuffix}`;
				return part.isMatch ? (
					<mark key={key} className={MENU_STYLES.MATCH_HIGHLIGHT}>
						{part.text}
					</mark>
				) : (
					<span key={key}>{part.text}</span>
				);
			})}
		</span>
	);
}
