import { renderOptions } from '@core/ui/forms/multi-select/components/MultiSelectOptionItemRenderers';
import { getListboxStyles } from '@core/ui/forms/multi-select/helpers/MultiSelectContentHelpers';
import type { MultiSelectContentProps } from '@core/ui/forms/multi-select/types/MultiSelectTypes';

type MultiSelectOptionsListProps = Readonly<
	Pick<
		MultiSelectContentProps,
		| 'filteredOptions'
		| 'highlightedIndex'
		| 'optionRefs'
		| 'handleSelect'
		| 'listboxRef'
		| 'menuId'
		| 'maxHeight'
		| 'selectedValues'
	>
>;

export function MultiSelectOptionsList(props: MultiSelectOptionsListProps) {
	const {
		filteredOptions,
		highlightedIndex,
		optionRefs,
		handleSelect,
		listboxRef,
		menuId,
		maxHeight,
		selectedValues,
	} = props;
	const { className, style } = getListboxStyles(maxHeight);
	const options = renderOptions({
		filteredOptions,
		highlightedIndex,
		optionRefs,
		handleSelect,
		selectedValues,
	});

	// ARIA listbox pattern: Using role="listbox" on <ul> is correct per WAI-ARIA spec
	// tabIndex={-1} makes the element programmatically focusable, satisfying interactive role requirements
	// Native <select> cannot support filtering, custom styling, or complex interactions
	return (
		<ul
			ref={listboxRef}
			id={menuId}
			role="listbox"
			aria-multiselectable="true"
			tabIndex={-1}
			className={className}
			style={style}
		>
			{options}
		</ul>
	);
}
