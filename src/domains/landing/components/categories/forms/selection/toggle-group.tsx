import type { FormsCategoryState } from '@domains/landing/components/categories/forms/state';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

import { ToggleGroupMultipleShowcase } from './toggle-group/ToggleGroupMultipleShowcase';
import { ToggleGroupSingleShowcase } from './toggle-group/ToggleGroupSingleShowcase';

export function renderToggleGroupSection(state: FormsCategoryState) {
	return (
		<ShowcaseSection
			title="ToggleGroup"
			description="Container for managing multiple Toggle components"
			tags={['form', 'input', 'toggle', 'group']}
		>
			<div className="space-y-4">
				<ToggleGroupSingleShowcase state={state} />
				<ToggleGroupMultipleShowcase state={state} />
			</div>
		</ShowcaseSection>
	);
}
