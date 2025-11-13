import type { ComboboxOption } from '@core/ui/forms/combobox/Combobox';
import { ComboboxOptionItem } from '@core/ui/forms/combobox/components/ComboboxOptionItem';
import { getListboxStyles } from '@core/ui/forms/combobox/helpers/ComboboxContentHelpers';
import type { RefObject } from 'react';

interface ComboboxOptionsListProps {
	readonly filteredOptions: ComboboxOption[];
	readonly highlightedIndex: number;
	readonly optionRefs: RefObject<HTMLButtonElement | null>[];
	readonly handleSelect: (option: ComboboxOption) => void;
	readonly listboxRef: RefObject<HTMLUListElement | null>;
	readonly menuId: string;
	readonly maxHeight: number;
}

export function ComboboxOptionsList({
	filteredOptions,
	highlightedIndex,
	optionRefs,
	handleSelect,
	listboxRef,
	menuId,
	maxHeight,
}: Readonly<ComboboxOptionsListProps>) {
	const { className, style } = getListboxStyles(maxHeight);

	// Note: Using role="listbox" on ul is correct for custom combobox per ARIA spec
	// Native <select> doesn't support filtering/search functionality
	return (
		<ul ref={listboxRef} id={menuId} role="listbox" className={className} style={style}>
			{filteredOptions.map((option, index) => (
				<ComboboxOptionItem
					key={option.value}
					option={option}
					index={index}
					highlightedIndex={highlightedIndex}
					optionRef={optionRefs[index] ?? { current: null }}
					onSelect={handleSelect}
				/>
			))}
		</ul>
	);
}
