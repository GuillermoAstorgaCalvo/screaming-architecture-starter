import Text from '@core/ui/text/Text';
import VirtualizedList from '@core/ui/utilities/virtualized-list/VirtualizedList';
import { VIRTUALIZED_ITEMS } from '@domains/landing/components/categories/utilities/constants/constants';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function VirtualizedListShowcase() {
	return (
		<ShowcaseSection
			title="VirtualizedList"
			description="Efficiently renders large lists"
			tags={['utility', 'virtual', 'list', 'performance']}
		>
			<div className="space-y-4">
				<VirtualizedList
					items={VIRTUALIZED_ITEMS}
					renderItem={item => (
						<div className="p-2 border-b border-border">
							<Text size="sm">{item.text}</Text>
						</div>
					)}
					itemSize={40}
					containerSize={300}
					orientation="vertical"
				/>
				<Text size="sm" className="text-muted-foreground">
					This list efficiently renders 1000 items using virtualization
				</Text>
			</div>
		</ShowcaseSection>
	);
}
