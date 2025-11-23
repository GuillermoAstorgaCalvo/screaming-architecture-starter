import type { FormsCategoryState } from '@domains/landing/components/categories/forms/state';

import { renderAutocompleteSection } from './advanced/autocomplete';
import { renderComboboxSection } from './advanced/combobox';
import { renderRangeSliderSection } from './advanced/range-slider';
import { renderRichTextEditorSection } from './advanced/rich-text-editor';
import { renderSegmentedControlSection } from './advanced/segmented-control';
import { renderSliderSection } from './advanced/slider';

export function renderAdvanced(state: FormsCategoryState) {
	return (
		<div className="space-y-8">
			{renderAutocompleteSection(state)}
			{renderComboboxSection(state)}
			{renderRichTextEditorSection(state)}
			{renderSliderSection(state)}
			{renderRangeSliderSection(state)}
			{renderSegmentedControlSection(state)}
		</div>
	);
}
