import { useCallback } from 'react';

import type { ComboboxOption } from './Combobox';
import { findNextEnabledIndex } from './useComboboxHelpers';

export interface UseArrowHandlersParams {
	isOpen: boolean;
	setIsOpen: (open: boolean) => void;
	filteredOptions: ComboboxOption[];
	highlightedIndex: number;
	setHighlightedIndex: (index: number) => void;
}

export function useArrowHandlers(params: UseArrowHandlersParams) {
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

export interface UseHomeEndHandlersParams {
	isOpen: boolean;
	filteredOptions: ComboboxOption[];
	setHighlightedIndex: (index: number) => void;
}

export function useHomeEndHandlers(params: UseHomeEndHandlersParams) {
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

export interface UseNavigationHandlersParams {
	isOpen: boolean;
	setIsOpen: (open: boolean) => void;
	filteredOptions: ComboboxOption[];
	highlightedIndex: number;
	setHighlightedIndex: (index: number) => void;
}

export function useNavigationHandlers(params: UseNavigationHandlersParams) {
	const arrows = useArrowHandlers(params);
	const homeEnd = useHomeEndHandlers(params);
	return { ...arrows, ...homeEnd };
}
