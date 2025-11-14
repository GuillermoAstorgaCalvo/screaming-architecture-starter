import { findNextEnabledIndex } from '@core/ui/overlays/command-palette/helpers/CommandPaletteHelpers';
import type { CommandPaletteCommand } from '@core/ui/overlays/command-palette/types/CommandPalette.types';
import type { KeyboardEvent } from 'react';

interface NavigationParams {
	readonly filteredCommands: CommandPaletteCommand[];
	readonly highlightedIndex: number;
	readonly setHighlightedIndex: (index: number) => void;
}

interface SelectionParams {
	readonly filteredCommands: CommandPaletteCommand[];
	readonly highlightedIndex: number;
	readonly handleSelect: (command: CommandPaletteCommand) => Promise<void>;
}

interface HomeEndParams {
	readonly filteredCommands: CommandPaletteCommand[];
	readonly setHighlightedIndex: (index: number) => void;
}

export interface KeyboardNavigationParams {
	readonly filteredCommands: CommandPaletteCommand[];
	readonly highlightedIndex: number;
	readonly setHighlightedIndex: (index: number) => void;
	readonly handleSelect: (command: CommandPaletteCommand) => Promise<void>;
	readonly onClose: () => void;
	readonly closeOnEscape: boolean;
}

export function handleEscapeKey(event: KeyboardEvent<HTMLDivElement>, onClose: () => void) {
	event.preventDefault();
	onClose();
}

function handleArrowDown(event: KeyboardEvent<HTMLDivElement>, params: NavigationParams) {
	event.preventDefault();
	const nextIndex = findNextEnabledIndex(params.filteredCommands, params.highlightedIndex, 1);
	if (nextIndex >= 0) {
		params.setHighlightedIndex(nextIndex);
	}
}

function handleArrowUp(event: KeyboardEvent<HTMLDivElement>, params: NavigationParams) {
	event.preventDefault();
	const prevIndex = findNextEnabledIndex(params.filteredCommands, params.highlightedIndex, -1);
	if (prevIndex >= 0) {
		params.setHighlightedIndex(prevIndex);
	}
}

function handleEnterOrSpace(event: KeyboardEvent<HTMLDivElement>, params: SelectionParams) {
	event.preventDefault();
	const command = params.filteredCommands[params.highlightedIndex];
	if (command) {
		params.handleSelect(command).catch(() => {
			// Ignore errors from async select handler
		});
	}
}

function handleHomeKey(event: KeyboardEvent<HTMLDivElement>, params: HomeEndParams) {
	event.preventDefault();
	const firstEnabled = findNextEnabledIndex(params.filteredCommands, -1, 1);
	if (firstEnabled >= 0) {
		params.setHighlightedIndex(firstEnabled);
	}
}

function handleEndKey(event: KeyboardEvent<HTMLDivElement>, params: HomeEndParams) {
	event.preventDefault();
	const lastEnabled = findNextEnabledIndex(params.filteredCommands, 0, -1);
	if (lastEnabled >= 0) {
		params.setHighlightedIndex(lastEnabled);
	}
}

export function handleNavigationKey(
	event: KeyboardEvent<HTMLDivElement>,
	params: KeyboardNavigationParams
) {
	const navigationParams: NavigationParams = {
		filteredCommands: params.filteredCommands,
		highlightedIndex: params.highlightedIndex,
		setHighlightedIndex: params.setHighlightedIndex,
	};

	if (event.key === 'ArrowDown') {
		handleArrowDown(event, navigationParams);
		return true;
	}

	if (event.key === 'ArrowUp') {
		handleArrowUp(event, navigationParams);
		return true;
	}

	return false;
}

export function handleSelectionKey(
	event: KeyboardEvent<HTMLDivElement>,
	params: KeyboardNavigationParams
) {
	const selectionParams: SelectionParams = {
		filteredCommands: params.filteredCommands,
		highlightedIndex: params.highlightedIndex,
		handleSelect: params.handleSelect,
	};

	if (event.key === 'Enter' || event.key === ' ') {
		handleEnterOrSpace(event, selectionParams);
		return true;
	}

	return false;
}

export function handleHomeEndKey(
	event: KeyboardEvent<HTMLDivElement>,
	params: KeyboardNavigationParams
) {
	const homeEndParams: HomeEndParams = {
		filteredCommands: params.filteredCommands,
		setHighlightedIndex: params.setHighlightedIndex,
	};

	if (event.key === 'Home') {
		handleHomeKey(event, homeEndParams);
		return true;
	}

	if (event.key === 'End') {
		handleEndKey(event, homeEndParams);
		return true;
	}

	return false;
}
