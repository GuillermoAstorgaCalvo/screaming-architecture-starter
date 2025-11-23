import Card from '@core/ui/data-display/card/Card';
import Text from '@core/ui/text/Text';
import SortableList from '@core/ui/utilities/sortable-list/SortableList';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

interface SortableListShowcaseProps {
	readonly sortableItems: Array<{ id: string; data: { name: string } }>;
	readonly setSortableItems: (items: Array<{ id: string; data: { name: string } }>) => void;
}

export function renderSortableListShowcase({
	sortableItems,
	setSortableItems,
}: SortableListShowcaseProps) {
	return (
		<ShowcaseSection
			title="SortableList"
			description="Drag-and-drop sortable list"
			tags={['utility', 'sortable', 'drag', 'drop', 'list']}
		>
			<div className="space-y-4">
				<SortableList
					items={sortableItems}
					renderItem={item => (
						<Card variant="outlined" padding="sm">
							<Text size="sm">{item.data.name}</Text>
						</Card>
					)}
					onReorder={newItems => setSortableItems([...newItems])}
					variant="bordered"
				/>
				<Text size="sm" className="text-muted-foreground">
					Drag items to reorder them
				</Text>
			</div>
		</ShowcaseSection>
	);
}
