import type { CommandPaletteHandlersParams } from '@core/ui/overlays/command-palette/types/useCommandPalette.types';
import { type KeyboardEvent, type MouseEvent, useCallback } from 'react';

import {
	handleEscapeKey,
	handleHomeEndKey,
	handleNavigationKey,
	handleSelectionKey,
	type KeyboardNavigationParams,
} from './useCommandPalette.keyboard';

export function useKeyboardNavigation(params: KeyboardNavigationParams) {
	return useCallback(
		(event: KeyboardEvent<HTMLDivElement>) => {
			if (event.key === 'Escape' && params.closeOnEscape) {
				handleEscapeKey(event, params.onClose);
				return;
			}

			if (handleNavigationKey(event, params)) {
				return;
			}

			if (handleSelectionKey(event, params)) {
				return;
			}

			handleHomeEndKey(event, params);
		},
		[params]
	);
}

export function useCommandPaletteHandlers(params: CommandPaletteHandlersParams) {
	const handleKeyDown = useKeyboardNavigation({
		filteredCommands: params.filteredCommands,
		highlightedIndex: params.highlightedIndex,
		setHighlightedIndex: params.setHighlightedIndex,
		handleSelect: params.handleSelect,
		onClose: params.onClose,
		closeOnEscape: params.closeOnEscape,
	});

	const handleOverlayClick = useCallback(
		(event: MouseEvent<HTMLDivElement>) => {
			if (params.closeOnOverlayClick && event.target === event.currentTarget) {
				params.onClose();
			}
		},
		[params]
	);

	return { handleKeyDown, handleOverlayClick };
}
