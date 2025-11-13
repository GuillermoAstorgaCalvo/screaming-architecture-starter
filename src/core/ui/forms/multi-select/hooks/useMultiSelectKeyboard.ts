import { useActionHandlers } from '@core/ui/forms/multi-select/hooks/useMultiSelectKeyboard.actions';
import {
	createKeyHandlerMap,
	type KeyboardHandlers,
} from '@core/ui/forms/multi-select/hooks/useMultiSelectKeyboard.map';
import { useNavigationHandlers } from '@core/ui/forms/multi-select/hooks/useMultiSelectKeyboard.navigation';
import { useSelectHandler } from '@core/ui/forms/multi-select/hooks/useMultiSelectKeyboard.select';
import type { MultiSelectOption, MultiSelectProps } from '@core/ui/forms/multi-select/MultiSelect';
import { type KeyboardEvent, useCallback } from 'react';

export interface UseMultiSelectKeyboardParams {
	readonly isOpen: boolean;
	readonly setIsOpen: (open: boolean) => void;
	readonly setInputValue: (value: string) => void;
	readonly filteredOptions: MultiSelectOption[];
	readonly highlightedIndex: number;
	readonly setHighlightedIndex: (index: number) => void;
	readonly setValue: (value: string[]) => void;
	readonly value: string[];
}

function useKeyboardHandlers(params: UseMultiSelectKeyboardParams) {
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
	} satisfies KeyboardHandlers & { handleSelect: ReturnType<typeof useSelectHandler> };
}

export function useMultiSelectKeyboard(
	_props: Readonly<Pick<MultiSelectProps, 'options' | 'onChange'>>,
	params: UseMultiSelectKeyboardParams
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
