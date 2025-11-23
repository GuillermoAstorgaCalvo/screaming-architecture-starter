import Heading from '@core/ui/heading/Heading';
import Text from '@core/ui/text/Text';
import { CardsBadgesShowcase } from '@domains/landing/components/categories/data-display/CardsBadgesShowcase';
import { ChartsShowcase } from '@domains/landing/components/categories/data-display/ChartsShowcase';
import { CodeTextShowcase } from '@domains/landing/components/categories/data-display/CodeTextShowcase';
import { IndicatorsShowcase } from '@domains/landing/components/categories/data-display/IndicatorsShowcase';
import { ListsTablesShowcase } from '@domains/landing/components/categories/data-display/ListsTablesShowcase';
import SubcategoryNavigation, {
	type Subcategory,
} from '@domains/landing/components/shared/SubcategoryNavigation';
import { useState } from 'react';

/**
 * DataDisplayCategory - Showcase for data display components
 */
function getSubcategories(
	selectedNode: string | null,
	onNodeSelect: (nodeId: string) => void
): Subcategory[] {
	return [
		{
			id: 'charts',
			label: 'Charts',
			content: <ChartsShowcase />,
		},
		{
			id: 'lists-tables',
			label: 'Lists & Tables',
			content: <ListsTablesShowcase selectedNode={selectedNode} onNodeSelect={onNodeSelect} />,
		},
		{
			id: 'cards-badges',
			label: 'Cards & Badges',
			content: <CardsBadgesShowcase />,
		},
		{
			id: 'code-text',
			label: 'Code & Text',
			content: <CodeTextShowcase />,
		},
		{
			id: 'indicators',
			label: 'Indicators',
			content: <IndicatorsShowcase />,
		},
	];
}

export default function DataDisplayCategory() {
	const [activeSubcategory, setActiveSubcategory] = useState('charts');
	const [selectedNode, setSelectedNode] = useState<string | null>(null);
	const subcategories = getSubcategories(selectedNode, setSelectedNode);

	return (
		<div className="space-y-8">
			<div>
				<Heading as="h1" size="lg" className="mb-2 text-white">
					Data Display
				</Heading>
				<Text className="text-white/70">
					Components for displaying data, information, and visual content
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
