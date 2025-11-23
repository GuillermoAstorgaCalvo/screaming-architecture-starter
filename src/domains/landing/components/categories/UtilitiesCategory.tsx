import Heading from '@core/ui/heading/Heading';
import Text from '@core/ui/text/Text';
import { getSubcategories } from '@domains/landing/components/categories/utilities/render-subcategories';
import { useUtilitiesCategoryState } from '@domains/landing/components/categories/utilities/state';
import SubcategoryNavigation from '@domains/landing/components/shared/SubcategoryNavigation';
import { useMemo } from 'react';

/**
 * UtilitiesCategory - Showcase for utility components
 */
export default function UtilitiesCategory() {
	const state = useUtilitiesCategoryState();
	const subcategories = useMemo(() => getSubcategories(state), [state]);

	return (
		<div className="space-y-8">
			<div>
				<Heading as="h1" size="lg" className="mb-2 text-white">
					Utilities
				</Heading>
				<Text className="text-white/70">
					Utility components and helpers for enhanced functionality
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
