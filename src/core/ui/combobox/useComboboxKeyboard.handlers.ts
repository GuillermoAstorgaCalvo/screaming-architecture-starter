import type { ComboboxOption } from './Combobox';
import { useActionHandlers } from './useComboboxKeyboard.actions';
import { useNavigationHandlers } from './useComboboxKeyboard.navigation';
import { useSelectHandler } from './useComboboxKeyboard.select';

export interface UseKeyboardHandlersParams {
	isOpen: boolean;
	setIsOpen: (open: boolean) => void;
	setInputValue: (value: string) => void;
	filteredOptions: ComboboxOption[];
	highlightedIndex: number;
	setHighlightedIndex: (index: number) => void;
	setValue: (value: string) => void;
}

export function useKeyboardHandlers(params: UseKeyboardHandlersParams) {
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

export function createKeyHandlerMap(
	handlers: ReturnType<typeof useKeyboardHandlers>
): Record<string, () => void> {
	return {
		ArrowDown: handlers.handleArrowDown,
		ArrowUp: handlers.handleArrowUp,
		Enter: handlers.handleEnterOrSpace,
		' ': handlers.handleEnterOrSpace,
		Escape: handlers.handleEscape,
		Home: handlers.handleHome,
		End: handlers.handleEnd,
	};
}
