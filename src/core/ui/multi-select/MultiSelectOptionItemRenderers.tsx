import type { OptionItemData, RenderOptionsParams } from './MultiSelectContentHelpers';
import { MultiSelectOptionItem } from './MultiSelectOptionItem';

export function renderOptionItem({
	option,
	index,
	highlightedIndex,
	optionRef,
	handleSelect,
	isSelected,
}: OptionItemData) {
	return (
		<MultiSelectOptionItem
			key={option.value}
			option={option}
			index={index}
			highlightedIndex={highlightedIndex}
			optionRef={optionRef}
			onSelect={handleSelect}
			isSelected={isSelected}
		/>
	);
}

export function renderOptions({
	filteredOptions,
	highlightedIndex,
	optionRefs,
	handleSelect,
	selectedValues,
}: RenderOptionsParams) {
	return filteredOptions.map((option, index) =>
		renderOptionItem({
			option,
			index,
			highlightedIndex,
			optionRef: optionRefs[index] ?? { current: null },
			handleSelect,
			isSelected: selectedValues.includes(option.value),
		})
	);
}
