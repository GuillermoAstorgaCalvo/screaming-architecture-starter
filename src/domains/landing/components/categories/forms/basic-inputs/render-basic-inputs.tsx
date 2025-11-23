import type { FormsCategoryState } from '@domains/landing/components/categories/forms/state';

import { renderInputSection } from './input-section';
import { renderNumberInputSection } from './number-input-section';
import { renderSearchInputSection } from './search-input-section';
import { renderTextareaSection } from './textarea-section';

export function renderBasicInputs(state: FormsCategoryState) {
	return (
		<div className="space-y-8">
			{renderInputSection(state)}
			{renderTextareaSection(state)}
			{renderNumberInputSection(state)}
			{renderSearchInputSection(state)}
		</div>
	);
}
