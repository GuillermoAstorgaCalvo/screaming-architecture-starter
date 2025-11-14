import type { AutocompleteOption } from '@domains/shared/components/autocomplete-combobox/AutocompleteCombobox';
import { type RefObject, useEffect, useRef } from 'react';

function useClickOutside(
	containerRef: RefObject<HTMLDivElement | null>,
	isOpen: boolean,
	onClose: () => void
) {
	useEffect(() => {
		if (!isOpen) {
			return;
		}

		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as Node;
			if (containerRef.current?.contains(target)) {
				return;
			}
			onClose();
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isOpen, containerRef, onClose]);
}

interface UseHighlightResetParams {
	readonly filteredOptions: AutocompleteOption[];
	readonly isOpen: boolean;
	readonly firstEnabledIndex: number;
	readonly setHighlightedIndex: (index: number) => void;
}

function useHighlightReset(params: UseHighlightResetParams) {
	const previousFilteredOptionsRef = useRef(params.filteredOptions);
	const { filteredOptions, isOpen, firstEnabledIndex, setHighlightedIndex } = params;

	useEffect(() => {
		if (isOpen && previousFilteredOptionsRef.current !== filteredOptions) {
			previousFilteredOptionsRef.current = filteredOptions;
			queueMicrotask(() => {
				setHighlightedIndex(firstEnabledIndex >= 0 ? firstEnabledIndex : -1);
			});
		}
	}, [filteredOptions, isOpen, firstEnabledIndex, setHighlightedIndex]);
}

interface UseComboboxContainerParams {
	readonly isOpen: boolean;
	readonly onClose: () => void;
}

export function useComboboxContainer(params: UseComboboxContainerParams) {
	const containerRef = useRef<HTMLDivElement | null>(null);

	useClickOutside(containerRef, params.isOpen, params.onClose);

	return { containerRef };
}

interface UseComboboxEffectsParams {
	readonly filteredOptions: AutocompleteOption[];
	readonly isOpen: boolean;
	readonly firstEnabledIndex: number;
	readonly setHighlightedIndex: (index: number) => void;
}

export function useComboboxEffects(params: UseComboboxEffectsParams) {
	useHighlightReset({
		filteredOptions: params.filteredOptions,
		isOpen: params.isOpen,
		firstEnabledIndex: params.firstEnabledIndex,
		setHighlightedIndex: params.setHighlightedIndex,
	});
}
