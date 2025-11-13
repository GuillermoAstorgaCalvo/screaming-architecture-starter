import type { ComboboxOption, ComboboxProps } from '@core/ui/forms/combobox/Combobox';
import {
	createKeyHandlerMap,
	useKeyboardHandlers,
} from '@core/ui/forms/combobox/helpers/useComboboxKeyboard.handlers';
import { type KeyboardEvent, useCallback } from 'react';

export function useComboboxKeyboard(
	_props: Readonly<Pick<ComboboxProps, 'options' | 'onChange'>>,
	params: {
		isOpen: boolean;
		setIsOpen: (open: boolean) => void;
		inputValue: string;
		setInputValue: (value: string) => void;
		filteredOptions: ComboboxOption[];
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
