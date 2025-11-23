import type { Subcategory } from '@domains/landing/components/shared/SubcategoryNavigation';

import { InteractionShowcase } from './InteractionShowcase';
import type { UtilitiesCategoryState } from './state';

export function renderInteractionSubcategory(state: UtilitiesCategoryState): Subcategory {
	return {
		id: 'interaction',
		label: 'Interaction',
		content: (
			<InteractionShowcase
				focusTrapEnabled={state.focusTrapEnabled}
				setFocusTrapEnabled={state.setFocusTrapEnabled}
				sortableItems={state.sortableItems}
				setSortableItems={state.setSortableItems}
			/>
		),
	};
}
