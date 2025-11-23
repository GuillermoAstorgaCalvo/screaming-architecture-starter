import Heading from '@core/ui/heading/Heading';
import Text from '@core/ui/text/Text';
import { renderDialogs } from '@domains/landing/components/categories/overlays/dialogs';
import { renderMenus } from '@domains/landing/components/categories/overlays/menus';
import { renderPanels } from '@domains/landing/components/categories/overlays/panels';
import { renderPopoversAndTooltips } from '@domains/landing/components/categories/overlays/popovers';
import { renderSpecialized } from '@domains/landing/components/categories/overlays/specialized';
import { useOverlayState } from '@domains/landing/components/categories/overlays/useOverlayState';
import SubcategoryNavigation, {
	type Subcategory,
} from '@domains/landing/components/shared/SubcategoryNavigation';
import { useMemo, useState } from 'react';

/**
 * OverlaysCategory - Showcase for overlay components
 */

export default function OverlaysCategory() {
	const [activeSubcategory, setActiveSubcategory] = useState('dialogs');
	const { state, setters } = useOverlayState();

	const subcategories: Subcategory[] = useMemo(
		() => [
			{ id: 'dialogs', label: 'Dialogs', content: renderDialogs(state, setters) },
			{ id: 'panels', label: 'Panels', content: renderPanels(state, setters) },
			{
				id: 'popovers-tooltips',
				label: 'Popovers & Tooltips',
				content: renderPopoversAndTooltips(state, setters),
			},
			{ id: 'menus', label: 'Menus', content: renderMenus(state, setters) },
			{ id: 'specialized', label: 'Specialized', content: renderSpecialized(state, setters) },
		],
		[state, setters]
	);

	return (
		<div className="space-y-8">
			<div>
				<Heading as="h1" size="lg" className="mb-2 text-white">
					Overlays
				</Heading>
				<Text className="text-white/70">
					Components for dialogs, modals, tooltips, and other overlay interactions
				</Text>
			</div>
			<SubcategoryNavigation
				subcategories={subcategories}
				activeSubcategory={activeSubcategory}
				onSubcategoryChange={setActiveSubcategory}
			/>
		</div>
	);
}
