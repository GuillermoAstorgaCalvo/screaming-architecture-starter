import type { CommandPaletteCommand } from '@core/ui/overlays/command-palette/CommandPalette';
import type { KeyboardEvent, MouseEvent, ReactNode, RefObject } from 'react';

export interface CommandPaletteOverlayProps {
	readonly isOpen: boolean;
	readonly onClick: (e: MouseEvent<HTMLDivElement>) => void;
	readonly overlayClassName?: string;
}

export interface CommandPaletteContentProps {
	readonly id: string;
	readonly className?: string;
	readonly searchQuery: string;
	readonly onSearchChange: (query: string) => void;
	readonly searchInputRef: RefObject<HTMLInputElement | null>;
	readonly placeholder: string;
	readonly commands: readonly CommandPaletteCommand[];
	readonly highlightedIndex: number;
	readonly commandsListRef: RefObject<HTMLDivElement | null>;
	readonly onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
	readonly onSelect: (command: CommandPaletteCommand) => Promise<void>;
	readonly emptyState: ReactNode;
	readonly searchIcon: ReactNode;
}

export interface CommandPaletteSearchInputProps {
	readonly searchQuery: string;
	readonly onSearchChange: (query: string) => void;
	readonly searchInputRef: RefObject<HTMLInputElement | null>;
	readonly placeholder: string;
	readonly searchIcon: ReactNode;
}

export interface CommandPaletteListProps {
	readonly commands: readonly CommandPaletteCommand[];
	readonly highlightedIndex: number;
	readonly commandsListRef: RefObject<HTMLDivElement | null>;
	readonly onSelect: (command: CommandPaletteCommand) => Promise<void>;
	readonly emptyState: ReactNode;
}

export interface CommandPaletteDialogProps {
	readonly id: string;
	readonly className?: string | undefined;
	readonly onKeyDown: (event: KeyboardEvent<HTMLDialogElement>) => void;
	readonly children: ReactNode;
}

export interface CommandPaletteItemProps {
	readonly command: CommandPaletteCommand;
	readonly index: number;
	readonly isHighlighted: boolean;
	readonly onSelect: (command: CommandPaletteCommand) => Promise<void>;
}
