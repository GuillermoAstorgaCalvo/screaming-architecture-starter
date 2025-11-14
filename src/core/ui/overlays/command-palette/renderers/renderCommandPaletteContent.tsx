import SearchIcon from '@core/ui/icons/search-icon/SearchIcon';
import { CommandPaletteContent } from '@core/ui/overlays/command-palette/components/CommandPaletteContent';
import { CommandPaletteOverlay } from '@core/ui/overlays/command-palette/components/CommandPaletteOverlay';
import type { CommandPaletteCommand } from '@core/ui/overlays/command-palette/types/CommandPalette.types';
import type { UseCommandPaletteReturn } from '@core/ui/overlays/command-palette/types/useCommandPalette.types';
import type { KeyboardEvent, MouseEvent, ReactNode, RefObject } from 'react';
import { createPortal } from 'react-dom';

function buildOverlayProps(
	isOpen: boolean,
	onClick: (e: MouseEvent<HTMLDivElement>) => void,
	overlayClassName?: string
) {
	return {
		isOpen,
		onClick,
		...(overlayClassName !== undefined && { overlayClassName }),
	};
}

interface ContentPropsParams {
	readonly paletteId: string;
	readonly searchQuery: string;
	readonly setSearchQuery: (query: string) => void;
	readonly searchInputRef: RefObject<HTMLInputElement | null>;
	readonly placeholder: string;
	readonly filteredCommands: CommandPaletteCommand[];
	readonly highlightedIndex: number;
	readonly commandsListRef: RefObject<HTMLDivElement | null>;
	readonly handleKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
	readonly handleSelect: (command: CommandPaletteCommand) => Promise<void>;
	readonly emptyState: ReactNode;
	readonly className?: string;
}

interface BuildContentPropsParamsArgs {
	readonly paletteId: string;
	readonly state: UseCommandPaletteReturn;
	readonly placeholder: string;
	readonly emptyState: ReactNode;
	readonly className?: string;
}

function buildContentPropsParams(args: BuildContentPropsParamsArgs): ContentPropsParams {
	return {
		paletteId: args.paletteId,
		searchQuery: args.state.searchQuery,
		setSearchQuery: args.state.setSearchQuery,
		searchInputRef: args.state.searchInputRef,
		placeholder: args.placeholder,
		filteredCommands: args.state.filteredCommands,
		highlightedIndex: args.state.highlightedIndex,
		commandsListRef: args.state.commandsListRef,
		handleKeyDown: args.state.handleKeyDown,
		handleSelect: args.state.handleSelect,
		emptyState: args.emptyState,
		...(args.className !== undefined && { className: args.className }),
	};
}

function buildContentProps(params: ContentPropsParams) {
	return {
		id: params.paletteId,
		searchQuery: params.searchQuery,
		onSearchChange: params.setSearchQuery,
		searchInputRef: params.searchInputRef,
		placeholder: params.placeholder,
		commands: params.filteredCommands,
		highlightedIndex: params.highlightedIndex,
		commandsListRef: params.commandsListRef,
		onKeyDown: params.handleKeyDown,
		onSelect: params.handleSelect,
		emptyState: params.emptyState,
		searchIcon: <SearchIcon size="md" />,
		...(params.className !== undefined && { className: params.className }),
	};
}

interface RenderPaletteArgs {
	readonly isOpen: boolean;
	readonly state: UseCommandPaletteReturn;
	readonly overlayClassName: string | undefined;
	readonly contentParams: ContentPropsParams;
}

function renderPalette(args: RenderPaletteArgs) {
	return createPortal(
		<>
			<CommandPaletteOverlay
				{...buildOverlayProps(args.isOpen, args.state.handleOverlayClick, args.overlayClassName)}
			/>
			<CommandPaletteContent {...buildContentProps(args.contentParams)} />
		</>,
		document.body
	);
}

interface PaletteRenderParams {
	readonly isOpen: boolean;
	readonly paletteId: string;
	readonly state: UseCommandPaletteReturn;
	readonly overlayClassName: string | undefined;
	readonly placeholder: string;
	readonly emptyState: ReactNode;
	readonly className: string | undefined;
}

export function renderCommandPaletteContent(params: PaletteRenderParams) {
	if (!params.isOpen) {
		return null;
	}

	return renderPalette({
		isOpen: params.isOpen,
		state: params.state,
		overlayClassName: params.overlayClassName,
		contentParams: buildContentPropsParams({
			paletteId: params.paletteId,
			state: params.state,
			placeholder: params.placeholder,
			emptyState: params.emptyState,
			...(params.className !== undefined && { className: params.className }),
		}),
	});
}
