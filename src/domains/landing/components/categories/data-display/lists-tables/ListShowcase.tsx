import ListItem from '@core/ui/data-display/list/components/ListItem';
import List from '@core/ui/data-display/list/List';
import Text from '@core/ui/text/Text';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function ListShowcase() {
	return (
		<ShowcaseSection title="List" description="List component" tags={['data', 'list']}>
			<div className="space-y-4">
				<div>
					<Text className="mb-2 font-semibold">Default List</Text>
					<List variant="default">
						<ListItem>Item 1</ListItem>
						<ListItem>Item 2</ListItem>
						<ListItem>Item 3</ListItem>
					</List>
				</div>
				<div>
					<Text className="mb-2 font-semibold">Bordered List</Text>
					<List variant="bordered">
						<ListItem>Item 1</ListItem>
						<ListItem>Item 2</ListItem>
						<ListItem>Item 3</ListItem>
					</List>
				</div>
			</div>
		</ShowcaseSection>
	);
}
