import type {
	HandlersSetupParams,
	UseCommandPaletteParams,
	UseCommandPaletteReturn,
} from '@core/ui/overlays/command-palette/types/useCommandPalette.types';

import { useCommandPaletteEffects } from './useCommandPalette.effects';
import { useCommandPaletteHandlers } from './useCommandPalette.handlers';
import { useCommandPaletteRefs } from './useCommandPalette.refs';
import { useCommandSelection } from './useCommandPalette.selection';
import { useCommandPaletteState, useSearchState } from './useCommandPalette.state';

function useCommandPaletteStateAndEffects(params: UseCommandPaletteParams, searchQuery: string) {
	const { searchInputRef, commandsListRef } = useCommandPaletteRefs();
	const { filteredCommands, highlightedIndex, setHighlightedIndex } = useCommandPaletteState(
		params.commands,
		params.isOpen,
		searchQuery
	);

	useCommandPaletteEffects({
		isOpen: params.isOpen,
		searchInputRef,
		highlightedIndex,
		commandsListRef,
	});

	return {
		searchInputRef,
		commandsListRef,
		filteredCommands,
		highlightedIndex,
		setHighlightedIndex,
	};
}

function useCommandPaletteHandlersSetup(setup: HandlersSetupParams) {
	return useCommandPaletteHandlers({
		filteredCommands: setup.filteredCommands,
		highlightedIndex: setup.highlightedIndex,
		setHighlightedIndex: setup.setHighlightedIndex,
		handleSelect: setup.handleSelect,
		onClose: setup.params.onClose,
		closeOnEscape: setup.params.closeOnEscape,
		closeOnOverlayClick: setup.params.closeOnOverlayClick,
	});
}

function useCommandPaletteCore(params: UseCommandPaletteParams) {
	const { searchQuery, setSearchQuery } = useSearchState(params.isOpen);
	const {
		searchInputRef,
		commandsListRef,
		filteredCommands,
		highlightedIndex,
		setHighlightedIndex,
	} = useCommandPaletteStateAndEffects(params, searchQuery);
	const handleSelect = useCommandSelection(params.onSelect, params.onClose);
	const { handleKeyDown, handleOverlayClick } = useCommandPaletteHandlersSetup({
		params,
		filteredCommands,
		highlightedIndex,
		setHighlightedIndex,
		handleSelect,
	});

	return {
		searchQuery,
		setSearchQuery,
		filteredCommands,
		highlightedIndex,
		setHighlightedIndex,
		searchInputRef,
		commandsListRef,
		handleKeyDown,
		handleSelect,
		handleOverlayClick,
	};
}

export function useCommandPalette(params: UseCommandPaletteParams): UseCommandPaletteReturn {
	return useCommandPaletteCore(params);
}
