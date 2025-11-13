import type { RefObject } from 'react';

import type { ComboboxOption } from './Combobox';
import { createOptionHandlers, getOptionClassName } from './ComboboxContentHelpers';

interface ComboboxOptionItemProps {
	readonly option: ComboboxOption;
	readonly index: number;
	readonly highlightedIndex: number;
	readonly optionRef: RefObject<HTMLButtonElement | null>;
	readonly onSelect: (option: ComboboxOption) => void;
}

export function ComboboxOptionItem({
	option,
	index,
	highlightedIndex,
	optionRef,
	onSelect,
}: Readonly<ComboboxOptionItemProps>) {
	const isHighlighted = index === highlightedIndex;
	const isDisabled = option.disabled ?? false;
	const { handleClick, handleKeyDown } = createOptionHandlers(option, isDisabled, onSelect);

	// Note: Using role="option" on button is correct for custom combobox per ARIA spec
	// Native <option> doesn't support filtering/search functionality
	return (
		<li>
			<button
				type="button"
				ref={optionRef}
				role="option"
				aria-selected={isHighlighted}
				aria-disabled={isDisabled}
				disabled={isDisabled}
				className={getOptionClassName(isHighlighted, isDisabled)}
				onClick={handleClick}
				onKeyDown={handleKeyDown}
			>
				{option.label}
			</button>
		</li>
	);
}
