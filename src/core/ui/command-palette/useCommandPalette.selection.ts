import { useCallback } from 'react';

import type { CommandPaletteCommand } from './CommandPalette';

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
