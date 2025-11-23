import Checkbox from '@core/ui/forms/checkbox/Checkbox';
import type { FormsCategoryState } from '@domains/landing/components/categories/forms/state';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function renderCheckboxSection(state: FormsCategoryState) {
	return (
		<ShowcaseSection
			title="Checkbox"
			description="Checkbox input component"
			tags={['form', 'input', 'checkbox', 'selection']}
		>
			<div className="space-y-4">
				<Checkbox
					label="Checkbox Option"
					checked={state.checkboxChecked}
					onChange={e => state.setCheckboxChecked(e.target.checked)}
				/>
				<Checkbox label="Checked by default" defaultChecked />
				<Checkbox label="Disabled checkbox" disabled />
				<Checkbox label="Disabled checked" disabled defaultChecked />
			</div>
		</ShowcaseSection>
	);
}
