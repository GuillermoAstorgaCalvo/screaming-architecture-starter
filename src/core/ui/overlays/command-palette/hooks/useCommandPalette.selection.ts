import type { CommandPaletteCommand } from '@core/ui/overlays/command-palette/types/CommandPalette.types';
import { useCallback } from 'react';

export function useCommandSelection(
	onSelect: ((command: CommandPaletteCommand) => void) | undefined,
	onClose: () => void
) {
	return useCallback(
		async (command: CommandPaletteCommand) => {
			if (command.disabled) {
				return;
			}

			await command.onSelect?.();
			onSelect?.(command);
			onClose();
		},
		[onSelect, onClose]
	);
}
