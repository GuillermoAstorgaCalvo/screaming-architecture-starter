import Heading from '@core/ui/heading/Heading';
import Text from '@core/ui/text/Text';
import { getSubcategories } from '@domains/landing/components/categories/forms/render-forms';
import { useFormsCategoryState } from '@domains/landing/components/categories/forms/state';
import SubcategoryNavigation from '@domains/landing/components/shared/SubcategoryNavigation';
import { useMemo } from 'react';

/**
 * FormsCategory - Showcase for form components
 */
export default function FormsCategory() {
	const state = useFormsCategoryState();
	const subcategories = useMemo(() => getSubcategories(state), [state]);

	return (
		<div className="space-y-8">
			<div>
				<Heading as="h1" size="lg" className="mb-2 text-white">
					Forms
				</Heading>
				<Text className="text-white/70">
					Form controls and input components for user input and data collection
				</Text>
			</div>

			<SubcategoryNavigation
				subcategories={subcategories}
				activeSubcategory={state.activeSubcategory}
				onSubcategoryChange={state.setActiveSubcategory}
			/>
		</div>
	);
}
