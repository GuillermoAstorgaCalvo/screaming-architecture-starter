import Autocomplete from '@core/ui/forms/autocomplete/Autocomplete';
import type { FormsCategoryState } from '@domains/landing/components/categories/forms/state';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function renderAutocompleteSection(state: FormsCategoryState) {
	return (
		<ShowcaseSection
			title="Autocomplete"
			description="Search-as-you-type autocomplete component"
			tags={['form', 'input', 'autocomplete', 'search']}
		>
			<div className="space-y-4">
				<Autocomplete
					label="Search Countries"
					placeholder="Type to search..."
					value={state.autocompleteValue}
					onChange={state.setAutocompleteValue}
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
