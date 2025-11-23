import Combobox from '@core/ui/forms/combobox/Combobox';
import type { FormsCategoryState } from '@domains/landing/components/categories/forms/state';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function renderComboboxSection(state: FormsCategoryState) {
	return (
		<ShowcaseSection
			title="Combobox"
			description="Autocomplete/combobox component with search"
			tags={['form', 'input', 'combobox', 'autocomplete', 'search']}
		>
			<div className="space-y-4">
				<Combobox
					label="Select Country"
					placeholder="Search countries..."
					value={state.comboboxValue}
					onChange={state.setComboboxValue}
					options={[
						{ value: 'us', label: 'United States' },
						{ value: 'uk', label: 'United Kingdom' },
						{ value: 'ca', label: 'Canada' },
						{ value: 'au', label: 'Australia' },
						{ value: 'de', label: 'Germany' },
					]}
				/>
			</div>
		</ShowcaseSection>
	);
}
