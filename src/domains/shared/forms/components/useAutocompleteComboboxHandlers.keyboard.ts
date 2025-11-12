import { type KeyboardEvent, useMemo } from 'react';

import type { AutocompleteOption } from './AutocompleteCombobox';

interface KeyboardHandlersContext {
	readonly isOpen: boolean;
	readonly filteredOptions: AutocompleteOption[];
	readonly highlightedIndex: number;
	readonly openList: () => void;
	readonly moveHighlight: (direction: 1 | -1) => void;
	readonly selectOption: (option: AutocompleteOption | undefined) => void;
	readonly closeList: () => void;
	readonly updateInputValue: (value: string) => void;
	readonly onValueChange?: ((value: string | undefined) => void) | undefined;
	readonly onOptionSelect?: ((option: AutocompleteOption | undefined) => void) | undefined;
}

function handleArrowKey(ctx: KeyboardHandlersContext, direction: 1 | -1) {
	if (!ctx.isOpen) {
		ctx.openList();
	}
	ctx.moveHighlight(direction);
}

function handleEnterKey(ctx: KeyboardHandlersContext) {
	const option = ctx.filteredOptions[ctx.highlightedIndex];
	if (option) {
		ctx.selectOption(option);
	}
}

function handleEscapeKey(ctx: KeyboardHandlersContext) {
	if (ctx.isOpen) {
		ctx.closeList();
	} else {
		ctx.updateInputValue('');
		ctx.onValueChange?.(undefined);
		ctx.onOptionSelect?.(undefined);
	}
}

function createKeyboardHandlers(ctx: KeyboardHandlersContext) {
	return (event: KeyboardEvent<HTMLInputElement>) => {
		switch (event.key) {
			case 'ArrowDown': {
				event.preventDefault();
				handleArrowKey(ctx, 1);
				break;
			}
			case 'ArrowUp': {
				event.preventDefault();
				handleArrowKey(ctx, -1);
				break;
			}
			case 'Enter': {
				if (ctx.isOpen) {
					event.preventDefault();
					handleEnterKey(ctx);
				}
				break;
			}
			case 'Escape': {
				event.preventDefault();
				handleEscapeKey(ctx);
				break;
			}
			default:
		}
	};
}

export interface KeyboardHandlerParams {
	readonly isOpen: boolean;
	readonly filteredOptions: AutocompleteOption[];
	readonly highlightedIndex: number;
	readonly openList: () => void;
	readonly moveHighlight: (direction: 1 | -1) => void;
	readonly selectOption: (option: AutocompleteOption | undefined) => void;
	readonly closeList: () => void;
	readonly updateInputValue: (value: string) => void;
	readonly onValueChange?: ((value: string | undefined) => void) | undefined;
	readonly onOptionSelect?: ((option: AutocompleteOption | undefined) => void) | undefined;
}

export function useKeyboardHandler(params: KeyboardHandlerParams) {
	return useMemo(() => createKeyboardHandlers(params), [params]);
}
