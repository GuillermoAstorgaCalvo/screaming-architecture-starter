import type { CommandPaletteDialogProps } from '@core/ui/overlays/command-palette/types/CommandPaletteParts.types';
import { componentZIndex } from '@core/ui/theme/tokens';
import { twMerge } from 'tailwind-merge';

export function CommandPaletteDialog({
	id,
	className,
	onKeyDown,
	children,
}: Readonly<CommandPaletteDialogProps>) {
	return (
		<dialog
			id={id}
			open
			className={twMerge(
				'fixed left-1/2 top-1/4 w-full max-w-2xl -translate-x-1/2 rounded-lg border border-border bg-surface shadow-xl',
				className
			)}
			style={{ zIndex: componentZIndex.modal }}
			aria-labelledby={`${id}-title`}
			tabIndex={-1}
			onKeyDown={onKeyDown}
		>
			{children}
		</dialog>
	);
}
