import { type RefObject, useEffect } from 'react';

export function useScrollToHighlighted(
	highlightedIndex: number,
	commandsListRef: RefObject<HTMLDivElement | null>
) {
	useEffect(() => {
		if (highlightedIndex >= 0 && commandsListRef.current) {
			const highlightedElement = commandsListRef.current.querySelector(
				`[data-command-index="${highlightedIndex}"]`
			);

			if (highlightedElement) {
				highlightedElement.scrollIntoView({
					behavior: 'smooth',
					block: 'nearest',
				});
			}
		}
	}, [highlightedIndex, commandsListRef]);
}
