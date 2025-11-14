import type { ReactNode } from 'react';

export interface CommandPaletteCommand {
	readonly id: string;
	readonly label: string;
	readonly description?: string;
	readonly icon?: ReactNode;
	readonly shortcut?: string;
	readonly keywords?: string[];
	readonly onSelect?: () => void | Promise<void>;
	readonly disabled?: boolean;
	readonly group?: string;
}

export interface CommandPaletteProps {
	readonly isOpen: boolean;
	readonly onClose: () => void;
	readonly commands: CommandPaletteCommand[];
	readonly placeholder?: string;
	readonly emptyState?: ReactNode;
	readonly className?: string;
	readonly overlayClassName?: string;
	readonly closeOnOverlayClick?: boolean;
	readonly closeOnEscape?: boolean;
	readonly onSelect?: (command: CommandPaletteCommand) => void;
}
