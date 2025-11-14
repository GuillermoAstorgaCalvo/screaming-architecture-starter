import type { CommandPaletteOverlayProps } from '@core/ui/overlays/command-palette/types/CommandPaletteParts.types';
import { componentZIndex } from '@core/ui/theme/tokens';
import { twMerge } from 'tailwind-merge';

export function CommandPaletteOverlay({
	isOpen,
	onClick,
	overlayClassName,
}: Readonly<CommandPaletteOverlayProps>) {
	if (!isOpen) {
		return null;
	}

	return (
		<div
			className={twMerge(
				'fixed inset-0 bg-overlay backdrop-blur-md transition-opacity',
				overlayClassName
			)}
			style={{ zIndex: componentZIndex.modalBackdrop }}
			onClick={onClick}
			aria-hidden="true"
		/>
	);
}
