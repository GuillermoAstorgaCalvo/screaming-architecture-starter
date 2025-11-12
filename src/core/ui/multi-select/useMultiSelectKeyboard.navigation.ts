import { useCallback } from 'react';

import type { MultiSelectOption } from './MultiSelect';
import { findNextEnabledIndex } from './useMultiSelectHelpers';

export interface ArrowHandlersParams {
	readonly isOpen: boolean;
	readonly setIsOpen: (open: boolean) => void;
	readonly filteredOptions: MultiSelectOption[];
	readonly highlightedIndex: number;
	readonly setHighlightedIndex: (index: number) => void;
}

export function useArrowHandlers(params: ArrowHandlersParams) {
	const { isOpen, setIsOpen, filteredOptions, highlightedIndex, setHighlightedIndex } = params;

	const handleArrowDown = useCallback(() => {
		if (!isOpen) {
			setIsOpen(true);
			return;
		}
		const nextIndex = findNextEnabledIndex(filteredOptions, highlightedIndex, 1);
		if (nextIndex >= 0) {
			setHighlightedIndex(nextIndex);
		}
	}, [isOpen, setIsOpen, filteredOptions, highlightedIndex, setHighlightedIndex]);

	const handleArrowUp = useCallback(() => {
		if (!isOpen) {
			return;
		}
		const prevIndex = findNextEnabledIndex(filteredOptions, highlightedIndex, -1);
		if (prevIndex >= 0) {
			setHighlightedIndex(prevIndex);
		}
	}, [isOpen, filteredOptions, highlightedIndex, setHighlightedIndex]);

	return { handleArrowDown, handleArrowUp };
}

export interface HomeEndHandlersParams {
	readonly isOpen: boolean;
	readonly filteredOptions: MultiSelectOption[];
	readonly setHighlightedIndex: (index: number) => void;
}

export function useHomeEndHandlers(params: HomeEndHandlersParams) {
	const { isOpen, filteredOptions, setHighlightedIndex } = params;

	const handleHome = useCallback(() => {
		if (!isOpen) {
			return;
		}
		const firstEnabled = findNextEnabledIndex(filteredOptions, -1, 1);
		if (firstEnabled >= 0) {
			setHighlightedIndex(firstEnabled);
		}
	}, [isOpen, filteredOptions, setHighlightedIndex]);

	const handleEnd = useCallback(() => {
		if (!isOpen) {
			return;
		}
		const lastEnabled = findNextEnabledIndex(filteredOptions, 0, -1);
		if (lastEnabled >= 0) {
			setHighlightedIndex(lastEnabled);
		}
	}, [isOpen, filteredOptions, setHighlightedIndex]);

	return { handleHome, handleEnd };
}

export interface NavigationHandlersParams {
	readonly isOpen: boolean;
	readonly setIsOpen: (open: boolean) => void;
	readonly filteredOptions: MultiSelectOption[];
	readonly highlightedIndex: number;
	readonly setHighlightedIndex: (index: number) => void;
}

export function useNavigationHandlers(params: NavigationHandlersParams) {
	const arrows = useArrowHandlers(params);
	const homeEnd = useHomeEndHandlers(params);
	return { ...arrows, ...homeEnd };
}
