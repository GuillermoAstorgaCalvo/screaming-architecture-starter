import type { Subcategory } from '@domains/landing/components/shared/SubcategoryNavigation';

import { MotionShowcase } from './MotionShowcase';
import type { UtilitiesCategoryState } from './state';

export function renderMotionSubcategory(state: UtilitiesCategoryState): Subcategory {
	return {
		id: 'motion',
		label: 'Motion/Animation',
		content: (
			<MotionShowcase
				motionVisible={state.motionVisible}
				setMotionVisible={state.setMotionVisible}
				motionPresenceVisible={state.motionPresenceVisible}
				setMotionPresenceVisible={state.setMotionPresenceVisible}
				motionAccordionOpen={state.motionAccordionOpen}
				setMotionAccordionOpen={state.setMotionAccordionOpen}
			/>
		),
	};
}
