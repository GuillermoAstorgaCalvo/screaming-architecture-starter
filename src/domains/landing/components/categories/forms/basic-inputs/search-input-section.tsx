import SearchInput from '@core/ui/forms/search-input/SearchInput';
import type { FormsCategoryState } from '@domains/landing/components/categories/forms/state';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function renderSearchInputSection(state: FormsCategoryState) {
	return (
		<ShowcaseSection
			title="SearchInput"
			description="Search input component"
			tags={['form', 'input', 'search']}
		>
			<div className="space-y-4">
				<SearchInput
					label="Search"
					value={state.searchValue}
					onChange={value => state.setSearchValue(value)}
				/>
			</div>
		</ShowcaseSection>
	);
}
