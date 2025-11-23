import type { FormsCategoryState } from '@domains/landing/components/categories/forms/state';

import { renderCheckboxSection } from './selection/checkbox';
import { renderChipSection } from './selection/chip';
import { renderMultiSelectSection } from './selection/multi-select';
import { renderRadioSection } from './selection/radio';
import { renderSelectSection } from './selection/select';
import { renderSwitchSection } from './selection/switch';
import { renderToggleSection } from './selection/toggle';
import { renderToggleGroupSection } from './selection/toggle-group';

export function renderSelection(state: FormsCategoryState) {
	return (
		<div className="space-y-8">
			{renderCheckboxSection(state)}
			{renderRadioSection(state)}
			{renderSwitchSection(state)}
			{renderSelectSection(state)}
			{renderMultiSelectSection(state)}
			{renderChipSection()}
			{renderToggleSection(state)}
			{renderToggleGroupSection(state)}
		</div>
	);
}
