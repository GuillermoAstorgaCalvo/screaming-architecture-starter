import { useRef } from 'react';

export function useCommandPaletteRefs() {
	const searchInputRef = useRef<HTMLInputElement | null>(null);
	const commandsListRef = useRef<HTMLDivElement | null>(null);
	return { searchInputRef, commandsListRef };
}
