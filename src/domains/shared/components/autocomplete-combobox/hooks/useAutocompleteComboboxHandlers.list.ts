import { useCallback } from 'react';

export interface ListCallbacks {
	readonly openList: () => void;
	readonly closeList: () => void;
}

export interface ListCallbacksParams {
	readonly disabled: boolean;
	readonly firstEnabledIndex: number;
	readonly setIsOpen: (open: boolean) => void;
	readonly setHighlightedIndex: (index: number) => void;
}

export function useListCallbacks(params: ListCallbacksParams): ListCallbacks {
	const { disabled, firstEnabledIndex, setIsOpen, setHighlightedIndex } = params;
	const openList = useCallback(() => {
		if (!disabled) {
			setIsOpen(true);
			setHighlightedIndex(firstEnabledIndex >= 0 ? firstEnabledIndex : -1);
		}
	}, [disabled, firstEnabledIndex, setIsOpen, setHighlightedIndex]);

	const closeList = useCallback(() => {
		setIsOpen(false);
		setHighlightedIndex(-1);
	}, [setIsOpen, setHighlightedIndex]);

	return { openList, closeList };
}
