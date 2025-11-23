import Tabs from '@core/ui/navigation/tabs/Tabs';
import type { ReactNode } from 'react';

export interface Subcategory {
	id: string;
	label: string;
	content: ReactNode;
}

interface SubcategoryNavigationProps {
	subcategories: Subcategory[];
	activeSubcategory: string;
	onSubcategoryChange: (id: string) => void;
}

/**
 * SubcategoryNavigation - Navigation component for subcategories within a category
 *
 * Displays tabs for navigating between subcategories
 */
export default function SubcategoryNavigation({
	subcategories,
	activeSubcategory,
	onSubcategoryChange,
}: Readonly<SubcategoryNavigationProps>) {
	return (
		<div className="mb-6">
			<Tabs
				items={subcategories.map(sub => ({
					id: sub.id,
					label: sub.label,
					content: sub.content,
				}))}
				activeTabId={activeSubcategory}
				onTabChange={onSubcategoryChange}
			/>
		</div>
	);
}
