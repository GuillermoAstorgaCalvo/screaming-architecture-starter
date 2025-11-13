import type {
	AutocompleteOption,
	AutocompleteProps,
} from '@core/ui/forms/autocomplete/Autocomplete';
import { useActionHandlers } from '@core/ui/forms/autocomplete/helpers/useAutocompleteKeyboard.actions';
import {
	createKeyHandlerMap,
	type KeyboardHandlers,
} from '@core/ui/forms/autocomplete/helpers/useAutocompleteKeyboard.map';
import { useNavigationHandlers } from '@core/ui/forms/autocomplete/helpers/useAutocompleteKeyboard.navigation';
import { useSelectHandler } from '@core/ui/forms/autocomplete/helpers/useAutocompleteKeyboard.select';
import { type KeyboardEvent, useCallback } from 'react';

interface UseKeyboardHandlersParams {
	isOpen: boolean;
	setIsOpen: (open: boolean) => void;
	setInputValue: (value: string) => void;
	filteredOptions: AutocompleteOption[];
	highlightedIndex: number;
	setHighlightedIndex: (index: number) => void;
	setValue: (value: string) => void;
}

function useKeyboardHandlers(params: UseKeyboardHandlersParams): KeyboardHandlers & {
	handleSelect: (option: AutocompleteOption) => void;
} {
	const handleSelect = useSelectHandler(params);
	const navigation = useNavigationHandlers(params);
	const actions = useActionHandlers({ ...params, handleSelect });

	return {
		handleSelect,
		handleArrowDown: navigation.handleArrowDown,
		handleArrowUp: navigation.handleArrowUp,
		handleEnterOrSpace: actions.handleEnterOrSpace,
		handleEscape: actions.handleEscape,
		handleHome: navigation.handleHome,
		handleEnd: navigation.handleEnd,
	};
}

export function useAutocompleteKeyboard(
	_props: Readonly<Pick<AutocompleteProps, 'options' | 'onChange'>>,
	params: {
		isOpen: boolean;
		setIsOpen: (open: boolean) => void;
		inputValue: string;
		setInputValue: (value: string) => void;
		filteredOptions: AutocompleteOption[];
		highlightedIndex: number;
		setHighlightedIndex: (index: number) => void;
		value: string;
		setValue: (value: string) => void;
	}
) {
	const handlers = useKeyboardHandlers(params);
	const keyHandlers = createKeyHandlerMap(handlers);

	const handleKeyDown = useCallback(
		(event: KeyboardEvent<HTMLInputElement>) => {
			const handler = keyHandlers[event.key];
			if (handler) {
				event.preventDefault();
				handler();
			}
		},
		[keyHandlers]
	);

	return { handleSelect: handlers.handleSelect, handleKeyDown };
}
