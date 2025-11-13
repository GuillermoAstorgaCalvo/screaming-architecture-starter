import type { CommandPaletteOverlayProps } from '@core/ui/overlays/command-palette/types/CommandPaletteParts.types';
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
				'fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity',
				overlayClassName
			)}
			onClick={onClick}
			aria-hidden="true"
		/>
	);
}
