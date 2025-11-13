import type { CommandPaletteCommand } from '@core/ui/overlays/command-palette/CommandPalette';
import {
	filterCommands,
	findNextEnabledIndex,
} from '@core/ui/overlays/command-palette/helpers/CommandPaletteHelpers';
import { startTransition, useEffect, useMemo, useRef, useState } from 'react';

export function useSearchState(isOpen: boolean) {
	const [searchQuery, setSearchQuery] = useState('');
	const prevIsOpenRef = useRef(isOpen);

	useEffect(() => {
		if (isOpen && !prevIsOpenRef.current) {
			startTransition(() => {
				setSearchQuery('');
			});
		}
		prevIsOpenRef.current = isOpen;
	}, [isOpen]);

	return { searchQuery, setSearchQuery };
}

export function useFilteredCommands(commands: CommandPaletteCommand[], searchQuery: string) {
	return useMemo(() => {
		if (!searchQuery.trim()) {
			return commands;
		}
		return filterCommands(commands, searchQuery);
	}, [commands, searchQuery]);
}

export function useHighlightedIndex(filteredCommands: CommandPaletteCommand[], isOpen: boolean) {
	const [highlightedIndex, setHighlightedIndex] = useState(-1);
	const prevIsOpenRef = useRef(isOpen);

	useEffect(() => {
		if (isOpen && !prevIsOpenRef.current) {
			startTransition(() => {
				setHighlightedIndex(-1);
			});
		}
		prevIsOpenRef.current = isOpen;
	}, [isOpen]);

	useEffect(() => {
		if (filteredCommands.length > 0 && highlightedIndex < 0) {
			const firstEnabled = findNextEnabledIndex(filteredCommands, -1, 1);
			if (firstEnabled >= 0) {
				startTransition(() => {
					setHighlightedIndex(firstEnabled);
				});
			}
		}
	}, [filteredCommands, highlightedIndex]);

	return { highlightedIndex, setHighlightedIndex };
}

export function useCommandPaletteState(
	commands: CommandPaletteCommand[],
	isOpen: boolean,
	searchQuery: string
) {
	const filteredCommands = useFilteredCommands(commands, searchQuery);
	const { highlightedIndex, setHighlightedIndex } = useHighlightedIndex(filteredCommands, isOpen);
	return { filteredCommands, highlightedIndex, setHighlightedIndex };
}
