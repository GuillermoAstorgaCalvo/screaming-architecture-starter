import type { Subcategory } from '@domains/landing/components/shared/SubcategoryNavigation';

import { renderInteractionSubcategory } from './render-interaction';
import { renderMotionSubcategory } from './render-motion';
import { renderOtherSubcategory } from './render-other';
import { renderScrollSubcategory } from './render-scroll';
import type { UtilitiesCategoryState } from './state';

export function getSubcategories(state: UtilitiesCategoryState): Subcategory[] {
	return [
		renderMotionSubcategory(state),
		renderScrollSubcategory(state),
		renderInteractionSubcategory(state),
		renderOtherSubcategory(state),
	];
}
