import type { Subcategory } from '@domains/landing/components/shared/SubcategoryNavigation';

import { OtherShowcase } from './OtherShowcase';
import type { UtilitiesCategoryState } from './state';

export function renderOtherSubcategory(state: UtilitiesCategoryState): Subcategory {
	return {
		id: 'other',
		label: 'Other',
		content: (
			<OtherShowcase loadingState={state.loadingState} setLoadingState={state.setLoadingState} />
		),
	};
}
