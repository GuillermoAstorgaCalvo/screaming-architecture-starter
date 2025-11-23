import Select from '@core/ui/forms/select/Select';
import type { FormsCategoryState } from '@domains/landing/components/categories/forms/state';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function renderSelectSection(state: FormsCategoryState) {
	return (
		<ShowcaseSection
			title="Select"
			description="Select/dropdown component"
			tags={['form', 'input', 'select', 'dropdown']}
		>
			<div className="space-y-4">
				<Select
					label="Select Option"
					value={state.selectValue}
					onChange={e => state.setSelectValue(e.target.value)}
				>
					<option value="">Select an option...</option>
					<option value="option1">Option 1</option>
					<option value="option2">Option 2</option>
					<option value="option3">Option 3</option>
				</Select>
				<Select label="Disabled Select" value="option1" disabled>
					<option value="option1">Option 1</option>
					<option value="option2">Option 2</option>
				</Select>
			</div>
		</ShowcaseSection>
	);
}
