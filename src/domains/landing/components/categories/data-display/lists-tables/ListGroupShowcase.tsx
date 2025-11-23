import ListGroup from '@core/ui/data-display/list/components/ListGroup';
import ListItem from '@core/ui/data-display/list/components/ListItem';
import List from '@core/ui/data-display/list/List';
import Heading from '@core/ui/heading/Heading';
import Text from '@core/ui/text/Text';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function ListGroupShowcase() {
	return (
		<ShowcaseSection
			title="ListGroup"
			description="List wrapper with optional header and footer"
			tags={['data', 'list', 'group']}
		>
			<div className="space-y-4">
				<ListGroup
					header={
						<Heading as="h3" size="sm">
							Shopping List
						</Heading>
					}
					footer={
						<Text size="sm" className="text-muted-foreground">
							Total: 3 items
						</Text>
					}
				>
					<List variant="bordered">
						<ListItem>Milk</ListItem>
						<ListItem>Bread</ListItem>
						<ListItem>Eggs</ListItem>
					</List>
				</ListGroup>
			</div>
		</ShowcaseSection>
	);
}
