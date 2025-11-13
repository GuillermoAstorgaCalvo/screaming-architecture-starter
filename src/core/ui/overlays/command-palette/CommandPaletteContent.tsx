import type { KeyboardEvent } from 'react';

import { CommandPaletteDialog } from './CommandPaletteDialog';
import { CommandPaletteList } from './CommandPaletteList';
import type { CommandPaletteContentProps } from './CommandPaletteParts.types';
import { CommandPaletteSearchInput } from './CommandPaletteSearchInput';

export function CommandPaletteContent(props: Readonly<CommandPaletteContentProps>) {
	const handleKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
		props.onKeyDown(event as unknown as KeyboardEvent<HTMLDivElement>);
	};

	return (
		<CommandPaletteDialog id={props.id} className={props.className} onKeyDown={handleKeyDown}>
			<div className="p-4">
				<CommandPaletteSearchInput
					searchQuery={props.searchQuery}
					onSearchChange={props.onSearchChange}
					searchInputRef={props.searchInputRef}
					placeholder={props.placeholder}
					searchIcon={props.searchIcon}
				/>
				<CommandPaletteList
					commands={props.commands}
					highlightedIndex={props.highlightedIndex}
					commandsListRef={props.commandsListRef}
					onSelect={props.onSelect}
					emptyState={props.emptyState}
				/>
			</div>
		</CommandPaletteDialog>
	);
}
