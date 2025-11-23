import type { Subcategory } from '@domains/landing/components/shared/SubcategoryNavigation';

import { ScrollShowcase } from './ScrollShowcase';
import type { UtilitiesCategoryState } from './state';

export function renderScrollSubcategory(state: UtilitiesCategoryState): Subcategory {
	return {
		id: 'scroll',
		label: 'Scroll',
		content: (
			<ScrollShowcase
				infiniteItems={state.infiniteItems}
				infiniteLoading={state.infiniteLoading}
				hasMore={state.hasMore}
				setInfiniteItems={state.setInfiniteItems}
				setInfiniteLoading={state.setInfiniteLoading}
				setHasMore={state.setHasMore}
				refreshing={state.refreshing}
				setRefreshing={state.setRefreshing}
			/>
		),
	};
}
