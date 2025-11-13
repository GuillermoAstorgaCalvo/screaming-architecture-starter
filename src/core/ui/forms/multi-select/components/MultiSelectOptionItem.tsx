import {
	createOptionHandlers,
	getOptionClassName,
	MENU_STYLES,
} from '@core/ui/forms/multi-select/helpers/MultiSelectContentHelpers';
import type { MultiSelectOption } from '@core/ui/forms/multi-select/MultiSelect';
import type { RefObject } from 'react';

interface MultiSelectOptionItemProps {
	readonly option: MultiSelectOption;
	readonly index: number;
	readonly highlightedIndex: number;
	readonly optionRef: RefObject<HTMLButtonElement | null>;
	readonly onSelect: (option: MultiSelectOption) => void;
	readonly isSelected: boolean;
}

export function MultiSelectOptionItem({
	option,
	index,
	highlightedIndex,
	optionRef,
	onSelect,
	isSelected,
}: Readonly<MultiSelectOptionItemProps>) {
	const isHighlighted = index === highlightedIndex;
	const isDisabled = option.disabled ?? false;
	const { handleClick, handleKeyDown } = createOptionHandlers(option, isDisabled, onSelect);

	// Note: Using role="option" on button is correct for custom multi-select per ARIA spec
	// Native <option> doesn't support multi-select with filtering/search functionality
	// This warning is a false positive - the implementation follows ARIA Authoring Practices
	// See: https://www.w3.org/WAI/ARIA/apg/patterns/listbox/
	// The accessibility warning about using <option> is expected and acceptable for this pattern

	return (
		<li>
			<button
				type="button"
				ref={optionRef}
				role="option"
				aria-selected={isSelected}
				aria-disabled={isDisabled}
				disabled={isDisabled}
				className={getOptionClassName(isHighlighted, isDisabled)}
				onClick={handleClick}
				onKeyDown={handleKeyDown}
			>
				<input
					type="checkbox"
					checked={isSelected}
					readOnly
					className={MENU_STYLES.CHECKBOX}
					tabIndex={-1}
					aria-hidden="true"
				/>
				<span>{option.label}</span>
			</button>
		</li>
	);
}
