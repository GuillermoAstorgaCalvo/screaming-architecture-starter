import { twMerge } from 'tailwind-merge';

import type { CommandPaletteDialogProps } from './CommandPaletteParts.types';

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
				'fixed left-1/2 top-1/4 z-50 w-full max-w-2xl -translate-x-1/2 rounded-lg border border-border bg-surface shadow-xl',
				className
			)}
			aria-labelledby={`${id}-title`}
			tabIndex={-1}
			onKeyDown={onKeyDown}
		>
			{children}
		</dialog>
	);
}
