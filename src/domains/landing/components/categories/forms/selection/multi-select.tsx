import MultiSelect from '@core/ui/forms/multi-select/MultiSelect';
import type { FormsCategoryState } from '@domains/landing/components/categories/forms/state';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function renderMultiSelectSection(state: FormsCategoryState) {
	return (
		<ShowcaseSection
			title="MultiSelect"
			description="Multi-select component"
			tags={['form', 'input', 'select', 'multi-select']}
		>
			<div className="space-y-4">
				<MultiSelect
					label="Select Multiple Options"
					value={state.multiSelectValue}
					onChange={state.setMultiSelectValue}
					options={[
						{ value: 'option1', label: 'Option 1' },
						{ value: 'option2', label: 'Option 2' },
						{ value: 'option3', label: 'Option 3' },
						{ value: 'option4', label: 'Option 4' },
					]}
				/>
			</div>
		</ShowcaseSection>
	);
}
