import type { CommandPaletteCommand } from '@core/ui/overlays/command-palette/CommandPalette';
import type { KeyboardNavigationParams } from '@core/ui/overlays/command-palette/hooks/useCommandPalette.keyboard';
import type { KeyboardEvent, MouseEvent, RefObject } from 'react';

export interface UseCommandPaletteParams {
	readonly commands: CommandPaletteCommand[];
	readonly isOpen: boolean;
	readonly onClose: () => void;
	readonly closeOnEscape: boolean;
	readonly closeOnOverlayClick: boolean;
	readonly onSelect?: ((command: CommandPaletteCommand) => void) | undefined;
}

export interface UseCommandPaletteReturn {
	readonly searchQuery: string;
	readonly setSearchQuery: (query: string) => void;
	readonly filteredCommands: CommandPaletteCommand[];
	readonly highlightedIndex: number;
	readonly setHighlightedIndex: (index: number) => void;
	readonly searchInputRef: RefObject<HTMLInputElement | null>;
	readonly commandsListRef: RefObject<HTMLDivElement | null>;
	readonly handleKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
	readonly handleSelect: (command: CommandPaletteCommand) => Promise<void>;
	readonly handleOverlayClick: (event: MouseEvent<HTMLDivElement>) => void;
}

export interface CommandPaletteHandlersParams {
	readonly filteredCommands: CommandPaletteCommand[];
	readonly highlightedIndex: number;
	readonly setHighlightedIndex: (index: number) => void;
	readonly handleSelect: (command: CommandPaletteCommand) => Promise<void>;
	readonly onClose: () => void;
	readonly closeOnEscape: boolean;
	readonly closeOnOverlayClick: boolean;
}

export interface CommandPaletteEffectsParams {
	readonly isOpen: boolean;
	readonly searchInputRef: RefObject<HTMLInputElement | null>;
	readonly highlightedIndex: number;
	readonly commandsListRef: RefObject<HTMLDivElement | null>;
}

export interface HandlersSetupParams {
	readonly params: UseCommandPaletteParams;
	readonly filteredCommands: CommandPaletteCommand[];
	readonly highlightedIndex: number;
	readonly setHighlightedIndex: (index: number) => void;
	readonly handleSelect: (command: CommandPaletteCommand) => Promise<void>;
}

export interface KeyboardNavigationHookParams extends KeyboardNavigationParams {
	readonly closeOnEscape: boolean;
}
