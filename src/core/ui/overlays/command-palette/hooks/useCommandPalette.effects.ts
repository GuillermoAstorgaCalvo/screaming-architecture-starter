import { useFocusManagement } from './useCommandPalette.focus';
import { useScrollToHighlighted } from './useCommandPalette.scroll';
import type { CommandPaletteEffectsParams } from './useCommandPalette.types';

export function useCommandPaletteEffects(params: CommandPaletteEffectsParams) {
	useFocusManagement(params.isOpen, params.searchInputRef);
	useScrollToHighlighted(params.highlightedIndex, params.commandsListRef);
}
