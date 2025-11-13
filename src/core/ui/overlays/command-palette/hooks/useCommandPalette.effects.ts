import type { CommandPaletteEffectsParams } from '@core/ui/overlays/command-palette/types/useCommandPalette.types';

import { useFocusManagement } from './useCommandPalette.focus';
import { useScrollToHighlighted } from './useCommandPalette.scroll';

export function useCommandPaletteEffects(params: CommandPaletteEffectsParams) {
	useFocusManagement(params.isOpen, params.searchInputRef);
	useScrollToHighlighted(params.highlightedIndex, params.commandsListRef);
}
