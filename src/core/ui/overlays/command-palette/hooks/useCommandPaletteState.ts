import { useCommandPalette } from '@core/ui/overlays/command-palette/hooks/useCommandPalette';
import type { CommandPaletteProps } from '@core/ui/overlays/command-palette/types/CommandPalette.types';

export function useCommandPaletteState(props: Readonly<CommandPaletteProps>) {
	return useCommandPalette({
		commands: props.commands,
		isOpen: props.isOpen,
		onClose: props.onClose,
		closeOnEscape: props.closeOnEscape ?? true,
		closeOnOverlayClick: props.closeOnOverlayClick ?? true,
		onSelect: props.onSelect,
	});
}
