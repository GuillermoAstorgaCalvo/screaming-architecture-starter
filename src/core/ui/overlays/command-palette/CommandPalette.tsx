import SearchIcon from '@core/ui/icons/search-icon/SearchIcon';
import { CommandPaletteContent } from '@core/ui/overlays/command-palette/components/CommandPaletteContent';
import { CommandPaletteOverlay } from '@core/ui/overlays/command-palette/components/CommandPaletteOverlay';
import { useCommandPalette } from '@core/ui/overlays/command-palette/hooks/useCommandPalette';
import type { UseCommandPaletteReturn } from '@core/ui/overlays/command-palette/types/useCommandPalette.types';
import { type KeyboardEvent, type MouseEvent, type ReactNode, type RefObject, useId } from 'react';
import { createPortal } from 'react-dom';

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

function renderPaletteContent(params: PaletteRenderParams) {
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

/**
 * CommandPalette - Searchable command interface (like VS Code's command palette)
 *
 * Features:
 * - Accessible: proper ARIA attributes, focus management, keyboard navigation
 * - Searchable: filter commands by label, description, or keywords
 * - Keyboard navigation: arrow keys, enter, escape
 * - Grouped commands: optional grouping support
 * - Shortcuts display: show keyboard shortcuts
 * - Dark mode support
 * - Portal rendering to avoid overflow issues
 *
 * @example
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 *
 * <CommandPalette
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   commands={[
 *     { id: '1', label: 'New File', onSelect: () => console.log('New file') },
 *     { id: '2', label: 'Save', shortcut: 'Ctrl+S', onSelect: () => console.log('Save') },
 *   ]}
 * />
 * ```
 */
function useCommandPaletteState(props: Readonly<CommandPaletteProps>) {
	return useCommandPalette({
		commands: props.commands,
		isOpen: props.isOpen,
		onClose: props.onClose,
		closeOnEscape: props.closeOnEscape ?? true,
		closeOnOverlayClick: props.closeOnOverlayClick ?? true,
		onSelect: props.onSelect,
	});
}

export default function CommandPalette(props: Readonly<CommandPaletteProps>) {
	const {
		isOpen,
		placeholder = 'Type a command or search...',
		emptyState = 'No commands found',
		className,
		overlayClassName,
	} = props;
	const state = useCommandPaletteState(props);
	return renderPaletteContent({
		isOpen,
		paletteId: useId(),
		state,
		overlayClassName,
		placeholder,
		emptyState,
		className,
	});
}
